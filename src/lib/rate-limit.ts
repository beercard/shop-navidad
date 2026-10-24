import { prisma } from '@/lib/db';

/** PostgreSQL-backed fixed-window rate limit. The caller should pass a hashed identity. */
export async function checkRateLimit(key: string, limit: number, windowMs: number) {
  // Las peticiones simultáneas con la misma clave chocan en la transacción Serializable (P2034):
  // se reintenta con espera aleatoria en lugar de devolver un 500 al comercio.
  for (let attempt = 0; ; attempt += 1) {
    try {
      return await attemptRateLimit(key, limit, windowMs);
    } catch (error) {
      const conflict = error && typeof error === 'object' && 'code' in error && (error.code === 'P2034' || error.code === 'P2002');
      if (!conflict || attempt >= 6) throw error;
      await new Promise((resolve) => setTimeout(resolve, 15 + Math.random() * 35 * (attempt + 1)));
    }
  }
}

async function attemptRateLimit(key: string, limit: number, windowMs: number) {
  const now = new Date();
  const resetAt = new Date(now.getTime() + windowMs);
  return prisma.$transaction(async (tx) => {
    const current = await tx.rateLimitBucket.findUnique({ where: { key } });
    if (!current || current.resetAt <= now) {
      await tx.rateLimitBucket.upsert({ where: { key }, create: { key, count: 1, resetAt }, update: { count: 1, resetAt } });
      return { allowed: true, remaining: limit - 1 };
    }
    if (current.count >= limit) return { allowed: false, remaining: 0 };
    await tx.rateLimitBucket.update({ where: { key }, data: { count: { increment: 1 } } });
    return { allowed: true, remaining: limit - current.count - 1 };
  }, { isolationLevel: 'Serializable' });
}
