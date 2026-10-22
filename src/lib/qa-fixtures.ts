import { randomUUID } from 'node:crypto';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
import { logAudit } from '@/lib/admin';
import { GameError, playCard } from '@/lib/game';
import { RedeemError, validateRedemption } from '@/lib/redeem';
import { sha256 } from '@/lib/security';

export const qaShops = [
  { slug: 'centenario', name: 'Centenario Shopping', prefix: 'CEN' },
  { slug: 'uniplaza', name: 'UniPlaza Shopping', prefix: 'UNI' },
] as const;

export async function resetQaFixtures(actorId: string) {
  const created = await prisma.$transaction(async (tx) => {
    const shops = await Promise.all(qaShops.map((shop) => tx.shopping.upsert({
      where: { slug: shop.slug }, update: { name: shop.name }, create: { slug: shop.slug, name: shop.name },
    })));
    const fixtures: { shoppingId: string; slug: string; campaignId: string; cards: { id: string; publicId: string }[]; prizes: { id: string; name: string; totalStock: number; remainingStock: number }[] }[] = [];
    for (const [index, shopConfig] of qaShops.entries()) {
      const shop = shops[index];
      const campaignSlug = `qa-${shopConfig.slug}-campaign`;
      const oldCampaigns = await tx.campaign.findMany({ where: { slug: campaignSlug }, select: { id: true } });
      const ids = oldCampaigns.map(({ id }) => id);
      if (ids.length) {
        const progress = await tx.collectionProgress.findMany({ where: { campaignId: { in: ids } }, select: { id: true } });
        const progressIds = progress.map(({ id }) => id);
        await tx.redeemCode.deleteMany({ where: { campaignId: { in: ids } } });
        await tx.participation.deleteMany({ where: { campaignId: { in: ids } } });
        if (progressIds.length) await tx.collectionCard.deleteMany({ where: { progressId: { in: progressIds } } });
        await tx.collectionProgress.deleteMany({ where: { campaignId: { in: ids } } });
        await tx.event.deleteMany({ where: { campaignId: { in: ids } } });
        // Keep QA run history when replacing the fixture campaign; detach its optional FK first.
        await tx.auditLog.updateMany({ where: { campaignId: { in: ids }, entityType: 'QaRun' }, data: { campaignId: null } });
        await tx.inventoryMovement.deleteMany({ where: { campaignId: { in: ids } } });
        await tx.clue.deleteMany({ where: { campaignId: { in: ids } } });
        await tx.card.deleteMany({ where: { campaignId: { in: ids } } });
        await tx.prize.deleteMany({ where: { campaignId: { in: ids } } });
        await tx.participant.deleteMany({ where: { campaignId: { in: ids } } });
        await tx.campaign.deleteMany({ where: { id: { in: ids } } });
      }
      const now = new Date();
      const campaign = await tx.campaign.create({ data: {
        slug: campaignSlug, shoppingId: shop.id, name: `QA · ${shop.name}`, description: 'Campaña aislada para pruebas; no usar en producción.',
        status: 'ACTIVE', startsAt: new Date(now.getTime() - 60 * 60_000), endsAt: new Date(now.getTime() + 30 * 86400_000),
        settings: { collectionTarget: 3, collectionUnlockText: 'Colección de prueba completada.' },
      } });
      const cards = await Promise.all([1, 2, 3].map((number) => tx.card.create({ data: {
        publicId: `QA-${shopConfig.prefix}-${String(number).padStart(2, '0')}`, shoppingId: shop.id, campaignId: campaign.id,
        location: `Zona de pruebas ${number}`, kind: number === 3 ? 'COLLECTION' : 'ROULETTE', status: 'ACTIVE',
      } })));
      const prizeRows = await Promise.all([
        tx.prize.create({ data: { campaignId: campaign.id, shoppingId: shop.id, name: `QA · Premio disponible ${shopConfig.prefix}`, description: 'Premio ficticio en base de pruebas.', totalStock: 25, remainingStock: 25, weight: 1, maxPerPerson: 3 } }),
        tx.prize.create({ data: { campaignId: campaign.id, shoppingId: shop.id, name: `QA · Última unidad ${shopConfig.prefix}`, description: 'Premio ficticio para concurrencia.', totalStock: 1, remainingStock: 1, weight: 1, maxPerPerson: 3 } }),
      ]);
      await tx.inventoryMovement.createMany({ data: prizeRows.map((prize) => ({ prizeId: prize.id, campaignId: campaign.id, shoppingId: shop.id, actorId, delta: prize.totalStock, reason: 'Restablecimiento de fixtures QA' })) });
      fixtures.push({ shoppingId: shop.id, slug: shop.slug, campaignId: campaign.id, cards: cards.map(({ id, publicId }) => ({ id, publicId })), prizes: prizeRows.map(({ id, name, totalStock, remainingStock }) => ({ id, name, totalStock, remainingStock })) });
    }
    await logAudit(tx, { actorId, action: 'QA_DATA_RESET', entityType: 'QaRun', entityId: 'all', metadata: { shops: fixtures.map(({ slug }) => slug), fixtureCampaigns: fixtures.length } });
    return fixtures;
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable, timeout: 20_000 });
  return created;
}

