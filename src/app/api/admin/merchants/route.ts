import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authFailure, getAdminShopping, logAudit } from '@/lib/admin';
import { prisma } from '@/lib/db';
import { apiError, serviceUnavailable } from '@/lib/http';

const slugSchema = z.string().trim().toLowerCase().min(2).max(80).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const createSchema = z.object({ shoppingSlug: z.string().min(1).max(80), slug: slugSchema, name: z.string().trim().min(2).max(120), sector: z.string().trim().max(120).optional().nullable() });

export async function GET(request: NextRequest) {
  if (!process.env.DATABASE_URL) return serviceUnavailable();
  try {
    const scope = await getAdminShopping(request.nextUrl.searchParams.get('shoppingSlug') ?? '', ['SUPERADMIN', 'SHOPPING_OPERATOR']);
    if ('error' in scope) { const failure = authFailure(scope.error); return NextResponse.json({ error: failure.error }, { status: failure.statusCode }); }
    const merchants = await prisma.merchant.findMany({
      where: { shoppingId: scope.shopping.id },
      include: {
        shopping: { select: { slug: true, name: true } },
        ...(scope.admin.role === 'SUPERADMIN' ? { users: { select: { user: { select: { id: true, name: true, email: true, active: true } } } } } : {}),
        prizes: { select: { prizeId: true } },
        _count: { select: { users: true, prizes: true, redemptions: true } },
      },
      orderBy: [{ active: 'desc' }, { name: 'asc' }],
    });
    return NextResponse.json({ merchants }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) { return apiError(error); }
}

export async function POST(request: NextRequest) {
  if (!process.env.DATABASE_URL) return serviceUnavailable();
  try {
    const input = createSchema.parse(await request.json());
    const scope = await getAdminShopping(input.shoppingSlug, ['SUPERADMIN', 'SHOPPING_OPERATOR']);
    if ('error' in scope) { const failure = authFailure(scope.error); return NextResponse.json({ error: failure.error }, { status: failure.statusCode }); }
    const merchant = await prisma.$transaction(async (tx) => {
      const created = await tx.merchant.create({ data: { shoppingId: scope.shopping.id, slug: input.slug, name: input.name, sector: input.sector || null } });
      await logAudit(tx, { actorId: scope.admin.id, shoppingId: scope.shopping.id, action: 'MERCHANT_CREATED', entityType: 'Merchant', entityId: created.id, metadata: { slug: created.slug, name: created.name } });
      return created;
    });
    return NextResponse.json({ merchant }, { status: 201 });
  } catch (error) { return apiError(error); }
}
