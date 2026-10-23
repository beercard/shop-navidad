import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authFailure, getAdminShopping, logAudit } from '@/lib/admin';
import { prisma } from '@/lib/db';
import { apiError, serviceUnavailable } from '@/lib/http';

const locationSlug = z.string().trim().toLowerCase().min(2).max(80).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const patchSchema = z.object({ shoppingSlug: z.string().min(1).max(80), campaignId: z.string().nullable().optional(), slug: locationSlug.optional(), name: z.string().trim().min(2).max(120).optional(), sector: z.string().trim().max(120).nullable().optional(), active: z.boolean().optional() }).refine((input) => Object.keys(input).some((key) => key !== 'shoppingSlug'), 'Indicá al menos un campo para actualizar.');

export async function PATCH(request: NextRequest, context: { params: Promise<{ locationId: string }> }) {
  if (!process.env.DATABASE_URL) return serviceUnavailable();
  try {
    const { locationId } = await context.params;
    const input = patchSchema.parse(await request.json());
    const scope = await getAdminShopping(input.shoppingSlug, ['SUPERADMIN', 'SHOPPING_OPERATOR']);
    if ('error' in scope) { const failure = authFailure(scope.error); return NextResponse.json({ error: failure.error }, { status: failure.statusCode }); }
    const current = await prisma.location.findFirst({ where: { id: locationId, shoppingId: scope.shopping.id } });
    if (!current) return NextResponse.json({ error: 'No encontramos esta ubicación en el shopping.' }, { status: 404 });
    if (input.campaignId && !await prisma.campaign.findFirst({ where: { id: input.campaignId, shoppingId: scope.shopping.id }, select: { id: true } })) return NextResponse.json({ error: 'La campaña no pertenece a este shopping.' }, { status: 400 });
    const location = await prisma.$transaction(async (tx) => {
      const updated = await tx.location.update({ where: { id: locationId }, data: { ...(input.campaignId !== undefined ? { campaignId: input.campaignId } : {}), ...(input.slug !== undefined ? { slug: input.slug } : {}), ...(input.name !== undefined ? { name: input.name } : {}), ...(input.sector !== undefined ? { sector: input.sector } : {}), ...(input.active !== undefined ? { active: input.active } : {}) } });
      await logAudit(tx, { actorId: scope.admin.id, shoppingId: scope.shopping.id, campaignId: updated.campaignId ?? undefined, action: updated.active === current.active ? 'LOCATION_UPDATED' : updated.active ? 'LOCATION_ACTIVATED' : 'LOCATION_DEACTIVATED', entityType: 'Location', entityId: locationId, metadata: { changedFields: Object.keys(input).filter((key) => key !== 'shoppingSlug') } });
      return updated;
    });
    return NextResponse.json({ location });
  } catch (error) { return apiError(error); }
}
