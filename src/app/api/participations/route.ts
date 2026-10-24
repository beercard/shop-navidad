import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { GameError, playCard } from '@/lib/game';
import { apiError, serviceUnavailable } from '@/lib/http';
import { readParticipantToken, setParticipantCookie } from '@/lib/participants';
import { checkRateLimit } from '@/lib/rate-limit';
import { sha256 } from '@/lib/security';
import QRCode from 'qrcode';

const schema = z.object({ shoppingSlug: z.string().min(1).max(80), cardId: z.string().trim().min(1).max(40), idempotencyKey: z.string().uuid().optional() });

export async function POST(request: NextRequest) {
  if (!process.env.DATABASE_URL) return serviceUnavailable();
  if (request.headers.get('origin')) {
    const expected = process.env.APP_URL ? new URL(process.env.APP_URL).origin : request.nextUrl.origin;
    const allowedOrigins = new Set([expected, request.nextUrl.origin]);
    if (process.env.VERCEL_URL) allowedOrigins.add(`https://${process.env.VERCEL_URL}`);
    if (process.env.VERCEL_BRANCH_URL) allowedOrigins.add(`https://${process.env.VERCEL_BRANCH_URL}`);
    const origin = new URL(request.headers.get('origin')!).origin;
    const originUrl = new URL(origin);
    const isLoopback = ['localhost', '127.0.0.1', '[::1]', '::1'].includes(originUrl.hostname.toLowerCase());
    const qaLoopbackAllowed = process.env.QA_MODE === 'true' && process.env.NODE_ENV !== 'production' && isLoopback;
    if (!allowedOrigins.has(origin) && !qaLoopbackAllowed) return NextResponse.json({ error: 'Origen no permitido.', code: 'INVALID_ORIGIN' }, { status: 403 });
  }
  let token = readParticipantToken(request);
  try {
    const payload = schema.parse(await request.json());
    token = readParticipantToken(request);
    const clientIp = request.headers.get('x-real-ip') ?? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
    const limit = await checkRateLimit(`play:${sha256(clientIp)}:${payload.shoppingSlug}`, 20, 15 * 60_000);
    if (!limit.allowed) return NextResponse.json({ error: 'Hiciste varios intentos seguidos. Esperá un rato y probá otra vez.', code: 'RATE_LIMITED' }, { status: 429 });
    const result = await playCard({ ...payload, token, idempotencyKey: payload.idempotencyKey ?? randomUUID() });
    const redeemQr = result.redeemCode ? await QRCode.toDataURL(result.redeemCode, { width: 240, margin: 2, errorCorrectionLevel: 'M' }) : undefined;
    const response = NextResponse.json({ ...result, redeemQr }, { headers: { 'Cache-Control': 'private, no-store' } });
    setParticipantCookie(response, token);
    return response;
  } catch (error) {
    if (error instanceof GameError) return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
    return apiError(error);
  }
}
