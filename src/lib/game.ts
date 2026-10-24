import { Prisma, type Participation, type Prize } from '@prisma/client';
import { prisma } from '@/lib/db';
import { findOrCreateParticipant, readCollectionProgress } from '@/lib/participants';
import { chooseWeighted, decryptCode, encryptCode, newRedeemCode, sha256 } from '@/lib/security';

export type GameErrorCode =
  | 'CAMPAIGN_NOT_FOUND'
  | 'CARD_NOT_FOUND'
  | 'CARD_INACTIVE'
  | 'CAMPAIGN_CLOSED'
  | 'ALREADY_PARTICIPATED'
  | 'RETRY_TRANSACTION';

export class GameError extends Error {
  constructor(public code: GameErrorCode, message: string, public status = 409) {
    super(message);
  }
}

type Existing = Participation & {
  prize: Prize | null;
  redeemCode: { codeEncrypted: string; expiresAt: Date; status: string } | null;
};

async function existingResult(
  tx: Prisma.TransactionClient | typeof prisma,
  existing: Existing,
  participantId: string,
  campaignId: string,
  options?: { duplicateRejected?: boolean; idempotentReplay?: boolean },
) {
  const progress = await readCollectionProgress(participantId, campaignId, tx);
  const priorCampaignWin = await tx.participation.findFirst({
    where: {
      participantId,
      campaignId,
      OR: [{ status: { in: ['WON', 'REDEEMED'] } }, { prizeId: { not: null } }],
    },
    include: { prize: { select: { id: true, name: true } } },
  });
  const canShowCode =
    existing.status === 'WON' &&
    existing.redeemCode?.status === 'ISSUED' &&
    existing.redeemCode.expiresAt > new Date();

  return {
    status: existing.status === 'NO_PRIZE' ? ('no_prize' as const) : ('won' as const),
    prize: existing.prize
      ? { id: existing.prize.id, name: existing.prize.name, description: existing.prize.description }
      : undefined,
    redeemCode: canShowCode && existing.redeemCode ? decryptCode(existing.redeemCode.codeEncrypted) : undefined,
    expiresAt: canShowCode ? existing.redeemCode?.expiresAt : undefined,
    collectionProgress: progress,
    raffleEntriesCount: progress.count,
    raffleEntryAdded: false,
    alreadyParticipated: true,
    duplicateRejected: Boolean(options?.duplicateRejected),
    idempotentReplay: Boolean(options?.idempotentReplay),
    instantPrizeLimitReached: Boolean(priorCampaignWin && existing.status === 'NO_PRIZE'),
    priorInstantPrize: priorCampaignWin?.prize
      ? { id: priorCampaignWin.prize.id, name: priorCampaignWin.prize.name }
      : undefined,
  };
}

/**
 * El servidor es la única autoridad:
 * 1. Valida shopping, cartel/ubicación activa y vigencia de campaña.
 * 2. Serializa las operaciones por participante (SELECT ... FOR UPDATE dentro de transacción Serializable).
 * 3. Regla 1: Una jugada por (campaña + participante + cartel). Escaneos repetidos devuelven el resultado previo sin duplicar jugadas ni participaciones de sorteo.
 * 4. Regla 2: Máximo un premio instantáneo por (campaña + participante), incluso ante solicitudes simultáneas en distintos carteles.
 * 5. Regla 3: Cada cartel distinto válido suma una participación única y auditable para el sorteo final.
 */
