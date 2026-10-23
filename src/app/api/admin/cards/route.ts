import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authFailure, getAdminShopping, logAudit } from '@/lib/admin';
import { prisma } from '@/lib/db';
import { apiError, serviceUnavailable } from '@/lib/http';

const schema = z.object({ shoppingSlug: z.string(), campaignId: z.string(), publicId: z.string().trim().min(2).max(40).regex(/^[A-Za-z0-9-]+$/), location: z.string().trim().max(120).optional(), locationId: z.string().optional().nullable(), kind: z.enum(['ROULETTE', 'COLLECTION', 'SPECIAL']).default('ROULETTE'), status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE') });

export async function GET(request: NextRequest) {
  if (!process.env.DATABASE_URL) return serviceUnavailable();
  try {
    const shoppingSlug = request.nextUrl.searchParams.get('shoppingSlug') ?? '';
    const scope = await getAdminShopping(shoppingSlug, ['SUPERADMIN', 'SHOPPING_OPERATOR']);
    if ('error' in scope) { const failure = authFailure(scope.error); return NextResponse.json({ error: failure.error }, { status: failure.statusCode }); }
    const query = request.nextUrl.searchParams.get('q')?.trim();
    const cards = await prisma.card.findMany({ where: { shoppingId: scope.shopping.id, ...(query ? { OR: [{ publicId: { contains: query, mode: 'insensitive' } }, { location: { contains: query, mode: 'insensitive' } }] } : {}) }, include: { campaign: { select: { name: true } }, _count: { select: { participations: true } } }, orderBy: { publicId: 'asc' }, take: 100 });
    return NextResponse.json({ cards });
  } catch (error) { return apiError(error); }
}

export async function POST(request: NextRequest) {
  if (!process.env.DATABASE_URL) return serviceUnavailable();
  try {
    const input = schema.parse(await request.json());
    const scope = await getAdminShopping(input.shoppingSlug, ['SUPERADMIN', 'SHOPPING_OPERATOR']);
    if ('error' in scope) { const failure = authFailure(scope.error); return NextResponse.json({ error: failure.error }, { status: failure.statusCode }); }
    const campaign = await prisma.campaign.findFirst({ where: { id: input.campaignId, shoppingId: scope.shopping.id }, select: { id: true } });
    if (!campaign) return NextResponse.json({ error: 'La campaña no pertenece a este shopping.' }, { status: 400 });
    const place = input.locationId ? await prisma.location.findFirst({ where: { id: input.locationId, shoppingId: scope.shopping.id, active: true }, select: { id: true, name: true } }) : null;
    if (input.locationId && !place) return NextResponse.json({ error: 'La ubicación no pertenece a este shopping o está desactivada.' }, { status: 400 });
    const card = await prisma.$transaction(async (tx) => {
      const created = await tx.card.create({ data: { publicId: input.publicId, shoppingId: scope.shopping.id, campaignId: input.campaignId, location: place?.name ?? input.location, locationId: place?.id, kind: input.kind, status: input.status } });
      await logAudit(tx, { actorId: scope.admin.id, shoppingId: scope.shopping.id, campaignId: input.campaignId, action: 'CARD_CREATED', entityType: 'Card', entityId: created.id, metadata: { publicId: created.publicId, location: created.location, kind: created.kind } });
      return created;
    });
    return NextResponse.json({ card }, { status: 201 });
  } catch (error) { return apiError(error); }
}
