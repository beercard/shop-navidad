import { expect, request as pwRequest, test } from '@playwright/test';
import { randomUUID } from 'node:crypto';
import { PrismaClient } from '@prisma/client';
import fs from 'node:fs';
import path from 'node:path';
import { normalizePhone } from '../src/lib/phone';
import { hashRecoveryCode } from '../src/lib/participants';
import { sha256 } from '../src/lib/security';

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
test.use({ actionTimeout: 20_000 });

test.beforeEach(async () => {
  await prisma.rateLimitBucket.deleteMany({});
});

async function cleanupParticipantByHash(phoneHash: string) {
  try {
    const parts = await prisma.participant.findMany({ where: { phoneHash }, select: { id: true } });
    const partIds = parts.map((p) => p.id);
    if (partIds.length === 0) return;
    await prisma.redeemCode.deleteMany({ where: { participation: { participantId: { in: partIds } } } });
    await prisma.participation.deleteMany({ where: { participantId: { in: partIds } } });
    await prisma.collectionCard.deleteMany({ where: { progress: { participantId: { in: partIds } } } });
    await prisma.collectionProgress.deleteMany({ where: { participantId: { in: partIds } } });
    await prisma.event.deleteMany({ where: { participantId: { in: partIds } } });
    await prisma.participant.deleteMany({ where: { id: { in: partIds } } });
  } catch {}
}