export async function playCard(input: {
  token: string;
  shoppingSlug: string;
  cardId: string;
  idempotencyKey: string;
}) {
  const normalizedCardId = input.cardId.trim();

  for (let attempt = 0; attempt < 8; attempt += 1) {
    try {
      return await prisma.$transaction(
        async (tx) => {
          const shopping = await tx.shopping.findUnique({ where: { slug: input.shoppingSlug } });
          if (!shopping?.active) {
            throw new GameError('CAMPAIGN_NOT_FOUND', 'No encontramos este shopping.', 404);
          }

          let card = await tx.card.findFirst({
            where: { publicId: normalizedCardId, shoppingId: shopping.id },
            include: { campaign: true, place: true },
          });

          // Si el QR físico contiene el slug permanente de una ubicación (Location), resolver su tarjeta activa en la campaña vigente.
          if (!card) {
            const location = await tx.location.findFirst({
              where: { slug: normalizedCardId.toLowerCase(), shoppingId: shopping.id },
            });
            if (location) {
              if (!location.active) {
                throw new GameError('CARD_INACTIVE', 'Este cartel físico fue deshabilitado.', 410);
              }
              card = await tx.card.findFirst({
                where: {
                  shoppingId: shopping.id,
                  locationId: location.id,
                  ...(location.campaignId ? { campaignId: location.campaignId } : {}),
                },
                include: { campaign: true, place: true },
                orderBy: { createdAt: 'desc' },
              });
            }
          }

          if (!card) {
            throw new GameError('CARD_NOT_FOUND', 'No encontramos esa tarjeta en este shopping.', 404);
          }
          if (card.status !== 'ACTIVE' || (card.place && !card.place.active)) {
            throw new GameError('CARD_INACTIVE', 'Esta tarjeta o cartel no está habilitado.', 410);
          }

          const campaign = card.campaign;
          const now = new Date();
          if (campaign.status !== 'ACTIVE' || campaign.startsAt > now || campaign.endsAt <= now) {
            const detail =
              campaign.startsAt > now
                ? 'La campaña de esta tarjeta todavía no comenzó.'
                : campaign.endsAt <= now || campaign.status === 'ENDED'
                  ? 'La campaña de esta tarjeta ya finalizó.'
                  : 'La campaña de esta tarjeta no está activa ahora.';
            throw new GameError('CAMPAIGN_CLOSED', detail, 409);
          }

          const participant = await findOrCreateParticipant(tx, input.token, campaign.id, shopping.id);

          // Bloqueo de fila por participante para serializar solicitudes concurrentes (mismo cartel o dos carteles distintos a la vez).
          await tx.$queryRaw`SELECT id FROM "participants" WHERE id = ${participant.id} FOR UPDATE`;

          const priorByKey = await tx.participation.findFirst({
            where: { participantId: participant.id, idempotencyKey: input.idempotencyKey },
            include: { prize: true, redeemCode: { select: { codeEncrypted: true, expiresAt: true, status: true } } },
          });
          if (priorByKey) {
            return existingResult(tx, priorByKey, participant.id, campaign.id, { idempotentReplay: true });
          }

          const priorCard = await tx.participation.findUnique({
            where: {
              participantId_cardId_campaignId: {
                participantId: participant.id,
                cardId: card.id,
                campaignId: campaign.id,
              },
            },
            include: { prize: true, redeemCode: { select: { codeEncrypted: true, expiresAt: true, status: true } } },
          });
          if (priorCard) {
            await tx.event.create({
              data: {
                eventType: 'DUPLICATE_PLAY_REJECTED',
                campaignId: campaign.id,
                shoppingId: shopping.id,
                cardId: card.id,
                participantId: participant.id,
                metadata: { publicId: card.publicId },
              },
            });
            return existingResult(tx, priorCard, participant.id, campaign.id, { duplicateRejected: true });
          }

          // REGLA 2: Un solo premio instantáneo como máximo por participante y campaña.
          const priorCampaignWin = await tx.participation.findFirst({
            where: {
              participantId: participant.id,
              campaignId: campaign.id,
              OR: [{ status: { in: ['WON', 'REDEEMED'] } }, { prizeId: { not: null } }],
            },
            include: { prize: { select: { id: true, name: true } } },
          });
          const alreadyWonInCampaign = Boolean(priorCampaignWin);

          let selected: Prize | undefined;
          if (!alreadyWonInCampaign) {
            const candidates = await tx.prize.findMany({
              where: {
                campaignId: campaign.id,
                shoppingId: shopping.id,
                active: true,
                remainingStock: { gt: 0 },
                AND: [
                  { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
                  { OR: [{ endsAt: null }, { endsAt: { gt: now } }] },
                ],
              },
            });
            const eligible: typeof candidates = [];
            for (const prize of candidates) {
              if (prize.maxPerPerson > 0) eligible.push(prize);
            }
            const pool = [...eligible];
            while (pool.length && !selected) {
              const weighted = chooseWeighted(pool);
              if (!weighted) break;
              const reserved = await tx.prize.updateMany({
                where: { id: weighted.id, remainingStock: { gt: 0 } },
                data: { remainingStock: { decrement: 1 } },
              });
              if (reserved.count === 1) selected = weighted;
              else pool.splice(pool.findIndex(({ id }) => id === weighted.id), 1);
            }
          } else {
            await tx.event.create({
              data: {
                eventType: 'INSTANT_PRIZE_LIMIT_APPLIED',
                campaignId: campaign.id,
                shoppingId: shopping.id,
                cardId: card.id,
                participantId: participant.id,
                metadata: { priorPrizeId: priorCampaignWin?.prize?.id ?? null },
              },
            });
          }

          const participation = await tx.participation.create({
            data: {
              participantId: participant.id,
              cardId: card.id,
              campaignId: campaign.id,
              shoppingId: shopping.id,
              prizeId: selected?.id,
              idempotencyKey: input.idempotencyKey,
              status: selected ? 'WON' : 'NO_PRIZE',
            },
          });

          let rawCode: string | undefined;
          let expiresAt: Date | undefined;
          if (selected) {
            rawCode = newRedeemCode();
            expiresAt = new Date(
              Math.min(
                now.getTime() + 7 * 24 * 60 * 60_000,
                campaign.endsAt.getTime(),
                selected.endsAt?.getTime() ?? Infinity,
              ),
            );
            await tx.redeemCode.create({
              data: {
                codeHash: sha256(rawCode),
                codeEncrypted: encryptCode(rawCode),
                participationId: participation.id,
                prizeId: selected.id,
                campaignId: campaign.id,
                shoppingId: shopping.id,
                expiresAt,
              },
            });
            await tx.inventoryMovement.create({
              data: {
                prizeId: selected.id,
                campaignId: campaign.id,
                shoppingId: shopping.id,
                delta: -1,
                reason: `Premio asignado · participación ${participation.id}`,
              },
            });
            await tx.event.create({
              data: {
                eventType: 'PRIZE_ASSIGNED',
                campaignId: campaign.id,
                shoppingId: shopping.id,
                cardId: card.id,
                participantId: participant.id,
                metadata: { prizeId: selected.id, participationId: participation.id },
              },
            });
          }

          // REGLA 3: Registro único e idempotente de participación para el sorteo final (1 por campaña + participante + cartel).
          const collection = await tx.collectionProgress.upsert({
            where: { participantId_campaignId: { participantId: participant.id, campaignId: campaign.id } },
            create: { participantId: participant.id, campaignId: campaign.id },
            update: {},
          });
          await tx.collectionCard.createMany({
            data: [{ progressId: collection.id, cardId: card.id }],
            skipDuplicates: true,
          });
          const raffleDedupeKey = sha256(`raffle:v1:${campaign.id}:${participant.id}:${card.id}`);
          await tx.event.upsert({
            where: { dedupeKey: raffleDedupeKey },
            update: {},
            create: {
              eventType: 'RAFFLE_ENTRY_REGISTERED',
              campaignId: campaign.id,
              shoppingId: shopping.id,
              cardId: card.id,
              participantId: participant.id,
              dedupeKey: raffleDedupeKey,
              metadata: { cardPublicId: card.publicId, participationId: participation.id },
            },
          });
          await tx.event.create({
            data: {
              eventType: 'CARD_PLAYED',
              campaignId: campaign.id,
              shoppingId: shopping.id,
              cardId: card.id,
              participantId: participant.id,
              metadata: {
                result: selected ? 'WON' : 'NO_PRIZE',
                instantPrizeLimitReached: alreadyWonInCampaign,
              },
            },
          });

          const collected = await tx.collectionCard.findMany({
            where: { progressId: collection.id },
            select: { card: { select: { publicId: true } } },
          });

          return {
            status: selected ? ('won' as const) : ('no_prize' as const),
            prize: selected
              ? { id: selected.id, name: selected.name, description: selected.description }
              : undefined,
            redeemCode: rawCode,
            expiresAt,
            collectionProgress: {
              count: collected.length,
              cardIds: collected.map(({ card: collectedCard }) => collectedCard.publicId),
            },
            raffleEntriesCount: collected.length,
            raffleEntryAdded: true,
            alreadyParticipated: false,
            instantPrizeLimitReached: alreadyWonInCampaign,
            priorInstantPrize: priorCampaignWin?.prize
              ? { id: priorCampaignWin.prize.id, name: priorCampaignWin.prize.name }
              : undefined,
          };
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable, timeout: 15_000 },
      );
    } catch (error) {
      if (error instanceof GameError) throw error;
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        (error.code === 'P2034' || error.code === 'P2002') &&
        attempt < 7
      ) {
        await new Promise((resolve) => setTimeout(resolve, 18 + Math.random() * 40 * (attempt + 1)));
        continue;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new GameError('ALREADY_PARTICIPATED', 'Ya participaste con esta tarjeta.', 409);
      }
      throw error;
    }
  }
  throw new GameError('RETRY_TRANSACTION', 'Hay muchas personas jugando a la vez. Probá de nuevo.', 503);
}
