import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getClientIp } from '@/lib/client-ip';
import { prisma } from '@/lib/db';
import { apiError, serviceUnavailable } from '@/lib/http';
import { participantCookieName } from '@/lib/participants';
import { pushEnabled, pushPublicKey } from '@/lib/push';
import { checkRateLimit } from '@/lib/rate-limit';
import { sha256 } from '@/lib/security';

const subscribeSchema = z.object({
  shoppingSlug: z.string().min(1).max(80),
  subscription: z.object({
    endpoint: z.string().url().max(1000).startsWith('https://'),
    keys: z.object({ p256dh: z.string().min(1).max(200), auth: z.string().min(1).max(100) }),
  }),
}).strict();

const unsubscribeSchema = z.object({ endpoint: z.string().url().max(1000) }).strict();

/** Clave pública para que el navegador cree la suscripción. Sin claves configuradas, la función se oculta. */
export async function GET() {
  return NextResponse.json({ enabled: pushEnabled(), publicKey: pushPublicKey() });
}

/** Alta de la suscripción del participante identificado por su cookie en la campaña activa del shopping. */
export async function POST(request: NextRequest) {
  if (!process.env.DATABASE_URL) return serviceUnavailable();
  if (!pushEnabled()) return NextResponse.json({ error: 'Las notificaciones no están disponibles.', code: 'PUSH_DISABLED' }, { status: 404 });
  try {
    const input = subscribeSchema.parse(await request.json());
    const limit = await checkRateLimit(`push:${sha256(getClientIp(request))}`, 20, 15 * 60_000);
    if (!limit.allowed) return NextResponse.json({ error: 'Demasiados intentos. Probá en unos minutos.', code: 'RATE_LIMITED' }, { status: 429 });

    const participant = await findParticipant(request, input.shoppingSlug);
    if (!participant) {
      return NextResponse.json({ error: 'Jugá tu primera posta para activar los avisos.', code: 'PARTICIPANT_REQUIRED' }, { status: 409 });
    }
    await prisma.pushSubscription.upsert({
      where: { endpoint: input.subscription.endpoint },
      create: { participantId: participant.id, endpoint: input.subscription.endpoint, p256dh: input.subscription.keys.p256dh, auth: input.subscription.keys.auth },
      update: { participantId: participant.id, p256dh: input.subscription.keys.p256dh, auth: input.subscription.keys.auth },
    });
    return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    return apiError(error);
  }
}

/** Baja: solo borra la suscripción si pertenece al participante de esta cookie. */
export async function DELETE(request: NextRequest) {
  if (!process.env.DATABASE_URL) return serviceUnavailable();
  try {
    const input = unsubscribeSchema.parse(await request.json());
    const token = request.cookies.get(participantCookieName)?.value;
    if (!token) return NextResponse.json({ ok: true });
    await prisma.pushSubscription.deleteMany({ where: { endpoint: input.endpoint, participant: { sessionHash: sha256(token) } } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}

async function findParticipant(request: NextRequest, shoppingSlug: string) {
  const token = request.cookies.get(participantCookieName)?.value;
  if (!token) return null;
  const now = new Date();
  const shopping = await prisma.shopping.findUnique({ where: { slug: shoppingSlug }, select: { id: true, active: true } });
  if (!shopping?.active) return null;
  const campaign = await prisma.campaign.findFirst({
    where: { shoppingId: shopping.id, status: 'ACTIVE', startsAt: { lte: now }, endsAt: { gt: now } },
    select: { id: true },
  });
  if (!campaign) return null;
  return prisma.participant.findUnique({
    where: { sessionHash_campaignId_shoppingId: { sessionHash: sha256(token), campaignId: campaign.id, shoppingId: shopping.id } },
    select: { id: true },
  });
}
