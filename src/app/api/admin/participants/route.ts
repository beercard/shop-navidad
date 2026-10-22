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
      prisma.participant.findMany({ where: { shoppingId: scope.shopping.id, campaignId }, include: { collections: { where: { campaignId }, include: { cards: { select: { card: { select: { publicId: true, location: true } } } } } }, participations: { where: { campaignId }, include: { prize: { select: { name: true } }, redeemCode: { select: { status: true, expiresAt: true } } }, orderBy: { createdAt: 'desc' }, take: 10 } }, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
    ]);
    const participants = rows.map(({ id, createdAt, collections, participations }) => ({
      id: `P-${id.slice(0, 8).toUpperCase()}`,
      createdAt,
      collectionProgress: collections[0]?.cards.map(({ card }) => card.publicId) ?? [],
      participations: participations.map(({ status, createdAt: playedAt, prize, redeemCode }) => ({ status, playedAt, prize: prize?.name ?? null, redemptionStatus: redeemCode?.status ?? null, redeemExpiresAt: redeemCode?.expiresAt ?? null })),
    }));
    return NextResponse.json({ participants, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) { return apiError(error); }
}
