/**
 * IP del cliente para límites de uso.
 *
 * El primer valor de X-Forwarded-For lo escribe el cliente y se puede falsificar, así que no se usa.
 * Se toma X-Real-IP si lo define el proxy de confianza; si no, el último valor de X-Forwarded-For,
 * que es el que agrega el proxy más cercano. Desplegar detrás de un proxy que sobrescriba estas cabeceras.
 */
export function getClientIp(request: Request): string {
  const realIp = request.headers.get('x-real-ip')?.trim();
  if (realIp) return realIp;
  const forwarded = request.headers
    .get('x-forwarded-for')
    ?.split(',')
    .map((part) => part.trim())
    .filter(Boolean);
  return forwarded?.at(-1) ?? 'unknown';
}
