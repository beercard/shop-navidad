import { randomBytes } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { requireAdmin } from '@/lib/auth';
import { logAudit } from '@/lib/admin';
import { prisma } from '@/lib/db';
import { apiError, serviceUnavailable } from '@/lib/http';

export async function POST(_request: NextRequest, context: { params: Promise<{ userId: string }> }) {
  if (!process.env.DATABASE_URL) return serviceUnavailable();
  try {
    const admin = await requireAdmin(['SUPERADMIN']);
    if (!admin) return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
    const { userId } = await context.params;
    const target = await prisma.adminUser.findUnique({ where: { id: userId }, select: { id: true, role: true } });
    if (!target || target.role !== 'MERCHANT_VALIDATOR') return NextResponse.json({ error: 'No encontramos una cuenta validadora para restablecer.' }, { status: 404 });
    const temporaryPassword = randomBytes(24).toString('base64url');
    const passwordHash = await bcrypt.hash(temporaryPassword, 12);
    await prisma.$transaction(async (tx) => {
      await tx.adminUser.update({ where: { id: userId }, data: { passwordHash, sessionVersion: { increment: 1 } } });
      await logAudit(tx, { actorId: admin.id, action: 'MERCHANT_PASSWORD_RESET', entityType: 'AdminUser', entityId: userId });
    });
    return NextResponse.json({ ok: true, temporaryPassword }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) { return apiError(error); }
}
