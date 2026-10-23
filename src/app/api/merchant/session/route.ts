import { NextResponse } from 'next/server';
import { authFailure } from '@/lib/admin';
import { getMerchantScopes } from '@/lib/merchant';
import { apiError, serviceUnavailable } from '@/lib/http';

export async function GET() {
  if (!process.env.DATABASE_URL) return serviceUnavailable();
  try {
    const scope = await getMerchantScopes();
    if ('error' in scope) { const failure = authFailure(scope.error === 'UNAUTHORIZED' ? 'UNAUTHORIZED' : 'FORBIDDEN'); return NextResponse.json({ error: failure.error }, { status: failure.statusCode }); }
    return NextResponse.json({ user: { id: scope.admin.id, name: scope.admin.name }, merchants: scope.merchants.map(({ id, slug, name, shopping }) => ({ id, slug, name, shopping })) }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) { return apiError(error); }
}
