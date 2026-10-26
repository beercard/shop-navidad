import { expect, request as pwRequest, test, type APIRequestContext } from '@playwright/test';
import { createHash, randomUUID } from 'node:crypto';
import { PrismaClient } from '@prisma/client';
import fs from 'node:fs';
import path from 'node:path';

function sha256(value: string) {
  return createHash('sha256').update(value).digest('hex');
}

function loadEnvLocal() {
  const files = ['.env.local', '.env.dev.local', '.env'];
  for (const file of files) {
    const full = path.join(process.cwd(), file);
    if (!fs.existsSync(full)) continue;
    const content = fs.readFileSync(full, 'utf8');
    for (const rawLine of content.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) continue;
      const idx = line.indexOf('=');
      if (idx === -1) continue;
      const key = line.slice(0, idx).trim();
      let val = line.slice(idx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!(key in process.env)) process.env[key] = val;
    }
  }
}

loadEnvLocal();

const baseURL = 'http://127.0.0.1:3000';
const prisma = new PrismaClient({ datasourceUrl: process.env.QA_DATABASE_URL });

test.describe.configure({ mode: 'serial' });
test.use({ actionTimeout: 15_000 });

let adminCtx: APIRequestContext;
let merchantAccount: { id: string; email: string; ctx: APIRequestContext; merchantId: string; merchantSlug: string };
let otherMerchantAccount: { id: string; email: string; ctx: APIRequestContext; merchantId: string; merchantSlug: string };
const auditTestCampaignId = 'camp-audit-10-postas';

test.beforeAll(async () => {
  test.skip(process.env.QA_MODE !== 'true' || !process.env.QA_ADMIN_EMAIL, 'Requiere la base QA aislada.');

  // Autenticar superadmin
  adminCtx = await pwRequest.newContext({ baseURL });
  const loginRes = await adminCtx.post('/api/auth/login', {
    data: { email: process.env.QA_ADMIN_EMAIL, password: process.env.QA_ADMIN_PASSWORD },
  });
  expect(loginRes.status()).toBe(200);

  // Limpiar rate limits acumulados
  await prisma.rateLimitBucket.deleteMany({});

  // Crear 2 comercios de auditoría
  const suffix = randomUUID().slice(0, 6);
  const m1Res = await adminCtx.post('/api/admin/merchants', {
    data: { shoppingSlug: 'centenario', slug: `audit-merch-a-${suffix}`, name: `Audit Merchant A` },
  });
  expect(m1Res.status()).toBe(201);
  const m1 = (await m1Res.json()).merchant;

  const m2Res = await adminCtx.post('/api/admin/merchants', {
    data: { shoppingSlug: 'centenario', slug: `audit-merch-b-${suffix}`, name: `Audit Merchant B` },
  });
  expect(m2Res.status()).toBe(201);
  const m2 = (await m2Res.json()).merchant;

  // Asignar premios de Centenario únicamente a Merchant A
  const centenarioCampaign = await prisma.campaign.findUniqueOrThrow({ where: { slug: 'navidad-demo-centenario' } });
  const prizeIds = (await prisma.prize.findMany({ where: { campaignId: centenarioCampaign.id }, select: { id: true } })).map((p) => p.id);
  await adminCtx.put(`/api/admin/merchants/${m1.id}/prizes`, { data: { shoppingSlug: 'centenario', prizeIds } });

  // Crear cuentas de validador para Merchant A y Merchant B
  const createVal = async (merchId: string, label: string) => {
    const email = `audit-val-${label}-${randomUUID()}@example.invalid`;
    const password = `Audit-${randomUUID()}-123!`;
    const created = await adminCtx.post('/api/admin/users', {
      data: { name: `Val ${label}`, email, password, role: 'MERCHANT_VALIDATOR', shoppingSlugs: ['centenario'], merchantIds: [merchId] },
    });
    expect(created.status()).toBe(201);
    const userId = (await created.json()).user.id;
    const userCtx = await pwRequest.newContext({ baseURL });
    const logRes = await userCtx.post('/api/auth/login', { data: { email, password } });
    expect(logRes.status()).toBe(200);
    return { id: userId, email, ctx: userCtx, merchantId: merchId, merchantSlug: merchId === m1.id ? m1.slug : m2.slug };
  };

  merchantAccount = await createVal(m1.id, 'a');
  otherMerchantAccount = await createVal(m2.id, 'b');
});

