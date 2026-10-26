/** Textos de cuenta regresiva a partir de fechas reales de la campaña o del cupón; nunca inventan urgencia. */

const DAY_MS = 86_400_000;

function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-AR', { dateStyle: 'short' });
}

/** Vencimiento de un cupón: "Vence hoy a las 20:00", "Vence mañana (24/12/26)", "Vence en 3 días (…)". */
export function expiryLabel(iso: string, now = Date.now()) {
  const ms = new Date(iso).getTime() - now;
  const hours = ms / 3_600_000;
  if (hours < 0) return { text: `Venció el ${new Date(iso).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })}`, soon: false };
  if (hours < 24) return { text: `Vence hoy a las ${new Date(iso).toLocaleTimeString('es-AR', { timeStyle: 'short' })}`, soon: true };
  const days = Math.floor(hours / 24);
  return { text: `Vence ${days === 1 ? 'mañana' : `en ${days} días`} (${shortDate(iso)})`, soon: hours < 48 };
}

/** Días completos que faltan hasta una fecha; negativo si ya pasó. */
export function daysUntil(iso: string, now = Date.now()) {
  return Math.ceil((new Date(iso).getTime() - now) / DAY_MS);
}

/** Cierre de campaña: solo se muestra cuando falta poco, para no agregar ruido el resto del tiempo. */
export function campaignEndLabel(iso: string, now = Date.now(), withinDays = 14) {
  const days = daysUntil(iso, now);
  if (days < 0 || days > withinDays) return null;
  if (days === 0) return 'La campaña termina hoy';
  if (days === 1) return 'La campaña termina mañana';
  return `La campaña termina en ${days} días (${shortDate(iso)})`;
}
