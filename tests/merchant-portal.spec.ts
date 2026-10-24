import AxeBuilder from '@axe-core/playwright';
import { expect, request as pwRequest, test, type APIRequestContext, type Page } from '@playwright/test';
import { randomUUID } from 'node:crypto';
import { PrismaClient } from '@prisma/client';

// Integración del portal de comercios contra la API real y la base QA aislada.
// Ejecutar con: npm run test:merchant (requiere QA_MODE=true, QA_ADMIN_* y datos demo cargados).
test.describe.configure({ mode: 'serial' });
test.use({ actionTimeout: 15_000 });

const baseURL = 'http://127.0.0.1:3000';
const prisma = new PrismaClient({ datasourceUrl: process.env.QA_DATABASE_URL });

type Account = { id: string; email: string; password: string; ctx: APIRequestContext };
let admin: APIRequestContext;
let merchantA: { id: string; slug: string };
let merchantB: { id: string; slug: string };
let a1: Account; let a2: Account; let b1: Account;
let prizeIds: string[] = [];
let cardCursor = 1;

async function login(email: string, password: string) {
  const ctx = await pwRequest.newContext({ baseURL });
  const res = await ctx.post('/api/auth/login', { data: { email, password } });
  return { ctx, status: res.status() };
}

async function createAccount(merchantId: string, label: string): Promise<Account> {
  const email = `qa-${label}-${randomUUID()}@example.invalid`;
  const password = `Qa-${randomUUID()}-A1!`;
  const created = await admin.post('/api/admin/users', { data: { name: `Cuenta ${label}`, email, password, role: 'MERCHANT_VALIDATOR', shoppingSlugs: ['centenario'], merchantIds: [merchantId] } });
  expect(created.status()).toBe(201);
  const id = (await created.json()).user.id as string;
  const { ctx, status } = await login(email, password);
  expect(status).toBe(200);
  return { id, email, password, ctx };
}

/** Juega tarjetas demo con participantes distintos hasta obtener un cupón ganador. */
async function wonCode() {
  for (let guard = 0; guard < 40; guard += 1) {
    const cardId = `CEN-DEMO-${String(((cardCursor++ - 1) % 10) + 1).padStart(3, '0')}`;
    const player = await pwRequest.newContext({ baseURL });
    const res = await player.post('/api/participations', { data: { shoppingSlug: 'centenario', cardId, idempotencyKey: randomUUID() } });
    const body = res.status() === 200 ? await res.json() : null;
    await player.dispose();
    if (body?.status === 'won' && body.redeemCode) return body.redeemCode as string;
  }
  throw new Error('No se pudo obtener un cupón ganador de prueba.');
}

test.beforeAll(async () => {
  test.skip(process.env.QA_MODE !== 'true' || !process.env.QA_ADMIN_EMAIL, 'Requiere la base QA aislada.');
  admin = await pwRequest.newContext({ baseURL });
  const res = await admin.post('/api/auth/login', { data: { email: process.env.QA_ADMIN_EMAIL, password: process.env.QA_ADMIN_PASSWORD } });
  expect(res.status()).toBe(200);
  const suffix = randomUUID().slice(0, 8);
  const mk = async (name: string) => (await (await admin.post('/api/admin/merchants', { data: { shoppingSlug: 'centenario', slug: `qa-${name}-${suffix}`, name: `QA ${name}` } })).json()).merchant;
  merchantA = await mk('a'); merchantB = await mk('b');
  const campaign = await prisma.campaign.findUniqueOrThrow({ where: { slug: 'navidad-demo-centenario' } });
  prizeIds = (await prisma.prize.findMany({ where: { campaignId: campaign.id }, select: { id: true } })).map((p) => p.id);
  // La base QA es desechable: se repone el stock demo y se limpian los límites para que la suite sea repetible.
  await prisma.$executeRaw`UPDATE prizes SET "remainingStock" = "totalStock" WHERE "campaignId" = ${campaign.id}`;
  await prisma.rateLimitBucket.deleteMany({});
  // Solo el comercio A está habilitado para los premios; B no.
  const put = await admin.put(`/api/admin/merchants/${merchantA.id}/prizes`, { data: { shoppingSlug: 'centenario', prizeIds } });
  expect(put.status()).toBe(200);
  a1 = await createAccount(merchantA.id, 'a1');
  a2 = await createAccount(merchantA.id, 'a2');
  b1 = await createAccount(merchantB.id, 'b1');
});

