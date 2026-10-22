import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authFailure, getAdminShopping } from '@/lib/admin';
import { apiError, serviceUnavailable } from '@/lib/http';
import { RedeemError, validateRedemption } from '@/lib/redeem';

const schema = z.object({ shoppingSlug: z.string(), code: z.string().trim().min(8).max(40).transform((value) => value.toUpperCase()) });

export async function POST(request: NextRequest) {
  if (!process.env.DATABASE_URL) return serviceUnavailable();
  try {
    const input = schema.parse(await request.json());
    const scope = await getAdminShopping(input.shoppingSlug, ['SUPERADMIN', 'SHOPPING_OPERATOR', 'MERCHANT_VALIDATOR']);
    if ('error' in scope) { const failure = authFailure(scope.error); return NextResponse.json({ error: failure.error }, { status: failure.statusCode }); }
    return NextResponse.json(await validateRedemption({ shoppingId: scope.shopping.id, actorId: scope.admin.id, code: input.code }));
  } catch (error) {
    if (error instanceof RedeemError) return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
    return apiError(error);
  }
}
