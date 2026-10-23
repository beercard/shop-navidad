import { Role } from '@prisma/client';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';

const sessionCookie = 'navidad_admin_session';

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) throw new Error('AUTH_SECRET must be configured with at least 32 characters');
  return new TextEncoder().encode(value);
}

export async function createAdminSession(userId: string) {
  return new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(secret());
}

export async function setAdminCookie(token: string) {
  (await cookies()).set(sessionCookie, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8,
  });
}

export async function clearAdminCookie() {
  (await cookies()).delete(sessionCookie);
}

export async function getAdmin() {
  const token = (await cookies()).get(sessionCookie)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    if (!payload.sub) return null;
    return await prisma.adminUser.findFirst({
      where: { id: payload.sub, active: true },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        shoppingScopes: { select: { shopping: { select: { id: true, slug: true, name: true } } } },
        merchantScopes: {
          where: { merchant: { active: true, shopping: { active: true } } },
          select: { merchant: { select: { id: true, slug: true, name: true, active: true, shoppingId: true, shopping: { select: { slug: true, name: true } } } } },
        },
      },
    });
  } catch {
    return null;
  }
}

export async function requireAdmin(roles?: Role[]) {
  const admin = await getAdmin();
  if (!admin || (roles && !roles.includes(admin.role))) return null;
  return admin;
}

export function canAccessShopping(admin: NonNullable<Awaited<ReturnType<typeof getAdmin>>>, shoppingId: string) {
  return admin.role === 'SUPERADMIN' || admin.shoppingScopes.some((scope) => scope.shopping.id === shoppingId);
}
