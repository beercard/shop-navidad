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
    const take = Math.min(100, Math.max(1, Number(request.nextUrl.searchParams.get('limit') ?? 50)));
    const logs = await prisma.auditLog.findMany({ where: { shoppingId: scope.shopping.id }, include: { actor: { select: { id: true, name: true, email: true } } }, orderBy: { createdAt: 'desc' }, take });
    return NextResponse.json({ logs });
  } catch (error) { return apiError(error); }
}