test.afterAll(async () => { await prisma.$disconnect(); });

test('1 y 11: login y sesión con comercio fijo en el servidor', async () => {
  const session = await a1.ctx.get('/api/merchant/session');
  expect(session.status()).toBe(200);
  expect((await session.json()).merchant.slug).toBe(merchantA.slug);
  expect((await (await b1.ctx.get('/api/merchant/session')).json()).merchant.slug).toBe(merchantB.slug);
  const anonymous = await pwRequest.newContext({ baseURL });
  expect((await anonymous.get('/api/merchant/session')).status()).toBe(401);
  expect((await login(a1.email, 'contraseña-incorrecta-123')).status).toBe(401);
});

test('3, 4 y 13: consulta por QR y código manual con las mismas reglas, sin datos personales', async () => {
  const code = await wonCode();
  const viaQr = await a1.ctx.post('/api/merchant/coupons/lookup', { data: { code } });
  const manual = await a1.ctx.post('/api/merchant/coupons/lookup', { data: { code: ` ${code.toLowerCase().replace(/-/g, ' - ')} ` } });
  expect(viaQr.status()).toBe(200);
  expect(manual.status()).toBe(200);
  const first = await viaQr.json();
  expect(await manual.json()).toEqual(first);
  expect(first.maskedCode).toMatch(/^••••-/);
  expect(JSON.stringify(first)).not.toContain(code);
  expect(JSON.stringify(first).toLowerCase()).not.toMatch(/phone|tel[eé]fono|sessionhash/);
  // Formato inválido: rechazado por validación, sin tocar la base.
  expect((await a1.ctx.post('/api/merchant/coupons/lookup', { data: { code: 'x$%&/()=' } })).status()).toBeGreaterThanOrEqual(400);
  // La consulta nunca canjea.
  expect((await prisma.redeemCode.count({ where: { status: 'REDEEMED', redeemedMerchantId: merchantA.id } }))).toBe(await prisma.redeemCode.count({ where: { status: 'REDEEMED', redeemedMerchantId: merchantA.id } }));
});

test('5, 6 y 10: canje válido, repetición idempotente y segundo canje rechazado', async () => {
  const code = await wonCode();
  const redeem = await a1.ctx.post('/api/merchant/coupons/redeem', { data: { code } });
  expect(redeem.status()).toBe(200);
  const body = await redeem.json();
  expect(body.ok).toBe(true);
  expect(body.alreadyRedeemed).toBeUndefined();
  const record = await prisma.redeemCode.findFirstOrThrow({ where: { status: 'REDEEMED', redeemedById: a1.id }, orderBy: { redeemedAt: 'desc' } });
  expect(record.redeemedMerchantId).toBe(merchantA.id);
  expect(record.redeemedAt).toBeTruthy();
  // Reintento por pérdida de conexión (misma cuenta): no duplica.
  const retry = await a1.ctx.post('/api/merchant/coupons/redeem', { data: { code } });
  expect(retry.status()).toBe(200);
  expect((await retry.json()).alreadyRedeemed).toBe(true);
  expect(await prisma.redeemCode.count({ where: { id: record.id, status: 'REDEEMED' } })).toBe(1);
  // Otra cuenta, aunque sea del mismo comercio: ya utilizado.
  const other = await a2.ctx.post('/api/merchant/coupons/redeem', { data: { code } });
  expect(other.status()).toBe(409);
  expect((await other.json()).code).toBe('ALREADY_REDEEMED');
  const lookup = await a2.ctx.post('/api/merchant/coupons/lookup', { data: { code } });
  expect(lookup.status()).toBe(409);
});

