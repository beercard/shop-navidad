import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authFailure, getAdminShopping, logAudit } from '@/lib/admin';
import { prisma } from '@/lib/db';
import { apiError, serviceUnavailable } from '@/lib/http';

const schema = z.object({ shoppingSlug: z.string(), location: z.string().trim().max(120).nullable().optional(), locationId: z.string().nullable().optional(), kind: z.enum(['ROULETTE', 'COLLECTION', 'SPECIAL']).optional(), status: z.enum(['ACTIVE', 'INACTIVE', 'RETIRED']).optional() });

export async function PATCH(request: NextRequest, context: { params: Promise<{ cardId: string }> }) {
  if (!process.env.DATABASE_URL) return serviceUnavailable();
  try {
    const { cardId } = await context.params;
    const input = schema.parse(await request.json());
    const scope = await getAdminShopping(input.shoppingSlug, ['SUPERADMIN', 'SHOPPING_OPERATOR']);
    if ('error' in scope) { const failure = authFailure(scope.error); return NextResponse.json({ error: failure.error }, { status: failure.statusCode }); }
    const current = await prisma.card.findFirst({ where: { id: cardId, shoppingId: scope.shopping.id } });
    if (!current) return NextResponse.json({ error: 'No encontramos esta tarjeta.' }, { status: 404 });
    const place = input.locationId ? await prisma.location.findFirst({ where: { id: input.locationId, shoppingId: scope.shopping.id, active: true }, select: { id: true, name: true } }) : null;
    if (input.locationId && !place) return NextResponse.json({ error: 'La ubicación no pertenece a este shopping o está desactivada.' }, { status: 400 });
    const card = await prisma.$transaction(async (tx) => {
      const updated = await tx.card.update({ where: { id: cardId }, data: { location: input.locationId !== undefined ? (place?.name ?? null) : input.location, locationId: input.locationId === undefined ? undefined : (place?.id ?? null), kind: input.kind, status: input.status } });
      await logAudit(tx, { actorId: scope.admin.id, shoppingId: scope.shopping.id, campaignId: current.campaignId, action: 'CARD_UPDATED', entityType: 'Card', entityId: cardId, metadata: { changes: Object.keys(input).filter((key) => key !== 'shoppingSlug') } });
      return updated;
    });
    return NextResponse.json({ card });
  } catch (error) { return apiError(error); }
}
