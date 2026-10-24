import { randomUUID } from 'node:crypto';
import type { NextRequest, NextResponse } from 'next/server';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
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
