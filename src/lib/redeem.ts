import { prisma } from '@/lib/db';
import { sha256 } from '@/lib/security';
import { logAudit } from '@/lib/admin';

export class RedeemError extends Error {
  constructor(
    public code:
      | 'INVALID_CODE'
      | 'ALREADY_REDEEMED'
      | 'CODE_EXPIRED'
      | 'CODE_REVOKED'
      | 'OFFER_UNAVAILABLE'
      | 'MERCHANT_NOT_AUTHORIZED',
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

export async function validateRedemption(input: {
  shoppingId: string;
  actorId: string;
  code: string;
  merchantId?: string;
}) {
  const redeemCode = await prisma.redeemCode.findFirst({
    where: { codeHash: sha256(input.code), shoppingId: input.shoppingId },
    include: {
      prize: {
        select: { id: true, name: true, description: true, active: true, merchants: { select: { merchantId: true } } },
      },
      campaign: { select: { name: true, status: true, startsAt: true, endsAt: true } },
    },
  });
  if (!redeemCode) throw new RedeemError('INVALID_CODE', 'Código inválido.', 404);
  if (input.merchantId && !redeemCode.prize.merchants.some((m) => m.merchantId === input.merchantId)) {
    throw new RedeemError('MERCHANT_NOT_AUTHORIZED', 'Premio no habilitado para este comercio.', 403);
  }
  if (redeemCode.status === 'REDEEMED') {
    if (
      redeemCode.redeemedMerchantId === input.merchantId &&
      redeemCode.redeemedById === input.actorId &&
      redeemCode.redeemedAt
    ) {
      return {
        ok: true,
        prize: redeemCode.prize,
        campaign: redeemCode.campaign.name,
        redeemedAt: redeemCode.redeemedAt.toISOString(),
        alreadyRedeemed: true,
      };
    }
    throw new RedeemError('ALREADY_REDEEMED', 'Cupón ya utilizado.', 409);
  }
  const now = new Date();
  if (redeemCode.status === 'REVOKED') {
    throw new RedeemError('CODE_REVOKED', 'Cupón anulado. Pedile al cliente que consulte con el shopping.', 410);
  }
  if (redeemCode.status !== 'ISSUED' || redeemCode.expiresAt <= now) {
    throw new RedeemError('CODE_EXPIRED', 'Cupón vencido.', 410);
  }
  if (
    !redeemCode.prize.active ||
    redeemCode.campaign.status !== 'ACTIVE' ||
    redeemCode.campaign.startsAt > now ||
    redeemCode.campaign.endsAt <= now
  ) {
    throw new RedeemError('OFFER_UNAVAILABLE', 'La campaña o el premio ya no están vigentes.', 410);
  }

  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      return await prisma.$transaction(
        async (tx) => {
          const redeemedAt = new Date();
          const current = await tx.redeemCode.findFirst({
            where: { id: redeemCode.id, shoppingId: input.shoppingId },
            include: {
              campaign: { select: { status: true, startsAt: true, endsAt: true, name: true } },
              prize: { select: { active: true, name: true, merchants: { select: { merchantId: true } } } },
            },
          });
          if (!current) throw new RedeemError('INVALID_CODE', 'Código inválido.', 404);
          if (input.merchantId && !current.prize.merchants.some((m) => m.merchantId === input.merchantId)) {
            throw new RedeemError('MERCHANT_NOT_AUTHORIZED', 'Premio no habilitado para este comercio.', 403);
          }
          if (current.status !== 'ISSUED') {
            if (current.status === 'REDEEMED') {
              if (
                current.redeemedMerchantId === input.merchantId &&
                current.redeemedById === input.actorId &&
                current.redeemedAt
              ) {
                return {
                  ok: true,
                  prize: current.prize,
                  campaign: current.campaign.name,
                  redeemedAt: current.redeemedAt.toISOString(),
                  alreadyRedeemed: true,
                };
              }
              throw new RedeemError('ALREADY_REDEEMED', 'Cupón ya utilizado.', 409);
            }
            if (current.status === 'REVOKED') {
              throw new RedeemError('CODE_REVOKED', 'Cupón anulado. Pedile al cliente que consulte con el shopping.', 410);
            }
            throw new RedeemError('CODE_EXPIRED', 'Cupón vencido.', 410);
          }
          if (current.expiresAt <= redeemedAt) throw new RedeemError('CODE_EXPIRED', 'Cupón vencido.', 410);
          if (
            !current.prize.active ||
            current.campaign.status !== 'ACTIVE' ||
            current.campaign.startsAt > redeemedAt ||
            current.campaign.endsAt <= redeemedAt
          ) {
            throw new RedeemError('OFFER_UNAVAILABLE', 'La campaña o el premio ya no están vigentes.', 410);
          }
          const changed = await tx.redeemCode.updateMany({
            where: { id: redeemCode.id, shoppingId: input.shoppingId, status: 'ISSUED', expiresAt: { gt: redeemedAt } },
            data: {
              status: 'REDEEMED',
              redeemedAt,
              redeemedById: input.actorId,
              redeemedMerchantId: input.merchantId ?? null,
            },
          });
          if (changed.count !== 1) {
            const recheck = await tx.redeemCode.findUnique({ where: { id: redeemCode.id } });
            if (
              recheck?.status === 'REDEEMED' &&
              recheck.redeemedMerchantId === input.merchantId &&
              recheck.redeemedById === input.actorId &&
              recheck.redeemedAt
            ) {
              return {
                ok: true,
                prize: current.prize,
                campaign: current.campaign.name,
                redeemedAt: recheck.redeemedAt.toISOString(),
                alreadyRedeemed: true,
              };
            }
            throw new RedeemError('ALREADY_REDEEMED', 'Cupón ya utilizado.', 409);
          }
          await tx.participation.update({ where: { id: redeemCode.participationId }, data: { status: 'REDEEMED' } });
          await tx.event.create({
            data: {
              eventType: 'REDEEMED',
              campaignId: redeemCode.campaignId,
              shoppingId: redeemCode.shoppingId,
              metadata: { prizeId: redeemCode.prizeId, ...(input.merchantId ? { merchantId: input.merchantId } : {}) },
            },
          });
          await logAudit(tx, {
            actorId: input.actorId,
            shoppingId: input.shoppingId,
            campaignId: redeemCode.campaignId,
            action: 'REDEEMED',
            entityType: 'RedeemCode',
            entityId: redeemCode.id,
            metadata: { prizeId: redeemCode.prizeId, ...(input.merchantId ? { merchantId: input.merchantId } : {}) },
          });
          return {
            ok: true,
            prize: redeemCode.prize,
            campaign: redeemCode.campaign.name,
            redeemedAt: redeemedAt.toISOString(),
          };
        },
        { isolationLevel: 'Serializable' },
      );
    } catch (error) {
      if (error instanceof RedeemError) throw error;
      if (error && typeof error === 'object' && 'code' in error && error.code === 'P2034') {
        if (attempt < 3) {
          await new Promise((resolve) => setTimeout(resolve, 15 + Math.random() * 25 * (attempt + 1)));
          continue;
        }
        const recheck = await prisma.redeemCode.findFirst({ where: { id: redeemCode.id } });
        if (
          recheck?.status === 'REDEEMED' &&
          recheck.redeemedMerchantId === input.merchantId &&
          recheck.redeemedById === input.actorId &&
          recheck.redeemedAt
        ) {
          return {
            ok: true,
            prize: redeemCode.prize,
            campaign: redeemCode.campaign.name,
            redeemedAt: recheck.redeemedAt.toISOString(),
            alreadyRedeemed: true,
          };
        }
        throw new RedeemError('ALREADY_REDEEMED', 'Cupón ya utilizado.', 409);
      }
      throw error;
    }
  }
  throw new RedeemError('ALREADY_REDEEMED', 'Cupón ya utilizado.', 409);
}
