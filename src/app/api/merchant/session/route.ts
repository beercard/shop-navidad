import { NextRequest, NextResponse } from 'next/server';
import { authFailure } from '@/lib/admin';
import { getMerchantScopes } from '@/lib/merchant';
import { apiError, serviceUnavailable } from '@/lib/http';

export async function GET(request: NextRequest) {
  if (!process.env.DATABASE_URL) return serviceUnavailable();
  try {
    const scope = await getMerchantScopes();
    if ('error' in scope) {
      if (scope.error === 'UNAUTHORIZED' && request.nextUrl.searchParams.get('optional') === '1') {
        return NextResponse.json({ user: null, merchant: null }, { status: 200, headers: { 'Cache-Control': 'private, no-store' } });
      }
      const failure = authFailure(scope.error === 'UNAUTHORIZED' ? 'UNAUTHORIZED' : 'FORBIDDEN');
      return NextResponse.json({ error: failure.error }, { status: failure.statusCode });
    }
    const merchant = scope.merchants[0];
    return NextResponse.json({ user: { id: scope.admin.id, name: scope.admin.name }, merchant: { id: merchant.id, slug: merchant.slug, name: merchant.name, shopping: merchant.shopping } }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) { return apiError(error); }
}
