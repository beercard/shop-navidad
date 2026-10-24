import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authFailure } from '@/lib/admin';
import { getMerchantScope } from '@/lib/merchant';
import { RedeemError, validateRedemption } from '@/lib/redeem';
import { apiError, serviceUnavailable } from '@/lib/http';
import { checkRateLimit } from '@/lib/rate-limit';
import { sha256 } from '@/lib/security';

const schema = z.object({ merchantSlug: z.string().trim().min(1).max(80).optional(), code: z.string().trim().min(8).max(40).transform((value) => value.replace(/\s+/g, '').toUpperCase()).pipe(z.string().regex(/^[A-Z0-9-]{8,40}$/)) });

export async function POST(request: NextRequest) {
  if (!process.env.DATABASE_URL) return serviceUnavailable();
  try {
    const input = schema.parse(await request.json());
    const scope = await getMerchantScope();
    if ('error' in scope) {
      if (scope.error === 'MERCHANT_REQUIRED') return NextResponse.json({ error: 'Elegí un comercio asignado a tu cuenta.' }, { status: 400 });
      const failure = authFailure(scope.error === 'UNAUTHORIZED' ? 'UNAUTHORIZED' : 'FORBIDDEN');
      return NextResponse.json({ error: failure.error }, { status: failure.statusCode });
    }
    if (input.merchantSlug && input.merchantSlug !== scope.merchant.slug) return NextResponse.json({ error: 'Esta cuenta no está habilitada para ese comercio.', code: 'FORBIDDEN' }, { status: 403 });
    const clientIp = request.headers.get('x-real-ip') ?? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
    const limit = await checkRateLimit(`merchant-redeem:${scope.merchant.id}:${sha256(clientIp)}`, 20, 15 * 60_000);
    if (!limit.allowed) return NextResponse.json({ error: 'Hubo muchos intentos. Esperá unos minutos y probá de nuevo.', code: 'RATE_LIMITED' }, { status: 429 });
    return NextResponse.json(await validateRedemption({ shoppingId: scope.merchant.shoppingId, actorId: scope.admin.id, merchantId: scope.merchant.id, code: input.code }), { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    if (error instanceof RedeemError) return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
    return apiError(error);
  }
}
