import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { apiError, serviceUnavailable } from '@/lib/http';
import { readCollectionProgress, participantCookieName } from '@/lib/participants';
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
        prizes: { where: { shoppingId: shopping.id, active: true }, orderBy: { name: 'asc' } },
        cards: {
          where: {
            shoppingId: shopping.id,
            status: 'ACTIVE',
            OR: [{ locationId: null }, { place: { active: true } }],
          },
          select: { publicId: true, location: true, kind: true },
          orderBy: { publicId: 'asc' },
        },
        clues: {
          where: { shoppingId: shopping.id, active: true, startsAt: { lte: now }, endsAt: { gt: now } },
          orderBy: { startsAt: 'desc' },
          take: 1,
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
          select: { id: true },
        })
      : null;

    const collectionProgress = participant
      ? await readCollectionProgress(participant.id, campaign.id)
      : { count: 0, cardIds: [] };

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
        prizes: campaign.prizes.map(({ id, name, description, imageUrl, remainingStock, startsAt, endsAt }) => ({
          id,
          name,
          description,
          imageUrl,
          remainingStock,
          available: remainingStock > 0 && (!startsAt || startsAt <= now) && (!endsAt || endsAt > now),
        })),
        cards: campaign.cards,
        clue: campaign.clues[0] ?? null,
        collectionProgress,
        raffleEntriesCount: collectionProgress.count,
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

function publicSettings(settings: unknown) {
  if (!settings || typeof settings !== 'object' || Array.isArray(settings)) return {};
  const allowed = ['collectionTarget', 'collectionUnlockText', 'publicMessage'];
  return Object.fromEntries(Object.entries(settings).filter(([key]) => allowed.includes(key)));
}

function publicBrandSettings(settings: unknown) {
  if (!settings || typeof settings !== 'object' || Array.isArray(settings)) return {};
  const allowed = ['primary', 'accent', 'surface', 'text', 'fontPreset', 'publicMessage', 'collectionUnlockText'];
  return Object.fromEntries(Object.entries(settings).filter(([key]) => allowed.includes(key)));
}
