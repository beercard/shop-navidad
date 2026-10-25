import type { Role, Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
import { canAccessShopping, getAdmin } from '@/lib/auth';

export async function getAdminShopping(shoppingSlug: string, roles?: Role[]) {
  const admin = await getAdmin();
  if (!admin) return { error: 'UNAUTHORIZED' as const };
  if (roles && !roles.includes(admin.role)) return { error: 'FORBIDDEN' as const };
  const shopping = await prisma.shopping.findUnique({ where: { slug: shoppingSlug } });
  if (!shopping || !canAccessShopping(admin, shopping.id)) return { error: 'FORBIDDEN' as const };
  return { admin, shopping };
}

export async function logAudit(tx: Prisma.TransactionClient, input: {
  actorId: string; shoppingId?: string; campaignId?: string; action: string; entityType: string; entityId: string; metadata?: Prisma.InputJsonValue;
}) {
  await tx.auditLog.create({ data: { ...input, metadata: input.metadata ?? {} } });
}

export function authFailure(status: 'UNAUTHORIZED' | 'FORBIDDEN' | undefined) {
  const resolved = status === 'FORBIDDEN' ? 'FORBIDDEN' : 'UNAUTHORIZED';
  return { error: resolved, statusCode: resolved === 'UNAUTHORIZED' ? 401 : 403 };
}
