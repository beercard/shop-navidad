import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { getAdmin, createAdminSession, setAdminCookie } from '@/lib/auth';
import { logAudit } from '@/lib/admin';
import { prisma } from '@/lib/db';
import { apiError, serviceUnavailable } from '@/lib/http';
import { checkRateLimit } from '@/lib/rate-limit';
import { sha256 } from '@/lib/security';

const schema = z.object({ currentPassword: z.string().min(1).max(200), newPassword: z.string().min(12).max(200) });

export async function POST(request: NextRequest) {
  if (!process.env.DATABASE_URL) return serviceUnavailable();
  try {
    const admin = await getAdmin();
    if (!admin) return NextResponse.json({ error: 'Iniciá sesión nuevamente para cambiar la contraseña.' }, { status: 401 });
    const ip = request.headers.get('x-real-ip') ?? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
    const limit = await checkRateLimit(`password-change:${sha256(admin.id)}:${sha256(ip)}`, 5, 15 * 60_000);
    if (!limit.allowed) return NextResponse.json({ error: 'Hubo varios intentos. Esperá unos minutos e intentá de nuevo.' }, { status: 429 });
    const input = schema.parse(await request.json());
    const user = await prisma.adminUser.findFirst({ where: { id: admin.id, active: true } });
    if (!user || !(await bcrypt.compare(input.currentPassword, user.passwordHash))) return NextResponse.json({ error: 'La contraseña actual no coincide.' }, { status: 400 });
    const passwordHash = await bcrypt.hash(input.newPassword, 12);
    const updated = await prisma.$transaction(async (tx) => {
      const saved = await tx.adminUser.update({ where: { id: user.id }, data: { passwordHash, sessionVersion: { increment: 1 } }, select: { sessionVersion: true } });
      await logAudit(tx, { actorId: user.id, action: 'ACCOUNT_PASSWORD_CHANGED', entityType: 'AdminUser', entityId: user.id });
      return saved;
    });
    await setAdminCookie(await createAdminSession(user.id, updated.sessionVersion));
    return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) { return apiError(error); }
}
