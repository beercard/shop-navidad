import { NextRequest, NextResponse } from 'next/server';
import { authFailure } from '@/lib/admin';
import { getMerchantScope } from '@/lib/merchant';
import { prisma } from '@/lib/db';
import { apiError, serviceUnavailable } from '@/lib/http';
import { decryptCode } from '@/lib/security';

function argentinaDayStart(now: Date) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Argentina/Buenos_Aires', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }).formatToParts(now);
  const value = Object.fromEntries(parts.map(({ type, value }) => [type, Number(value)]));
  const localAsUtc = Date.UTC(value.year, value.month - 1, value.day, value.hour, value.minute, value.second);
  const instant = Math.floor(now.getTime() / 1000) * 1000;
  const offset = localAsUtc - instant;
  return new Date(Date.UTC(value.year, value.month - 1, value.day) - offset);
}

function parseFilterDate(value: string | null, end = false) {
  if (!value) return undefined;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) return null;
  if (end) date.setUTCDate(date.getUTCDate() + 1);
  return date;
}

export async function GET(request: NextRequest) {
  if (!process.env.DATABASE_URL) return serviceUnavailable();
  try {
    const scope = await getMerchantScope();
    if ('error' in scope) {
      if (scope.error === 'MERCHANT_REQUIRED') return NextResponse.json({ error: 'Elegí un comercio asignado a tu cuenta.' }, { status: 400 });
      const failure = authFailure(scope.error === 'UNAUTHORIZED' ? 'UNAUTHORIZED' : 'FORBIDDEN');
      return NextResponse.json({ error: failure.error }, { status: failure.statusCode });
    }
    const requestedMerchant = request.nextUrl.searchParams.get('merchantSlug');
    if (requestedMerchant && requestedMerchant !== scope.merchant.slug) return NextResponse.json({ error: 'Esta cuenta no está habilitada para ese comercio.', code: 'FORBIDDEN' }, { status: 403 });
    const take = Math.min(100, Math.max(1, Number(request.nextUrl.searchParams.get('limit')) || 30));
    const from = parseFilterDate(request.nextUrl.searchParams.get('from'));
    const through = parseFilterDate(request.nextUrl.searchParams.get('to'), true);
    if (from === null || through === null || (from && through && from >= through)) return NextResponse.json({ error: 'Revisá el período seleccionado.' }, { status: 400 });
    const where = { redeemedMerchantId: scope.merchant.id, shoppingId: scope.merchant.shoppingId, status: 'REDEEMED' as const, ...(from || through ? { redeemedAt: { ...(from ? { gte: from } : {}), ...(through ? { lt: through } : {}) } } : {}) };
    const todayStart = argentinaDayStart(new Date());
    const [rows, todayCount] = await Promise.all([
      prisma.redeemCode.findMany({ where, select: { id: true, codeEncrypted: true, redeemedAt: true, prize: { select: { name: true } }, campaign: { select: { name: true } }, redeemedBy: { select: { name: true } } }, orderBy: { redeemedAt: 'desc' }, take }),
      prisma.redeemCode.count({ where: { redeemedMerchantId: scope.merchant.id, shoppingId: scope.merchant.shoppingId, status: 'REDEEMED', redeemedAt: { gte: todayStart } } }),
    ]);
    const redemptions = rows.map(({ codeEncrypted, ...row }) => ({ ...row, maskedCode: `••••-${decryptCode(codeEncrypted).slice(-4)}` }));
    return NextResponse.json({ merchant: { id: scope.merchant.id, name: scope.merchant.name, shoppingName: scope.merchant.shopping.name }, todayCount, redemptions }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) { return apiError(error); }
}
