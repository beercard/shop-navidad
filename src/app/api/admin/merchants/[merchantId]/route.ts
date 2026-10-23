import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authFailure, getAdminShopping, logAudit } from '@/lib/admin';
import { prisma } from '@/lib/db';
import { apiError, serviceUnavailable } from '@/lib/http';

const slugSchema = z.string().trim().toLowerCase().min(2).max(80).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const schema = z.object({ shoppingSlug: z.string().min(1).max(80), slug: slugSchema.optional(), name: z.string().trim().min(2).max(120).optional(), sector: z.string().trim().max(120).nullable().optional(), active: z.boolean().optional() }).refine((input) => Object.keys(input).some((key) => key !== 'shoppingSlug'), 'Indicá al menos un campo para actualizar.');

export async function PATCH(request: NextRequest, context: { params: Promise<{ merchantId: string }> }) {
  if (!process.env.DATABASE_URL) return serviceUnavailable();
  try {
    const { merchantId } = await context.params;
    const input = schema.parse(await request.json());
    const scope = await getAdminShopping(input.shoppingSlug, ['SUPERADMIN', 'SHOPPING_OPERATOR']);
    if ('error' in scope) { const failure = authFailure(scope.error); return NextResponse.json({ error: failure.error }, { status: failure.statusCode }); }
    const current = await prisma.merchant.findFirst({ where: { id: merchantId, shoppingId: scope.shopping.id } });
    if (!current) return NextResponse.json({ error: 'No encontramos este comercio en el shopping.' }, { status: 404 });
    const merchant = await prisma.$transaction(async (tx) => {
      const updated = await tx.merchant.update({ where: { id: merchantId }, data: { ...(input.slug !== undefined ? { slug: input.slug } : {}), ...(input.name !== undefined ? { name: input.name } : {}), ...(input.sector !== undefined ? { sector: input.sector } : {}), ...(input.active !== undefined ? { active: input.active } : {}) } });
      await logAudit(tx, { actorId: scope.admin.id, shoppingId: scope.shopping.id, action: updated.active === current.active ? 'MERCHANT_UPDATED' : updated.active ? 'MERCHANT_ACTIVATED' : 'MERCHANT_DEACTIVATED', entityType: 'Merchant', entityId: merchantId, metadata: { changedFields: Object.keys(input).filter((key) => key !== 'shoppingSlug') } });
      return updated;
    });
    return NextResponse.json({ merchant });
  } catch (error) { return apiError(error); }
}
