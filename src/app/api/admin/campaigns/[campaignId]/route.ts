import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authFailure, getAdminShopping, logAudit } from '@/lib/admin';
import { prisma } from '@/lib/db';
import { apiError, serviceUnavailable } from '@/lib/http';

const schema = z.object({ shoppingSlug: z.string(), name: z.string().trim().min(2).max(120).optional(), description: z.string().max(2000).nullable().optional(), status: z.enum(['DRAFT', 'SCHEDULED', 'ACTIVE', 'PAUSED', 'ENDED']).optional(), startsAt: z.string().datetime().optional(), endsAt: z.string().datetime().optional(), rulesUrl: z.string().url().nullable().optional(), settings: z.record(z.string(), z.unknown()).optional() });

export async function PATCH(request: NextRequest, context: { params: Promise<{ campaignId: string }> }) {
  if (!process.env.DATABASE_URL) return serviceUnavailable();
  try {
    const { campaignId } = await context.params;
    const input = schema.parse(await request.json());
    const scope = await getAdminShopping(input.shoppingSlug, ['SUPERADMIN', 'SHOPPING_OPERATOR']);
    if ('error' in scope) { const failure = authFailure(scope.error); return NextResponse.json({ error: failure.error }, { status: failure.statusCode }); }
    const current = await prisma.campaign.findFirst({ where: { id: campaignId, shoppingId: scope.shopping.id } });
    if (!current) return NextResponse.json({ error: 'No encontramos esta campaña.' }, { status: 404 });
    const startsAt = input.startsAt ? new Date(input.startsAt) : current.startsAt;
    const endsAt = input.endsAt ? new Date(input.endsAt) : current.endsAt;
    if (startsAt >= endsAt) return NextResponse.json({ error: 'El inicio debe ser anterior al cierre.' }, { status: 400 });
    const campaign = await prisma.$transaction(async (tx) => {
      if (input.status === 'ACTIVE') await tx.campaign.updateMany({ where: { id: { not: campaignId }, status: 'ACTIVE', shoppingId: scope.shopping.id }, data: { status: 'PAUSED' } });
      const updated = await tx.campaign.update({ where: { id: campaignId }, data: { name: input.name, description: input.description, status: input.status, startsAt: input.startsAt ? startsAt : undefined, endsAt: input.endsAt ? endsAt : undefined, rulesUrl: input.rulesUrl, settings: input.settings as object | undefined } });
      await logAudit(tx, { actorId: scope.admin.id, shoppingId: scope.shopping.id, campaignId, action: 'CAMPAIGN_UPDATED', entityType: 'Campaign', entityId: campaignId, metadata: { fields: Object.keys(input).filter((key) => key !== 'shoppingSlug') } });
      return updated;
    });
    return NextResponse.json({ campaign });
  } catch (error) { return apiError(error); }
}