test('7: cupón vencido y anulado son rechazados', async () => {
  const expired = await wonCode();
  const revoked = await wonCode();
  const hashOf = async (code: string) => (await import('../src/lib/security')).sha256(code.replace(/\s+/g, '').toUpperCase());
  await prisma.redeemCode.update({ where: { codeHash: await hashOf(expired) }, data: { expiresAt: new Date(Date.now() - 60_000) } });
  await prisma.redeemCode.update({ where: { codeHash: await hashOf(revoked) }, data: { status: 'REVOKED' } });
  for (const [code, expected] of [[expired, 'CODE_EXPIRED'], [revoked, 'CODE_REVOKED']] as const) {
    for (const path of ['lookup', 'redeem']) {
      const res = await a1.ctx.post(`/api/merchant/coupons/${path}`, { data: { code } });
      expect(res.status()).toBe(410);
      expect((await res.json()).code).toBe(expected);
    }
  }
});

test('8: un comercio no autorizado no puede consultar ni canjear, ni elegir otro local', async () => {
  const code = await wonCode();
  for (const path of ['lookup', 'redeem']) {
    const res = await b1.ctx.post(`/api/merchant/coupons/${path}`, { data: { code } });
    expect(res.status()).toBe(403);
    expect((await res.json()).code).toBe('MERCHANT_NOT_AUTHORIZED');
  }
  // Intentar suplantar al comercio A mediante parámetros.
  const spoof = await b1.ctx.post('/api/merchant/coupons/redeem', { data: { code, merchantSlug: merchantA.slug } });
  expect(spoof.status()).toBe(403);
  expect((await b1.ctx.get(`/api/merchant/coupons/history?merchantSlug=${merchantA.slug}`)).status()).toBe(403);
  // El cupón sigue disponible para el comercio habilitado.
  expect((await a1.ctx.post('/api/merchant/coupons/lookup', { data: { code } })).status()).toBe(200);
});

test('9: dos canjes simultáneos producen como máximo un éxito real', async () => {
  const code = await wonCode();
  const results = await Promise.all([
    a1.ctx.post('/api/merchant/coupons/redeem', { data: { code } }),
    a2.ctx.post('/api/merchant/coupons/redeem', { data: { code } }),
  ]);
  const bodies = await Promise.all(results.map(async (r) => ({ status: r.status(), body: await r.json() })));
  const fresh = bodies.filter(({ status, body }) => status === 200 && !body.alreadyRedeemed);
  expect(fresh).toHaveLength(1);
  expect(bodies.filter(({ status }) => status !== 200).every(({ status }) => status === 409)).toBe(true);
  const hash = (await import('../src/lib/security')).sha256(code.replace(/\s+/g, '').toUpperCase());
  const rows = await prisma.redeemCode.findMany({ where: { codeHash: hash } });
  expect(rows).toHaveLength(1);
  expect(rows[0].status).toBe('REDEEMED');
});

test('11: el historial solo muestra operaciones del comercio autenticado', async () => {
  const mine = await (await a1.ctx.get('/api/merchant/coupons/history')).json();
  expect(mine.redemptions.length).toBeGreaterThan(0);
  const ids = mine.redemptions.map((r: { id: string }) => r.id);
  const foreign = await prisma.redeemCode.count({ where: { id: { in: ids }, NOT: { redeemedMerchantId: merchantA.id } } });
  expect(foreign).toBe(0);
  expect(JSON.stringify(mine)).not.toMatch(/codeEncrypted|codeHash/);
  const theirs = await (await b1.ctx.get('/api/merchant/coupons/history')).json();
  expect(theirs.redemptions).toHaveLength(0);
  expect(theirs.todayCount).toBe(0);
});

test('2: una cuenta suspendida pierde el acceso de inmediato y no puede volver a ingresar', async () => {
  const suspended = await admin.patch(`/api/admin/users/${a2.id}`, { data: { active: false } });
  expect(suspended.status()).toBe(200);
  expect((await a2.ctx.get('/api/merchant/session')).status()).toBe(401);
  expect((await a2.ctx.post('/api/merchant/coupons/lookup', { data: { code: 'AAAA-BBBB-CCCC-DDDD' } })).status()).toBe(401);
  expect((await login(a2.email, a2.password)).status).toBe(401);
  // Reactivar no revive la sesión anterior (sessionVersion incrementado).
  await admin.patch(`/api/admin/users/${a2.id}`, { data: { active: true } });
  expect((await a2.ctx.get('/api/merchant/session')).status()).toBe(401);
  expect((await login(a2.email, a2.password)).status).toBe(200);
});

