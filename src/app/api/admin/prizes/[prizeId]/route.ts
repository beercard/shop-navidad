import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authFailure, getAdminShopping, logAudit } from '@/lib/admin';
import { prisma } from '@/lib/db';
import { apiError, serviceUnavailable } from '@/lib/http';

const schema = z.object({ shoppingSlug: z.string(), name: z.string().trim().min(2).max(120).optional(), description: z.string().max(1000).nullable().optional(), imageUrl: z.string().url().max(500).nullable().optional(), weight: z.number().int().min(1).max(100000).optional(), startsAt: z.string().datetime().nullable().optional(), endsAt: z.string().datetime().nullable().optional(), active: z.boolean().optional(), stockAdjustment: z.number().int().min(-1_000_000).max(1_000_000).optional(), stockReason: z.string().trim().min(2).max(200).optional() });

export async function PATCH(request: NextRequest, context: { params: Promise<{ prizeId: string }> }) {
  if (!process.env.DATABASE_URL) return serviceUnavailable();
  try {
    const { prizeId } = await context.params;
    const input = schema.parse(await request.json());
    const scope = await getAdminShopping(input.shoppingSlug, ['SUPERADMIN', 'SHOPPING_OPERATOR']);
    if ('error' in scope) { const failure = authFailure(scope.error); return NextResponse.json({ error: failure.error }, { status: failure.statusCode }); }
    const current = await prisma.prize.findFirst({ where: { id: prizeId, shoppingId: scope.shopping.id } });
    if (!current) return NextResponse.json({ error: 'No encontramos ese premio.' }, { status: 404 });
    if (input.stockAdjustment && !input.stockReason) return NextResponse.json({ error: 'Agregá un motivo para el movimiento de stock.' }, { status: 400 });
    const prize = await prisma.$transaction(async (tx) => {
      if (input.stockAdjustment) {
        const changed = await tx.prize.updateMany({ where: { id: prizeId, shoppingId: scope.shopping.id, ...(input.stockAdjustment < 0 ? { remainingStock: { gte: -input.stockAdjustment } } : {}) }, data: { remainingStock: { increment: input.stockAdjustment }, totalStock: { increment: input.stockAdjustment } } });
        if (changed.count !== 1) throw new Error('STOCK_UNDERFLOW');
        await tx.inventoryMovement.create({ data: { prizeId, actorId: scope.admin.id, campaignId: current.campaignId, shoppingId: current.shoppingId, delta: input.stockAdjustment, reason: input.stockReason! } });
      }
      const updated = await tx.prize.update({ where: { id: prizeId }, data: {
        name: input.name, description: input.description, imageUrl: input.imageUrl,
        weight: input.weight, startsAt: input.startsAt === undefined ? undefined : input.startsAt ? new Date(input.startsAt) : null,
        endsAt: input.endsAt === undefined ? undefined : input.endsAt ? new Date(input.endsAt) : null, active: input.active,
      } });
      await logAudit(tx, { actorId: scope.admin.id, shoppingId: scope.shopping.id, campaignId: current.campaignId, action: input.stockAdjustment ? 'PRIZE_UPDATED_STOCK' : 'PRIZE_UPDATED', entityType: 'Prize', entityId: prizeId, metadata: { fields: Object.keys(input).filter((field) => field !== 'shoppingSlug'), stockAdjustment: input.stockAdjustment ?? 0 } });
      return updated;
    });
    return NextResponse.json({ prize });
  } catch (error) { if (error instanceof Error && error.message === 'STOCK_UNDERFLOW') return NextResponse.json({ error: 'El stock disponible no alcanza para ese ajuste.' }, { status: 409 }); return apiError(error); }
}
