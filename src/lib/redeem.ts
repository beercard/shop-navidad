import { prisma } from '@/lib/db';
import { sha256 } from '@/lib/security';
import { logAudit } from '@/lib/admin';

export class RedeemError extends Error {
  constructor(public code: 'INVALID_CODE' | 'ALREADY_REDEEMED' | 'CODE_EXPIRED' | 'OFFER_UNAVAILABLE', message: string, public status: number) { super(message); }
}

export async function validateRedemption(input: { shoppingId: string; actorId: string; code: string; merchantId?: string }) {
  const redeemCode = await prisma.redeemCode.findFirst({
    where: { codeHash: sha256(input.code), shoppingId: input.shoppingId, ...(input.merchantId ? { prize: { merchants: { some: { merchantId: input.merchantId } } } } : {}) },
    include: { prize: { select: { name: true, description: true, active: true } }, campaign: { select: { name: true, status: true, startsAt: true, endsAt: true } } },
  });
  if (!redeemCode) throw new RedeemError('INVALID_CODE', 'El código no es válido para este shopping.', 404);
  if (redeemCode.status === 'REDEEMED') throw new RedeemError('ALREADY_REDEEMED', 'Este código ya fue utilizado.', 409);
  const now = new Date();
  if (redeemCode.status !== 'ISSUED' || redeemCode.expiresAt <= now) throw new RedeemError('CODE_EXPIRED', 'Este código venció o ya no está disponible.', 410);
  if (!redeemCode.prize.active || redeemCode.campaign.status !== 'ACTIVE' || redeemCode.campaign.startsAt > now || redeemCode.campaign.endsAt <= now) throw new RedeemError('OFFER_UNAVAILABLE', 'La campaña o el premio ya no están vigentes.', 410);
  try {
    return await prisma.$transaction(async (tx) => {
      const redeemedAt = new Date();
      const current = await tx.redeemCode.findFirst({ where: { id: redeemCode.id, shoppingId: input.shoppingId, ...(input.merchantId ? { prize: { merchants: { some: { merchantId: input.merchantId } } } } : {}) }, include: { campaign: { select: { status: true, startsAt: true, endsAt: true } }, prize: { select: { active: true } } } });
      if (!current || current.status !== 'ISSUED') {
        if (current?.status === 'REDEEMED') throw new RedeemError('ALREADY_REDEEMED', 'Este código ya fue utilizado.', 409);
        if (current) throw new RedeemError('CODE_EXPIRED', 'Este código venció o ya no está disponible.', 410);
        throw new RedeemError('INVALID_CODE', 'El código no es válido para este comercio.', 404);
      }
      if (current.expiresAt <= redeemedAt) throw new RedeemError('CODE_EXPIRED', 'Este código venció o ya no está disponible.', 410);
      if (!current.prize.active || current.campaign.status !== 'ACTIVE' || current.campaign.startsAt > redeemedAt || current.campaign.endsAt <= redeemedAt) throw new RedeemError('OFFER_UNAVAILABLE', 'La campaña o el premio ya no están vigentes.', 410);
      const changed = await tx.redeemCode.updateMany({ where: { id: redeemCode.id, shoppingId: input.shoppingId, status: 'ISSUED', expiresAt: { gt: redeemedAt } }, data: { status: 'REDEEMED', redeemedAt, redeemedById: input.actorId, redeemedMerchantId: input.merchantId ?? null } });
      if (changed.count !== 1) throw new RedeemError('ALREADY_REDEEMED', 'Este código ya fue utilizado.', 409);
      await tx.participation.update({ where: { id: redeemCode.participationId }, data: { status: 'REDEEMED' } });
      await tx.event.create({ data: { eventType: 'REDEEMED', campaignId: redeemCode.campaignId, shoppingId: redeemCode.shoppingId, metadata: { prizeId: redeemCode.prizeId, ...(input.merchantId ? { merchantId: input.merchantId } : {}) } } });
      await logAudit(tx, { actorId: input.actorId, shoppingId: input.shoppingId, campaignId: redeemCode.campaignId, action: 'REDEEMED', entityType: 'RedeemCode', entityId: redeemCode.id, metadata: { prizeId: redeemCode.prizeId, ...(input.merchantId ? { merchantId: input.merchantId } : {}) } });
      return { ok: true, prize: redeemCode.prize, campaign: redeemCode.campaign.name, redeemedAt: redeemedAt.toISOString() };
    }, { isolationLevel: 'Serializable' });
  } catch (error) {
    if (error instanceof RedeemError) throw error;
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2034') throw new RedeemError('ALREADY_REDEEMED', 'El estado de este código cambió. Consultalo nuevamente antes de continuar.', 409);
    throw error;
  }
}
