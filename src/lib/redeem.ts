import { prisma } from '@/lib/db';
import { sha256 } from '@/lib/security';
import { logAudit } from '@/lib/admin';

export class RedeemError extends Error {
  constructor(public code: 'INVALID_CODE' | 'ALREADY_REDEEMED' | 'CODE_EXPIRED', message: string, public status: number) { super(message); }
}

export async function validateRedemption(input: { shoppingId: string; actorId: string; code: string }) {
  const redeemCode = await prisma.redeemCode.findFirst({
    where: { codeHash: sha256(input.code), shoppingId: input.shoppingId },
    include: { prize: { select: { name: true, description: true } }, campaign: { select: { name: true } } },
  });
  if (!redeemCode) throw new RedeemError('INVALID_CODE', 'El código no es válido para este shopping.', 404);
  if (redeemCode.status === 'REDEEMED') throw new RedeemError('ALREADY_REDEEMED', 'Este código ya fue utilizado.', 409);
  if (redeemCode.status !== 'ISSUED' || redeemCode.expiresAt <= new Date()) throw new RedeemError('CODE_EXPIRED', 'Este código venció o ya no está disponible.', 410);
  try {
    return await prisma.$transaction(async (tx) => {
      const redeemedAt = new Date();
      const changed = await tx.redeemCode.updateMany({ where: { id: redeemCode.id, status: 'ISSUED', expiresAt: { gt: redeemedAt } }, data: { status: 'REDEEMED', redeemedAt, redeemedById: input.actorId } });
      if (changed.count !== 1) throw new RedeemError('ALREADY_REDEEMED', 'Este código ya fue utilizado.', 409);
      await tx.participation.update({ where: { id: redeemCode.participationId }, data: { status: 'REDEEMED' } });
      await tx.event.create({ data: { eventType: 'REDEEMED', campaignId: redeemCode.campaignId, shoppingId: redeemCode.shoppingId, metadata: { prizeId: redeemCode.prizeId } } });
      await logAudit(tx, { actorId: input.actorId, shoppingId: input.shoppingId, campaignId: redeemCode.campaignId, action: 'REDEEMED', entityType: 'RedeemCode', entityId: redeemCode.id, metadata: { prizeId: redeemCode.prizeId } });
      return { ok: true, prize: redeemCode.prize, campaign: redeemCode.campaign.name, redeemedAt: redeemedAt.toISOString() };
    });
  } catch (error) {
    if (error instanceof RedeemError) throw error;
    throw error;
  }
}