async function activateFixture(campaignId: string) {
  const now = new Date();
  await prisma.campaign.update({ where: { id: campaignId }, data: { status: 'ACTIVE', startsAt: new Date(now.getTime() - 60 * 60_000), endsAt: new Date(now.getTime() + 30 * 86400_000) } });
}

async function recordStock(prize: { id: string; totalStock: number }, campaignId: string, shoppingId: string, actorId: string, remainingStock: number, active = true) {
  const current = await prisma.prize.findUniqueOrThrow({ where: { id: prize.id }, select: { remainingStock: true } });
  await prisma.prize.update({ where: { id: prize.id }, data: { remainingStock, active } });
  const delta = remainingStock - current.remainingStock;
  if (delta) await prisma.inventoryMovement.create({ data: { prizeId: prize.id, campaignId, shoppingId, actorId, delta, reason: 'Ajuste de escenario QA' } });
}

export async function executeQaScenario(input: { actorId: string; shoppingSlug: string; scenario: string }) {
  const shop = qaShops.find(({ slug }) => slug === input.shoppingSlug);
  if (!shop) throw new Error('Shopping QA desconocido.');
  const fixture = await prisma.campaign.findUnique({ where: { slug: `qa-${shop.slug}-campaign` }, include: { cards: { orderBy: { publicId: 'asc' } }, prizes: { orderBy: { name: 'asc' } } } });
  if (!fixture) throw new Error('Restablecé los datos QA antes de correr escenarios.');
  if (!fixture.cards.length || fixture.prizes.length < 2) throw new Error('Los fixtures QA están incompletos. Restablecelos.');

  let expected = '';
  let observed: Record<string, unknown> = {};
  let passed = false;
  try {
    switch (input.scenario) {
    case 'all-available': {
      await activateFixture(fixture.id);
      for (const prize of fixture.prizes) await recordStock(prize, fixture.id, fixture.shoppingId, input.actorId, prize.totalStock, true);
      expected = 'Campaña activa y todos los premios con stock inicial.';
      observed = { campaign: 'ACTIVE', prizes: await prisma.prize.count({ where: { campaignId: fixture.id, active: true, remainingStock: { gt: 0 } } }) };
      passed = observed.prizes === fixture.prizes.length;
      break;
    }
    case 'one-exhausted': {
      await activateFixture(fixture.id);
      const target = fixture.prizes.find(({ name }) => name.includes('Última unidad'))!;
      await recordStock(target, fixture.id, fixture.shoppingId, input.actorId, 0, true);
      expected = 'El premio sin unidades debe mostrarse agotado; los demás conservan stock.';
      observed = { exhausted: (await prisma.prize.findUniqueOrThrow({ where: { id: target.id } })).remainingStock === 0, available: await prisma.prize.count({ where: { campaignId: fixture.id, remainingStock: { gt: 0 }, active: true } }) };
      passed = observed.exhausted === true && observed.available === fixture.prizes.length - 1;
      break;
    }
    case 'all-exhausted': {
      await activateFixture(fixture.id);
      for (const prize of fixture.prizes) await recordStock(prize, fixture.id, fixture.shoppingId, input.actorId, 0, true);
      expected = 'La campaña sigue disponible pero no ofrece premios con stock.';
      observed = { campaign: 'ACTIVE', available: await prisma.prize.count({ where: { campaignId: fixture.id, active: true, remainingStock: { gt: 0 } } }) };
      passed = observed.available === 0;
      break;
    }
    case 'campaign-inactive': {
      await prisma.campaign.update({ where: { id: fixture.id }, data: { status: 'PAUSED' } });
      expected = 'El backend debe rechazar una participación de una campaña pausada.';
      try { await playCard({ token: randomUUID(), shoppingSlug: shop.slug, cardId: fixture.cards[0].publicId, idempotencyKey: randomUUID() }); observed = { rejected: false }; }
      catch (error) { observed = { rejected: true, code: error instanceof GameError ? error.code : 'SERVER_ERROR' }; }
      passed = observed.code === 'CAMPAIGN_CLOSED';
      break;
    }
    case 'campaign-expired': {
      const past = new Date(Date.now() - 86400_000);
      await prisma.campaign.update({ where: { id: fixture.id }, data: { status: 'ACTIVE', startsAt: new Date(past.getTime() - 86400_000), endsAt: past } });
      expected = 'El backend debe rechazar una campaña fuera de vigencia.';
      try { await playCard({ token: randomUUID(), shoppingSlug: shop.slug, cardId: fixture.cards[0].publicId, idempotencyKey: randomUUID() }); observed = { rejected: false }; }
      catch (error) { observed = { rejected: true, code: error instanceof GameError ? error.code : 'SERVER_ERROR' }; }
      passed = observed.code === 'CAMPAIGN_CLOSED';
      break;
    }
    case 'cross-tenant-card': {
      const other = qaShops.find(({ slug }) => slug !== shop.slug)!;
      const otherFixture = await prisma.campaign.findUnique({ where: { slug: `qa-${other.slug}-campaign` }, include: { cards: { orderBy: { publicId: 'asc' } } } });
      await activateFixture(fixture.id);
      if (otherFixture) await activateFixture(otherFixture.id);
      expected = 'Una tarjeta del otro shopping debe responder CARD_NOT_FOUND.';
      try { await playCard({ token: randomUUID(), shoppingSlug: shop.slug, cardId: otherFixture?.cards[0]?.publicId ?? '', idempotencyKey: randomUUID() }); observed = { rejected: false }; }
      catch (error) { observed = { rejected: true, code: error instanceof GameError ? error.code : 'SERVER_ERROR' }; }
      passed = observed.code === 'CARD_NOT_FOUND';
      break;
    }
    case 'duplicate-card': {
      await activateFixture(fixture.id);
      const token = randomUUID();
      await playCard({ token, shoppingSlug: shop.slug, cardId: fixture.cards[0].publicId, idempotencyKey: randomUUID() });
      const duplicate = await playCard({ token, shoppingSlug: shop.slug, cardId: fixture.cards[0].publicId, idempotencyKey: randomUUID() });
      const participant = await prisma.participant.findUnique({ where: { sessionHash_campaignId_shoppingId: { sessionHash: sha256(token), campaignId: fixture.id, shoppingId: fixture.shoppingId } } });
      const plays = participant ? await prisma.participation.count({ where: { participantId: participant.id, cardId: fixture.cards[0].id } }) : 0;
      expected = 'Repetir tarjeta devuelve el resultado anterior y mantiene una sola participación y una tarjeta coleccionada.';
      observed = { alreadyParticipated: duplicate.alreadyParticipated, participations: plays, collectionCount: duplicate.collectionProgress.count };
      passed = duplicate.alreadyParticipated && plays === 1 && duplicate.collectionProgress.count === 1;
      break;
    }
    case 'collection-complete': {
      await activateFixture(fixture.id);
      const token = randomUUID();
      let result;
      for (const card of fixture.cards) result = await playCard({ token, shoppingSlug: shop.slug, cardId: card.publicId, idempotencyKey: randomUUID() });
      expected = 'Tres tarjetas diferentes deben producir progreso 3/3.';
      observed = { count: result?.collectionProgress.count, cards: result?.collectionProgress.cardIds };
      passed = result?.collectionProgress.count === 3;
      break;
    }
    case 'last-prize-concurrent': {
      await activateFixture(fixture.id);
      const lastPrize = fixture.prizes.find(({ name }) => name.includes('Última unidad'))!;
      for (const prize of fixture.prizes) await recordStock(prize, fixture.id, fixture.shoppingId, input.actorId, prize.id === lastPrize.id ? 1 : 0, true);
      const outcomes = await Promise.allSettled(fixture.cards.slice(0, 2).map((card) => playCard({ token: randomUUID(), shoppingSlug: shop.slug, cardId: card.publicId, idempotencyKey: randomUUID() })));
      const stockAfter = (await prisma.prize.findUniqueOrThrow({ where: { id: lastPrize.id } })).remainingStock;
      const winners = outcomes.filter((outcome) => outcome.status === 'fulfilled' && outcome.value.prize?.id === lastPrize.id).length;
      expected = 'Dos participantes compiten por la última unidad: se asigna como máximo un premio y el stock nunca baja de cero.';
      observed = { winners, stockAfter, outcomes: outcomes.map((outcome) => outcome.status === 'fulfilled' ? outcome.value.status : 'retry-or-error') };
      passed = winners <= 1 && stockAfter >= 0 && stockAfter <= 1 && winners + stockAfter === 1;
      break;
    }
    case 'redeem-cycle': {
      await activateFixture(fixture.id);
      const target = fixture.prizes.find(({ name }) => name.includes('Última unidad'))!;
      for (const prize of fixture.prizes) await recordStock(prize, fixture.id, fixture.shoppingId, input.actorId, prize.id === target.id ? 1 : 0, true);
      const played = await playCard({ token: randomUUID(), shoppingSlug: shop.slug, cardId: fixture.cards[0].publicId, idempotencyKey: randomUUID() });
      if (!played.redeemCode) throw new Error('El servidor no confirmó un código de canje para el premio de prueba.');
      const redemption = await validateRedemption({ shoppingId: fixture.shoppingId, actorId: input.actorId, code: played.redeemCode });
      let replay = 'UNEXPECTED_SUCCESS';
      try { await validateRedemption({ shoppingId: fixture.shoppingId, actorId: input.actorId, code: played.redeemCode }); }
      catch (error) { replay = error instanceof RedeemError ? error.code : 'SERVER_ERROR'; }
      const other = qaShops.find(({ slug }) => slug !== shop.slug)!;
      const otherShop = await prisma.shopping.findUniqueOrThrow({ where: { slug: other.slug } });
      let crossShopping = 'UNEXPECTED_SUCCESS';
      try { await validateRedemption({ shoppingId: otherShop.id, actorId: input.actorId, code: played.redeemCode }); }
      catch (error) { crossShopping = error instanceof RedeemError ? error.code : 'SERVER_ERROR'; }
      expected = 'El primer canje se confirma; una repetición y la validación desde el otro shopping se rechazan.';
      observed = { redeemed: redemption.ok, replay, crossShopping, code: '•••••••• (oculto)' };
      passed = redemption.ok && replay === 'ALREADY_REDEEMED' && crossShopping === 'INVALID_CODE';
      break;
    }
      default: throw new Error('Escenario QA desconocido.');
    }
  } catch (error) {
    expected ||= 'El escenario debe completar la operación solicitada y comparar su resultado con lo esperado.';
    observed = { error: error instanceof Error ? error.message : 'Error no identificado' };
    passed = false;
  }

  const status = passed ? 'APPROVED' : 'FAILED';
  const run = await prisma.auditLog.create({ data: {
    actorId: input.actorId, shoppingId: fixture.shoppingId, campaignId: fixture.id, action: 'QA_SCENARIO', entityType: 'QaRun', entityId: input.scenario,
    metadata: { scenario: input.scenario, expected, observed: JSON.parse(JSON.stringify(observed)) as Prisma.InputJsonValue, status },
  } });
  return { id: run.id, shopping: shop.slug, scenario: input.scenario, status, expected, observed, createdAt: run.createdAt };
}
