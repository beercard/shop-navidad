import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authFailure } from '@/lib/admin';
import { getMerchantScope } from '@/lib/merchant';
import { apiError, serviceUnavailable } from '@/lib/http';
import { checkRateLimit } from '@/lib/rate-limit';
import { sha256 } from '@/lib/security';

const schema = z.object({ merchantSlug: z.string().trim().min(1).max(80), code: z.string().trim().min(8).max(40).transform((value) => value.toUpperCase()) });

export async function POST(request: NextRequest) {
  if (!process.env.DATABASE_URL) return serviceUnavailable();
  try {
    const input = schema.parse(await request.json());
    const scope = await getMerchantScope(input.merchantSlug);
    if ('error' in scope) {
      if (scope.error === 'MERCHANT_REQUIRED') return NextResponse.json({ error: 'Elegí un comercio asignado a tu cuenta.' }, { status: 400 });
      const failure = authFailure(scope.error === 'UNAUTHORIZED' ? 'UNAUTHORIZED' : 'FORBIDDEN');
      return NextResponse.json({ error: failure.error }, { status: failure.statusCode });
    }
    const clientIp = request.headers.get('x-real-ip') ?? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
    const limit = await checkRateLimit(`merchant-lookup:${scope.merchant.id}:${sha256(clientIp)}`, 60, 15 * 60_000);
    if (!limit.allowed) return NextResponse.json({ error: 'Hubo muchos intentos. Esperá unos minutos y probá de nuevo.', code: 'RATE_LIMITED' }, { status: 429 });
    const { prisma } = await import('@/lib/db');
    const redeemCode = await prisma.redeemCode.findFirst({
      where: { codeHash: sha256(input.code), shoppingId: scope.merchant.shoppingId, prize: { merchants: { some: { merchantId: scope.merchant.id } } } },
      include: { prize: { select: { name: true, description: true, active: true } }, campaign: { select: { name: true, status: true, startsAt: true, endsAt: true } } },
    });
    if (!redeemCode) return NextResponse.json({ error: 'El código no es válido para este comercio.', code: 'INVALID_CODE' }, { status: 404 });
    if (redeemCode.status === 'REDEEMED') return NextResponse.json({ error: 'Este código ya fue utilizado.', code: 'ALREADY_REDEEMED', redeemedAt: redeemCode.redeemedAt }, { status: 409 });
    const now = new Date();
    if (redeemCode.status !== 'ISSUED' || redeemCode.expiresAt <= now) return NextResponse.json({ error: 'Este código venció o ya no está disponible.', code: 'CODE_EXPIRED' }, { status: 410 });
    if (!redeemCode.prize.active || redeemCode.campaign.status !== 'ACTIVE' || redeemCode.campaign.startsAt > now || redeemCode.campaign.endsAt <= now) return NextResponse.json({ error: 'La campaña o el premio ya no están vigentes.', code: 'OFFER_UNAVAILABLE' }, { status: 410 });
    return NextResponse.json({ valid: true, prize: { name: redeemCode.prize.name, description: redeemCode.prize.description }, campaign: redeemCode.campaign.name, expiresAt: redeemCode.expiresAt.toISOString() }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) { return apiError(error); }
}
