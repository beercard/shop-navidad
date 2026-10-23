import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

type MerchantAdmin = NonNullable<Awaited<ReturnType<typeof requireAdmin>>>;
type MerchantRecord = { id: string; slug: string; name: string; active: boolean; shoppingId: string; shopping: { name: string; slug: string } };
type MerchantScopesResult = { error: 'UNAUTHORIZED' | 'FORBIDDEN' } | { admin: MerchantAdmin; merchants: MerchantRecord[] };
type MerchantScopeResult = { error: 'UNAUTHORIZED' | 'FORBIDDEN' | 'MERCHANT_REQUIRED' } | { admin: MerchantAdmin; merchant: MerchantRecord };

export async function getMerchantScopes(): Promise<MerchantScopesResult> {
  const admin = await requireAdmin(['MERCHANT_VALIDATOR']);
  if (!admin) return { error: 'UNAUTHORIZED' as const };
  const merchants = admin.merchantScopes.map(({ merchant }) => merchant).filter((merchant) => merchant.active);
  if (!merchants.length) return { error: 'FORBIDDEN' as const };
  return { admin, merchants };
}

export async function getMerchantScope(merchantSlug?: string | null): Promise<MerchantScopeResult> {
  const scope = await getMerchantScopes();
  if ('error' in scope) return scope;
  const merchants = merchantSlug ? scope.merchants.filter((merchant) => merchant.slug === merchantSlug) : scope.merchants;
  if (merchants.length !== 1) return { error: merchants.length ? 'MERCHANT_REQUIRED' as const : 'FORBIDDEN' as const };
  const merchant = await prisma.merchant.findFirst({ where: { id: merchants[0].id, active: true, shoppingId: merchants[0].shoppingId, shopping: { active: true } }, include: { shopping: { select: { name: true, slug: true } } } });
  if (!merchant) return { error: 'FORBIDDEN' as const };
  return { admin: scope.admin, merchant };
}
