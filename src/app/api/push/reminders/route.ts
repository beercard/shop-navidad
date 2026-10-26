import { timingSafeEqual } from 'node:crypto';
import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { apiError } from '@/lib/http';
import { pushEnabled, sendPushToParticipant } from '@/lib/push';

const WINDOW_MS = 24 * 60 * 60_000;
const MAX_PER_RUN = 500;

/**
 * Recordatorios push, pensado para ejecutarse cada hora desde un cron con `Authorization: Bearer <CRON_SECRET>`.
 * 1. Cupón emitido que vence en las próximas 24 h.
 * 2. Pista publicada en las últimas 24 h, para quien todavía no encontró la posta a la que apunta.
 * Cada aviso se registra en `events` con un dedupeKey único, así nunca se envía dos veces.
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || secret.length < 32) return NextResponse.json({ error: 'CRON_SECRET no configurado.', code: 'CRON_DISABLED' }, { status: 503 });
  if (!authorized(request.headers.get('authorization'), secret)) return NextResponse.json({ error: 'No autorizado.', code: 'UNAUTHORIZED' }, { status: 401 });
  if (!pushEnabled()) return NextResponse.json({ error: 'Claves VAPID no configuradas.', code: 'PUSH_DISABLED' }, { status: 503 });

  try {
    const now = new Date();
    let processed = 0;
    const result = { couponReminders: 0, clueAlerts: 0, removedSubscriptions: 0 };

    const expiring = await prisma.redeemCode.findMany({
      where: {
        status: 'ISSUED',
        expiresAt: { gt: now, lte: new Date(now.getTime() + WINDOW_MS) },
        participation: { participant: { pushSubscriptions: { some: {} } } },
      },
      select: {
        id: true,
        campaignId: true,
        shoppingId: true,
        prize: { select: { name: true } },
        shopping: { select: { slug: true } },
        participation: { select: { participantId: true } },
      },
      take: MAX_PER_RUN,
    });
    for (const coupon of expiring) {
      if (processed++ >= MAX_PER_RUN) break;
      const participantId = coupon.participation.participantId;
      if (!(await claim(`push:coupon-expiry:${coupon.id}`, 'PUSH_COUPON_EXPIRY', coupon.shoppingId, coupon.campaignId, participantId))) continue;
      const sent = await sendPushToParticipant(participantId, {
        title: 'Tu cupón vence pronto',
        body: `${coupon.prize.name}: canjealo antes de que venza.`,
        url: `/${coupon.shopping.slug}#progreso`,
        tag: `coupon-${coupon.id}`,
      });
      result.couponReminders += sent.sent > 0 ? 1 : 0;
      result.removedSubscriptions += sent.removed;
    }

    const clues = await prisma.clue.findMany({
      where: { active: true, startsAt: { gte: new Date(now.getTime() - WINDOW_MS), lte: now }, endsAt: { gt: now } },
      select: { id: true, cardId: true, campaignId: true, shoppingId: true, shopping: { select: { slug: true } } },
    });
    for (const clue of clues) {
      const participants = await prisma.participant.findMany({
        where: {
          campaignId: clue.campaignId,
          shoppingId: clue.shoppingId,
          pushSubscriptions: { some: {} },
          // Una pista de una posta que la persona ya encontró no le sirve: no se avisa.
          ...(clue.cardId ? { collections: { none: { cards: { some: { cardId: clue.cardId } } } } } : {}),
        },
        select: { id: true },
        take: MAX_PER_RUN,
      });
      for (const participant of participants) {
        if (processed++ >= MAX_PER_RUN) break;
        if (!(await claim(`push:clue:${clue.id}:${participant.id}`, 'PUSH_NEW_CLUE', clue.shoppingId, clue.campaignId, participant.id))) continue;
        const sent = await sendPushToParticipant(participant.id, {
          title: 'Hay una pista nueva',
          body: 'Abrí Descubrir para ver dónde buscar tu próxima posta.',
          url: `/${clue.shopping.slug}#descubrir`,
          tag: `clue-${clue.id}`,
        });
        result.clueAlerts += sent.sent > 0 ? 1 : 0;
        result.removedSubscriptions += sent.removed;
      }
    }

    return NextResponse.json({ ok: true, ...result, truncated: processed >= MAX_PER_RUN });
  } catch (error) {
    return apiError(error);
  }
}

function authorized(header: string | null, secret: string) {
  const expected = Buffer.from(`Bearer ${secret}`);
  const received = Buffer.from(header ?? '');
  return received.length === expected.length && timingSafeEqual(received, expected);
}

/** Registra el aviso antes de enviarlo; si el dedupeKey ya existe, otro proceso o una corrida anterior ya lo envió. */
async function claim(dedupeKey: string, eventType: string, shoppingId: string, campaignId: string, participantId: string) {
  try {
    await prisma.event.create({ data: { dedupeKey, eventType, shoppingId, campaignId, participantId } });
    return true;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') return false;
    throw error;
  }
}
