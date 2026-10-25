import { randomBytes, randomUUID } from 'node:crypto';
import type { NextRequest, NextResponse } from 'next/server';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
import { maskPhone, normalizePhone } from '@/lib/phone';
import { checkRateLimit } from '@/lib/rate-limit';
import { sha256 } from '@/lib/security';

export const participantCookieName = 'navidad_player_session';

export function readParticipantToken(request: NextRequest) {
  return request.cookies.get(participantCookieName)?.value ?? randomUUID();
}

export function setParticipantCookie(response: NextResponse, token: string) {
  response.cookies.set(participantCookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 180,
  });
}

/**
 * Genera un código de rescate legible y seguro de 8 caracteres alfanuméricos.
 * Ej: REC-4B9X-72KY
 */
export function generateRecoveryCode(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // Excluye 0, O, 1, I para evitar ambigüedades visuales
  const bytes = randomBytes(8);
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars[bytes[i] % chars.length];
  }
  return `REC-${code.slice(0, 4)}-${code.slice(4)}`;
}

export function hashRecoveryCode(code: string): string {
  const clean = code.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  return sha256(`recovery_code:v1:${clean}`);
}

export async function findOrCreateParticipant(
  db: Prisma.TransactionClient | typeof prisma,
  token: string,
  campaignId: string,
  shoppingId: string,
) {
  const sessionHash = sha256(token);
  return db.participant.upsert({
    where: { sessionHash_campaignId_shoppingId: { sessionHash, campaignId, shoppingId } },
    create: { sessionHash, campaignId, shoppingId },
    update: {},
  });
}

export type PreregistrationInput = {
  token: string;
  shoppingSlug: string;
  campaignSlug?: string;
  phone: string;
  consent: boolean;
  consentVersion?: string;
  recoveryCode?: string;
  clientIp?: string;
};

export type PreregistrationResult =
  | {
      success: true;
      status: 'registered' | 'already_registered' | 'recovered';
      participantId: string;
      phone: string;
      maskedPhone: string;
      recoveryCode?: string;
      message: string;
    }
  | {
      success: false;
      status: 'invalid_input' | 'existing_phone' | 'invalid_recovery_code' | 'rate_limited' | 'campaign_not_found';
      code: string;
      error: string;
      requiresRecoveryCode?: boolean;
    };

