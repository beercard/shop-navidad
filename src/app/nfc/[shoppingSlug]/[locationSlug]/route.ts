import { randomBytes } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { apiError, serviceUnavailable } from '@/lib/http';
import { sha256 } from '@/lib/security';

const VISIT_COOKIE = 'navidad_visit_session';
const VISIT_WINDOW_MS = 30 * 60_000;

/** Public NFC/QR entry point. The URL identifies a permanent physical location; it grants no direct prize access. */
export async function GET(request: NextRequest, context: { params: Promise<{ shoppingSlug: string; locationSlug: string }> }) {
  if (!process.env.DATABASE_URL) return serviceUnavailable();
  try {
    const { shoppingSlug, locationSlug } = await context.params;
    const location = await prisma.location.findFirst({
      where: { slug: locationSlug, active: true, shopping: { slug: shoppingSlug, active: true } },
      include: {
        shopping: { select: { id: true, slug: true } },
        campaign: { select: { id: true, slug: true, status: true, startsAt: true, endsAt: true } },
      },
    });
    if (!location) {
      return new NextResponse('No encontramos este cartel o está desactivado.', {
        status: 404,
        headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
      });
    }

    const now = new Date();
    const isLinkedCampaignActive =
      location.campaign &&
      location.campaign.status === 'ACTIVE' &&
      location.campaign.startsAt <= now &&
      location.campaign.endsAt > now;

    const campaign = isLinkedCampaignActive
      ? location.campaign
      : await prisma.campaign.findFirst({
          where: { shoppingId: location.shoppingId, status: 'ACTIVE', startsAt: { lte: now }, endsAt: { gt: now } },
          select: { id: true, slug: true },
        });

    const linkedCard = campaign
      ? await prisma.card.findFirst({
          where: {
            shoppingId: location.shoppingId,
            campaignId: campaign.id,
            locationId: location.id,
            status: 'ACTIVE',
          },
          select: { publicId: true },
          orderBy: { publicId: 'asc' },
        })
      : null;

    const visitor = request.cookies.get(VISIT_COOKIE)?.value ?? randomBytes(24).toString('base64url');
    const window = Math.floor(now.getTime() / VISIT_WINDOW_MS);
    const dedupeKey = sha256(`nfc-visit:v1:${location.id}:${visitor}:${window}`);
    await prisma.event.upsert({
      where: { dedupeKey },
      update: {},
      create: {
        eventType: 'LANDING_VISIT',
        shoppingId: location.shoppingId,
        campaignId: campaign?.id ?? null,
        locationId: location.id,
        dedupeKey,
        metadata: { source: 'NFC_QR' },
      },
    });

    const destination = new URL(`/${location.shopping.slug}`, request.url);
    destination.searchParams.set('location', location.slug);
    if (campaign) destination.searchParams.set('campaign', campaign.slug);
    if (linkedCard) destination.searchParams.set('card', linkedCard.publicId);
    const response = NextResponse.redirect(destination, 307);
    response.headers.set('Cache-Control', 'private, no-store');
    response.cookies.set(VISIT_COOKIE, visitor, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: Math.ceil(VISIT_WINDOW_MS / 1000),
    });
    return response;
  } catch (error) {
    return apiError(error);
  }
}
