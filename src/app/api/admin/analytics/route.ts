import { NextRequest, NextResponse } from 'next/server';
import { authFailure, getAdminShopping } from '@/lib/admin';
import { prisma } from '@/lib/db';
import { apiError, serviceUnavailable } from '@/lib/http';

export async function GET(request: NextRequest) {
  if (!process.env.DATABASE_URL) return serviceUnavailable();
  try {
    const scope = await getAdminShopping(request.nextUrl.searchParams.get('shoppingSlug') ?? '', ['SUPERADMIN', 'SHOPPING_OPERATOR']);
    if ('error' in scope) { const failure = authFailure(scope.error); return NextResponse.json({ error: failure.error }, { status: failure.statusCode }); }
    const from = new Date(request.nextUrl.searchParams.get('from') ?? new Date(Date.now() - 30 * 86400000).toISOString());
    const to = new Date(request.nextUrl.searchParams.get('to') ?? new Date().toISOString());
    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()) || from >= to) return NextResponse.json({ error: 'El rango de fechas no es válido.' }, { status: 400 });
    const [cards, prizes, redemptions, eventCounts, locationVisitGroups, participantsCount, raffleEntriesCount, stockAgg, campaigns, merchants] = await Promise.all([
      prisma.card.findMany({ where: { shoppingId: scope.shopping.id }, select: { publicId: true, location: true, _count: { select: { participations: { where: { createdAt: { gte: from, lt: to } } } } } }, orderBy: { publicId: 'asc' }, take: 2500 }),
      prisma.participation.groupBy({ by: ['prizeId', 'status'], where: { shoppingId: scope.shopping.id, createdAt: { gte: from, lt: to } }, _count: { _all: true } }),
      prisma.redeemCode.groupBy({ by: ['status'], where: { shoppingId: scope.shopping.id, createdAt: { gte: from, lt: to } }, _count: { _all: true } }),
      prisma.event.groupBy({ by: ['eventType'], where: { shoppingId: scope.shopping.id, createdAt: { gte: from, lt: to } }, _count: { _all: true } }),
      prisma.event.groupBy({ by: ['locationId'], where: { shoppingId: scope.shopping.id, eventType: 'LANDING_VISIT', locationId: { not: null }, createdAt: { gte: from, lt: to } }, _count: { _all: true } }),
      prisma.participant.count({ where: { shoppingId: scope.shopping.id, createdAt: { gte: from, lt: to } } }),
      prisma.collectionCard.count({ where: { card: { shoppingId: scope.shopping.id }, collectedAt: { gte: from, lt: to } } }),
      prisma.prize.aggregate({ where: { shoppingId: scope.shopping.id, active: true }, _sum: { remainingStock: true, totalStock: true } }),
      prisma.campaign.findMany({ where: { shoppingId: scope.shopping.id }, select: { name: true, status: true, _count: { select: { participations: true, cards: true, prizes: true } } }, orderBy: { createdAt: 'desc' } }),
      prisma.merchant.findMany({ where: { shoppingId: scope.shopping.id }, select: { name: true, slug: true, active: true, _count: { select: { redemptions: true, prizes: true } } }, orderBy: { name: 'asc' } }),
    ]);
    const prizeIds = prizes.map(({ prizeId }) => prizeId).filter((id): id is string => Boolean(id));
    const prizeNames = await prisma.prize.findMany({ where: { id: { in: prizeIds } }, select: { id: true, name: true } });
    const nameById = new Map(prizeNames.map(({ id, name }) => [id, name]));
    const byPrize = prizes.map(({ prizeId, status, _count }) => ({ prize: prizeId ? nameById.get(prizeId) ?? 'Premio eliminado' : 'Sin premio', status, count: _count._all }));
    const locationIds = locationVisitGroups.map(({ locationId }) => locationId).filter((id): id is string => Boolean(id));
    const locationRows = locationIds.length ? await prisma.location.findMany({ where: { id: { in: locationIds }, shoppingId: scope.shopping.id }, select: { id: true, name: true, slug: true } }) : [];
    const locationNames = new Map(locationRows.map(({ id, name, slug }) => [id, `${name} (${slug})`]));
    const byLocation = new Map<string, number>();
    for (const card of cards) byLocation.set(card.location || 'Sin ubicación', (byLocation.get(card.location || 'Sin ubicación') ?? 0) + card._count.participations);
    const visitsByLocation = locationVisitGroups.map(({ locationId, _count }) => ({ location: locationId ? locationNames.get(locationId) ?? 'Ubicación eliminada' : 'Sin ubicación', visits: _count._all }));
    const eventMap = new Map(eventCounts.map(({ eventType, _count }) => [eventType, _count._all]));
    const redemptionMap = new Map(redemptions.map(({ status, _count }) => [status, _count._all]));
    const authorizedPlays = prizes.reduce((sum, row) => sum + row._count._all, 0);
    const prizesAssigned = prizes.filter((row) => row.status === 'WON').reduce((sum, row) => sum + row._count._all, 0);
    const couponsIssued = redemptions.reduce((sum, row) => sum + row._count._all, 0);
    const couponsRedeemed = redemptionMap.get('REDEEMED') ?? 0;
    const availableStock = stockAgg._sum.remainingStock ?? 0;
    const consumedStock = Math.max(0, (stockAgg._sum.totalStock ?? 0) - availableStock);
    const discoveredCards = cards.filter((c) => c._count.participations > 0).length;
    const duplicatePlaysRejected = eventMap.get('DUPLICATE_PLAY_REJECTED') ?? 0;
    const suspiciousAttempts = eventMap.get('SUSPICIOUS_ATTEMPT') ?? 0;
    const bonusRaffleEntries = eventMap.get('EXTRA_RAFFLE_ENTRY_ISSUED') ?? 0;
    const completedRoutesCount = eventMap.get('ROUTE_COMPLETION_REWARD_ISSUED') ?? 0;
    const exclusiveDrawEligibleCount = eventMap.get('EXCLUSIVE_DRAW_ELIGIBILITY_ISSUED') ?? 0;
    const completionRate = cards.length > 0 ? `${Math.round((discoveredCards / cards.length) * 100)}%` : '0%';
    const redemptionRate = couponsIssued > 0 ? `${Math.round((couponsRedeemed / couponsIssued) * 100)}%` : '0%';
    return NextResponse.json({
      range: { from, to },
      visits: locationVisitGroups.reduce((sum, row) => sum + row._count._all, 0),
      uniqueParticipants: participantsCount,
      discoveredCards,
      authorizedPlays,
      duplicatePlaysRejected,
      prizesAssigned,
      availableStock,
      consumedStock,
      couponsIssued,
      couponsRedeemed,
      scanRaffleEntries: raffleEntriesCount,
      bonusRaffleEntries,
      raffleEntries: raffleEntriesCount + bonusRaffleEntries,
      completedRoutesCount,
      exclusiveDrawEligibleCount,
      suspiciousAttempts,
      completionRate,
      redemptionRate,
      byCampaign: campaigns.map((c) => ({ campaign: c.name, status: c.status, cards: c._count.cards, prizes: c._count.prizes, participations: c._count.participations })),
      byCard: cards.map(({ publicId, location, _count }) => ({ publicId, location, participations: _count.participations })),
      byLocation: [...byLocation].map(([location, participations]) => ({ location, participations })),
      byMerchant: merchants.map((m) => ({ merchant: m.name, slug: m.slug, active: m.active ? 'Activo' : 'Inactivo', assignedPrizes: m._count.prizes, redemptions: m._count.redemptions })),
      visitsByLocation,
      byPrize,
      redemptions: redemptions.map(({ status, _count }) => ({ status, count: _count._all })),
      events: eventCounts.map(({ eventType, _count }) => ({ eventType, count: _count._all })),
    });
  } catch (error) { return apiError(error); }
}
