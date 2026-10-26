import webpush from 'web-push';
import { prisma } from '@/lib/db';

/** Web Push con claves VAPID. Sin claves configuradas, las notificaciones quedan desactivadas. */
let configured: boolean | null = null;

export function pushPublicKey() {
  return process.env.VAPID_PUBLIC_KEY || null;
}

function ensureConfigured() {
  if (configured !== null) return configured;
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT;
  configured = Boolean(publicKey && privateKey && subject);
  if (configured) webpush.setVapidDetails(subject!, publicKey!, privateKey!);
  return configured;
}

export function pushEnabled() {
  return ensureConfigured();
}

export type PushMessage = { title: string; body: string; url: string; tag?: string };

/**
 * Envía un aviso a todas las suscripciones de un participante.
 * Las suscripciones que el navegador dio de baja (404/410) se eliminan; otros errores no frenan el resto.
 */
export async function sendPushToParticipant(participantId: string, message: PushMessage) {
  if (!ensureConfigured()) return { sent: 0, removed: 0 };
  const subscriptions = await prisma.pushSubscription.findMany({ where: { participantId } });
  let sent = 0;
  let removed = 0;
  for (const subscription of subscriptions) {
    try {
      await webpush.sendNotification(
        { endpoint: subscription.endpoint, keys: { p256dh: subscription.p256dh, auth: subscription.auth } },
        JSON.stringify(message),
        { TTL: 60 * 60 * 12 },
      );
      sent += 1;
    } catch (error) {
      const status = (error as { statusCode?: number }).statusCode;
      if (status === 404 || status === 410) {
        await prisma.pushSubscription.delete({ where: { id: subscription.id } }).catch(() => undefined);
        removed += 1;
      }
    }
  }
  return { sent, removed };
}