export async function registerOrRecoverParticipant(input: PreregistrationInput): Promise<PreregistrationResult> {
  const clientIp = input.clientIp ?? 'unknown';

  // 1. Rate limiting por IP (máximo 20 intentos de registro cada 15 minutos)
  const ipLimit = await checkRateLimit(`phone-reg:ip:${sha256(clientIp)}`, 20, 15 * 60_000);
  if (!ipLimit.allowed) {
    return {
      success: false,
      status: 'rate_limited',
      code: 'RATE_LIMITED',
      error: 'Muchos intentos seguidos. Por favor esperá unos minutos antes de volver a intentar.',
    };
  }

  // 2. Validación de aceptación de términos
  if (!input.consent) {
    return {
      success: false,
      status: 'invalid_input',
      code: 'CONSENT_REQUIRED',
      error: 'Debés aceptar las Bases y Condiciones y el Aviso de Privacidad para participar.',
    };
  }

  // 3. Normalización del celular
  const norm = normalizePhone(input.phone);
  if (!norm.valid || !norm.e164) {
    return {
      success: false,
      status: 'invalid_input',
      code: 'INVALID_PHONE',
      error: norm.error ?? 'Número de celular inválido.',
    };
  }

  const phoneE164 = norm.e164;
  const phoneHash = sha256(phoneE164);

  // 4. Rate limiting por teléfono normalizado (máximo 10 intentos cada 15 minutos)
  const phoneLimit = await checkRateLimit(`phone-reg:phone:${phoneHash}`, 10, 15 * 60_000);
  if (!phoneLimit.allowed) {
    return {
      success: false,
      status: 'rate_limited',
      code: 'RATE_LIMITED',
      error: 'Demasiadas solicitudes para este número. Esperá unos minutos.',
    };
  }

  // 5. Resolver shopping y campaña activa
  const shopping = await prisma.shopping.findUnique({
    where: { slug: input.shoppingSlug },
    select: { id: true, slug: true, active: true },
  });
  if (!shopping?.active) {
    return {
      success: false,
      status: 'campaign_not_found',
      code: 'SHOPPING_NOT_FOUND',
      error: 'No se encontró el shopping especificado.',
    };
  }

  const now = new Date();
  const campaign = await prisma.campaign.findFirst({
    where: {
      shoppingId: shopping.id,
      ...(input.campaignSlug ? { slug: input.campaignSlug } : {}),
      status: 'ACTIVE',
      startsAt: { lte: now },
      endsAt: { gt: now },
    },
    select: { id: true, slug: true },
  });
  if (!campaign) {
    return {
      success: false,
      status: 'campaign_not_found',
      code: 'CAMPAIGN_NOT_ACTIVE',
      error: 'No hay una campaña activa en este shopping en este momento.',
    };
  }

  const currentSessionHash = sha256(input.token);

  // 6. Transacción para registro o recuperación segura
  return prisma.$transaction(async (tx) => {
    // Buscar si ya existe un participante con este teléfono en esta campaña
    const existingByPhone = await tx.participant.findFirst({
      where: {
        shoppingId: shopping.id,
        campaignId: campaign.id,
        phoneHash,
      },
    });

    if (existingByPhone) {
      // Caso A: La sesión actual ya coincide con este participante
      if (existingByPhone.sessionHash === currentSessionHash) {
        return {
          success: true,
          status: 'already_registered',
          participantId: existingByPhone.id,
          phone: phoneE164,
          maskedPhone: maskPhone(phoneE164),
          message: 'Tu celular ya está registrado en este dispositivo.',
        };
      }

      // Caso B: El teléfono está registrado pero en otra sesión (otro celular o cookies borradas)
      // Si no proporcionó código de recuperación, denegar toma de control sin exponer datos
      if (!input.recoveryCode) {
        return {
          success: false,
          status: 'existing_phone',
          code: 'RECOVERY_REQUIRED',
          error: 'Este número de celular ya está participando en esta campaña. Si cambiaste de dispositivo, ingresá tu código de recuperación para acceder a tus cupones.',
          requiresRecoveryCode: true,
        };
      }

      // Verificar código de recuperación
      const inputRecoveryHash = hashRecoveryCode(input.recoveryCode);
      if (!existingByPhone.recoveryCodeHash || existingByPhone.recoveryCodeHash !== inputRecoveryHash) {
        return {
          success: false,
          status: 'invalid_recovery_code',
          code: 'INVALID_RECOVERY_CODE',
          error: 'El código de recuperación ingresado es incorrecto. Verificalo e intentá de nuevo.',
          requiresRecoveryCode: true,
        };
      }

      // Código de recuperación válido: transferir sesión actual al participante legítimo
      await tx.participant.update({
        where: { id: existingByPhone.id },
        data: {
          sessionHash: currentSessionHash,
          updatedAt: now,
        },
      });

      await tx.event.create({
        data: {
          eventType: 'PARTICIPANT_RECOVERED',
          shoppingId: shopping.id,
          campaignId: campaign.id,
          participantId: existingByPhone.id,
          metadata: {
            phoneMasked: maskPhone(phoneE164),
            clientIp: sha256(clientIp),
          },
        },
      });

      return {
        success: true,
        status: 'recovered',
        participantId: existingByPhone.id,
        phone: phoneE164,
        maskedPhone: maskPhone(phoneE164),
        message: '¡Cuenta recuperada exitosamente! Tu progreso y cupones ya están vinculados a este dispositivo.',
      };
    }

    // Caso C: El teléfono no existe en esta campaña. Procedemos al registro nuevo.
    const recoveryCode = generateRecoveryCode();
    const recoveryCodeHash = hashRecoveryCode(recoveryCode);

    // Verificar si para la sesión actual ya se había creado un participante anónimo (ej. por navegación previa)
    const existingBySession = await tx.participant.findUnique({
      where: {
        sessionHash_campaignId_shoppingId: {
          sessionHash: currentSessionHash,
          campaignId: campaign.id,
          shoppingId: shopping.id,
        },
      },
    });

    let participantId: string;

    if (existingBySession) {
      const updated = await tx.participant.update({
        where: { id: existingBySession.id },
        data: {
          phone: phoneE164,
          phoneNormalized: phoneE164,
          phoneHash,
          recoveryCodeHash,
          consentAt: now,
          consentVersion: input.consentVersion ?? '2026-v1',
          updatedAt: now,
        },
      });
      participantId = updated.id;
    } else {
      const created = await tx.participant.create({
        data: {
          sessionHash: currentSessionHash,
          shoppingId: shopping.id,
          campaignId: campaign.id,
          phone: phoneE164,
          phoneNormalized: phoneE164,
          phoneHash,
          recoveryCodeHash,
          consentAt: now,
          consentVersion: input.consentVersion ?? '2026-v1',
        },
      });
      participantId = created.id;
    }

    await tx.event.create({
      data: {
        eventType: 'PARTICIPANT_REGISTERED',
        shoppingId: shopping.id,
        campaignId: campaign.id,
        participantId,
        metadata: {
          phoneMasked: maskPhone(phoneE164),
          clientIp: sha256(clientIp),
        },
      },
    });

    return {
      success: true,
      status: 'registered',
      participantId,
      phone: phoneE164,
      maskedPhone: maskPhone(phoneE164),
      recoveryCode,
      message: '¡Registro completado! Tu celular quedó vinculado para participar y gestionar premios.',
    };
  });
}

export async function readCollectionProgress(
  participantId: string,
  campaignId: string,
  db: Prisma.TransactionClient | typeof prisma = prisma,
) {
  const progress = await db.collectionProgress.findUnique({
    where: { participantId_campaignId: { participantId, campaignId } },
    include: { cards: { select: { card: { select: { publicId: true } } } } },
  });
  const cardIds = progress?.cards.map(({ card }) => card.publicId) ?? [];
  return { count: cardIds.length, cardIds };
}
