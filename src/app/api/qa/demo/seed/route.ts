import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { seedDemo } from '@/lib/demo-seed.mjs';
import { getPublicBaseUrl } from '@/lib/public-base-url';
import { isQaEnvironmentReady } from '@/lib/qa-safety';

export async function POST() {
  if (!isQaEnvironmentReady()) return NextResponse.json({ error: 'Entorno QA no habilitado.' }, { status: 404 });
  const admin = await requireAdmin(['SUPERADMIN']);
  if (!admin) return NextResponse.json({ error: 'Acceso restringido a superadministradores del entorno QA.' }, { status: 401 });
  try {
    const baseUrl = getPublicBaseUrl();
    const result = await seedDemo(prisma);
    const first = result.campaigns[0];
    await prisma.auditLog.create({ data: { actorId: admin.id, action: 'DEMO_SEED_TRIGGERED', entityType: 'DemoSeed', entityId: 'both-shoppings', metadata: result.counts } });
    return NextResponse.json({ ok: true, baseUrl, result, exampleUrl: `${baseUrl}/centenario/participar/${first.cardIds[0]}` }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'No se pudieron preparar los datos de demostración.' }, { status: 400 });
  }
}
