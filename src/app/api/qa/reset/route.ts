import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { resetQaFixtures } from '@/lib/qa-fixtures';
import { isQaEnvironmentReady } from '@/lib/qa-safety';

const schema = z.object({ confirmation: z.literal('RESET QA') });

export async function POST(request: NextRequest) {
  if (!isQaEnvironmentReady()) return NextResponse.json({ error: 'Entorno QA no habilitado.' }, { status: 404 });
  const admin = await requireAdmin(['SUPERADMIN']);
  if (!admin) return NextResponse.json({ error: 'Acceso restringido a superadministradores del entorno QA.' }, { status: 401 });
  try {
    schema.parse(await request.json());
    const fixtures = await resetQaFixtures(admin.id);
    return NextResponse.json({ reset: true, fixtures }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'No se pudieron restablecer los fixtures QA.' }, { status: 400 });
  }
}
