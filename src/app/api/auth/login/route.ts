import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { createAdminSession, setAdminCookie } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { apiError, serviceUnavailable } from '@/lib/http';
import { checkRateLimit } from '@/lib/rate-limit';
import { getClientIp } from '@/lib/client-ip';
import { sha256 } from '@/lib/security';

const schema = z.object({ email: z.string().email().max(254), password: z.string().min(1).max(200) });
// Hash de referencia con el mismo costo que los hashes reales; nunca coincide con una contraseña válida.
const DUMMY_PASSWORD_HASH = bcrypt.hashSync('referencia-sin-cuenta-asociada', 12);

export async function POST(request: NextRequest) {
  try {
    const { email, password } = schema.parse(await request.json());
    const normalizedEmail = email.trim().toLowerCase();
    const limit = await checkRateLimit(`login:${sha256(normalizedEmail)}`, 8, 15 * 60_000);
    if (!limit.allowed) return NextResponse.json({ error: 'Demasiados intentos. Esperá unos minutos y probá otra vez.', code: 'RATE_LIMITED' }, { status: 429 });
    const ipLimit = await checkRateLimit(`login-ip:${sha256(getClientIp(request))}`, 40, 15 * 60_000);
    if (!ipLimit.allowed) return NextResponse.json({ error: 'Demasiados intentos desde tu conexión. Esperá unos minutos.', code: 'RATE_LIMITED' }, { status: 429 });
    const user = await prisma.adminUser.findUnique({ where: { email: normalizedEmail } });
    // Siempre se ejecuta bcrypt, exista o no el usuario, para que el tiempo de respuesta no revele qué correos existen.
    const passwordMatches = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_PASSWORD_HASH);
    if (!user || !user.active || !passwordMatches) {
      return NextResponse.json({ error: 'El correo o la contraseña no son correctos.', code: 'INVALID_CREDENTIALS' }, { status: 401 });
    }
    const response = NextResponse.json({ ok: true });
    const updated = await prisma.adminUser.update({ where: { id: user.id }, data: { lastLoginAt: new Date() }, select: { sessionVersion: true } });
    await setAdminCookie(await createAdminSession(user.id, updated.sessionVersion));
    return response;
  } catch (error) {
    if (!process.env.DATABASE_URL) return serviceUnavailable();
    return apiError(error);
  }
}
