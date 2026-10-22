import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { apiError, serviceUnavailable } from '@/lib/http';
import { findOrCreateParticipant, readCollectionProgress, readParticipantToken, setParticipantCookie } from '@/lib/participants';

export async function GET(request: NextRequest, context: { params: Promise<{ shoppingSlug: string }> }) {
  if (!process.env.DATABASE_URL) return serviceUnavailable();
  try {
    const { shoppingSlug } = await context.params;
    const shopping = await prisma.shopping.findUnique({ where: { slug: shoppingSlug } });
    if (!shopping?.active) return NextResponse.json({ error: 'No encontramos este shopping.', code: 'SHOPPING_NOT_FOUND' }, { status: 404 });
    const now = new Date();
    const campaign = await prisma.campaign.findFirst({
      where: { shoppingId: shopping.id, status: 'ACTIVE', startsAt: { lte: now }, endsAt: { gt: now } },
      include: { prizes: { where: { shoppingId: shopping.id, active: true }, orderBy: { name: 'asc' } }, cards: { where: { shoppingId: shopping.id, status: 'ACTIVE' }, select: { publicId: true, location: true, kind: true }, orderBy: { publicId: 'asc' } }, clues: { where: { shoppingId: shopping.id, active: true, startsAt: { lte: now }, endsAt: { gt: now } }, orderBy: { startsAt: 'desc' }, take: 1 } },
    });
    if (!campaign) return NextResponse.json({ error: 'Todavía no hay una campaña activa en este shopping.', code: 'CAMPAIGN_UNAVAILABLE' }, { status: 404 });
    const token = readParticipantToken(request);
    const participant = await findOrCreateParticipant(prisma, token, campaign.id, shopping.id);
    const response = NextResponse.json({
      shopping: { slug: shopping.slug, name: shopping.name, brandSettings: publicBrandSettings(shopping.brandSettings) },
      campaign: { id: campaign.id, name: campaign.name, startsAt: campaign.startsAt, endsAt: campaign.endsAt, rulesUrl: campaign.rulesUrl, settings: publicSettings(campaign.settings) },
      prizes: campaign.prizes.map(({ id, name, description, imageUrl, remainingStock, startsAt, endsAt }) => ({ id, name, description, imageUrl, remainingStock, available: remainingStock > 0 && (!startsAt || startsAt <= now) && (!endsAt || endsAt > now) })),
      cards: campaign.cards,
      clue: campaign.clues[0] ?? null,
      collectionProgress: await readCollectionProgress(participant.id, campaign.id),
    }, { headers: { 'Cache-Control': 'private, no-store' } });
    setParticipantCookie(response, token);
    return response;
  } catch (error) {
    return apiError(error);
  }
}

function publicSettings(settings: unknown) {
  if (!settings || typeof settings !== 'object' || Array.isArray(settings)) return {};
  const allowed = ['collectionTarget', 'collectionUnlockText', 'publicMessage'];
  return Object.fromEntries(Object.entries(settings).filter(([key]) => allowed.includes(key)));
}

function publicBrandSettings(settings: unknown) {
  if (!settings || typeof settings !== 'object' || Array.isArray(settings)) return {};
  const allowed = ['primary', 'accent', 'surface', 'text', 'fontPreset', 'publicMessage', 'collectionUnlockText'];
  return Object.fromEntries(Object.entries(settings).filter(([key]) => allowed.includes(key)));
}

export async function POST(request: NextRequest, context: { params: Promise<{ shoppingSlug: string }> }) {
  return GET(request, context);
}
