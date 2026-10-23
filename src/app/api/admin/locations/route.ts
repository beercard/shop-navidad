import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authFailure, getAdminShopping, logAudit } from '@/lib/admin';
import { prisma } from '@/lib/db';
import { apiError, serviceUnavailable } from '@/lib/http';

const locationSlug = z.string().trim().toLowerCase().min(2).max(80).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const createSchema = z.object({ shoppingSlug: z.string().min(1).max(80), campaignId: z.string().optional().nullable(), slug: locationSlug, name: z.string().trim().min(2).max(120), sector: z.string().trim().max(120).optional().nullable(), active: z.boolean().default(true) });

export async function GET(request: NextRequest) {
  if (!process.env.DATABASE_URL) return serviceUnavailable();
  try {
    const shoppingSlug = request.nextUrl.searchParams.get('shoppingSlug') ?? '';
    const scope = await getAdminShopping(shoppingSlug, ['SUPERADMIN', 'SHOPPING_OPERATOR']);
    if ('error' in scope) { const failure = authFailure(scope.error); return NextResponse.json({ error: failure.error }, { status: failure.statusCode }); }
    const locations = await prisma.location.findMany({ where: { shoppingId: scope.shopping.id }, include: { campaign: { select: { id: true, name: true, slug: true, status: true } }, _count: { select: { events: true } } }, orderBy: [{ active: 'desc' }, { name: 'asc' }] });
    return NextResponse.json({ locations });
  } catch (error) { return apiError(error); }
}

export async function POST(request: NextRequest) {
  if (!process.env.DATABASE_URL) return serviceUnavailable();
  try {
    const input = createSchema.parse(await request.json());
    const scope = await getAdminShopping(input.shoppingSlug, ['SUPERADMIN', 'SHOPPING_OPERATOR']);
    if ('error' in scope) { const failure = authFailure(scope.error); return NextResponse.json({ error: failure.error }, { status: failure.statusCode }); }
    if (input.campaignId && !await prisma.campaign.findFirst({ where: { id: input.campaignId, shoppingId: scope.shopping.id }, select: { id: true } })) return NextResponse.json({ error: 'La campaña no pertenece a este shopping.' }, { status: 400 });
    const location = await prisma.$transaction(async (tx) => {
      const created = await tx.location.create({ data: { shoppingId: scope.shopping.id, campaignId: input.campaignId || null, slug: input.slug, name: input.name, sector: input.sector || null, active: input.active } });
      await logAudit(tx, { actorId: scope.admin.id, shoppingId: scope.shopping.id, campaignId: created.campaignId ?? undefined, action: 'LOCATION_CREATED', entityType: 'Location', entityId: created.id, metadata: { slug: created.slug, name: created.name, active: created.active } });
      return created;
    });
    return NextResponse.json({ location }, { status: 201 });
  } catch (error) { return apiError(error); }
}