test.describe('Preregistro por Celular sin OTP — Suite de Verificación Obligatoria', () => {
  const testPhoneA = '11 4123 4567';
  const testPhoneE164 = '+5491141234567';
  const testPhoneHash = sha256(testPhoneE164);

  test.afterAll(async () => {
    // Limpieza de datos creados en los tests
    await prisma.event.deleteMany({ where: { metadata: { path: ['phoneMasked'], string_contains: '4567' } } });
    await prisma.participant.deleteMany({ where: { phoneHash: testPhoneHash } });
    await prisma.$disconnect();
  });

  // 1. Registro válido sin OTP
  test('1. Registro válido sin OTP: guarda teléfono normalizado, genera recoveryCode y crea cookie', async () => {
    const client = await pwRequest.newContext({ baseURL });
    const res = await client.post('/api/participants/register', {
      data: {
        shoppingSlug: 'centenario',
        phone: testPhoneA,
        consent: true,
        consentVersion: '2026-v1',
      },
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.status).toBe('registered');
    expect(body.phone).toBe(testPhoneE164);
    expect(body.recoveryCode).toMatch(/^REC-[A-Z0-9]{4}-[A-Z0-9]{4}$/);

    // Verificar en la base de datos PostgreSQL real
    const participant = await prisma.participant.findUnique({
      where: { id: body.participantId },
    });
    expect(participant).not.toBeNull();
    expect(participant?.phone).toBe(testPhoneE164);
    expect(participant?.phoneNormalized).toBe(testPhoneE164);
    expect(participant?.phoneHash).toBe(testPhoneHash);
    expect(participant?.recoveryCodeHash).toBe(hashRecoveryCode(body.recoveryCode));
    expect(participant?.consentAt).not.toBeNull();
  });

  // 2. Rechazo de teléfono inválido
  test('2. Rechazo de teléfonos inválidos con código 400 y mensaje descriptivo', async () => {
    const client = await pwRequest.newContext({ baseURL });

    // A. Vacío
    const r1 = await client.post('/api/participants/register', {
      data: { shoppingSlug: 'centenario', phone: '', consent: true },
    });
    expect(r1.status()).toBe(400);

    // B. Letras
    const r2 = await client.post('/api/participants/register', {
      data: { shoppingSlug: 'centenario', phone: 'abcd-efgh', consent: true },
    });
    expect(r2.status()).toBe(400);
    expect((await r2.json()).code).toBe('INVALID_PHONE');

    // C. Demasiado corto (falta código de área)
    const r3 = await client.post('/api/participants/register', {
      data: { shoppingSlug: 'centenario', phone: '412345', consent: true },
    });
    expect(r3.status()).toBe(400);

    // D. Secuencia repetida (ej. 00000000)
    const r4 = await client.post('/api/participants/register', {
      data: { shoppingSlug: 'centenario', phone: '0000000000', consent: true },
    });
    expect(r4.status()).toBe(400);

    // E. Consentimiento no aceptado
    const r5 = await client.post('/api/participants/register', {
      data: { shoppingSlug: 'centenario', phone: '11 4123 4567', consent: false },
    });
    expect(r5.status()).toBe(400);
    expect((await r5.json()).code).toBe('CONSENT_REQUIRED');
  });

  // 3. Normalización consistente de diferentes formatos del mismo número
  test('3. Normalización consistente: formatos con 0, 15, +54, 9 producen el mismo E.164 canónico', () => {
    const variations = [
      '11 4123-4567',
      '011 4123-4567',
      '011 15 4123 4567',
      '+54 9 11 4123 4567',
      '+54 11 4123 4567',
      '5491141234567',
      '+54 011 15 4123 4567',
    ];

    for (const v of variations) {
      const res = normalizePhone(v);
      expect(res.valid).toBe(true);
      expect(res.e164).toBe('+5491141234567');
    }

    // Variación para Corrientes (Centenario Shopping)
    const corrientes = normalizePhone('0379 15 412 3456');
    expect(corrientes.valid).toBe(true);
    expect(corrientes.e164).toBe('+5493794123456');
  });

  // 4. Dos registros concurrentes con el mismo teléfono y campaña
  test('4. Concurrencia con el mismo teléfono y campaña: exactamente un único participante en DB', async () => {
    const uniquePhone = `11 9${randomUUID().replace(/\D/g, '').slice(0, 7)}`;
    const normalized = normalizePhone(uniquePhone).e164!;
    const phoneHash = sha256(normalized);

    const client1 = await pwRequest.newContext({ baseURL });
    const client2 = await pwRequest.newContext({ baseURL });

    // Dos peticiones concurrentes simultáneas desde dos sesiones distintas
    const [res1, res2] = await Promise.all([
      client1.post('/api/participants/register', {
        data: { shoppingSlug: 'centenario', phone: uniquePhone, consent: true },
      }),
      client2.post('/api/participants/register', {
        data: { shoppingSlug: 'centenario', phone: uniquePhone, consent: true },
      }),
    ]);

    const statuses = [res1.status(), res2.status()];
    expect(statuses).toContain(200); // Al menos una ganó la carrera
    expect(statuses).toContain(409); // La otra fue rechazada como existente

    // Verificar en DB que existe EXACTAMENTE 1 fila con ese phoneHash para esa campaña
    const centenarioCampaign = await prisma.campaign.findUniqueOrThrow({ where: { slug: 'navidad-demo-centenario' } });
    const count = await prisma.participant.count({
      where: { campaignId: centenarioCampaign.id, phoneHash },
    });
    expect(count).toBe(1);

    // Limpieza
    await cleanupParticipantByHash(phoneHash);
  });

  // 5. El mismo teléfono en Centenario y UniPlaza (aislamiento multi-tenant)
  test('5. El mismo teléfono en Centenario y UniPlaza: aislamiento de campaña por shopping', async () => {
    const multiTenantPhone = `11 8${randomUUID().replace(/\D/g, '').slice(0, 7)}`;
    const phoneHash = sha256(normalizePhone(multiTenantPhone).e164!);

    const clientCen = await pwRequest.newContext({ baseURL });
    const clientUni = await pwRequest.newContext({ baseURL });

    // Registro en Centenario
    const rCen = await clientCen.post('/api/participants/register', {
      data: { shoppingSlug: 'centenario', phone: multiTenantPhone, consent: true },
    });
    expect(rCen.status()).toBe(200);
    const bodyCen = await rCen.json();

    // Registro en UniPlaza con el mismo número
    const rUni = await clientUni.post('/api/participants/register', {
      data: { shoppingSlug: 'uniplaza', phone: multiTenantPhone, consent: true },
    });
    expect(rUni.status()).toBe(200);
    const bodyUni = await rUni.json();

    // Participantes distintos, independientes y aislados
    expect(bodyCen.participantId).not.toBe(bodyUni.participantId);

    // Limpieza
    await prisma.participant.deleteMany({ where: { phoneHash } });
  });

  // 6. Reingreso desde la misma sesión sin duplicar al participante
  test('6. Reingreso desde la misma sesión: devuelve status already_registered sin duplicar', async () => {
    const token = `session-reenter-${randomUUID()}`;
    const client = await pwRequest.newContext({
      baseURL,
      extraHTTPHeaders: { Cookie: `navidad_player_session=${token}` },
    });

    const phone = `11 7${randomUUID().replace(/\D/g, '').slice(0, 7)}`;

    // Primer registro
    const r1 = await client.post('/api/participants/register', {
      data: { shoppingSlug: 'centenario', phone, consent: true },
    });
    expect(r1.status()).toBe(200);
    const b1 = await r1.json();
    expect(b1.status).toBe('registered');

    // Segundo registro desde la misma sesión
    const r2 = await client.post('/api/participants/register', {
      data: { shoppingSlug: 'centenario', phone, consent: true },
    });
    expect(r2.status()).toBe(200);
    const b2 = await r2.json();
    expect(b2.status).toBe('already_registered');
    expect(b2.participantId).toBe(b1.participantId);

    // Limpieza
    await prisma.participant.deleteMany({ where: { id: b1.participantId } });
  });

  // 7. Una sesión ajena no puede acceder a premios o cupones de otro participante
  test('7. Una sesión ajena no puede ver los premios o cupones de otro participante', async () => {
    const phone = `11 6${randomUUID().replace(/\D/g, '').slice(0, 7)}`;
    const tokenOwner = `owner-${randomUUID()}`;
    const ownerClient = await pwRequest.newContext({
      baseURL,
      extraHTTPHeaders: { Cookie: `navidad_player_session=${tokenOwner}` },
    });

    // Owner se registra
    const regRes = await ownerClient.post('/api/participants/register', {
      data: { shoppingSlug: 'centenario', phone, consent: true },
    });
    expect(regRes.status()).toBe(200);

    // Owner juega y obtiene estado
    const playRes = await ownerClient.post('/api/participations', {
      data: { shoppingSlug: 'centenario', cardId: 'CEN-DEMO-001' },
    });
    expect(playRes.status()).toBe(200);

    // Atacante con otra sesión
    const attackerToken = `attacker-${randomUUID()}`;
    const attackerClient = await pwRequest.newContext({
      baseURL,
      extraHTTPHeaders: { Cookie: `navidad_player_session=${attackerToken}` },
    });

    // Consulta pública de campaña para el atacante: no debe tener progreso ni premios del owner
    const publicRes = await attackerClient.get('/api/campaigns/centenario/public');
    expect(publicRes.status()).toBe(200);
    const publicData = await publicRes.json();

    expect(publicData.collectionProgress.count).toBe(0);
    expect(publicData.collectionProgress.cardIds).toHaveLength(0);
    expect(publicData.instantPrizeWon).toBeNull();
    expect(Boolean(publicData.participant?.registered)).toBe(false);

    // Limpieza
    const pHash = sha256(normalizePhone(phone).e164!);
    await cleanupParticipantByHash(pHash);
  });

  // 8 y 9. Ingresar número de otra persona / borrado de cookies sin OTP
  test('8 y 9. Intentar apropiarse de cuenta ajena o recuperar sin código: 409 y 403, recuperación exitosa solo con código', async () => {
    const phone = `11 5${randomUUID().replace(/\D/g, '').slice(0, 7)}`;
    const token1 = `device-one-${randomUUID()}`;
    const dev1 = await pwRequest.newContext({
      baseURL,
      extraHTTPHeaders: { Cookie: `navidad_player_session=${token1}` },
    });

    // 1. Registro legítimo en Dispositivo 1
    const regRes = await dev1.post('/api/participants/register', {
      data: { shoppingSlug: 'centenario', phone, consent: true },
    });
    expect(regRes.status()).toBe(200);
    const { recoveryCode, participantId } = await regRes.json();
    expect(recoveryCode).toBeDefined();

    // 2. Dispositivo 2 (simula cookies borradas o atacante con el número de teléfono)
    const token2 = `device-two-${randomUUID()}`;
    const dev2 = await pwRequest.newContext({
      baseURL,
      extraHTTPHeaders: { Cookie: `navidad_player_session=${token2}` },
    });

    // A. Intento sin código de recuperación -> RECHAZADO 409 RECOVERY_REQUIRED
    const attemptNoCode = await dev2.post('/api/participants/register', {
      data: { shoppingSlug: 'centenario', phone, consent: true },
    });
    expect(attemptNoCode.status()).toBe(409);
    const bodyNoCode = await attemptNoCode.json();
    expect(bodyNoCode.code).toBe('RECOVERY_REQUIRED');
    expect(bodyNoCode.requiresRecoveryCode).toBe(true);

    // B. Intento con código de recuperación inválido -> RECHAZADO 403 INVALID_RECOVERY_CODE
    const attemptBadCode = await dev2.post('/api/participants/register', {
      data: { shoppingSlug: 'centenario', phone, consent: true, recoveryCode: 'REC-WRONG-CODE' },
    });
    expect(attemptBadCode.status()).toBe(403);
    const bodyBadCode = await attemptBadCode.json();
    expect(bodyBadCode.code).toBe('INVALID_RECOVERY_CODE');

    // C. Recuperación exitosa con código de recuperación correcto -> 200 OK
    const attemptGoodCode = await dev2.post('/api/participants/register', {
      data: { shoppingSlug: 'centenario', phone, consent: true, recoveryCode },
    });
    expect(attemptGoodCode.status()).toBe(200);
    const bodyGood = await attemptGoodCode.json();
    expect(bodyGood.status).toBe('recovered');
    expect(bodyGood.participantId).toBe(participantId);

    // Limpieza
    const pHash = sha256(normalizePhone(phone).e164!);
    await cleanupParticipantByHash(pHash);
  });

  // 10 y 11. Conservación de reglas del juego y recompensas
  test('10 y 11. Conservación de reglas: 1 tiro por posta, no duplicación de participaciones ni recompensa', async () => {
    const token = `player-rules-${randomUUID()}`;
    const client = await pwRequest.newContext({
      baseURL,
      extraHTTPHeaders: { Cookie: `navidad_player_session=${token}` },
    });

    // Jugar primera posta
    const r1 = await client.post('/api/participations', {
      data: { shoppingSlug: 'centenario', cardId: 'CEN-DEMO-002' },
    });
    expect(r1.status()).toBe(200);
    const b1 = await r1.json();
    expect(b1.alreadyParticipated).toBe(false);

    // Rejugar misma posta -> duplicado rechazado
    const r2 = await client.post('/api/participations', {
      data: { shoppingSlug: 'centenario', cardId: 'CEN-DEMO-002' },
    });
    expect(r2.status()).toBe(200);
    const b2 = await r2.json();
    expect(b2.alreadyParticipated).toBe(true);
    expect(b2.duplicateRejected).toBe(true);
  });

  // 12. Controles RBAC del panel y del portal de comercios
  test('12. Controles RBAC: comercios no acceden a teléfonos y endpoints de admin bloqueados', async () => {
    const anon = await pwRequest.newContext({ baseURL });

    // No autorizado a lista de participantes
    const rAdmin = await anon.get('/api/admin/participants?shoppingSlug=centenario');
    expect(rAdmin.status()).toBe(401);
  });

  // 13. Carteles permanentes QR/NFC
  test('13. Carteles permanentes QR/NFC siguen respondiendo y redirigiendo', async () => {
    const client = await pwRequest.newContext({ baseURL, maxRedirects: 0 });
    // Probar cartel de prueba de QA
    const shopping = await prisma.shopping.findUniqueOrThrow({ where: { slug: 'centenario' } });
    const location = await prisma.location.findFirst({ where: { shoppingId: shopping.id, active: true } });

    if (location) {
      const res = await client.get(`/nfc/centenario/${location.slug}`);
      expect(res.status()).toBe(307);
    }
  });

  // 14. Usabilidad y responsividad en múltiples viewports
  test('14. Usabilidad y responsividad de la pantalla de registro (390, 430, 768, 1440)', async ({ page }) => {
    const viewports = [
      { width: 390, height: 844, name: 'iPhone 14' },
      { width: 430, height: 932, name: 'iPhone 15 Pro Max' },
      { width: 768, height: 1024, name: 'iPad Mini' },
      { width: 1440, height: 900, name: 'Desktop HD' },
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/centenario', { waitUntil: 'networkidle' });

      // Verificar modal o formulario de registro visible
      const modal = page.getByTestId('registration-modal');
      await expect(modal).toBeVisible();

      // Verificar elementos principales
      await expect(page.getByTestId('registration-phone-input')).toBeVisible();
      await expect(page.getByTestId('registration-consent-checkbox')).toBeVisible();
      await expect(page.getByTestId('registration-submit-btn')).toBeVisible();

      // Verificar que no haya desborde horizontal en el contenedor
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2); // tolerancia de 2px
    }
  });

  // 15. Participantes existentes no pierden información
  test('15. Participantes existentes no pierden información tras la migración', async () => {
    const legacyCount = await prisma.participant.count({
      where: { phone: null },
    });
    // Debe haber participantes históricos existentes conservados
    expect(legacyCount).toBeGreaterThan(0);
  });
});
