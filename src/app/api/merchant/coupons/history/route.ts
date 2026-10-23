import { NextRequest, NextResponse } from 'next/server';
import { authFailure } from '@/lib/admin';
import { getMerchantScope } from '@/lib/merchant';
import { prisma } from '@/lib/db';
import { apiError, serviceUnavailable } from '@/lib/http';

export async function GET(request: NextRequest) {
  if (!process.env.DATABASE_URL) return serviceUnavailable();
  try {
    const merchantSlug = request.nextUrl.searchParams.get('merchantSlug');
    const scope = await getMerchantScope(merchantSlug);
    if ('error' in scope) {
      if (scope.error === 'MERCHANT_REQUIRED') return NextResponse.json({ error: 'Elegí un comercio asignado a tu cuenta.' }, { status: 400 });
      const failure = authFailure(scope.error === 'UNAUTHORIZED' ? 'UNAUTHORIZED' : 'FORBIDDEN');
      return NextResponse.json({ error: failure.error }, { status: failure.statusCode });
    }
    const take = Math.min(100, Math.max(1, Number(request.nextUrl.searchParams.get('limit')) || 30));
    const redemptions = await prisma.redeemCode.findMany({
      where: { redeemedMerchantId: scope.merchant.id, shoppingId: scope.merchant.shoppingId, status: 'REDEEMED' },
      select: { id: true, redeemedAt: true, createdAt: true, prize: { select: { name: true } }, campaign: { select: { name: true } }, redeemedBy: { select: { name: true } } },
      orderBy: { redeemedAt: 'desc' }, take,
    });
    return NextResponse.json({ merchant: { name: scope.merchant.name, shoppingName: scope.merchant.shopping.name }, redemptions }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) { return apiError(error); }
}
