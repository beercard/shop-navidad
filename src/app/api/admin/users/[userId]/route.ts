import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { apiError, serviceUnavailable } from '@/lib/http';
import { logAudit } from '@/lib/admin';

const schema = z.object({ active: z.boolean() });

export async function PATCH(request: NextRequest, context: { params: Promise<{ userId: string }> }) {
  if (!process.env.DATABASE_URL) return serviceUnavailable();
  try {
    const admin = await requireAdmin(['SUPERADMIN']);
    if (!admin) return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
    const { userId } = await context.params;
    const { active } = schema.parse(await request.json());
    if (userId === admin.id && !active) return NextResponse.json({ error: 'No podés desactivar tu propio usuario.' }, { status: 400 });
    const user = await prisma.$transaction(async (tx) => {
      const updated = await tx.adminUser.update({ where: { id: userId }, data: { active }, select: { id: true, name: true, email: true, role: true, active: true } });
      await logAudit(tx, { actorId: admin.id, action: active ? 'ADMIN_USER_ACTIVATED' : 'ADMIN_USER_DEACTIVATED', entityType: 'AdminUser', entityId: userId });
      return updated;
    });
    return NextResponse.json({ user });
  } catch (error) { return apiError(error); }
}
