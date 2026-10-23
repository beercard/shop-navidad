import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authFailure, getAdminShopping, logAudit } from '@/lib/admin';
import { prisma } from '@/lib/db';
import { apiError, serviceUnavailable } from '@/lib/http';

const schema = z.object({ shoppingSlug: z.string().min(1), prizeIds: z.array(z.string().min(1)).max(500) }).refine(({ prizeIds }) => new Set(prizeIds).size === prizeIds.length, 'Hay premios repetidos.');

export async function PUT(request: NextRequest, context: { params: Promise<{ merchantId: string }> }) {
  if (!process.env.DATABASE_URL) return serviceUnavailable();
  try {
    const { merchantId } = await context.params;
    const input = schema.parse(await request.json());
    const scope = await getAdminShopping(input.shoppingSlug, ['SUPERADMIN', 'SHOPPING_OPERATOR']);
    if ('error' in scope) { const failure = authFailure(scope.error); return NextResponse.json({ error: failure.error }, { status: failure.statusCode }); }
    const merchant = await prisma.merchant.findFirst({ where: { id: merchantId, shoppingId: scope.shopping.id, active: true }, select: { id: true } });
    if (!merchant) return NextResponse.json({ error: 'No encontramos un comercio activo en este shopping.' }, { status: 404 });
    const prizes = await prisma.prize.findMany({ where: { id: { in: input.prizeIds }, shoppingId: scope.shopping.id }, select: { id: true } });
    if (prizes.length !== input.prizeIds.length) return NextResponse.json({ error: 'Todos los premios deben pertenecer al shopping.' }, { status: 400 });
    await prisma.$transaction(async (tx) => {
      await tx.prizeMerchant.deleteMany({ where: { merchantId, ...(prizes.length ? { prizeId: { notIn: prizes.map(({ id }) => id) } } : {}) } });
      if (prizes.length) await tx.prizeMerchant.createMany({ data: prizes.map(({ id }) => ({ merchantId, prizeId: id })), skipDuplicates: true });
      await logAudit(tx, { actorId: scope.admin.id, shoppingId: scope.shopping.id, action: 'MERCHANT_PRIZES_ASSIGNED', entityType: 'Merchant', entityId: merchantId, metadata: { prizeCount: prizes.length } });
    });
    return NextResponse.json({ assigned: prizes.length });
  } catch (error) { return apiError(error); }
}
