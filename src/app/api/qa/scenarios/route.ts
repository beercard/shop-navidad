import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { executeQaScenario } from '@/lib/qa-fixtures';
import { isQaEnvironmentReady } from '@/lib/qa-safety';

const schema = z.object({ shoppingSlug: z.enum(['centenario', 'uniplaza']), scenario: z.enum(['all-available', 'one-exhausted', 'all-exhausted', 'campaign-inactive', 'campaign-expired', 'cross-tenant-card', 'duplicate-card', 'collection-complete', 'last-prize-concurrent', 'redeem-cycle', 'instant-prize-limit', 'concurrent-same-card', 'concurrent-two-cards', 'concurrent-redeem', 'completion-reward-modes', 'completion-reward-concurrency']) });

export async function POST(request: NextRequest) {
  if (!isQaEnvironmentReady()) return NextResponse.json({ error: 'Entorno QA no habilitado.' }, { status: 404 });
  const admin = await requireAdmin(['SUPERADMIN']);
  if (!admin) return NextResponse.json({ error: 'Acceso restringido a superadministradores del entorno QA.' }, { status: 401 });
  try {
    const input = schema.parse(await request.json());
    const run = await executeQaScenario({ ...input, actorId: admin.id });
    return NextResponse.json({ run }, { status: run.status === 'APPROVED' ? 200 : 409, headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Falló la ejecución de QA.' }, { status: 400 });
  }
}
