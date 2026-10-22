import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { createAdminSession, setAdminCookie } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { apiError, serviceUnavailable } from '@/lib/http';
import { checkRateLimit } from '@/lib/rate-limit';
import { sha256 } from '@/lib/security';

const schema = z.object({ email: z.string().email().max(254), password: z.string().min(1).max(200) });

export async function POST(request: NextRequest) {
  try {
    const { email, password } = schema.parse(await request.json());
    const normalizedEmail = email.trim().toLowerCase();
    const limit = await checkRateLimit(`login:${sha256(normalizedEmail)}`, 8, 15 * 60_000);
    if (!limit.allowed) return NextResponse.json({ error: 'Demasiados intentos. Esperá unos minutos y probá otra vez.', code: 'RATE_LIMITED' }, { status: 429 });
    const user = await prisma.adminUser.findUnique({ where: { email: normalizedEmail } });
    if (!user || !user.active || !(await bcrypt.compare(password, user.passwordHash))) {
      return NextResponse.json({ error: 'El correo o la contraseña no son correctos.', code: 'INVALID_CREDENTIALS' }, { status: 401 });
    }
    const response = NextResponse.json({ ok: true });
    await setAdminCookie(await createAdminSession(user.id));
    await prisma.adminUser.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    return response;
  } catch (error) {
    if (!process.env.DATABASE_URL) return serviceUnavailable();
    return apiError(error);
  }
}
