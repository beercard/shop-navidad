// Capturas de revisión visual. Uso: node scripts/ux-shots.mjs <carpeta-salida>
// Requiere el servidor en 127.0.0.1:3000 con QA_MODE=true y la base QA con datos demo.
// Crea un comercio y un validador de prueba en la base QA (desechable) para fotografiar el portal autenticado.
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import nextEnv from '@next/env';
import { chromium, request as pwRequest } from '@playwright/test';

nextEnv.loadEnvConfig(process.cwd());
const out = path.resolve(process.argv[2] ?? 'docs/ux-redesign/v5/before');
await mkdir(out, { recursive: true });
const base = 'http://127.0.0.1:3000';
const mobile = { width: 390, height: 844 };
const small = { width: 320, height: 640 };
const desktop = { width: 1440, height: 900 };
const log = (m) => console.log(m);

const browser = await chromium.launch();
const shot = async (page, name, full = true) => { await page.waitForTimeout(500); await page.screenshot({ path: path.join(out, `${name}.png`), fullPage: full }); log(`ok ${name}`); };

async function ctx(viewport, extra = {}) {
  return browser.newContext({ viewport, deviceScaleFactor: viewport.width < 500 ? 2 : 1, colorScheme: process.env.UX_SCHEME === 'dark' ? 'dark' : 'light', ...extra });
}

// 1) Público
for (const slug of ['centenario', 'uniplaza']) {
  for (const [label, vp] of [['390', mobile], ['1440', desktop]]) {
    const c = await ctx(vp); const page = await c.newPage();
    await page.goto(`${base}/${slug}`, { waitUntil: 'networkidle' });
    await shot(page, `${slug}-home-${label}`);
    if (label === '390') {
      for (const tab of ['Jugar', 'Premios', 'Mi progreso']) {
        const b = page.getByRole('button', { name: tab, exact: true });
        if (await b.count()) { await b.first().click(); await shot(page, `${slug}-${tab.toLowerCase().replace(' ', '-')}-390`); }
      }
    }
    await c.close();
  }
}

// 2) Participación por tarjeta (flujo real, resultado del servidor)
{
  const c = await ctx(mobile); const page = await c.newPage();
  await page.goto(`${base}/centenario/participar/CEN-DEMO-006`, { waitUntil: 'networkidle' });
  await shot(page, 'participar-antes-390');
  const play = page.getByRole('button', { name: /Participar|Girar/ });
  if (await play.count()) { await play.first().click(); await page.waitForTimeout(6000); await shot(page, 'participar-resultado-390'); }
  await c.close();
}