test.afterAll(async () => {
  // Limpieza de campaña temporal de 10 postas si se creó
  try {
    await prisma.event.deleteMany({ where: { campaignId: auditTestCampaignId } });
    await prisma.participation.deleteMany({ where: { campaignId: auditTestCampaignId } });
    await prisma.collectionCard.deleteMany({ where: { progress: { campaignId: auditTestCampaignId } } });
    await prisma.collectionProgress.deleteMany({ where: { campaignId: auditTestCampaignId } });
    await prisma.inventoryMovement.deleteMany({ where: { campaignId: auditTestCampaignId } });
    await prisma.redeemCode.deleteMany({ where: { campaignId: auditTestCampaignId } });
    await prisma.prize.deleteMany({ where: { campaignId: auditTestCampaignId } });
    await prisma.card.deleteMany({ where: { campaignId: auditTestCampaignId } });
    await prisma.campaign.deleteMany({ where: { id: auditTestCampaignId } });
  } catch {}
  await prisma.$disconnect();
});

test.beforeEach(async () => {
  await prisma.rateLimitBucket.deleteMany({});
});

test('1. Recorrido completo con exactamente 10 postas requeridas (desbloquea en 10/10)', async () => {
  const shopping = await prisma.shopping.findUniqueOrThrow({ where: { slug: 'centenario' } });
  const now = new Date();

  // Crear campaña temporal con collectionTarget: 10 y 10 postas activas
  await prisma.campaign.upsert({
    where: { id: auditTestCampaignId },
    update: { status: 'ACTIVE' },
    create: {
      id: auditTestCampaignId,
      slug: 'audit-camp-10-postas',
      shoppingId: shopping.id,
      name: 'Auditoría 10 Postas',
      status: 'ACTIVE',
      startsAt: new Date(now.getTime() - 3600_000),
      endsAt: new Date(now.getTime() + 86400_000),
      settings: {
        collectionTarget: 10,
        completionRewardEnabled: true,
        completionRewardMode: 'EXTRA_RAFFLE_ENTRY',
        completionRewardTitle: 'Premio Especial 10 Postas',
      },
    },
  });

  // Pausar temporalmente navidad-demo-centenario para que la activa sea audit-camp-10-postas
  await prisma.campaign.update({ where: { id: 'camp-demo-centenario' }, data: { status: 'PAUSED' } });

  const cardPublicIds: string[] = [];
  for (let i = 1; i <= 10; i++) {
    const publicId = `AUDIT-10P-${String(i).padStart(3, '0')}`;
    cardPublicIds.push(publicId);
    await prisma.card.upsert({
      where: { shoppingId_publicId: { shoppingId: shopping.id, publicId } },
      update: { campaignId: auditTestCampaignId, status: 'ACTIVE' },
      create: {
        shoppingId: shopping.id,
        campaignId: auditTestCampaignId,
        publicId,
        status: 'ACTIVE',
        kind: 'ROULETTE',
      },
    });
  }

  const player = await pwRequest.newContext({ baseURL });

  try {
    for (let step = 0; step < 9; step++) {
      const cardId = cardPublicIds[step];
      const res = await player.post('/api/participations', {
        data: { shoppingSlug: 'centenario', cardId },
      });
      expect(res.status()).toBe(200);
      const json = await res.json();
      expect(json.completionReward.target).toBe(10);
      expect(json.completionReward.completedCount).toBe(step + 1);
      expect(json.completionReward.pendingCount).toBe(10 - (step + 1));
      expect(json.completionReward.unlocked).toBe(false);
      expect(json.completionReward.justUnlocked).toBe(false);
    }

    // Escaneo de la 10ª posta: debe desbloquear la recompensa exactamente aquí
    const finalRes = await player.post('/api/participations', {
      data: { shoppingSlug: 'centenario', cardId: cardPublicIds[9] },
    });
    expect(finalRes.status()).toBe(200);
    const finalJson = await finalRes.json();
    expect(finalJson.completionReward.target).toBe(10);
    expect(finalJson.completionReward.completedCount).toBe(10);
    expect(finalJson.completionReward.pendingCount).toBe(0);
    expect(finalJson.completionReward.unlocked).toBe(true);
    expect(finalJson.completionReward.justUnlocked).toBe(true);
    expect(finalJson.completionReward.bonusRaffleEntriesCount).toBe(1);
    expect(finalJson.completionReward.totalRaffleEntriesCount).toBe(11); // 10 scans + 1 bonus
  } finally {
    // Restaurar navidad-demo-centenario
    await prisma.campaign.update({ where: { id: 'camp-demo-centenario' }, data: { status: 'ACTIVE' } });
    await prisma.campaign.update({ where: { id: auditTestCampaignId }, data: { status: 'PAUSED' } });
  }
});

