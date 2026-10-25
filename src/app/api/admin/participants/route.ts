import { NextRequest, NextResponse } from 'next/server';
import { authFailure, getAdminShopping } from '@/lib/admin';
import { prisma } from '@/lib/db';
import { apiError, serviceUnavailable } from '@/lib/http';

export async function GET(request: NextRequest) {
  if (!process.env.DATABASE_URL) return serviceUnavailable();
  try {
    const scope = await getAdminShopping(request.nextUrl.searchParams.get('shoppingSlug') ?? '', ['SUPERADMIN', 'SHOPPING_OPERATOR']);
    if ('error' in scope) { const failure = authFailure(scope.error); return NextResponse.json({ error: failure.error }, { status: failure.statusCode }); }
    const page = Math.max(1, Number(request.nextUrl.searchParams.get('page') ?? 1));
    const limit = Math.min(100, Math.max(1, Number(request.nextUrl.searchParams.get('limit') ?? 25)));
    const campaignId = request.nextUrl.searchParams.get('campaignId') ?? undefined;
    const [total, rows] = await Promise.all([
      prisma.participant.count({ where: { shoppingId: scope.shopping.id, campaignId } }),
      prisma.participant.findMany({
        where: { shoppingId: scope.shopping.id, campaignId },
        include: {
          collections: {
            where: { campaignId },
            include: { cards: { select: { card: { select: { publicId: true, location: true } } } } },
          },
          participations: {
            where: { campaignId },
            include: { prize: { select: { name: true } }, redeemCode: { select: { status: true, expiresAt: true } } },
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
          events: {
            where: {
              ...(campaignId ? { campaignId } : {}),
              eventType: { in: ['ROUTE_COMPLETION_REWARD_ISSUED', 'EXTRA_RAFFLE_ENTRY_ISSUED', 'EXCLUSIVE_DRAW_ELIGIBILITY_ISSUED'] },
            },
            select: { eventType: true, metadata: true, createdAt: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);
    const participants = rows.map(({ id, createdAt, collections, participations, events }) => {
      const cardIds = Array.from(new Set(collections.flatMap((col) => col.cards.map(({ card }) => card.publicId))));
      const winningPlay = participations.find((p) => p.status === 'WON' && p.prize);
      const rewardEvent = events.find((e) => e.eventType === 'ROUTE_COMPLETION_REWARD_ISSUED');
      const bonusEntry = events.some((e) => e.eventType === 'EXTRA_RAFFLE_ENTRY_ISSUED') ? 1 : 0;
      const exclusiveEligible = events.some((e) => e.eventType === 'EXCLUSIVE_DRAW_ELIGIBILITY_ISSUED');
      const rewardMeta = rewardEvent?.metadata && typeof rewardEvent.metadata === 'object' && !Array.isArray(rewardEvent.metadata)
        ? (rewardEvent.metadata as Record<string, unknown>)
        : null;
      return {
        id: `P-${id.slice(0, 8).toUpperCase()}`,
        createdAt,
        collectionProgress: { count: cardIds.length, cardIds },
        scanRaffleEntries: cardIds.length,
        bonusRaffleEntries: bonusEntry,
        raffleEntries: cardIds.length + bonusEntry,
        exclusiveDrawEligible: exclusiveEligible,
        completionReward: rewardEvent
          ? {
              unlocked: true,
              mode: typeof rewardMeta?.mode === 'string' ? rewardMeta.mode : exclusiveEligible ? 'EXCLUSIVE_DRAW' : 'EXTRA_RAFFLE_ENTRY',
              referenceId: typeof rewardMeta?.referenceId === 'string' ? rewardMeta.referenceId : null,
              completedAt: rewardEvent.createdAt,
            }
          : { unlocked: false, mode: null, referenceId: null, completedAt: null },
        instantPrizeWon: winningPlay?.prize?.name ?? null,
        participations: participations.map(({ status, createdAt: playedAt, prize, redeemCode }) => ({
          status,
          playedAt,
          prize: prize?.name ?? null,
          redemptionStatus: redeemCode?.status ?? null,
          redeemExpiresAt: redeemCode?.expiresAt ?? null,
        })),
      };
    });
    return NextResponse.json({ participants, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) { return apiError(error); }
}
