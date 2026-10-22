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
    const take = Math.min(100, Math.max(1, Number(request.nextUrl.searchParams.get('limit') ?? 25)));
    const [total, movements] = await Promise.all([
      prisma.inventoryMovement.count({ where: { shoppingId: scope.shopping.id } }),
      prisma.inventoryMovement.findMany({ where: { shoppingId: scope.shopping.id }, include: { prize: { select: { name: true } }, actor: { select: { name: true } } }, orderBy: { createdAt: 'desc' }, skip: (page - 1) * take, take }),
    ]);
    return NextResponse.json({ movements, pagination: { page, limit: take, total, pages: Math.ceil(total / take) } });
  } catch (error) { return apiError(error); }
}
