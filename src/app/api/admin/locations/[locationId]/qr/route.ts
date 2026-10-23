import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { authFailure, getAdminShopping } from '@/lib/admin';
import { prisma } from '@/lib/db';
import { apiError, serviceUnavailable } from '@/lib/http';
import { getPublicBaseUrl } from '@/lib/public-base-url';

export async function GET(request: NextRequest, context: { params: Promise<{ locationId: string }> }) {
  if (!process.env.DATABASE_URL) return serviceUnavailable();
  try {
    const { locationId } = await context.params;
    const scope = await getAdminShopping(request.nextUrl.searchParams.get('shoppingSlug') ?? '', ['SUPERADMIN', 'SHOPPING_OPERATOR']);
    if ('error' in scope) { const failure = authFailure(scope.error); return NextResponse.json({ error: failure.error }, { status: failure.statusCode }); }
    const location = await prisma.location.findFirst({ where: { id: locationId, shoppingId: scope.shopping.id, active: true, shopping: { active: true } }, select: { slug: true } });
    if (!location) return NextResponse.json({ error: 'No encontramos una ubicación activa para este shopping.' }, { status: 404, headers: { 'Cache-Control': 'no-store' } });
    const url = new URL(`/nfc/${scope.shopping.slug}/${location.slug}`, getPublicBaseUrl()).toString();
    const svg = await QRCode.toString(url, { type: 'svg', width: 480, margin: 4, errorCorrectionLevel: 'H' });
    return new NextResponse(svg, { headers: { 'Content-Type': 'image/svg+xml; charset=utf-8', 'Content-Disposition': `attachment; filename="${scope.shopping.slug}-${location.slug}-qr.svg"`, 'Cache-Control': 'private, no-store' } });
  } catch (error) { return apiError(error); }
}
