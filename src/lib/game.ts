import { Prisma, type Participation, type Prize } from '@prisma/client';
import { prisma } from '@/lib/db';
import { findOrCreateParticipant, readCollectionProgress } from '@/lib/participants';
import { chooseWeighted, decryptCode, encryptCode, newRedeemCode, sha256 } from '@/lib/security';

type GameErrorCode = 'CAMPAIGN_NOT_FOUND' | 'CARD_NOT_FOUND' | 'CARD_INACTIVE' | 'CAMPAIGN_CLOSED' | 'ALREADY_PARTICIPATED' | 'RETRY_TRANSACTION';
export class GameError extends Error {
  constructor(public code: GameErrorCode, message: string, public status = 409) { super(message); }
}

type Existing = Participation & { prize: Prize | null; redeemCode: { codeEncrypted: string; expiresAt: Date; status: string } | null };

async function existingResult(existing: Existing, participantId: string, campaignId: string) {
  const progress = await readCollectionProgress(participantId, campaignId);
  const canShowCode = existing.status === 'WON' && existing.redeemCode?.status === 'ISSUED' && existing.redeemCode.expiresAt > new Date();
  return {
    status: existing.status === 'NO_PRIZE' ? 'no_prize' as const : 'won' as const,
    prize: existing.prize ? { id: existing.prize.id, name: existing.prize.name, description: existing.prize.description } : undefined,
    redeemCode: canShowCode && existing.redeemCode ? decryptCode(existing.redeemCode.codeEncrypted) : undefined,
    expiresAt: canShowCode ? existing.redeemCode?.expiresAt : undefined,
    collectionProgress: progress,
    alreadyParticipated: true,
  };
}

/**
 * The result, stock reservation, participation, redeem code and collection update
 * commit as one PostgreSQL serializable transaction. The browser never chooses a prize.
 */
export async function playCard(input: { token: string; shoppingSlug: string; cardId: string; idempotencyKey: string }) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await prisma.$transaction(async (tx) => {
        const shopping = await tx.shopping.findUnique({ where: { slug: input.shoppingSlug } });
        if (!shopping?.active) throw new GameError('CAMPAIGN_NOT_FOUND', 'No encontramos este shopping.', 404);
        const card = await tx.card.findFirst({
          where: { publicId: input.cardId, shoppingId: shopping.id },
          include: { campaign: true },
        });
        if (!card) throw new GameError('CARD_NOT_FOUND', 'No encontramos esa tarjeta en este shopping.', 404);
        if (card.status !== 'ACTIVE') throw new GameError('CARD_INACTIVE', 'Esta tarjeta no está activa.', 410);
        const campaign = card.campaign;
        const now = new Date();
        if (campaign.status !== 'ACTIVE' || campaign.startsAt > now || campaign.endsAt <= now) {
          throw new GameError('CAMPAIGN_CLOSED', 'La campaña de esta tarjeta no está activa ahora.', 409);
        }
        const participant = await findOrCreateParticipant(tx, input.token, campaign.id, shopping.id);

        const priorByKey = await tx.participation.findFirst({
          where: { participantId: participant.id, idempotencyKey: input.idempotencyKey },
          include: { prize: true, redeemCode: { select: { codeEncrypted: true, expiresAt: true, status: true } } },
        });
        if (priorByKey) return existingResult(priorByKey, participant.id, campaign.id);
        const priorCard = await tx.participation.findUnique({
          where: { participantId_cardId_campaignId: { participantId: participant.id, cardId: card.id, campaignId: campaign.id } },
          include: { prize: true, redeemCode: { select: { codeEncrypted: true, expiresAt: true, status: true } } },
        });
        if (priorCard) return existingResult(priorCard, participant.id, campaign.id);

        const candidates = await tx.prize.findMany({
          where: {
            campaignId: campaign.id, shoppingId: shopping.id, active: true, remainingStock: { gt: 0 },
            AND: [{ OR: [{ startsAt: null }, { startsAt: { lte: now } }] }, { OR: [{ endsAt: null }, { endsAt: { gt: now } }] }],
          },
        });
        const eligible: typeof candidates = [];
        for (const prize of candidates) {
          const wonCount = await tx.participation.count({ where: { participantId: participant.id, campaignId: campaign.id, prizeId: prize.id } });
          if (wonCount < prize.maxPerPerson) eligible.push(prize);
        }
        let selected: (typeof candidates)[number] | undefined;
        const pool = [...eligible];
        while (pool.length && !selected) {
          const weighted = chooseWeighted(pool);
          if (!weighted) break;
          const reserved = await tx.prize.updateMany({ where: { id: weighted.id, remainingStock: { gt: 0 } }, data: { remainingStock: { decrement: 1 } } });
          if (reserved.count === 1) selected = weighted;
          else pool.splice(pool.findIndex(({ id }) => id === weighted.id), 1);
        }

        const participation = await tx.participation.create({ data: {
          participantId: participant.id,
          cardId: card.id,
          campaignId: campaign.id,
          shoppingId: shopping.id,
          prizeId: selected?.id,
          idempotencyKey: input.idempotencyKey,
          status: selected ? 'WON' : 'NO_PRIZE',
        } });
        let rawCode: string | undefined;
        let expiresAt: Date | undefined;
        if (selected) {
          rawCode = newRedeemCode();
          expiresAt = new Date(Math.min(now.getTime() + 7 * 24 * 60 * 60_000, campaign.endsAt.getTime(), selected.endsAt?.getTime() ?? Infinity));
          await tx.redeemCode.create({ data: {
            codeHash: sha256(rawCode), codeEncrypted: encryptCode(rawCode), participationId: participation.id,
            prizeId: selected.id, campaignId: campaign.id, shoppingId: shopping.id, expiresAt,
          } });
          await tx.inventoryMovement.create({ data: { prizeId: selected.id, campaignId: campaign.id, shoppingId: shopping.id, delta: -1, reason: `Premio asignado · participación ${participation.id}` } });
          await tx.event.create({ data: { eventType: 'PRIZE_ASSIGNED', campaignId: campaign.id, shoppingId: shopping.id, cardId: card.id, participantId: participant.id, metadata: { prizeId: selected.id } } });
        }
        const collection = await tx.collectionProgress.upsert({
          where: { participantId_campaignId: { participantId: participant.id, campaignId: campaign.id } },
          create: { participantId: participant.id, campaignId: campaign.id }, update: {},
        });
        await tx.collectionCard.createMany({ data: [{ progressId: collection.id, cardId: card.id }], skipDuplicates: true });
        await tx.event.create({ data: { eventType: 'CARD_PLAYED', campaignId: campaign.id, shoppingId: shopping.id, cardId: card.id, participantId: participant.id } });
        const collected = await tx.collectionCard.findMany({ where: { progressId: collection.id }, select: { card: { select: { publicId: true } } } });
        return {
          status: selected ? 'won' as const : 'no_prize' as const,
          prize: selected ? { id: selected.id, name: selected.name, description: selected.description } : undefined,
          redeemCode: rawCode,
          expiresAt,
          collectionProgress: { count: collected.length, cardIds: collected.map(({ card: collectedCard }) => collectedCard.publicId) },
          alreadyParticipated: false,
        };
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable, timeout: 10_000 });
    } catch (error) {
      if (error instanceof GameError) throw error;
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2034' && attempt < 2) continue;
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new GameError('ALREADY_PARTICIPATED', 'Ya participaste con esta tarjeta.', 409);
      }
      throw error;
    }
  }
  throw new GameError('RETRY_TRANSACTION', 'Hay muchas personas jugando a la vez. Probá de nuevo.', 503);
}
