import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authFailure, getAdminShopping, logAudit } from '@/lib/admin';
import { prisma } from '@/lib/db';
import { apiError, serviceUnavailable } from '@/lib/http';

const schema = z.object({ shoppingSlug: z.string(), text: z.string().trim().min(5).max(1000).optional(), startsAt: z.string().datetime().optional(), endsAt: z.string().datetime().optional(), active: z.boolean().optional() });

export async function PATCH(request: NextRequest, context: { params: Promise<{ clueId: string }> }) {
  if (!process.env.DATABASE_URL) return serviceUnavailable();
  try {
    const { clueId } = await context.params;
    const input = schema.parse(await request.json());
    const scope = await getAdminShopping(input.shoppingSlug, ['SUPERADMIN', 'SHOPPING_OPERATOR']);
    if ('error' in scope) { const failure = authFailure(scope.error); return NextResponse.json({ error: failure.error }, { status: failure.statusCode }); }
    const clue = await prisma.clue.findFirst({ where: { id: clueId, shoppingId: scope.shopping.id } });
    if (!clue) return NextResponse.json({ error: 'No encontramos esa pista.' }, { status: 404 });
    const startsAt = input.startsAt ? new Date(input.startsAt) : clue.startsAt;
    const endsAt = input.endsAt ? new Date(input.endsAt) : clue.endsAt;
    if (startsAt >= endsAt) return NextResponse.json({ error: 'El inicio debe ser anterior al cierre.' }, { status: 400 });
    const result = await prisma.$transaction(async (tx) => {
      const updated = await tx.clue.update({ where: { id: clueId }, data: { text: input.text, startsAt: input.startsAt ? startsAt : undefined, endsAt: input.endsAt ? endsAt : undefined, active: input.active } });
      await logAudit(tx, { actorId: scope.admin.id, shoppingId: scope.shopping.id, campaignId: clue.campaignId, action: 'CLUE_UPDATED', entityType: 'Clue', entityId: clueId });
      return updated;
    });
    return NextResponse.json({ clue: result });
  } catch (error) { return apiError(error); }
}
