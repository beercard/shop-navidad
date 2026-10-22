import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { apiError, serviceUnavailable } from '@/lib/http';
import { logAudit } from '@/lib/admin';

const schema = z.object({ name: z.string().trim().min(2).max(120), email: z.string().email().max(254).transform((email) => email.toLowerCase()), password: z.string().min(12).max(200), role: z.enum(['SUPERADMIN', 'SHOPPING_OPERATOR', 'MERCHANT_VALIDATOR']), shoppingSlugs: z.array(z.string()).max(10).default([]) });

export async function GET() {
  if (!process.env.DATABASE_URL) return serviceUnavailable();
  const admin = await requireAdmin(['SUPERADMIN']);
  if (!admin) return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  try {
    const users = await prisma.adminUser.findMany({ select: { id: true, email: true, name: true, role: true, active: true, lastLoginAt: true, createdAt: true, shoppingScopes: { select: { shopping: { select: { slug: true, name: true } } } } }, orderBy: { name: 'asc' } });
    return NextResponse.json({ users });
  } catch (error) { return apiError(error); }
}

export async function POST(request: NextRequest) {
  if (!process.env.DATABASE_URL) return serviceUnavailable();
  try {
    const admin = await requireAdmin(['SUPERADMIN']);
    if (!admin) return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
    const input = schema.parse(await request.json());
    if (input.role !== 'SUPERADMIN' && input.shoppingSlugs.length === 0) return NextResponse.json({ error: 'Asigná al menos un shopping a este usuario.' }, { status: 400 });
    if (input.role === 'SUPERADMIN' && input.shoppingSlugs.length > 0) return NextResponse.json({ error: 'El administrador general no necesita asignación de shopping.' }, { status: 400 });
    const shoppings = input.shoppingSlugs.length ? await prisma.shopping.findMany({ where: { slug: { in: input.shoppingSlugs } } }) : [];
    if (shoppings.length !== input.shoppingSlugs.length) return NextResponse.json({ error: 'Uno de los shoppings seleccionados no existe.' }, { status: 400 });
    const passwordHash = await bcrypt.hash(input.password, 12);
    const user = await prisma.$transaction(async (tx) => {
      const created = await tx.adminUser.create({ data: { name: input.name, email: input.email, passwordHash, role: input.role, shoppingScopes: { create: shoppings.map(({ id }) => ({ shoppingId: id })) } }, select: { id: true, email: true, name: true, role: true, active: true } });
      await logAudit(tx, { actorId: admin.id, action: 'ADMIN_USER_CREATED', entityType: 'AdminUser', entityId: created.id, metadata: { role: created.role } });
      return created;
    });
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) { return apiError(error); }
}
