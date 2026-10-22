import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authFailure, getAdminShopping, logAudit } from '@/lib/admin';
import { prisma } from '@/lib/db';
import { apiError, serviceUnavailable } from '@/lib/http';

const themeSchema = z.object({
  primary: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  accent: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  surface: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  text: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  fontPreset: z.enum(['classic', 'urban']).optional(),
  publicMessage: z.string().trim().max(240).optional(),
  collectionUnlockText: z.string().trim().max(240).optional(),
});
const schema = z.object({ shoppingSlug: z.string(), brandSettings: themeSchema });

export async function GET(request: NextRequest) {
  if (!process.env.DATABASE_URL) return serviceUnavailable();
  try {
    const shoppingSlug = request.nextUrl.searchParams.get('shoppingSlug') ?? '';
    const scope = await getAdminShopping(shoppingSlug, ['SUPERADMIN', 'SHOPPING_OPERATOR']);
    if ('error' in scope) { const failure = authFailure(scope.error); return NextResponse.json({ error: failure.error }, { status: failure.statusCode }); }
    return NextResponse.json({ shopping: { id: scope.shopping.id, slug: scope.shopping.slug, name: scope.shopping.name, brandSettings: scope.shopping.brandSettings } });
  } catch (error) { return apiError(error); }
}

export async function PATCH(request: NextRequest) {
  if (!process.env.DATABASE_URL) return serviceUnavailable();
  try {
    const input = schema.parse(await request.json());
    const scope = await getAdminShopping(input.shoppingSlug, ['SUPERADMIN', 'SHOPPING_OPERATOR']);
    if ('error' in scope) { const failure = authFailure(scope.error); return NextResponse.json({ error: failure.error }, { status: failure.statusCode }); }
    const merged = { ...(scope.shopping.brandSettings as Record<string, unknown>), ...input.brandSettings };
    const shopping = await prisma.$transaction(async (tx) => {
      const updated = await tx.shopping.update({ where: { id: scope.shopping.id }, data: { brandSettings: merged } });
      await logAudit(tx, { actorId: scope.admin.id, shoppingId: scope.shopping.id, action: 'PUBLIC_EXPERIENCE_SETTINGS_UPDATED', entityType: 'Shopping', entityId: scope.shopping.id, metadata: { fields: Object.keys(input.brandSettings) } });
      return updated;
    });
    return NextResponse.json({ shopping: { id: shopping.id, slug: shopping.slug, name: shopping.name, brandSettings: shopping.brandSettings } });
  } catch (error) { return apiError(error); }
}