test('10: un comercio no puede acceder a endpoints de administración', async () => {
  for (const path of ['/api/admin/summary?shoppingSlug=centenario', '/api/admin/prizes?shoppingSlug=centenario', '/api/admin/users']) {
    const res = await a1.ctx.get(path);
    expect([401, 403]).toContain(res.status());
  }
  const campaign = await prisma.campaign.findUniqueOrThrow({ where: { slug: 'navidad-demo-centenario' } });
  const stockBefore = await prisma.prize.count();
  const forged = await a1.ctx.post('/api/admin/prizes', { data: { shoppingSlug: 'centenario', campaignId: campaign.id, name: 'Premio forjado', stock: 999, weight: 1 } });
  expect([401, 403]).toContain(forged.status());
  expect(await prisma.prize.count()).toBe(stockBefore);
  const tamper = await a1.ctx.patch(`/api/admin/users/${a1.id}`, { data: { active: true } });
  expect([401, 403]).toContain(tamper.status());
});

/** Juega con un participante que conserva su cookie para consultar luego sus cupones. */
async function wonWithPlayer() {
  for (let guard = 0; guard < 40; guard += 1) {
    const cardId = `CEN-DEMO-${String(((cardCursor++ - 1) % 10) + 1).padStart(3, '0')}`;
    const player = await pwRequest.newContext({ baseURL });
    const res = await player.post('/api/participations', { data: { shoppingSlug: 'centenario', cardId, idempotencyKey: randomUUID() } });
    const body = res.status() === 200 ? await res.json() : null;
    if (body?.status === 'won' && body.redeemCode) return { player, code: body.redeemCode as string };
    await player.dispose();
  }
  throw new Error('No se pudo obtener un cupón ganador de prueba.');
}

test('12: el participante ve solo sus cupones, con QR únicamente mientras están disponibles', async () => {
  const { player, code } = await wonWithPlayer();
  const other = await pwRequest.newContext({ baseURL });
  const anonymous = await pwRequest.newContext({ baseURL });
  try {
    const mine = await (await player.get('/api/coupons?shoppingSlug=centenario')).json();
    expect(mine.coupons).toHaveLength(1);
    const coupon = mine.coupons[0];
    expect(coupon.state).toBe('available');
    expect(coupon.code).toBe(code);
    expect(coupon.qr).toMatch(/^data:image\/png;base64,/);
    expect(coupon.merchants).toContain('QA a');
    expect(JSON.stringify(mine).toLowerCase()).not.toMatch(/phone|tel[eé]fono|sessionhash|codehash|codeencrypted/);
    // Otro participante y una visita sin cookie no ven ese cupón (ni se les crea sesión).
    expect((await (await other.get('/api/coupons?shoppingSlug=centenario')).json()).coupons).toEqual([]);
    const noCookie = await anonymous.get('/api/coupons?shoppingSlug=centenario');
    expect((await noCookie.json()).coupons).toEqual([]);
    expect(noCookie.headers()['set-cookie']).toBeUndefined();
    expect(noCookie.headers()['cache-control']).toContain('no-store');
    // Un slug que no existe se rechaza por validación.
    expect((await player.get('/api/coupons?shoppingSlug=otro')).status()).toBe(400);

    // Canjeado: el estado cambia y el código y el QR dejan de exponerse.
    expect((await a1.ctx.post('/api/merchant/coupons/redeem', { data: { code } })).status()).toBe(200);
    const after = (await (await player.get('/api/coupons?shoppingSlug=centenario')).json()).coupons[0];
    expect(after.state).toBe('redeemed');
    expect(after.redeemedAt).toBeTruthy();
    expect(after.code).toBeUndefined();
    expect(after.qr).toBeUndefined();
  } finally { await player.dispose(); await other.dispose(); await anonymous.dispose(); }
});

