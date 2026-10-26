import { NextRequest, NextResponse } from 'next/server';
import { readCompletionRewardState } from '@/lib/completion-reward';
import { prisma } from '@/lib/db';
import { apiError, serviceUnavailable } from '@/lib/http';
import { readCollectionProgress, participantCookieName } from '@/lib/participants';
import { maskPhone } from '@/lib/phone';
import { sha256 } from '@/lib/security';

export async function GET(request: NextRequest, context: { params: Promise<{ shoppingSlug: string }> }) {
  if (!process.env.DATABASE_URL) return serviceUnavailable();
  try {
    const { shoppingSlug } = await context.params;
    const shopping = await prisma.shopping.findUnique({ where: { slug: shoppingSlug } });
    if (!shopping?.active) {
      return NextResponse.json({ error: 'No encontramos este shopping.', code: 'SHOPPING_NOT_FOUND' }, { status: 404 });
    }
    const now = new Date();
    const requestedCampaign = request.nextUrl.searchParams.get('campaign')?.trim();
    const requestedCardId = request.nextUrl.searchParams.get('cardId')?.trim();
    if (requestedCardId && (requestedCardId.length > 40 || !/^[a-zA-Z0-9_-]+$/.test(requestedCardId))) {
      return NextResponse.json({ error: 'El identificador de tarjeta no es válido.', code: 'INVALID_CARD_ID' }, { status: 400 });
    }

    const campaign = await prisma.campaign.findFirst({
      where: {
        shoppingId: shopping.id,
        ...(requestedCampaign ? { slug: requestedCampaign } : {}),
        ...(requestedCardId
          ? {
              cards: {
                some: {
                  shoppingId: shopping.id,
                  publicId: requestedCardId,
                  status: 'ACTIVE',
                  OR: [{ locationId: null }, { place: { active: true } }],
                },
              },
            }
          : {}),
        status: 'ACTIVE',
        startsAt: { lte: now },
        endsAt: { gt: now },
      },
      include: {
        prizes: {
          where: { shoppingId: shopping.id, active: true },
          orderBy: { name: 'asc' },
          include: { merchants: { where: { merchant: { active: true } }, select: { merchant: { select: { name: true } } } } },
        },
        cards: {
          where: {
            shoppingId: shopping.id,
            status: 'ACTIVE',
            OR: [{ locationId: null }, { place: { active: true } }],
          },
          select: { publicId: true, location: true, kind: true, place: { select: { sector: true } } },
          orderBy: { publicId: 'asc' },
        },
        clues: {
          where: { shoppingId: shopping.id, active: true, startsAt: { lte: now }, endsAt: { gt: now } },
          orderBy: { startsAt: 'desc' },
          select: { text: true, startsAt: true, endsAt: true, card: { select: { publicId: true } } },
        },
      },
    });

    if (!campaign) {
      return NextResponse.json(
        { error: 'Todavía no hay una campaña activa en este shopping.', code: 'CAMPAIGN_UNAVAILABLE' },
        { status: 404 },
      );
    }

    // Lectura libre de efectos secundarios: no crea participante ni emite cookies.
    const token = request.cookies.get(participantCookieName)?.value;
    const participant = token
      ? await prisma.participant.findUnique({
          where: {
            sessionHash_campaignId_shoppingId: {
              sessionHash: sha256(token),
              campaignId: campaign.id,
              shoppingId: shopping.id,
            },
          },
          select: { id: true, phone: true, consentAt: true },
        })
      : null;

    const collectionProgress = participant
      ? await readCollectionProgress(participant.id, campaign.id)
      : { count: 0, cardIds: [] };

    const activeCardPublicIds = campaign.cards.map((c) => c.publicId);
    const completionReward = await readCompletionRewardState({
      campaignId: campaign.id,
      participantId: participant?.id ?? null,
      settings: campaign.settings,
      activeCardPublicIds,
      collectedPublicIds: collectionProgress.cardIds,
    });

    const priorWin = participant
      ? await prisma.participation.findFirst({
          where: {
            participantId: participant.id,
            campaignId: campaign.id,
            OR: [{ status: { in: ['WON', 'REDEEMED'] } }, { prizeId: { not: null } }],
          },
          include: { prize: { select: { id: true, name: true } } },
        })
      : null;

    return NextResponse.json(
      {
        shopping: { slug: shopping.slug, name: shopping.name, brandSettings: publicBrandSettings(shopping.brandSettings) },
        campaign: {
          id: campaign.id,
          name: campaign.name,
          startsAt: campaign.startsAt,
          endsAt: campaign.endsAt,
          rulesUrl: campaign.rulesUrl,
          settings: publicSettings(campaign.settings),
        },
        prizes: campaign.prizes.map(({ id, name, description, imageUrl, remainingStock, startsAt, endsAt, merchants }) => ({
          merchants: merchants.map(({ merchant }) => merchant.name),
          id,
          name,
          description,
          imageUrl,
          remainingStock,
          available: remainingStock > 0 && (!startsAt || startsAt <= now) && (!endsAt || endsAt > now),
        })),
        // Solo se revelan ubicaciones de tarjetas ya descubiertas por esta persona; el resto queda oculto.
        cards: campaign.cards
          .filter((card) => collectionProgress.cardIds.includes(card.publicId))
          .map(({ publicId, location, kind }) => ({ publicId, location, kind })),
        cardCount: campaign.cards.length,
        zones: zoneProgress(campaign.cards, collectionProgress.cardIds),
        clue: nextClue(campaign.clues, collectionProgress.cardIds),
        collectionProgress,
        completionReward,
        raffleEntriesCount: completionReward.totalRaffleEntriesCount,
        scanRaffleEntriesCount: completionReward.scanRaffleEntriesCount,
        bonusRaffleEntriesCount: completionReward.bonusRaffleEntriesCount,
        exclusiveDrawEligible: completionReward.exclusiveDrawEligible,
        participant: participant
          ? {
              id: participant.id,
              registered: Boolean(participant.phone),
              maskedPhone: maskPhone(participant.phone),
            }
          : null,
        instantPrizeWon: priorWin?.prize
          ? { id: priorWin.prize.id, name: priorWin.prize.name, status: priorWin.status }
          : null,
      },
      { headers: { 'Cache-Control': 'private, no-store' } },
    );
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: NextRequest, context: { params: Promise<{ shoppingSlug: string }> }) {
  return GET(request, context);
}

type ClueRow = { text: string; startsAt: Date; endsAt: Date; card: { publicId: string } | null };

/**
 * Pista progresiva: primero la de la próxima tarjeta que esta persona todavía no encontró (orden por código);
 * si ya encontró todas las que tienen pista, una pista general. Cada hallazgo hace aparecer la siguiente.
 */
function nextClue(clues: ClueRow[], foundIds: string[]) {
  const found = new Set(foundIds);
  const pending = clues
    .filter((clue) => clue.card && !found.has(clue.card.publicId))
    .sort((a, b) => a.card!.publicId.localeCompare(b.card!.publicId))[0];
  const chosen = pending ?? clues.find((clue) => !clue.card);
  if (!chosen) return null;
  return { text: chosen.text, startsAt: chosen.startsAt, endsAt: chosen.endsAt, forNextCard: Boolean(pending) };
}

/** Avance por zona (sector de la ubicación). Solo cuenta tarjetas: no revela dónde está cada una. */
function zoneProgress(cards: Array<{ publicId: string; place: { sector: string | null } | null }>, foundIds: string[]) {
  const found = new Set(foundIds);
  const zones = new Map<string, { name: string; total: number; found: number }>();
  for (const card of cards) {
    const sector = card.place?.sector?.trim();
    if (!sector) continue;
    const zone = zones.get(sector) ?? { name: sector, total: 0, found: 0 };
    zone.total += 1;
    if (found.has(card.publicId)) zone.found += 1;
    zones.set(sector, zone);
  }
  return [...zones.values()].sort((a, b) => a.name.localeCompare(b.name, 'es'));
}

function publicSettings(settings: unknown) {
  if (!settings || typeof settings !== 'object' || Array.isArray(settings)) return {};
  const allowed = [
    'collectionTarget',
    'collectionUnlockText',
    'publicMessage',
    'completionRewardEnabled',
    'completionRewardMode',
    'requiredCardIds',
    'completionRewardTitle',
    'completionRewardTerms',
  ];
  return Object.fromEntries(Object.entries(settings).filter(([key]) => allowed.includes(key)));
}

function publicBrandSettings(settings: unknown) {
  if (!settings || typeof settings !== 'object' || Array.isArray(settings)) return {};
  const allowed = ['primary', 'accent', 'surface', 'text', 'fontPreset', 'publicMessage', 'collectionUnlockText'];
  return Object.fromEntries(Object.entries(settings).filter(([key]) => allowed.includes(key)));
}
