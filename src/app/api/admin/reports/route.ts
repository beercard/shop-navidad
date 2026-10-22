import { NextRequest, NextResponse } from 'next/server';
import { authFailure, getAdminShopping } from '@/lib/admin';
import { prisma } from '@/lib/db';
import { serviceUnavailable } from '@/lib/http';

export async function GET(request: NextRequest) {
  if (!process.env.DATABASE_URL) return serviceUnavailable();
  const shoppingSlug = request.nextUrl.searchParams.get('shoppingSlug') ?? '';
  const scope = await getAdminShopping(shoppingSlug, ['SUPERADMIN', 'SHOPPING_OPERATOR']);
  if ('error' in scope) { const failure = authFailure(scope.error); return NextResponse.json({ error: failure.error }, { status: failure.statusCode }); }
  const rows = await prisma.card.findMany({ where: { shoppingId: scope.shopping.id }, include: { _count: { select: { participations: true } } }, orderBy: { publicId: 'asc' } });
  const escape = (value: string) => `"${value.replaceAll('"', '""')}"`;
  const csv = ['Tarjeta,Ubicación,Participaciones', ...rows.map((row) => `${escape(row.publicId)},${escape(row.location ?? '')},${row._count.participations}`)].join('\r\n');
  return new NextResponse(`\uFEFF${csv}`, { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="${scope.shopping.slug}-informe-tarjetas.csv"`, 'Cache-Control': 'no-store' } });
}