test('12b: cupón vencido o anulado se muestra con su estado y sin código', async () => {
  const hashOf = async (value: string) => (await import('../src/lib/security')).sha256(value.replace(/\s+/g, '').toUpperCase());
  const expired = await wonWithPlayer();
  const voided = await wonWithPlayer();
  try {
    await prisma.redeemCode.update({ where: { codeHash: await hashOf(expired.code) }, data: { expiresAt: new Date(Date.now() - 60_000) } });
    await prisma.redeemCode.update({ where: { codeHash: await hashOf(voided.code) }, data: { status: 'REVOKED' } });
    const e = (await (await expired.player.get('/api/coupons?shoppingSlug=centenario')).json()).coupons[0];
    const v = (await (await voided.player.get('/api/coupons?shoppingSlug=centenario')).json()).coupons[0];
    expect(e.state).toBe('expired');
    expect(v.state).toBe('void');
    for (const item of [e, v]) { expect(item.code).toBeUndefined(); expect(item.qr).toBeUndefined(); }
  } finally { await expired.player.dispose(); await voided.player.dispose(); }
});


async function expectAccessible(page: Page, label: string) {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  const serious = results.violations.filter((violation) => violation.impact === 'serious' || violation.impact === 'critical');
  expect(serious.map((violation) => `${label} → ${violation.id}: ${violation.nodes.slice(0, 3).map((node) => node.target.join(' ')).join(' | ')}`)).toEqual([]);
}

for (const scheme of ['light', 'dark'] as const) {
  test(`accesibilidad (axe) de las pantallas autenticadas del portal en modo ${scheme}`, async ({ browser }) => {
    test.setTimeout(120_000);
    const code = await wonCode();
    const context = await browser.newContext({ storageState: await a1.ctx.storageState(), colorScheme: scheme, viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    try {
      await page.goto('/merchant');
      await expect(page.getByText('Canjes de hoy')).toBeVisible();
      await expectAccessible(page, 'inicio');
      await page.getByRole('button', { name: 'Ingresar código manualmente' }).click();
      await expectAccessible(page, 'entrada manual');
      await page.getByRole('button', { name: 'Escanear QR' }).click();
      await page.getByRole('button', { name: 'Permitir cámara y escanear' }).click();
      await expect(page.getByRole('region', { name: 'Escaneá el QR' }).getByRole('alert')).toBeVisible();
      await expectAccessible(page, 'escáner con error de cámara');
      await page.getByRole('button', { name: 'Cerrar', exact: true }).click();
      await page.getByLabel('Código del cupón').fill(code);
      await page.getByRole('button', { name: 'Consultar cupón' }).click();
      await expect(page.getByRole('button', { name: 'Confirmar canje' })).toBeVisible();
      await expectAccessible(page, 'confirmación');
      await page.getByRole('button', { name: 'Confirmar canje' }).click();
      await expect(page.getByRole('heading', { name: 'Cupón canjeado correctamente' })).toBeVisible();
      await expectAccessible(page, 'resultado exitoso');
      await page.getByRole('button', { name: 'Validar otro cupón' }).click();
      await page.getByRole('button', { name: 'Ingresar código manualmente' }).click();
      await page.getByLabel('Código del cupón').fill('ZZZZ-ZZZZ-ZZZZ-ZZZZ');
      await page.getByRole('button', { name: 'Consultar cupón' }).click();
      await expect(page.getByRole('alert').filter({ hasText: /inválido|no es válido/i })).toBeVisible();
      await expectAccessible(page, 'cupón inválido');
      await page.getByRole('button', { name: /Historial/ }).click();
      await expect(page.getByRole('heading', { name: 'Historial de canjes' })).toBeVisible();
      await expectAccessible(page, 'historial');
      await page.getByRole('button', { name: 'Seguridad' }).click();
      await expect(page.getByRole('heading', { name: 'Seguridad' })).toBeVisible();
      await expectAccessible(page, 'seguridad');
    } finally { await context.close(); }
  });
}
