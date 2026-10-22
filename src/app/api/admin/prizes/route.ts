import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAdminShopping, logAudit } from '@/lib/admin';
import { authFailure } from '@/lib/admin';
import { prisma } from '@/lib/db';
import { apiError, serviceUnavailable } from '@/lib/http';

const prizeInput = z.object({
  shoppingSlug: z.string().min(1), campaignId: z.string().min(1), name: z.string().trim().min(2).max(120),
  description: z.string().max(1000).optional(), imageUrl: z.string().url().max(500).optional().or(z.literal('')),
  stock: z.number().int().min(0).max(1_000_000), weight: z.number().int().min(1).max(100_000),
  startsAt: z.string().datetime().optional(), endsAt: z.string().datetime().optional(), active: z.boolean().default(true), maxPerPerson: z.number().int().min(1).max(100).default(1),
});

export async function GET(request: NextRequest) {
  if (!process.env.DATABASE_URL) return serviceUnavailable();
  try {
    const shoppingSlug = request.nextUrl.searchParams.get('shoppingSlug') ?? '';
    const scope = await getAdminShopping(shoppingSlug, ['SUPERADMIN', 'SHOPPING_OPERATOR']);
    if ('error' in scope) { const failure = authFailure(scope.error); return NextResponse.json({ error: failure.error }, { status: failure.statusCode }); }
    const prizes = await prisma.prize.findMany({ where: { shoppingId: scope.shopping.id }, include: { campaign: { select: { name: true, status: true } } }, orderBy: [{ campaign: { name: 'asc' } }, { name: 'asc' }] });
    return NextResponse.json({ prizes });
  } catch (error) { return apiError(error); }
}

export async function POST(request: NextRequest) {
  if (!process.env.DATABASE_URL) return serviceUnavailable();
  try {
    const input = prizeInput.parse(await request.json());
    const scope = await getAdminShopping(input.shoppingSlug, ['SUPERADMIN', 'SHOPPING_OPERATOR']);
    if ('error' in scope) { const failure = authFailure(scope.error); return NextResponse.json({ error: failure.error }, { status: failure.statusCode }); }
    const campaign = await prisma.campaign.findFirst({ where: { id: input.campaignId, shoppingId: scope.shopping.id }, select: { id: true } });
    if (!campaign) return NextResponse.json({ error: 'La campaña no pertenece a este shopping.' }, { status: 400 });
    if (input.startsAt && input.endsAt && new Date(input.startsAt) >= new Date(input.endsAt)) return NextResponse.json({ error: 'El horario de inicio debe ser anterior al de cierre.' }, { status: 400 });
    const prize = await prisma.$transaction(async (tx) => {
      const created = await tx.prize.create({ data: {
        campaignId: input.campaignId, shoppingId: scope.shopping.id, name: input.name, description: input.description,
        imageUrl: input.imageUrl || null, totalStock: input.stock, remainingStock: input.stock, weight: input.weight,
        startsAt: input.startsAt ? new Date(input.startsAt) : null, endsAt: input.endsAt ? new Date(input.endsAt) : null,
        active: input.active, maxPerPerson: input.maxPerPerson,
      } });
      if (input.stock > 0) await tx.inventoryMovement.create({ data: { prizeId: created.id, actorId: scope.admin.id, campaignId: input.campaignId, shoppingId: scope.shopping.id, delta: input.stock, reason: 'Stock inicial' } });
      await logAudit(tx, { actorId: scope.admin.id, shoppingId: scope.shopping.id, campaignId: input.campaignId, action: 'PRIZE_CREATED', entityType: 'Prize', entityId: created.id, metadata: { stock: input.stock } });
      return created;
    });
    return NextResponse.json({ prize }, { status: 201 });
  } catch (error) { return apiError(error); }
}
