import { expect, test } from '@playwright/test';
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

function loadEnvLocal() {
  const files = process.env.PLAYWRIGHT_BASE_URL
    ? ['.env.dev.local', '.env.local', '.env']
    : ['.env.local', '.env.dev.local', '.env'];
  for (const file of files) {
    const full = path.join(process.cwd(), file);
    if (!fs.existsSync(full)) continue;
    const content = fs.readFileSync(full, 'utf8');
    for (const rawLine of content.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) continue;
      const eq = line.indexOf('=');
      if (eq <= 0) continue;
      const key = line.slice(0, eq).trim();
      let val = line.slice(eq + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!val || val === '[SENSITIVE]') continue;
      if (!process.env[key]) process.env[key] = val;
    }
  }
}

loadEnvLocal();
const prisma = new PrismaClient({
  datasourceUrl: process.env.QA_DATABASE_URL || process.env.DATABASE_URL,
});

async function cleanupTestCampaign(campaignId: string) {
  await prisma.redeemCode.deleteMany({ where: { campaignId } });
  await prisma.participation.deleteMany({ where: { campaignId } });
  await prisma.collectionCard.deleteMany({ where: { progress: { campaignId } } });
  await prisma.collectionProgress.deleteMany({ where: { campaignId } });
  await prisma.event.deleteMany({ where: { campaignId } });
  await prisma.inventoryMovement.deleteMany({ where: { campaignId } });
  await prisma.clue.deleteMany({ where: { campaignId } });
  await prisma.card.deleteMany({ where: { campaignId } });
  await prisma.prize.deleteMany({ where: { campaignId } });
  await prisma.participant.deleteMany({ where: { campaignId } });
  await prisma.campaign.deleteMany({ where: { id: campaignId } });
}

