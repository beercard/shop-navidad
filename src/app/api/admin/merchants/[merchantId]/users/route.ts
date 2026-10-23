import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authFailure, getAdminShopping, logAudit } from '@/lib/admin';
import { prisma } from '@/lib/db';
import { apiError, serviceUnavailable } from '@/lib/http';

const schema = z.object({ shoppingSlug: z.string().min(1), userIds: z.array(z.string().min(1)).max(100) }).refine(({ userIds }) => new Set(userIds).size === userIds.length, 'Hay usuarios repetidos.');

export async function PUT(request: NextRequest, context: { params: Promise<{ merchantId: string }> }) {
  if (!process.env.DATABASE_URL) return serviceUnavailable();
  try {
    const { merchantId } = await context.params;
    const input = schema.parse(await request.json());
    const scope = await getAdminShopping(input.shoppingSlug, ['SUPERADMIN']);
    if ('error' in scope) { const failure = authFailure(scope.error); return NextResponse.json({ error: failure.error }, { status: failure.statusCode }); }
    const merchant = await prisma.merchant.findFirst({ where: { id: merchantId, shoppingId: scope.shopping.id, active: true }, select: { id: true, name: true } });
    if (!merchant) return NextResponse.json({ error: 'No encontramos un comercio activo en este shopping.' }, { status: 404 });
    const users = await prisma.adminUser.findMany({ where: { id: { in: input.userIds }, role: 'MERCHANT_VALIDATOR', active: true, shoppingScopes: { some: { shoppingId: scope.shopping.id } } }, select: { id: true } });
    if (users.length !== input.userIds.length) return NextResponse.json({ error: 'Todos los usuarios deben ser validadores activos del mismo shopping.' }, { status: 400 });
    await prisma.$transaction(async (tx) => {
      await tx.merchantUser.deleteMany({ where: { merchantId } });
      if (users.length) await tx.merchantUser.createMany({ data: users.map(({ id }) => ({ merchantId, userId: id })) });
      await logAudit(tx, { actorId: scope.admin.id, shoppingId: scope.shopping.id, action: 'MERCHANT_USERS_ASSIGNED', entityType: 'Merchant', entityId: merchantId, metadata: { userCount: users.length } });
    });
    return NextResponse.json({ assigned: users.length, merchant: merchant.name });
  } catch (error) { return apiError(error); }
}
