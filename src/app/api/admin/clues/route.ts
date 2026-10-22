import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authFailure, getAdminShopping, logAudit } from '@/lib/admin';
import { prisma } from '@/lib/db';
import { apiError, serviceUnavailable } from '@/lib/http';

const schema = z.object({ shoppingSlug: z.string(), campaignId: z.string(), text: z.string().trim().min(5).max(1000), startsAt: z.string().datetime(), endsAt: z.string().datetime(), cardId: z.string().optional().or(z.literal('')), active: z.boolean().default(true) }).refine((value) => new Date(value.startsAt) < new Date(value.endsAt), { message: 'El inicio debe ser anterior al cierre.', path: ['endsAt'] });

export async function GET(request: NextRequest) {
  if (!process.env.DATABASE_URL) return serviceUnavailable();
  try {
    const scope = await getAdminShopping(request.nextUrl.searchParams.get('shoppingSlug') ?? '', ['SUPERADMIN', 'SHOPPING_OPERATOR']);
    if ('error' in scope) { const failure = authFailure(scope.error); return NextResponse.json({ error: failure.error }, { status: failure.statusCode }); }
    const clues = await prisma.clue.findMany({ where: { shoppingId: scope.shopping.id }, include: { campaign: { select: { name: true } }, card: { select: { publicId: true } } }, orderBy: { startsAt: 'desc' }, take: 100 });
    return NextResponse.json({ clues });
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
    if (input.cardId && !await prisma.card.findFirst({ where: { id: input.cardId, campaignId: input.campaignId, shoppingId: scope.shopping.id } })) return NextResponse.json({ error: 'La tarjeta no pertenece a esta campaña.' }, { status: 400 });
    const clue = await prisma.$transaction(async (tx) => {
      const created = await tx.clue.create({ data: { campaignId: input.campaignId, shoppingId: scope.shopping.id, text: input.text, startsAt: new Date(input.startsAt), endsAt: new Date(input.endsAt), cardId: input.cardId || null, active: input.active } });
      await logAudit(tx, { actorId: scope.admin.id, shoppingId: scope.shopping.id, campaignId: input.campaignId, action: 'CLUE_CREATED', entityType: 'Clue', entityId: created.id });
      return created;
    });
    return NextResponse.json({ clue }, { status: 201 });
  } catch (error) { return apiError(error); }
}
