import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { apiError, serviceUnavailable } from '@/lib/http';
import { participantCookieName } from '@/lib/participants';
import { checkRateLimit } from '@/lib/rate-limit';
import { decryptCode, sha256 } from '@/lib/security';

const query = z.object({ shoppingSlug: z.enum(['centenario', 'uniplaza']) });

type CouponState = 'available' | 'redeemed' | 'expired' | 'void';

/**
 * Cupones del participante actual. La identidad es la misma cookie httpOnly que usa la participación;
 * si no existe, no se crea sesión y la lista es vacía. Solo se entrega código y QR mientras el cupón
 * está disponible: los vencidos, canjeados y anulados nunca vuelven a exponerlo.
 */
export async function GET(request: NextRequest) {
  if (!process.env.DATABASE_URL) return serviceUnavailable();
  try {
    const { shoppingSlug } = query.parse(Object.fromEntries(request.nextUrl.searchParams));
    const headers = { 'Cache-Control': 'private, no-store' };
    const token = request.cookies.get(participantCookieName)?.value;
    if (!token) return NextResponse.json({ coupons: [] }, { headers });

    const clientIp = request.headers.get('x-real-ip') ?? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
    const limit = await checkRateLimit(`coupons:${sha256(token)}:${sha256(clientIp)}`, 60, 15 * 60_000);
    if (!limit.allowed) return NextResponse.json({ error: 'Hiciste varias consultas seguidas. Probá de nuevo en unos minutos.', code: 'RATE_LIMITED' }, { status: 429, headers });

    const rows = await prisma.redeemCode.findMany({
      where: { shopping: { slug: shoppingSlug, active: true }, participation: { participant: { sessionHash: sha256(token) } } },
      orderBy: { createdAt: 'desc' },
      take: 30,
      select: {
        id: true, status: true, expiresAt: true, redeemedAt: true, codeEncrypted: true, createdAt: true,
        prize: { select: { name: true, description: true, merchants: { where: { merchant: { active: true } }, select: { merchant: { select: { name: true } } } } } },
        campaign: { select: { name: true } },
      },
    });

    const now = new Date();
    const coupons = await Promise.all(rows.map(async (row) => {
      const state: CouponState = row.status === 'REDEEMED' ? 'redeemed' : row.status === 'REVOKED' ? 'void' : row.status === 'EXPIRED' || row.expiresAt <= now ? 'expired' : 'available';
      const code = state === 'available' ? decryptCode(row.codeEncrypted) : undefined;
      return {
        id: row.id,
        state,
        prize: { name: row.prize.name, description: row.prize.description },
        campaign: row.campaign.name,
        merchants: row.prize.merchants.map(({ merchant }) => merchant.name),
        expiresAt: row.expiresAt.toISOString(),
        redeemedAt: row.redeemedAt?.toISOString() ?? null,
        code,
        qr: code ? await QRCode.toDataURL(code, { width: 240, margin: 2, errorCorrectionLevel: 'M' }) : undefined,
      };
    }));
    return NextResponse.json({ coupons }, { headers });
  } catch (error) { return apiError(error); }
}
