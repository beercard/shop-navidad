import { Prisma } from '@prisma/client';

const campaignDefinitions = [
  { slug: 'centenario', name: 'Centenario Shopping', prefix: 'CEN', campaignName: 'Navidad Demo — Centenario' },
  { slug: 'uniplaza', name: 'UniPlaza Shopping', prefix: 'UNI', campaignName: 'Navidad Demo — UniPlaza' },
];
const prizes = [
  { key: 'coupon-10', name: 'Cupón demo del 10%', type: 'DISCOUNT', stock: 100, weight: 45, image: '/demo-prizes/coupon-10.svg', description: 'Descuento ficticio del 10% para probar el recorrido. No válido en comercios reales.' },
  { key: 'coupon-20', name: 'Cupón demo del 20%', type: 'DISCOUNT', stock: 50, weight: 25, image: '/demo-prizes/coupon-20.svg', description: 'Descuento ficticio del 20% para pruebas. No válido en comercios reales.' },
  { key: 'giftcard-10000', name: 'Gift card demo de $10.000', type: 'GIFT_CARD', stock: 20, weight: 15, image: '/demo-prizes/gift-card.svg', description: 'Gift card ficticia sin valor comercial ni saldo real.' },
  { key: 'surprise-gift', name: 'Regalo sorpresa demo', type: 'GIFT', stock: 10, weight: 10, image: '/demo-prizes/surprise.svg', description: 'Regalo ilustrativo para validar emisión y canje; no se entrega en comercios.' },
  { key: 'special-prize', name: 'Premio especial demo', type: 'SPECIAL', stock: 3, weight: 5, image: '/demo-prizes/special.svg', description: 'Premio ficticio para probar stock limitado. Sin valor comercial.' },
];

