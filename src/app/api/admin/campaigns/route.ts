import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authFailure, getAdminShopping, logAudit } from '@/lib/admin';
import { prisma } from '@/lib/db';
import { apiError, serviceUnavailable } from '@/lib/http';

const schema = z.object({ shoppingSlug: z.string(), name: z.string().trim().min(2).max(120), slug: z.string().trim().min(2).max(80).regex(/^[a-z0-9-]+$/), description: z.string().max(2000).optional(), status: z.enum(['DRAFT', 'SCHEDULED', 'ACTIVE', 'PAUSED', 'ENDED']).default('DRAFT'), startsAt: z.string().datetime(), endsAt: z.string().datetime(), rulesUrl: z.string().url().optional(), settings: z.record(z.string(), z.unknown()).default({}) }).refine((value) => new Date(value.startsAt) < new Date(value.endsAt), { message: 'El inicio debe ser anterior al cierre.', path: ['endsAt'] });

export async function GET(request: NextRequest) {
  if (!process.env.DATABASE_URL) return serviceUnavailable();
  try {
    const shoppingSlug = request.nextUrl.searchParams.get('shoppingSlug') ?? '';
    const scope = await getAdminShopping(shoppingSlug, ['SUPERADMIN', 'SHOPPING_OPERATOR']);
    if ('error' in scope) { const failure = authFailure(scope.error); return NextResponse.json({ error: failure.error }, { status: failure.statusCode }); }
    const campaigns = await prisma.campaign.findMany({ where: { shoppingId: scope.shopping.id }, include: { _count: { select: { cards: true, prizes: true, participations: true } } }, orderBy: { startsAt: 'desc' } });
    return NextResponse.json({ campaigns });
  } catch (error) { return apiError(error); }
}

export async function POST(request: NextRequest) {
  if (!process.env.DATABASE_URL) return serviceUnavailable();
  try {
    const input = schema.parse(await request.json());
    const scope = await getAdminShopping(input.shoppingSlug, ['SUPERADMIN', 'SHOPPING_OPERATOR']);
    if ('error' in scope) { const failure = authFailure(scope.error); return NextResponse.json({ error: failure.error }, { status: failure.statusCode }); }
    const campaign = await prisma.$transaction(async (tx) => {
      if (input.status === 'ACTIVE') await tx.campaign.updateMany({ where: { status: 'ACTIVE', shoppingId: scope.shopping.id }, data: { status: 'PAUSED' } });
      const created = await tx.campaign.create({ data: {
        slug: input.slug, name: input.name, description: input.description, status: input.status,
        startsAt: new Date(input.startsAt), endsAt: new Date(input.endsAt), rulesUrl: input.rulesUrl,
        shoppingId: scope.shopping.id, settings: input.settings as object,
      } });
      await logAudit(tx, { actorId: scope.admin.id, shoppingId: scope.shopping.id, campaignId: created.id, action: 'CAMPAIGN_CREATED', entityType: 'Campaign', entityId: created.id, metadata: { status: created.status } });
      return created;
    });
    return NextResponse.json({ campaign }, { status: 201 });
  } catch (error) { return apiError(error); }
}
