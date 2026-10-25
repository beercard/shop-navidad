import { NextRequest, NextResponse } from 'next/server';
import { authFailure, getAdminShopping } from '@/lib/admin';
import { prisma } from '@/lib/db';
import { apiError, serviceUnavailable } from '@/lib/http';

export async function GET(request: NextRequest) {
  if (!process.env.DATABASE_URL) return serviceUnavailable();
  try {
    const shoppingSlug = request.nextUrl.searchParams.get('shoppingSlug') ?? '';
    const scope = await getAdminShopping(shoppingSlug, ['SUPERADMIN', 'SHOPPING_OPERATOR']);
    if ('error' in scope) { const failure = authFailure(scope.error); return NextResponse.json({ error: failure.error }, { status: failure.statusCode }); }
    const from = new Date(request.nextUrl.searchParams.get('from') ?? new Date(Date.now() - 30 * 86400000).toISOString());
    const to = new Date(request.nextUrl.searchParams.get('to') ?? new Date().toISOString());
    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()) || from >= to) return NextResponse.json({ error: 'El rango de fechas no es válido.' }, { status: 400 });
    const where = { shoppingId: scope.shopping.id, createdAt: { gte: from, lt: to } };
    const [participants, plays, wonPlays, issuedCoupons, redeemed, stock, prizes, cards, recentAudit, scanRaffleEntries, bonusRaffleEntries, completedRoutesCount, exclusiveDrawEligibleCount, duplicatePlaysRejected, suspiciousAttempts] = await Promise.all([
      prisma.participant.count({ where: { shoppingId: scope.shopping.id, createdAt: { gte: from, lt: to } } }),
      prisma.participation.count({ where }),
      prisma.participation.count({ where: { ...where, status: 'WON' } }),
      prisma.redeemCode.count({ where }),
      prisma.redeemCode.count({ where: { shoppingId: scope.shopping.id, status: 'REDEEMED', redeemedAt: { gte: from, lt: to } } }),
      prisma.prize.aggregate({ where: { shoppingId: scope.shopping.id, active: true }, _sum: { remainingStock: true, totalStock: true } }),
      prisma.prize.findMany({ where: { shoppingId: scope.shopping.id }, select: { id: true, name: true, remainingStock: true, totalStock: true, active: true }, orderBy: { name: 'asc' } }),
      prisma.card.findMany({ where: { shoppingId: scope.shopping.id }, select: { id: true, publicId: true, location: true, _count: { select: { participations: true } } }, orderBy: { publicId: 'asc' }, take: 100 }),
      prisma.auditLog.findMany({ where: { shoppingId: scope.shopping.id }, select: { action: true, entityType: true, createdAt: true, actor: { select: { name: true } } }, orderBy: { createdAt: 'desc' }, take: 8 }),
      prisma.collectionCard.count({ where: { card: { shoppingId: scope.shopping.id }, collectedAt: { gte: from, lt: to } } }),
      prisma.event.count({ where: { shoppingId: scope.shopping.id, eventType: 'EXTRA_RAFFLE_ENTRY_ISSUED', createdAt: { gte: from, lt: to } } }),
      prisma.event.count({ where: { shoppingId: scope.shopping.id, eventType: 'ROUTE_COMPLETION_REWARD_ISSUED', createdAt: { gte: from, lt: to } } }),
      prisma.event.count({ where: { shoppingId: scope.shopping.id, eventType: 'EXCLUSIVE_DRAW_ELIGIBILITY_ISSUED', createdAt: { gte: from, lt: to } } }),
      prisma.event.count({ where: { shoppingId: scope.shopping.id, eventType: 'DUPLICATE_PLAY_REJECTED', createdAt: { gte: from, lt: to } } }),
      prisma.event.count({ where: { shoppingId: scope.shopping.id, eventType: 'SUSPICIOUS_ATTEMPT', createdAt: { gte: from, lt: to } } }),
    ]);
    const availableStock = stock._sum.remainingStock ?? 0;
    const totalStock = stock._sum.totalStock ?? 0;
    const consumedStock = Math.max(0, totalStock - availableStock);
    const discoveredCards = cards.filter((c) => c._count.participations > 0).length;
    const raffleEntries = scanRaffleEntries + bonusRaffleEntries;
    return NextResponse.json({
      range: { from, to },
      metrics: {
        participants,
        participations: plays,
        authorizedPlays: plays,
        discoveredCards,
        duplicatePlaysRejected,
        prizesAssigned: wonPlays,
        couponsIssued: issuedCoupons,
        redeemed,
        couponsRedeemed: redeemed,
        availableStock,
        consumedStock,
        raffleEntries,
        scanRaffleEntries,
        bonusRaffleEntries,
        completedRoutesCount,
        exclusiveDrawEligibleCount,
        suspiciousAttempts,
        redemptionRate: issuedCoupons > 0 ? `${Math.round((redeemed / issuedCoupons) * 100)}%` : '0%',
      },
      prizes,
      cards,
      recentAudit,
    });
  } catch (error) { return apiError(error); }
}