test('2. Antifraude y límites de identidad (cookie/sesión vs nuevo contexto)', async () => {
  const token = `player-${randomUUID()}`;
  // Dispositivo 1: con cookie de sesión establecida
  const device1 = await pwRequest.newContext({
    baseURL,
    extraHTTPHeaders: { Cookie: `navidad_player_session=${token}` },
  });
  const res1 = await device1.post('/api/participations', {
    data: { shoppingSlug: 'centenario', cardId: 'CEN-DEMO-001' },
  });
  expect(res1.status()).toBe(200);
  const data1 = await res1.json();
  expect(data1.alreadyParticipated).toBe(false);

  // Re-escaneo de la misma tarjeta en Dispositivo 1: el servidor detecta que ya fue jugada
  const resRepeat = await device1.post('/api/participations', {
    data: { shoppingSlug: 'centenario', cardId: 'CEN-DEMO-001' },
  });
  expect(resRepeat.status()).toBe(200);
  const dataRepeat = await resRepeat.json();
  expect(dataRepeat.alreadyParticipated).toBe(true);
  expect(dataRepeat.duplicateRejected).toBe(true);

  // Dispositivo 2 (simula borrado de cookies / ventana de incógnito nueva sin cookie previa)
  const device2 = await pwRequest.newContext({ baseURL });
  const res2 = await device2.post('/api/participations', {
    data: { shoppingSlug: 'centenario', cardId: 'CEN-DEMO-001' },
  });
  expect(res2.status()).toBe(200);
  const data2 = await res2.json();
  expect(data2.alreadyParticipated).toBe(false);
});

test('3. Permisos RBAC: bloqueo de /api/admin para no autorizados y validadores comerciales', async () => {
  // Petición anónima a /api/admin/campaigns -> 401 UNAUTHORIZED
  const anon = await pwRequest.newContext({ baseURL });
  const anonRes = await anon.get('/api/admin/campaigns?shoppingSlug=centenario');
  expect(anonRes.status()).toBe(401);

  // Petición con cuenta de validador de comercio a /api/admin/campaigns -> 403 FORBIDDEN
  const merchRes = await merchantAccount.ctx.get('/api/admin/campaigns?shoppingSlug=centenario');
  expect(merchRes.status()).toBe(403);

  // Petición con cuenta de validador de comercio a /api/admin/users -> 403 FORBIDDEN
  const merchUsersRes = await merchantAccount.ctx.get('/api/admin/users');
  expect(merchUsersRes.status()).toBe(403);
});

