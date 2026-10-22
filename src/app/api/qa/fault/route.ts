import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { isQaEnvironmentReady } from '@/lib/qa-safety';

const schema = z.object({ shoppingSlug: z.enum(['centenario', 'uniplaza']) });

/** QA-only controlled 503 probe. It never changes campaign, participant, prize, or redemption data. */
export async function POST(request: NextRequest) {
  if (!isQaEnvironmentReady()) return NextResponse.json({ error: 'Entorno QA no habilitado.' }, { status: 404 });
  const admin = await requireAdmin(['SUPERADMIN']);
  if (!admin) return NextResponse.json({ error: 'Acceso restringido a superadministradores del entorno QA.' }, { status: 401 });
  try {
    const { shoppingSlug } = schema.parse(await request.json());
    const campaign = await prisma.campaign.findUnique({ where: { slug: `qa-${shoppingSlug}-campaign` } });
    if (!campaign) return NextResponse.json({ error: 'Restablecé los fixtures QA antes de correr este escenario.' }, { status: 409 });
    const run = await prisma.auditLog.create({ data: {
      actorId: admin.id,
      shoppingId: campaign.shoppingId,
      campaignId: campaign.id,
      action: 'QA_SERVER_ERROR_PROBE',
      entityType: 'QaRun',
      entityId: 'server-error',
      metadata: { scenario: 'server-error', status: 'APPROVED', expected: 'HTTP 503 controlado y recuperable', observed: { httpStatus: 503, code: 'QA_SERVER_ERROR' } },
    } });
    return NextResponse.json({ error: 'Falla controlada de QA; no se modificaron los datos de la campaña.', code: 'QA_SERVER_ERROR', run: { id: run.id, scenario: 'server-error', status: 'APPROVED', createdAt: run.createdAt } }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'No se pudo ejecutar la prueba controlada.' }, { status: 400 });
  }
}
