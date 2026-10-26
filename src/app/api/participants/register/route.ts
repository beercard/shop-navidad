import { getClientIp } from '@/lib/client-ip';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { apiError, serviceUnavailable } from '@/lib/http';
import {
  readParticipantToken,
  registerOrRecoverParticipant,
  setParticipantCookie,
} from '@/lib/participants';

const registerSchema = z.object({
  shoppingSlug: z.string().trim().min(1).max(80),
  campaignSlug: z.string().trim().min(1).max(80).optional(),
  phone: z.string().trim().min(1).max(40),
  consent: z.boolean(),
  consentVersion: z.string().trim().min(1).max(40).optional(),
  recoveryCode: z.string().trim().min(4).max(30).optional(),
});

export async function POST(request: NextRequest) {
  if (!process.env.DATABASE_URL) return serviceUnavailable();

  // Origin check / CSRF protection
  if (request.headers.get('origin')) {
    const expected = process.env.APP_URL ? new URL(process.env.APP_URL).origin : request.nextUrl.origin;
    const allowedOrigins = new Set([expected, request.nextUrl.origin]);
    if (process.env.VERCEL_URL) allowedOrigins.add(`https://${process.env.VERCEL_URL}`);
    if (process.env.VERCEL_BRANCH_URL) allowedOrigins.add(`https://${process.env.VERCEL_BRANCH_URL}`);
    const origin = new URL(request.headers.get('origin')!).origin;
    const originUrl = new URL(origin);
    const isLoopback = ['localhost', '127.0.0.1', '[::1]', '::1'].includes(originUrl.hostname.toLowerCase());
    const qaLoopbackAllowed = process.env.QA_MODE === 'true' && process.env.NODE_ENV !== 'production' && isLoopback;
    if (!allowedOrigins.has(origin) && !qaLoopbackAllowed) {
      return NextResponse.json({ error: 'Origen no permitido.', code: 'INVALID_ORIGIN' }, { status: 403 });
    }
  }

  const token = readParticipantToken(request);
  const clientIp =
    getClientIp(request);

  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return NextResponse.json(
        { error: firstIssue?.message ?? 'Datos de registro incompletos.', code: 'INVALID_PAYLOAD' },
        { status: 400 },
      );
    }

    const result = await registerOrRecoverParticipant({
      token,
      shoppingSlug: parsed.data.shoppingSlug,
      campaignSlug: parsed.data.campaignSlug,
      phone: parsed.data.phone,
      consent: parsed.data.consent,
      consentVersion: parsed.data.consentVersion,
      recoveryCode: parsed.data.recoveryCode,
      clientIp,
    });

    if (!result.success) {
      const statusCode =
        result.status === 'existing_phone'
          ? 409
          : result.status === 'invalid_recovery_code'
            ? 403
            : result.status === 'rate_limited'
              ? 429
              : 400;

      const errorRes = NextResponse.json(
        {
          error: result.error,
          code: result.code,
          status: result.status,
          requiresRecoveryCode: Boolean(result.requiresRecoveryCode),
        },
        { status: statusCode, headers: { 'Cache-Control': 'private, no-store' } },
      );
      setParticipantCookie(errorRes, token);
      return errorRes;
    }

    const response = NextResponse.json(result, {
      status: 200,
      headers: { 'Cache-Control': 'private, no-store' },
    });
    setParticipantCookie(response, token);
    return response;
  } catch (error) {
    return apiError(error);
  }
}