// 3) Portal de comercios (autenticado)
const admin = await pwRequest.newContext({ baseURL: base });
const adminLogin = await admin.post('/api/auth/login', { data: { email: process.env.QA_ADMIN_EMAIL, password: process.env.QA_ADMIN_PASSWORD } });
if (adminLogin.status() === 200) {
  const suffix = randomUUID().slice(0, 6);
  const merchant = (await (await admin.post('/api/admin/merchants', { data: { shoppingSlug: 'centenario', slug: `ux-${suffix}`, name: 'Óptica Lumbre' } })).json()).merchant;
  const prizes = (await (await admin.get('/api/admin/prizes?shoppingSlug=centenario')).json()).prizes.map((p) => p.id);
  await admin.put(`/api/admin/merchants/${merchant.id}/prizes`, { data: { shoppingSlug: 'centenario', prizeIds: prizes } });
  const email = `ux-${suffix}@example.invalid`; const password = `Ux-${randomUUID()}-A1!`;
  await admin.post('/api/admin/users', { data: { name: 'Caja principal', email, password, role: 'MERCHANT_VALIDATOR', shoppingSlugs: ['centenario'], merchantIds: [merchant.id] } });
  // Un cupón ganador real para fotografiar la confirmación y el resultado.
  let code = null;
  for (let i = 1; i <= 10 && !code; i += 1) {
    const player = await pwRequest.newContext({ baseURL: base });
    const r = await player.post('/api/participations', { data: { shoppingSlug: 'centenario', cardId: `CEN-DEMO-${String(i).padStart(3, '0')}`, idempotencyKey: randomUUID() } });
    const b = r.status() === 200 ? await r.json() : null; await player.dispose();
    if (b?.status === 'won') code = b.redeemCode;
  }
  for (const [label, vp] of [['390', mobile], ['320', small], ['1440', desktop]]) {
    const c = await ctx(vp, label === '390' ? { permissions: [] } : {}); const page = await c.newPage();
    await page.goto(`${base}/merchant`, { waitUntil: 'networkidle' });
    await shot(page, `merchant-login-${label}`);
    await page.getByLabel('Correo').fill(email); await page.getByLabel('Contraseña').fill(password);
    await page.getByRole('button', { name: 'Ingresar' }).click();
    await page.waitForSelector('text=Canjes de hoy', { timeout: 20000 }).catch(() => undefined);
    await shot(page, `merchant-home-${label}`);
    if (label !== '1440') {
      await page.getByRole('button', { name: 'Escanear QR' }).click();
      await page.getByRole('button', { name: 'Permitir cámara y escanear' }).click().catch(() => undefined);
      await page.waitForTimeout(1500);
      await shot(page, `merchant-scanner-error-${label}`);
      await page.getByRole('button', { name: 'Cerrar', exact: true }).click().catch(() => undefined);
    }
    if (code && label === '390') {
      await page.getByRole('button', { name: 'Ingresar código manualmente' }).click();
      await page.getByLabel('Código del cupón').fill(code);
      await page.getByRole('button', { name: 'Consultar cupón' }).click();
      await page.waitForSelector('text=Confirmar canje', { timeout: 15000 }).catch(() => undefined);
      await shot(page, 'merchant-confirm-390');
      await page.getByRole('button', { name: 'Confirmar canje' }).click().catch(() => undefined);
      await page.waitForTimeout(1500);
      await shot(page, 'merchant-success-390');
      await page.getByRole('button', { name: 'Validar otro cupón' }).click().catch(() => undefined);
      await page.getByRole('button', { name: /Historial/ }).click().catch(() => undefined);
      await shot(page, 'merchant-history-390');
    }
    await c.close();
  }

  // 4) Admin
  const c = await ctx(desktop); const page = await c.newPage();
  await page.goto(`${base}/admin`, { waitUntil: 'networkidle' });
  await shot(page, 'admin-login-1440');
  await page.getByLabel('Correo').fill(process.env.QA_ADMIN_EMAIL); await page.getByLabel('Contraseña').fill(process.env.QA_ADMIN_PASSWORD);
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await page.waitForTimeout(2500);
  await shot(page, 'admin-overview-1440');
  for (const tab of ['Premios y stock', 'Comercios', 'Usuarios y roles', 'Validar canje']) {
    const b = page.getByRole('button', { name: tab }).first();
    if (await b.count()) { await b.click(); await page.waitForTimeout(1200); await shot(page, `admin-${tab.toLowerCase().replace(/[^a-z]+/g, '-')}-1440`); }
  }
  await c.close();
  const m = await ctx(mobile); const mp = await m.newPage();
  await mp.goto(`${base}/admin`, { waitUntil: 'networkidle' });
  await mp.getByLabel('Correo').fill(process.env.QA_ADMIN_EMAIL); await mp.getByLabel('Contraseña').fill(process.env.QA_ADMIN_PASSWORD);
  await mp.getByRole('button', { name: 'Ingresar' }).click(); await mp.waitForTimeout(2500);
  await shot(mp, 'admin-overview-390');
  await m.close();
} else { log(`Login de admin falló (${adminLogin.status()}); se omiten portal y admin.`); }

await browser.close();