test.describe.serial('Verificación Real de los 10 Puntos del Checklist E2E', () => {
  test.beforeAll(async () => {
    const leftovers = await prisma.campaign.findMany({
      where: {
        OR: [
          { slug: { startsWith: 'temp-conc-' } },
          { slug: { startsWith: 'test-stock-vigencia-' } },
        ],
      },
      select: { id: true },
    });
    for (const item of leftovers) {
      await cleanupTestCampaign(item.id);
    }

    // Pausamos campañas de fixture QA si quedaron activas para que las rutas públicas apunten a las campañas demo oficiales
    await prisma.campaign.updateMany({
      where: { slug: { in: ['qa-centenario-campaign', 'qa-uniplaza-campaign'] } },
      data: { status: 'PAUSED' },
    });

    // Aseguramos que las campañas demo de ambos shoppings estén activas y tengan stock positivo antes de iniciar la corrida
    const demoCampaigns = await prisma.campaign.findMany({
      where: { slug: { in: ['navidad-demo-centenario', 'navidad-demo-uniplaza'] } },
      select: { id: true },
    });
    if (demoCampaigns.length) {
      await prisma.campaign.updateMany({
        where: { id: { in: demoCampaigns.map((c) => c.id) } },
        data: { status: 'ACTIVE' },
      });
      await prisma.prize.updateMany({
        where: { campaignId: { in: demoCampaigns.map((c) => c.id) }, active: true },
        data: { remainingStock: 25 },
      });
    }
  });

  test.beforeEach(async () => {
    // Limpiamos el bucket de rate-limit por IP loopback entre cada caso de prueba para que la corrida rápida de los 10 tests desde 127.0.0.1 no agote la ventana de 16 req/minuto por IP
    await prisma.rateLimitBucket.deleteMany({});
  });

  test.afterAll(async () => {
    await prisma.$disconnect();
  });

  test('[1] Escaneo y ruleta: Escanear un QR válido, jugar y volver a escanear ese mismo QR', async ({ browser }) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();

    // 1. Escaneo real abriendo la ruta del cartel QR físico (/centenario/participar/CEN-DEMO-001)
    await page.goto('/centenario/participar/CEN-DEMO-001', { waitUntil: 'networkidle' });
    await expect(page.getByRole('heading', { name: 'Encontraste una tarjeta' })).toBeVisible();
    await expect(page.getByText('CEN-DEMO-001')).toBeVisible();

    const playResponsePromise = page.waitForResponse(
      (res) => res.url().includes('/api/participations') && res.request().method() === 'POST',
    );
    await page.getByRole('button', { name: 'Participar' }).click();
    const firstPlayRes = await playResponsePromise;
    expect(firstPlayRes.status()).toBe(200);
    const firstPlayBody = await firstPlayRes.json();
    expect(firstPlayBody.alreadyParticipated).toBe(false);
    expect(['won', 'no_prize']).toContain(firstPlayBody.status);

    // 2. Volver a escanear exactamente el mismo QR (/centenario/participar/CEN-DEMO-001)
    await page.goto('/centenario/participar/CEN-DEMO-001', { waitUntil: 'networkidle' });
    const secondPlayPromise = page.waitForResponse(
      (res) => res.url().includes('/api/participations') && res.request().method() === 'POST',
    );
    await page.getByRole('button', { name: 'Participar' }).click();
    const secondPlayRes = await secondPlayPromise;
    expect(secondPlayRes.status()).toBe(200);
    const secondPlayBody = await secondPlayRes.json();

    expect(secondPlayBody.alreadyParticipated).toBe(true);
    expect(secondPlayBody.duplicateRejected).toBe(true);
    expect(secondPlayBody.raffleEntryAdded).toBe(false);
    expect(secondPlayBody.raffleEntriesCount).toBe(1);
    expect(secondPlayBody.redeemCode).toBe(firstPlayBody.redeemCode);
    await expect(page.getByText(/Esta posta ya había sido utilizada en tu recorrido/i)).toBeVisible();

    await ctx.close();
  });

  test('[2] Postas diferentes: Escanear dos QR distintos y comprobar que cada uno habilite una única oportunidad', async ({ browser }) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();

    // QR 1: CEN-DEMO-001 -> habilita oportunidad 1
    const qr1 = await page.request.post('/api/participations', {
      data: { shoppingSlug: 'centenario', cardId: 'CEN-DEMO-001', idempotencyKey: randomUUID() },
    });
    expect(qr1.status()).toBe(200);
    const qr1Body = await qr1.json();
    expect(qr1Body.alreadyParticipated).toBe(false);
    expect(qr1Body.collectionProgress.count).toBe(1);

    // QR 2 distinto: CEN-DEMO-002 -> habilita oportunidad 2
    const qr2 = await page.request.post('/api/participations', {
      data: { shoppingSlug: 'centenario', cardId: 'CEN-DEMO-002', idempotencyKey: randomUUID() },
    });
    expect(qr2.status()).toBe(200);
    const qr2Body = await qr2.json();
    expect(qr2Body.alreadyParticipated).toBe(false);
    expect(qr2Body.collectionProgress.count).toBe(2);
    expect(qr2Body.collectionProgress.cardIds).toEqual(expect.arrayContaining(['CEN-DEMO-001', 'CEN-DEMO-002']));

    // Repetir ambos QR -> ninguno habilita una nueva oportunidad
    const qr1Repeat = await (
      await page.request.post('/api/participations', {
        data: { shoppingSlug: 'centenario', cardId: 'CEN-DEMO-001', idempotencyKey: randomUUID() },
      })
    ).json();
    const qr2Repeat = await (
      await page.request.post('/api/participations', {
        data: { shoppingSlug: 'centenario', cardId: 'CEN-DEMO-002', idempotencyKey: randomUUID() },
      })
    ).json();
    expect(qr1Repeat.alreadyParticipated).toBe(true);
    expect(qr2Repeat.alreadyParticipated).toBe(true);
    expect(qr2Repeat.collectionProgress.count).toBe(2);

    await ctx.close();
  });

  test('[3] Límite de premio: Ganar un premio instantáneo y comprobar que no se pueda ganar otro en esa campaña', async ({ browser }) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();

    // 1. Primera jugada con stock activo -> gana su único premio instantáneo de la campaña
    const first = await page.request.post('/api/participations', {
      data: { shoppingSlug: 'centenario', cardId: 'CEN-DEMO-001', idempotencyKey: randomUUID() },
    });
    expect(first.status()).toBe(200);
    const firstBody = await first.json();
    expect(firstBody.status).toBe('won');
    expect(firstBody.redeemCode).toBeTruthy();
    expect(firstBody.prize?.name).toBeTruthy();

    // 2. Segunda y tercera jugada en otros carteles válidos de la misma campaña -> NUNCA pueden ganar otro premio instantáneo
    const second = await page.request.post('/api/participations', {
      data: { shoppingSlug: 'centenario', cardId: 'CEN-DEMO-002', idempotencyKey: randomUUID() },
    });
    const secondBody = await second.json();
    expect(secondBody.status).toBe('no_prize');
    expect(secondBody.instantPrizeLimitReached).toBe(true);
    expect(secondBody.priorInstantPrize?.name).toBe(firstBody.prize.name);
    expect(secondBody.redeemCode).toBeUndefined();

    const third = await page.request.post('/api/participations', {
      data: { shoppingSlug: 'centenario', cardId: 'CEN-DEMO-003', idempotencyKey: randomUUID() },
    });
    const thirdBody = await third.json();
    expect(thirdBody.status).toBe('no_prize');
    expect(thirdBody.instantPrizeLimitReached).toBe(true);
    expect(thirdBody.redeemCode).toBeUndefined();

    await ctx.close();
  });

  test('[4] Participaciones: Confirmar que cada posta distinta genere una participación y que repetir un QR no la duplique', async ({ browser }) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();

    // Posta 1 -> 1 participación por escaneo
    const p1 = await (
      await page.request.post('/api/participations', {
        data: { shoppingSlug: 'centenario', cardId: 'CEN-DEMO-001', idempotencyKey: randomUUID() },
      })
    ).json();
    expect(p1.scanRaffleEntriesCount).toBe(1);
    expect(p1.raffleEntryAdded).toBe(true);

    // Repetir Posta 1 dos veces -> sigue en 1 participación
    for (let i = 0; i < 2; i++) {
      const dup = await (
        await page.request.post('/api/participations', {
          data: { shoppingSlug: 'centenario', cardId: 'CEN-DEMO-001', idempotencyKey: randomUUID() },
        })
      ).json();
      expect(dup.scanRaffleEntriesCount).toBe(1);
      expect(dup.raffleEntryAdded).toBe(false);
    }

    // Posta 2 -> 2 participaciones por escaneo
    const p2 = await (
      await page.request.post('/api/participations', {
        data: { shoppingSlug: 'centenario', cardId: 'CEN-DEMO-002', idempotencyKey: randomUUID() },
      })
    ).json();
    expect(p2.scanRaffleEntriesCount).toBe(2);
    expect(p2.raffleEntryAdded).toBe(true);

    // Repetir Posta 2 -> sigue en 2 participaciones
    const dup2 = await (
      await page.request.post('/api/participations', {
        data: { shoppingSlug: 'centenario', cardId: 'CEN-DEMO-002', idempotencyKey: randomUUID() },
      })
    ).json();
    expect(dup2.scanRaffleEntriesCount).toBe(2);
    expect(dup2.raffleEntryAdded).toBe(false);

    await ctx.close();
  });

  test('[5] Recorrido completo: Completar todas las postas y comprobar que se desbloquee exactamente una recompensa especial', async ({ browser }) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();

    // Posta 1 (1/3) -> pendiente
    const s1 = await (
      await page.request.post('/api/participations', {
        data: { shoppingSlug: 'centenario', cardId: 'CEN-DEMO-001', idempotencyKey: randomUUID() },
      })
    ).json();
    expect(s1.completionReward.unlocked).toBe(false);
    expect(s1.completionReward.completedCount).toBe(1);
    expect(s1.completionReward.pendingCount).toBe(2);
    expect(s1.bonusRaffleEntriesCount).toBe(0);

    // Posta 2 (2/3) -> pendiente
    const s2 = await (
      await page.request.post('/api/participations', {
        data: { shoppingSlug: 'centenario', cardId: 'CEN-DEMO-002', idempotencyKey: randomUUID() },
      })
    ).json();
    expect(s2.completionReward.unlocked).toBe(false);
    expect(s2.completionReward.completedCount).toBe(2);
    expect(s2.completionReward.pendingCount).toBe(1);
    expect(s2.bonusRaffleEntriesCount).toBe(0);

    // Posta 3 (3/3) -> desbloquea exactamente 1 recompensa especial (+1 participación extra)
    const s3 = await (
      await page.request.post('/api/participations', {
        data: { shoppingSlug: 'centenario', cardId: 'CEN-DEMO-003', idempotencyKey: randomUUID() },
      })
    ).json();
    expect(s3.completionReward.unlocked).toBe(true);
    expect(s3.completionReward.justUnlocked).toBe(true);
    expect(s3.completionReward.completedCount).toBe(3);
    expect(s3.completionReward.pendingCount).toBe(0);
    expect(s3.completionReward.referenceId).toBeTruthy();
    expect(s3.scanRaffleEntriesCount).toBe(3);
    expect(s3.bonusRaffleEntriesCount).toBe(1);
    expect(s3.raffleEntriesCount).toBe(4);

    // Posta 4 adicional o repetición de Posta 3 -> NO emite una segunda recompensa especial
    const s4 = await (
      await page.request.post('/api/participations', {
        data: { shoppingSlug: 'centenario', cardId: 'CEN-DEMO-004', idempotencyKey: randomUUID() },
      })
    ).json();
    expect(s4.completionReward.unlocked).toBe(true);
    expect(s4.completionReward.justUnlocked).toBe(false);
    expect(s4.completionReward.rewardId).toBe(s3.completionReward.rewardId);
    expect(s4.completionReward.referenceId).toBe(s3.completionReward.referenceId);
    expect(s4.scanRaffleEntriesCount).toBe(4);
    expect(s4.bonusRaffleEntriesCount).toBe(1);
    expect(s4.raffleEntriesCount).toBe(5);

    await ctx.close();
  });

  test('[6] Concurrencia: Enviar dos solicitudes simultáneas y comprobar que no se dupliquen premios ni participaciones', async ({ browser }) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();

    // Establecemos la cookie de identidad del usuario con la primera posta
    const initPlay = await (
      await page.request.post('/api/participations', {
        data: { shoppingSlug: 'centenario', cardId: 'CEN-DEMO-001', idempotencyKey: randomUUID() },
      })
    ).json();
    expect(initPlay.scanRaffleEntriesCount).toBe(1);

    // 6A: Dos solicitudes simultáneas al mismo QR (CEN-DEMO-002)
    const [sameA, sameB] = await Promise.all([
      page.request.post('/api/participations', {
        data: { shoppingSlug: 'centenario', cardId: 'CEN-DEMO-002', idempotencyKey: randomUUID() },
      }),
      page.request.post('/api/participations', {
        data: { shoppingSlug: 'centenario', cardId: 'CEN-DEMO-002', idempotencyKey: randomUUID() },
      }),
    ]);
    expect(sameA.status()).toBe(200);
    expect(sameB.status()).toBe(200);
    const bodySameA = await sameA.json();
    const bodySameB = await sameB.json();
    expect(bodySameA.scanRaffleEntriesCount).toBe(2);
    expect(bodySameB.scanRaffleEntriesCount).toBe(2);

    // 6B: Dos solicitudes simultáneas en la última posta (CEN-DEMO-003) -> no duplican la recompensa de recorrido completo
    const [lastA, lastB] = await Promise.all([
      page.request.post('/api/participations', {
        data: { shoppingSlug: 'centenario', cardId: 'CEN-DEMO-003', idempotencyKey: randomUUID() },
      }),
      page.request.post('/api/participations', {
        data: { shoppingSlug: 'centenario', cardId: 'CEN-DEMO-003', idempotencyKey: randomUUID() },
      }),
    ]);
    const bodyLastA = await lastA.json();
    const bodyLastB = await lastB.json();
    expect(bodyLastA.completionReward.unlocked).toBe(true);
    expect(bodyLastB.completionReward.unlocked).toBe(true);
    expect(bodyLastA.completionReward.referenceId).toBe(bodyLastB.completionReward.referenceId);
    expect(bodyLastA.bonusRaffleEntriesCount).toBe(1);
    expect(bodyLastB.bonusRaffleEntriesCount).toBe(1);
    expect(bodyLastA.raffleEntriesCount).toBe(4);
    expect(bodyLastB.raffleEntriesCount).toBe(4);

    // 6C: Usuario nuevo (sin premio previo) envía dos solicitudes simultáneas a dos carteles distintos en UniPlaza -> máximo 1 premio instantáneo
    const ctx2 = await browser.newContext();
    const page2 = await ctx2.newPage();
    // Pre-creamos campaña aislada o agotamos temporalmente la primera jugada sin premio para fijar cookie, o verificamos directamente en base de datos
    const uniplazaShop = await prisma.shopping.findUniqueOrThrow({ where: { slug: 'uniplaza' } });
    const tempSlug = `temp-conc-${randomUUID().slice(0, 8)}`;
    const now = new Date();
    const tempCampaign = await prisma.campaign.create({
      data: {
        slug: tempSlug,
        shoppingId: uniplazaShop.id,
        name: 'Campaña Concurrencia Temporal',
        status: 'ACTIVE',
        startsAt: new Date(now.getTime() - 60_000),
        endsAt: new Date(now.getTime() + 3600_000),
        settings: { collectionTarget: 3 },
      },
    });
    const cardAId = `CONC-A-${randomUUID().slice(0, 6).toUpperCase()}`;
    const cardBId = `CONC-B-${randomUUID().slice(0, 6).toUpperCase()}`;
    const cardInitId = `CONC-0-${randomUUID().slice(0, 6).toUpperCase()}`;
    await prisma.card.createMany({
      data: [
        { publicId: cardInitId, shoppingId: uniplazaShop.id, campaignId: tempCampaign.id, status: 'ACTIVE', kind: 'ROULETTE' },
        { publicId: cardAId, shoppingId: uniplazaShop.id, campaignId: tempCampaign.id, status: 'ACTIVE', kind: 'ROULETTE' },
        { publicId: cardBId, shoppingId: uniplazaShop.id, campaignId: tempCampaign.id, status: 'ACTIVE', kind: 'ROULETTE' },
      ],
    });
    // Primero jugamos cardInitId sin stock para establecer la cookie del usuario en el navegador sin haber ganado premio aún
    await page2.request.post('/api/participations', {
      data: { shoppingSlug: 'uniplaza', cardId: cardInitId, idempotencyKey: randomUUID() },
    });
    // Ahora habilitamos un premio con stock abundante y disparamos cardAId y cardBId simultáneamente
    await prisma.prize.create({
      data: {
        campaignId: tempCampaign.id,
        shoppingId: uniplazaShop.id,
        name: 'Premio Concurrencia',
        totalStock: 10,
        remainingStock: 10,
        weight: 10,
        active: true,
      },
    });
    try {
      const [simDiffA, simDiffB] = await Promise.all([
        page2.request.post('/api/participations', {
          data: { shoppingSlug: 'uniplaza', cardId: cardAId, idempotencyKey: randomUUID() },
        }),
        page2.request.post('/api/participations', {
          data: { shoppingSlug: 'uniplaza', cardId: cardBId, idempotencyKey: randomUUID() },
        }),
      ]);
      const diffBodies = [await simDiffA.json(), await simDiffB.json()];
      const wonCount = diffBodies.filter((b) => b.status === 'won').length;
      expect(wonCount).toBe(1);
    } finally {
      await cleanupTestCampaign(tempCampaign.id);
    }

    await ctx.close();
    await ctx2.close();
  });

  test('[7] Stock y vigencia: Agotar el stock, vencer una campaña e intentar reclamar premios', async ({ browser }) => {
    const shop = await prisma.shopping.findUniqueOrThrow({ where: { slug: 'centenario' } });
    const now = new Date();
    const slug = `test-stock-vigencia-${randomUUID().slice(0, 8)}`;
    const cardCode = `STK-${randomUUID().slice(0, 6).toUpperCase()}`;

    const campaign = await prisma.campaign.create({
      data: {
        slug,
        shoppingId: shop.id,
        name: 'Campaña Prueba Stock y Vigencia',
        status: 'ACTIVE',
        startsAt: new Date(now.getTime() - 60_000),
        endsAt: new Date(now.getTime() + 3600_000),
        settings: { collectionTarget: 3 },
      },
    });
    await prisma.card.create({
      data: {
        publicId: cardCode,
        shoppingId: shop.id,
        campaignId: campaign.id,
        status: 'ACTIVE',
        kind: 'ROULETTE',
      },
    });
    const prize = await prisma.prize.create({
      data: {
        campaignId: campaign.id,
        shoppingId: shop.id,
        name: 'Última Unidad Test',
        totalStock: 1,
        remainingStock: 1,
        weight: 1,
        active: true,
      },
    });

    const ctx1 = await browser.newContext();
    const ctx2 = await browser.newContext();
    const ctx3 = await browser.newContext();
    try {
      const p1 = await ctx1.newPage();
      const p2 = await ctx2.newPage();
      const p3 = await ctx3.newPage();

      // 1. Usuario 1 reclama la última unidad disponible (remainingStock pasa de 1 a 0)
      const r1 = await p1.request.post('/api/participations', {
        data: { shoppingSlug: 'centenario', cardId: cardCode, idempotencyKey: randomUUID() },
      });
      expect(r1.status()).toBe(200);
      const b1 = await r1.json();
      expect(b1.status).toBe('won');
      expect(b1.redeemCode).toBeTruthy();

      const prizeAfter1 = await prisma.prize.findUniqueOrThrow({ where: { id: prize.id } });
      expect(prizeAfter1.remainingStock).toBe(0);

      // 2. Stock agotado: Usuario 2 escanea el mismo cartel cuando remainingStock === 0 -> no puede recibir premio y el stock no queda negativo
      const r2 = await p2.request.post('/api/participations', {
        data: { shoppingSlug: 'centenario', cardId: cardCode, idempotencyKey: randomUUID() },
      });
      expect(r2.status()).toBe(200);
      const b2 = await r2.json();
      expect(b2.status).toBe('no_prize');
      expect(b2.redeemCode).toBeUndefined();

      const prizeAfter2 = await prisma.prize.findUniqueOrThrow({ where: { id: prize.id } });
      expect(prizeAfter2.remainingStock).toBe(0);

      // 3. Vencer la campaña (endsAt en el pasado) e intentar participar / reclamar premio -> 409 CAMPAIGN_CLOSED
      await prisma.campaign.update({
        where: { id: campaign.id },
        data: {
          startsAt: new Date(now.getTime() - 7200_000),
          endsAt: new Date(now.getTime() - 60_000),
        },
      });
      const rExpired = await p3.request.post('/api/participations', {
        data: { shoppingSlug: 'centenario', cardId: cardCode, idempotencyKey: randomUUID() },
      });
      expect(rExpired.status()).toBe(409);
      const bExpired = await rExpired.json();
      expect(bExpired.code).toBe('CAMPAIGN_CLOSED');

      // 4. Pausar la campaña y verificar rechazo -> 409 CAMPAIGN_CLOSED
      await prisma.campaign.update({
        where: { id: campaign.id },
        data: {
          status: 'PAUSED',
          endsAt: new Date(now.getTime() + 3600_000),
        },
      });
      const rPaused = await p3.request.post('/api/participations', {
        data: { shoppingSlug: 'centenario', cardId: cardCode, idempotencyKey: randomUUID() },
      });
      expect(rPaused.status()).toBe(409);
      expect((await rPaused.json()).code).toBe('CAMPAIGN_CLOSED');
    } finally {
      await ctx1.close();
      await ctx2.close();
      await ctx3.close();
      await cleanupTestCampaign(campaign.id);
    }
  });

  test('[8] Persistencia: Cerrar sesión o la PWA, volver a entrar y verificar que el progreso se conserve según la identidad del usuario', async ({ browser }) => {
    const ctx = await browser.newContext();
    const page1 = await ctx.newPage();

    // El usuario completa las 3 postas en Centenario
    let lastBody: { redeemCode?: string; completionReward?: { referenceId: string } } = {};
    let wonCode = '';
    for (const cardId of ['CEN-DEMO-001', 'CEN-DEMO-002', 'CEN-DEMO-003']) {
      const res = await page1.request.post('/api/participations', {
        data: { shoppingSlug: 'centenario', cardId, idempotencyKey: randomUUID() },
      });
      const body = await res.json();
      if (body.redeemCode) wonCode = body.redeemCode;
      lastBody = body;
    }
    expect(wonCode).toBeTruthy();
    expect(lastBody.completionReward?.referenceId).toBeTruthy();

    // Cerramos completamente la pestaña/ventana de la PWA
    await page1.close();

    // Abrimos una nueva ventana en el mismo dispositivo/contexto del usuario y entramos a la PWA
    const page2 = await ctx.newPage();
    await page2.goto('/centenario#progreso', { waitUntil: 'networkidle' });

    // Verificamos que se conserven el pasaporte 3/3, las 4 participaciones del sorteo final, la credencial de recorrido y el cupón QR en billetera
    await expect(page2.locator('header').getByText('3/3')).toBeVisible();
    const credential = page2.getByTestId('completion-reward-credential').first();
    await expect(credential).toBeVisible();
    await expect(credential).toContainText(lastBody.completionReward!.referenceId);
    await expect(credential).toContainText('Total Sorteo Final: 4');
    await page2.getByRole('button', { name: 'Mostrar QR' }).first().click();
    await expect(page2.getByText(wonCode)).toBeVisible();

    await ctx.close();
  });

  test('[9] Separación de campañas: Comprobar que los usuarios, premios, postas y participaciones de ambos shoppings no se mezclen', async ({ browser }) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();

    // 1. El usuario juega y completa recorrido en Centenario
    const c1 = await (
      await page.request.post('/api/participations', {
        data: { shoppingSlug: 'centenario', cardId: 'CEN-DEMO-001', idempotencyKey: randomUUID() },
      })
    ).json();
    await page.request.post('/api/participations', {
      data: { shoppingSlug: 'centenario', cardId: 'CEN-DEMO-002', idempotencyKey: randomUUID() },
    });
    await page.request.post('/api/participations', {
      data: { shoppingSlug: 'centenario', cardId: 'CEN-DEMO-003', idempotencyKey: randomUUID() },
    });

    // 2. Consultamos UniPlaza con la misma sesión -> progreso 0, 0 participaciones, sin premio instantáneo ni recorrido completo
    const uniPublic = await (await page.request.get('/api/campaigns/uniplaza/public')).json();
    expect(uniPublic.shopping.slug).toBe('uniplaza');
    expect(uniPublic.collectionProgress.count).toBe(0);
    expect(uniPublic.raffleEntriesCount).toBe(0);
    expect(uniPublic.instantPrizeWon).toBeNull();
    expect(uniPublic.completionReward.unlocked).toBe(false);
    expect(uniPublic.cards.every((c: { publicId: string }) => c.publicId.startsWith('UNI-'))).toBe(true);

    // 3. Intentar usar una posta de Centenario en UniPlaza o viceversa -> 404 CARD_NOT_FOUND
    const crossCard1 = await page.request.post('/api/participations', {
      data: { shoppingSlug: 'uniplaza', cardId: 'CEN-DEMO-001', idempotencyKey: randomUUID() },
    });
    expect(crossCard1.status()).toBe(404);
    expect((await crossCard1.json()).code).toBe('CARD_NOT_FOUND');

    const crossCard2 = await page.request.post('/api/participations', {
      data: { shoppingSlug: 'centenario', cardId: 'UNI-DEMO-001', idempotencyKey: randomUUID() },
    });
    expect(crossCard2.status()).toBe(404);
    expect((await crossCard2.json()).code).toBe('CARD_NOT_FOUND');

    // 4. El usuario en UniPlaza aún puede ganar su propio premio instantáneo independiente en UniPlaza
    const uniPlay = await (
      await page.request.post('/api/participations', {
        data: { shoppingSlug: 'uniplaza', cardId: 'UNI-DEMO-001', idempotencyKey: randomUUID() },
      })
    ).json();
    expect(uniPlay.status).toBe('won');
    expect(uniPlay.redeemCode).toBeTruthy();
    expect(uniPlay.redeemCode).not.toBe(c1.redeemCode);

    await ctx.close();
  });

  test('[10] Móvil y escritorio: Probar navegación, botones, modales y contenido en 390×844, 430×932, tablet y escritorio', async ({ page }) => {
    test.setTimeout(120_000);
    const viewports = [
      { label: 'Móvil 390×844', width: 390, height: 844, isMobile: true },
      { label: 'Móvil 430×932', width: 430, height: 932, isMobile: true },
      { label: 'Tablet 768×1024', width: 768, height: 1024, isMobile: true },
      { label: 'Escritorio 1440×900', width: 1440, height: 900, isMobile: false },
    ];

    for (const shopping of ['/centenario', '/uniplaza']) {
      for (const vp of viewports) {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto(shopping, { waitUntil: 'networkidle' });

        // Sin desborde horizontal
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow, `${shopping} en ${vp.label} tiene overflow horizontal`).toBeLessThanOrEqual(0);

        const nav = page.getByRole('navigation', { name: 'Secciones de la campaña' });
        await expect(nav).toBeVisible();

        if (vp.isMobile) {
          const pos = await nav.evaluate((el) => window.getComputedStyle(el).position);
          expect(pos).toBe('fixed');
        }

        // Probar navegación por las 5 secciones y apertura/cierre de modal de detalle de premio en "Premios"
        await nav.getByRole('button', { name: 'Premios', exact: true }).click();
        await expect(page.getByRole('heading', { name: 'Premios' })).toBeVisible();

        // Abrir el modal (Sheet) del premio destacado
        const featuredBtn = page.locator('section[aria-labelledby="prizes-title"] button').first();
        await featuredBtn.click();
        const dialog = page.getByRole('dialog');
        await expect(dialog).toBeVisible();
        await expect(dialog.getByRole('button', { name: /Participar por este beneficio/i })).toBeVisible();

        // Cerrar el modal con el botón Cerrar
        await dialog.getByRole('button', { name: 'Cerrar' }).click();
        await expect(dialog).toBeHidden();

        // Navegar a Jugar, Descubrir y Mi progreso
        for (const tabName of ['Jugar', 'Descubrir', 'Mi progreso', 'Inicio']) {
          await nav.getByRole('button', { name: tabName, exact: true }).click();
          const overflowTab = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
          expect(overflowTab, `${shopping} (${vp.label}) pestaña ${tabName} desborda`).toBeLessThanOrEqual(0);
        }
      }
    }
  });
});