export async function seedDemo(prisma) {
  const counts = { campaignsCreated: 0, campaignsUpdated: 0, prizesCreated: 0, prizesUpdated: 0, cardsCreated: 0, cardsUpdated: 0, cluesCreated: 0, cluesUpdated: 0 };
  const now = new Date();
  const startsAt = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const endsAt = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);
  const results = await prisma.$transaction(async (tx) => {
    const campaigns = [];
    for (const definition of campaignDefinitions) {
      const shopping = await tx.shopping.findUnique({ where: { slug: definition.slug } });
      if (!shopping) throw new Error(`Falta el shopping ${definition.slug}; ejecutá primero npm run db:seed.`);
      const slug = `navidad-demo-${definition.slug}`;
      const priorCampaign = await tx.campaign.findUnique({ where: { slug } });
      if (priorCampaign && priorCampaign.shoppingId !== shopping.id) throw new Error(`Conflicto de tenant en la campaña reservada ${slug}; no se modificó.`);
      const settings = {
        demo: true,
        collectionTarget: 3,
        collectionUnlockText: 'Colección demo completada. Sin premio comercial asociado.',
        participationLimit: 'Una participación por tarjeta y participante.',
        redemptionExpiryHours: 48,
        terms: 'Campaña de demostración. Premios ficticios, sin valor comercial y no canjeables en comercios reales.',
        brandTheme: definition.slug,
      };
      const campaignData = { shoppingId: shopping.id, name: definition.campaignName, description: 'Campaña aislada de demostración; todos los premios son ficticios.', status: 'ACTIVE', startsAt, endsAt, settings };
      const campaign = priorCampaign
        ? await tx.campaign.update({ where: { id: priorCampaign.id }, data: campaignData })
        : await tx.campaign.create({ data: { id: `camp-demo-${definition.slug}`, slug, ...campaignData } });
      counts[priorCampaign ? 'campaignsUpdated' : 'campaignsCreated'] += 1;

      for (const prize of prizes) {
        const id = `prize-demo-${definition.slug}-${prize.key}`;
        const prior = await tx.prize.findUnique({ where: { id } });
        if (prior && (prior.shoppingId !== shopping.id || prior.campaignId !== campaign.id)) throw new Error(`Conflicto de tenant en el premio reservado ${id}; no se modificó.`);
        const details = {
          demo: true,
          label: 'DEMO — SIN VALOR COMERCIAL',
          type: prize.type,
          eligibility: 'Participantes de prueba de esta campaña; una unidad por persona y premio.',
          redemption: { required: true, expiryHours: 48, realMerchantValue: false },
          referenceProbabilityPercent: prize.weight,
          schedule: { startsAt: startsAt.toISOString(), endsAt: endsAt.toISOString() },
        };
        if (prior) {
          await tx.prize.update({ where: { id }, data: { name: `DEMO — SIN VALOR COMERCIAL · ${prize.name}`, description: prize.description, imageUrl: prize.image, weight: prize.weight, startsAt, endsAt, active: true, maxPerPerson: 10, details } });
          counts.prizesUpdated += 1;
        } else {
          await tx.prize.create({ data: { id, campaignId: campaign.id, shoppingId: shopping.id, name: `DEMO — SIN VALOR COMERCIAL · ${prize.name}`, description: prize.description, imageUrl: prize.image, totalStock: prize.stock, remainingStock: prize.stock, weight: prize.weight, startsAt, endsAt, active: true, maxPerPerson: 10, details } });
          await tx.inventoryMovement.create({ data: { prizeId: id, campaignId: campaign.id, shoppingId: shopping.id, delta: prize.stock, reason: 'Carga inicial de inventario de demostración' } });
          counts.prizesCreated += 1;
        }
      }

      const cards = [];
      for (let number = 1; number <= 10; number += 1) {
        const publicId = `${definition.prefix}-DEMO-${String(number).padStart(3, '0')}`;
        const prior = await tx.card.findUnique({ where: { shoppingId_publicId: { shoppingId: shopping.id, publicId } } });
        if (prior && prior.campaignId !== campaign.id) throw new Error(`Conflicto de campaña en la tarjeta reservada ${publicId}; no se modificó.`);
        const cardData = { campaignId: campaign.id, kind: number <= 3 ? 'COLLECTION' : 'ROULETTE', status: 'ACTIVE', location: `Punto demo ${number}` };
        const card = prior
          ? await tx.card.update({ where: { id: prior.id }, data: cardData })
          : await tx.card.create({ data: { shoppingId: shopping.id, publicId, ...cardData, activatedAt: now } });
        counts[prior ? 'cardsUpdated' : 'cardsCreated'] += 1;
        cards.push(card);
      }

      for (let number = 1; number <= 3; number += 1) {
        const id = `clue-demo-${definition.slug}-${number}`;
        const prior = await tx.clue.findUnique({ where: { id } });
        if (prior && (prior.shoppingId !== shopping.id || prior.campaignId !== campaign.id)) throw new Error(`Conflicto de tenant en la pista reservada ${id}; no se modificó.`);
        const clueData = { shoppingId: shopping.id, campaignId: campaign.id, cardId: cards[number - 1].id, text: `Pista demo ${number}: encontrá la tarjeta ${definition.prefix}-DEMO-${String(number).padStart(3, '0')} en el punto de prueba ${number}.`, startsAt, endsAt, active: true };
        if (prior) { await tx.clue.update({ where: { id }, data: clueData }); counts.cluesUpdated += 1; }
        else { await tx.clue.create({ data: { id, ...clueData } }); counts.cluesCreated += 1; }
      }
      campaigns.push({ shopping: definition.slug, campaignId: campaign.id, campaignName: campaign.name, cardIds: cards.map(({ publicId }) => publicId) });
    }
    await tx.auditLog.create({ data: { action: 'DEMO_SEED_RUN', entityType: 'DemoSeed', entityId: 'both-shoppings', metadata: { counts } } });
    return campaigns;
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable, timeout: 25_000 });
  return { counts, campaigns: results, validUntil: endsAt.toISOString() };
}
