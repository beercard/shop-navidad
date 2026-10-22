import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { isQaEnvironmentReady } from '@/lib/qa-safety';
import { getPublicBaseUrl } from '@/lib/public-base-url';

export async function GET(request: NextRequest) {
  if (!isQaEnvironmentReady()) return NextResponse.json({ error: 'Entorno QA no habilitado.' }, { status: 404 });
  const admin = await requireAdmin(['SUPERADMIN']);
  if (!admin) return NextResponse.json({ error: 'Acceso restringido a superadministradores del entorno QA.' }, { status: 401 });
  try {
    const shoppingSlug = request.nextUrl.searchParams.get('shoppingSlug');
    const shopping = shoppingSlug ? await prisma.shopping.findUnique({ where: { slug: shoppingSlug } }) : null;
    if (shoppingSlug && !shopping) return NextResponse.json({ error: 'Shopping no válido.' }, { status: 404 });
    const [shops, campaigns, prizes, cards, runs, participations, redeems] = await Promise.all([
      prisma.shopping.findMany({ where: { slug: { in: ['centenario', 'uniplaza'] } }, select: { id: true, slug: true, name: true } }),
      prisma.campaign.findMany({ where: { OR: [{ slug: { startsWith: 'qa-' } }, { slug: { startsWith: 'navidad-demo-' } }], ...(shopping ? { shoppingId: shopping.id } : {}) }, select: { id: true, shoppingId: true, slug: true, name: true, status: true, startsAt: true, endsAt: true }, orderBy: { slug: 'asc' } }),
      prisma.prize.findMany({ where: { campaign: { OR: [{ slug: { startsWith: 'qa-' } }, { slug: { startsWith: 'navidad-demo-' } }] }, ...(shopping ? { shoppingId: shopping.id } : {}) }, select: { id: true, campaignId: true, shoppingId: true, name: true, totalStock: true, remainingStock: true, weight: true, active: true, imageUrl: true, details: true, campaign: { select: { name: true, slug: true } } }, orderBy: [{ campaign: { slug: 'asc' } }, { name: 'asc' }] }),
      prisma.card.findMany({ where: { campaign: { OR: [{ slug: { startsWith: 'qa-' } }, { slug: { startsWith: 'navidad-demo-' } }] }, ...(shopping ? { shoppingId: shopping.id } : {}) }, select: { id: true, campaignId: true, shoppingId: true, publicId: true, status: true, location: true, campaign: { select: { name: true, slug: true } }, _count: { select: { participations: true } } }, orderBy: { publicId: 'asc' } }),
      prisma.auditLog.findMany({ where: { entityType: 'QaRun', ...(shopping ? { shoppingId: shopping.id } : {}) }, orderBy: { createdAt: 'desc' }, take: 100, include: { actor: { select: { name: true } }, shopping: { select: { slug: true } } } }),
      prisma.participation.findMany({ where: { campaign: { OR: [{ slug: { startsWith: 'qa-' } }, { slug: { startsWith: 'navidad-demo-' } }] }, ...(shopping ? { shoppingId: shopping.id } : {}) }, select: { id: true, status: true, createdAt: true, shoppingId: true, campaign: { select: { name: true, shopping: { select: { slug: true } } } }, card: { select: { publicId: true } }, prize: { select: { name: true } } }, orderBy: { createdAt: 'desc' }, take: 25 }),
      prisma.redeemCode.findMany({ where: { campaign: { OR: [{ slug: { startsWith: 'qa-' } }, { slug: { startsWith: 'navidad-demo-' } }] }, ...(shopping ? { shoppingId: shopping.id } : {}) }, select: { id: true, status: true, expiresAt: true, redeemedAt: true, createdAt: true, campaign: { select: { name: true, shopping: { select: { slug: true } } } }, prize: { select: { name: true } } }, orderBy: { createdAt: 'desc' }, take: 25 }),
    ]);
    let baseUrl: string | null = null;
    let baseUrlError: string | null = null;
    try { baseUrl = getPublicBaseUrl(); } catch (error) { baseUrlError = error instanceof Error ? error.message : 'APP_BASE_URL inválida.'; }
    return NextResponse.json({ isolated: true, mode: 'QA', admin: { name: admin.name }, baseUrl, baseUrlError, shops, campaigns, prizes, cards, runs, participations, redeems }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch {
    return NextResponse.json({ error: 'No se pudo consultar la base aislada de QA.' }, { status: 503 });
  }
}