test('4. Integridad y seguridad: rechazo de manipulación en el cliente y no filtración de secretos', async () => {
  const player = await pwRequest.newContext({ baseURL });

  // Inyección de parámetros fraudulentos en /api/participations
  const tamperRes = await player.post('/api/participations', {
    data: {
      shoppingSlug: 'centenario',
      cardId: 'CEN-DEMO-002',
      prizeId: 'prize-demo-centenario-special-prize',
      forceWin: true,
      remainingStock: 999,
    },
  });
  expect(tamperRes.status()).toBe(400);
  const tamperBody = await tamperRes.json();
  expect(tamperBody.code).toBe('CLIENT_TAMPERING_DETECTED');

  // Endpoint público no debe filtrar datos sensibles
  const publicRes = await player.get('/api/campaigns/centenario/public');
  expect(publicRes.status()).toBe(200);
  const publicData = await publicRes.json();

  // Verificaciones de no-filtración
  expect(publicData.shopping).toBeDefined();
  expect(publicData.campaign).toBeDefined();
  expect(JSON.stringify(publicData)).not.toContain('passwordHash');
  expect(JSON.stringify(publicData)).not.toContain('codeEncrypted');
  expect(JSON.stringify(publicData)).not.toContain('sessionHash');

  // Los premios públicos no deben incluir weights o algoritmos internos
  for (const prize of publicData.prizes) {
    expect(prize).toHaveProperty('id');
    expect(prize).toHaveProperty('name');
    expect(prize).not.toHaveProperty('weight');
    expect(prize).not.toHaveProperty('referenceProbabilityPercent');
  }
});

test('5. Portal comercios: validación de comercio cruzado, canje duplicado y expiración', async () => {
  // Emitir un cupón ganador real
  let redeemCode: string | null = null;
  for (let i = 0; i < 20; i++) {
    const player = await pwRequest.newContext({ baseURL });
    const res = await player.post('/api/participations', {
      data: { shoppingSlug: 'centenario', cardId: `CEN-DEMO-${String((i % 10) + 1).padStart(3, '0')}` },
    });
    if (res.status() === 200) {
      const data = await res.json();
      if (data.status === 'won' && data.redeemCode) {
        redeemCode = data.redeemCode;
        break;
      }
    }
  }

  if (!redeemCode) {
    // Si la ruleta no cayó en premio en los primeros intentos, creamos un cupón de prueba vinculado a Merchant A
    const centenarioCampaign = await prisma.campaign.findUniqueOrThrow({ where: { slug: 'navidad-demo-centenario' } });
    const prize = await prisma.prize.findFirstOrThrow({ where: { campaignId: centenarioCampaign.id } });
    const code = `AUDIT-TEST-${randomUUID().slice(0, 8).toUpperCase()}`;
    const part = await prisma.participant.create({
      data: { shoppingId: centenarioCampaign.shoppingId, campaignId: centenarioCampaign.id, sessionHash: sha256(randomUUID()) },
    });
    const participation = await prisma.participation.create({
      data: {
        shoppingId: centenarioCampaign.shoppingId,
        campaignId: centenarioCampaign.id,
        participantId: part.id,
        cardId: (await prisma.card.findFirstOrThrow({ where: { campaignId: centenarioCampaign.id } })).id,
        status: 'WON',
        prizeId: prize.id,
        idempotencyKey: randomUUID(),
      },
    });
    await prisma.redeemCode.create({
      data: {
        codeHash: sha256(code),
        codeEncrypted: code,
        status: 'ISSUED',
        expiresAt: new Date(Date.now() + 86400_000),
        shoppingId: centenarioCampaign.shoppingId,
        campaignId: centenarioCampaign.id,
        participationId: participation.id,
        prizeId: prize.id,
      },
    });
    redeemCode = code;
  }

  // A. Intento de validación por comercio no autorizado (Merchant B no tiene asignado este premio)
  const crossMerchantRes = await otherMerchantAccount.ctx.post('/api/merchant/coupons/lookup', {
    data: { merchantSlug: otherMerchantAccount.merchantSlug, code: redeemCode },
  });
  expect(crossMerchantRes.status()).toBe(403);
  const crossBody = await crossMerchantRes.json();
  expect(crossBody.code).toBe('MERCHANT_NOT_AUTHORIZED');

  // B. Validación exitosa por comercio autorizado (Merchant A)
  const lookupRes = await merchantAccount.ctx.post('/api/merchant/coupons/lookup', {
    data: { merchantSlug: merchantAccount.merchantSlug, code: redeemCode },
  });
  expect(lookupRes.status()).toBe(200);
  const lookupBody = await lookupRes.json();
  expect(lookupBody.valid).toBe(true);

  // C. Canje efectivo del cupón
  const redeemRes = await merchantAccount.ctx.post('/api/merchant/coupons/redeem', {
    data: { merchantSlug: merchantAccount.merchantSlug, code: redeemCode },
  });
  expect(redeemRes.status()).toBe(200);

  // D. Intento de segundo canje duplicado -> 409 ALREADY_REDEEMED
  const dupRedeemRes = await merchantAccount.ctx.post('/api/merchant/coupons/lookup', {
    data: { merchantSlug: merchantAccount.merchantSlug, code: redeemCode },
  });
  expect(dupRedeemRes.status()).toBe(409);
  const dupBody = await dupRedeemRes.json();
  expect(dupBody.code).toBe('ALREADY_REDEEMED');
});

