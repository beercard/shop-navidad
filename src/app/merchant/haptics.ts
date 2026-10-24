/**
 * Respuesta háptica breve, solo donde el dispositivo la soporta (Android/Chrome). Safari en iOS no expone
 * `navigator.vibrate`, así que nunca es la única señal: siempre hay icono, texto y color.
 */
export const haptics = {
  /** Lectura de QR correcta. */
  scan: () => buzz(60),
  /** Canje confirmado por el servidor. */
  success: () => buzz([70, 50, 70]),
  /** Rechazo o error: pulso largo, distinto del éxito. */
  error: () => buzz(220),
};

function buzz(pattern: number | number[]) {
  if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return;
  try { navigator.vibrate(pattern); } catch { /* sin vibración disponible */ }
}