test('6. Carteles permanentes NFC/QR: resolución dinámica y manejo de carteles inactivos', async () => {
  const shopping = await prisma.shopping.findUniqueOrThrow({ where: { slug: 'centenario' } });
  const campaign = await prisma.campaign.findUniqueOrThrow({ where: { slug: 'navidad-demo-centenario' } });

  const activeLocSlug = `audit-loc-active-${randomUUID().slice(0, 6)}`;
  const inactiveLocSlug = `audit-loc-inactive-${randomUUID().slice(0, 6)}`;

  // Cartel 1: Activo
  const locActive = await prisma.location.create({
    data: {
      shoppingId: shopping.id,
      campaignId: campaign.id,
      slug: activeLocSlug,
      name: 'Cartel Permanente Entrada',
      active: true,
    },
  });

  // Vincular a una tarjeta activa
  const card = await prisma.card.findFirstOrThrow({ where: { shoppingId: shopping.id, campaignId: campaign.id } });
  await prisma.card.update({ where: { id: card.id }, data: { locationId: locActive.id } });

  // Cartel 2: Inactivo
  await prisma.location.create({
    data: {
      shoppingId: shopping.id,
      campaignId: campaign.id,
      slug: inactiveLocSlug,
      name: 'Cartel Permanente En Desuso',
      active: false,
    },
  });

  const client = await pwRequest.newContext({ baseURL, maxRedirects: 0 });

  // A. Cartel activo redirige al shopping con los parámetros de campaña y tarjeta
  const activeRes = await client.get(`/nfc/centenario/${activeLocSlug}`);
  expect(activeRes.status()).toBe(307);
  const redirectLocation = activeRes.headers()['location'];
  expect(redirectLocation).toContain('/centenario');
  expect(redirectLocation).toContain(`location=${activeLocSlug}`);
  expect(redirectLocation).toContain(`card=${card.publicId}`);

  // B. Cartel inactivo responde 404
  const inactiveRes = await client.get(`/nfc/centenario/${inactiveLocSlug}`);
  expect(inactiveRes.status()).toBe(404);
  const text = await inactiveRes.text();
  expect(text).toContain('No encontramos este cartel o está desactivado');

  // Limpieza de ubicaciones de auditoría
  await prisma.card.update({ where: { id: card.id }, data: { locationId: null } });
  await prisma.event.deleteMany({ where: { locationId: { in: [locActive.id] } } });
  await prisma.location.deleteMany({ where: { slug: { in: [activeLocSlug, inactiveLocSlug] } } });
});
