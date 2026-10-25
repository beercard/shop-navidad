import { expect, test } from '@playwright/test';
import { randomUUID } from 'node:crypto';

test.describe('Auditoría Master — Navegación Inferior, Responsive y Reglas de Gamificación (Casos 1 a 14)', () => {
  test('Caso 13 — Navegación inferior fija en las 5 secciones sin tapar el último elemento (Centenario y UniPlaza)', async ({ page }) => {
    const viewports = [
      { width: 390, height: 844 },
      { width: 430, height: 932 },
    ];
    const sections = ['Inicio', 'Jugar', 'Descubrir', 'Premios', 'Mi progreso'];

    for (const shopping of ['/centenario', '/uniplaza']) {
      for (const vp of viewports) {
        await page.setViewportSize(vp);
        await page.goto(shopping, { waitUntil: 'networkidle' });

        const nav = page.getByRole('navigation', { name: 'Secciones de la campaña' });
        await expect(nav).toBeVisible();

        const navStyle = await nav.evaluate((el) => {
          const cs = window.getComputedStyle(el);
          const rect = el.getBoundingClientRect();
          return {
            position: cs.position,
            bottomGap: Math.abs(window.innerHeight - rect.bottom),
            top: rect.top,
          };
        });
        expect(navStyle.position).toBe('fixed');
        expect(navStyle.bottomGap).toBeLessThanOrEqual(2);

        for (const label of sections) {
          const btn = nav.getByRole('button', { name: label, exact: true });
          await expect(btn).toBeVisible();
          const box = await btn.boundingBox();
          expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
          expect(box?.width ?? 0).toBeGreaterThanOrEqual(44);

          await btn.click();
          await expect(btn).toHaveAttribute('aria-current', 'page');

          // Scroll to the very bottom of the document and verify the footer / last interactive element sits above the fixed bottom bar
          await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
          await page.waitForTimeout(80);
          const clearance = await page.evaluate(() => {
            const navEl = document.querySelector('nav[aria-label="Secciones de la campaña"]');
            const footerEl = document.querySelector('footer');
            if (!navEl || !footerEl) return 0;
            return navEl.getBoundingClientRect().top - footerEl.getBoundingClientRect().bottom;
          });
          expect(clearance, `${shopping} (${vp.width}x${vp.height}) sección ${label}: footer tapado por la barra inferior`).toBeGreaterThanOrEqual(-2);
        }
      }
    }
  });

  test('Caso 14 — Responsive en 390×844, 430×932, 768×1024 y 1440×900 sin desbordes horizontales', async ({ page }) => {
    test.setTimeout(90_000);
    const viewports = [
      { width: 390, height: 844 },
      { width: 430, height: 932 },
      { width: 768, height: 1024 },
      { width: 1440, height: 900 },
    ];
    for (const route of ['/centenario', '/uniplaza', '/merchant', '/admin']) {
      for (const vp of viewports) {
        await page.setViewportSize(vp);
        await page.goto(route, { waitUntil: 'networkidle' });
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow, `${route} desborda ${overflow}px en ${vp.width}×${vp.height}`).toBeLessThanOrEqual(0);
      }
    }
  });

  test('Casos 1 a 12 — Reglas de juego, límite de 1 premio instantáneo por campaña, sorteo final, concurrencia y antifraude', async ({ browser }) => {
    const ctx1 = await browser.newContext();
    const page1 = await ctx1.newPage();

    // Caso 8 — Manipulación del cliente (intento de inyectar prizeId, campaignId, participantId o status)
    const tampered = await page1.request.post('/api/participations', {
      data: {
        shoppingSlug: 'centenario',
        cardId: 'CEN-DEMO-001',
        idempotencyKey: randomUUID(),
        prizeId: 'forced-prize-id',
        status: 'won',
      },
    });
    expect(tampered.status()).toBe(400);
    const tamperedBody = await tampered.json();
    expect(tamperedBody.code).toBe('CLIENT_TAMPERING_DETECTED');

    // Caso 11 — Separación de shoppings (cartel de Centenario en UniPlaza)
    const crossTenant = await page1.request.post('/api/participations', {
      data: {
        shoppingSlug: 'uniplaza',
        cardId: 'CEN-DEMO-001',
        idempotencyKey: randomUUID(),
      },
    });
    expect(crossTenant.status()).toBe(404);
    expect((await crossTenant.json()).code).toBe('CARD_NOT_FOUND');

    // Caso 1 — Primer escaneo de Cartel A (CEN-DEMO-001) y Caso 10 — Reintento idempotente por corte de red
    const idempotencyKeyA = randomUUID();
    const scan1 = await page1.request.post('/api/participations', {
      data: {
        shoppingSlug: 'centenario',
        cardId: 'CEN-DEMO-001',
        idempotencyKey: idempotencyKeyA,
      },
    });
    expect(scan1.status()).toBe(200);
    const scan1Body = await scan1.json();
    expect(scan1Body.alreadyParticipated).toBe(false);
    expect(scan1Body.raffleEntriesCount).toBe(1);
    expect(scan1Body.raffleEntryAdded).toBe(true);

    // Caso 10 — Reintento con el mismo idempotencyKey recupera exactamente la misma respuesta sin duplicar jugada
    const retrySameKey = await page1.request.post('/api/participations', {
      data: {
        shoppingSlug: 'centenario',
        cardId: 'CEN-DEMO-001',
        idempotencyKey: idempotencyKeyA,
      },
    });
    expect(retrySameKey.status()).toBe(200);
    const retryBody = await retrySameKey.json();
    expect(retryBody.alreadyParticipated).toBe(true);
    expect(retryBody.redeemCode).toBe(scan1Body.redeemCode);
    expect(retryBody.raffleEntriesCount).toBe(1);

    // Caso 2 — Mismo QR repetido con distinto idempotencyKey (no vuelve a girar, no gana otro premio, no suma chance duplicada)
    const repeatSameCard = await page1.request.post('/api/participations', {
      data: {
        shoppingSlug: 'centenario',
        cardId: 'CEN-DEMO-001',
        idempotencyKey: randomUUID(),
      },
    });
    expect(repeatSameCard.status()).toBe(200);
    const repeatBody = await repeatSameCard.json();
    expect(repeatBody.alreadyParticipated).toBe(true);
    expect(repeatBody.duplicateRejected).toBe(true);
    expect(repeatBody.raffleEntryAdded).toBe(false);
    expect(repeatBody.raffleEntriesCount).toBe(1);
    expect(repeatBody.redeemCode).toBe(scan1Body.redeemCode);

    // Caso 3 y Caso 4 — Cartel diferente (CEN-DEMO-002): suma participación al Sorteo Final (+1 -> 2), pero si ya ganó premio instantáneo en Cartel A, nunca recibe un segundo premio instantáneo
    const scan2 = await page1.request.post('/api/participations', {
      data: {
        shoppingSlug: 'centenario',
        cardId: 'CEN-DEMO-002',
        idempotencyKey: randomUUID(),
      },
    });
    expect(scan2.status()).toBe(200);
    const scan2Body = await scan2.json();
    expect(scan2Body.alreadyParticipated).toBe(false);
    expect(scan2Body.raffleEntryAdded).toBe(true);
    expect(scan2Body.raffleEntriesCount).toBe(2);
    if (scan1Body.status === 'won') {
      expect(scan2Body.status).toBe('no_prize');
      expect(scan2Body.instantPrizeLimitReached).toBe(true);
      expect(scan2Body.priorInstantPrize?.name).toBeTruthy();
    }

    // Caso 5 — Solicitudes simultáneas al mismo cartel desde un usuario nuevo
    const ctx2 = await browser.newContext();
    const page2 = await ctx2.newPage();
    await page2.goto('/centenario'); // initialize session cookie if any or let first request set it
    // Ensure a single session cookie is established first on Cartel 1, then fire simultaneous requests on Cartel 2
    await page2.request.post('/api/participations', {
      data: { shoppingSlug: 'centenario', cardId: 'CEN-DEMO-001', idempotencyKey: randomUUID() },
    });
    const [simSame1, simSame2, simSame3] = await Promise.all([
      page2.request.post('/api/participations', { data: { shoppingSlug: 'centenario', cardId: 'CEN-DEMO-002', idempotencyKey: randomUUID() } }),
      page2.request.post('/api/participations', { data: { shoppingSlug: 'centenario', cardId: 'CEN-DEMO-002', idempotencyKey: randomUUID() } }),
      page2.request.post('/api/participations', { data: { shoppingSlug: 'centenario', cardId: 'CEN-DEMO-002', idempotencyKey: randomUUID() } }),
    ]);
    expect(simSame1.status()).toBe(200);
    expect(simSame2.status()).toBe(200);
    expect(simSame3.status()).toBe(200);
    const simSameBodies = await Promise.all([simSame1.json(), simSame2.json(), simSame3.json()]);
    // Exactly 2 total raffle entries (CEN-DEMO-001 + CEN-DEMO-002), never 3 or 4
    for (const b of simSameBodies) {
      expect(b.raffleEntriesCount).toBe(2);
    }

    // Caso 6 — Dos carteles simultáneos por el mismo usuario (establecemos cookie con lectura de cupones o creamos sesión y lanzamos 2 carteles simultáneos)
    const ctx3 = await browser.newContext();
    const page3 = await ctx3.newPage();
    // Si un usuario nuevo escanea CEN-DEMO-003 y CEN-DEMO-004 luego de tener sesión activa (o en simultáneo tras una jugada sin premio, o desde QA scenarios):
    // Verificamos también los escenarios transaccionales del servidor (/api/qa/scenarios) cuando hay credenciales QA
    if (process.env.QA_MODE === 'true' && process.env.QA_ADMIN_EMAIL && process.env.QA_ADMIN_PASSWORD) {
      await page3.goto('/admin');
      await page3.getByLabel('Correo').fill(process.env.QA_ADMIN_EMAIL);
      await page3.getByLabel('Contraseña').fill(process.env.QA_ADMIN_PASSWORD);
      await page3.getByRole('button', { name: 'Ingresar' }).click();
      await expect(page3.getByRole('heading', { name: 'Resumen' })).toBeVisible();

      const resetRes = await page3.request.post('/api/qa/reset', { data: { confirmation: 'RESET QA' } });
      expect(resetRes.status()).toBe(200);

      for (const scenario of [
        'instant-prize-limit',     // Caso 4
        'concurrent-same-card',    // Caso 5
        'concurrent-two-cards',    // Caso 6
        'last-prize-concurrent',   // Caso 7
        'campaign-inactive',       // Caso 9
        'campaign-expired',        // Caso 9
        'cross-tenant-card',       // Caso 11
        'concurrent-redeem',       // Caso 12
        'completion-reward-modes', // Modalidad A / Modalidad B + preservación ante cambios de config
        'completion-reward-concurrency', // Concurrencia en última posta
      ]) {
        const res = await page3.request.post('/api/qa/scenarios', {
          data: { shoppingSlug: 'centenario', scenario },
        });
        expect(res.status(), `Escenario ${scenario} falló`).toBe(200);
        const body = await res.json();
        expect(body.run.status).toBe('APPROVED');
      }

      // Restore demo seed after QA scenario runs so demo campaigns remain active and stocked
      const seedRes = await page3.request.post('/api/qa/demo/seed');
      expect(seedRes.status()).toBe(200);
    }

    await ctx1.close();
    await ctx2.close();
    await ctx3.close();
  });

  test('Sección 8 — Recompensa especial por completar todas las postas (progreso, desbloqueo único, persistencia, concurrencia y aislamiento entre shoppings)', async ({ browser }) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();

    // 1. Intento de forzar desbloqueo desde el cliente -> 400 CLIENT_TAMPERING_DETECTED
    const tamperedUnlock = await page.request.post('/api/participations', {
      data: {
        shoppingSlug: 'centenario',
        cardId: 'CEN-DEMO-001',
        idempotencyKey: randomUUID(),
        completedAll: true,
        forceReward: true,
      },
    });
    expect(tamperedUnlock.status()).toBe(400);
    expect((await tamperedUnlock.json()).code).toBe('CLIENT_TAMPERING_DETECTED');

    // 2. Posta 1 de 3 -> Usuario con postas pendientes (1/3) no desbloquea la recompensa
    const s1 = await page.request.post('/api/participations', {
      data: { shoppingSlug: 'centenario', cardId: 'CEN-DEMO-001', idempotencyKey: randomUUID() },
    });
    expect(s1.status()).toBe(200);
    const b1 = await s1.json();
    expect(b1.completionReward).toBeTruthy();
    expect(b1.completionReward.unlocked).toBe(false);
    expect(b1.completionReward.completedCount).toBe(1);
    expect(b1.completionReward.pendingCount).toBe(2);
    expect(b1.bonusRaffleEntriesCount).toBe(0);
    expect(b1.scanRaffleEntriesCount).toBe(1);
    expect(b1.raffleEntriesCount).toBe(1);

    // 3. Escanear el mismo QR dos veces no avanza el progreso de recorrido
    const s1Dup = await page.request.post('/api/participations', {
      data: { shoppingSlug: 'centenario', cardId: 'CEN-DEMO-001', idempotencyKey: randomUUID() },
    });
    expect(s1Dup.status()).toBe(200);
    const b1Dup = await s1Dup.json();
    expect(b1Dup.alreadyParticipated).toBe(true);
    expect(b1Dup.completionReward.unlocked).toBe(false);
    expect(b1Dup.completionReward.completedCount).toBe(1);
    expect(b1Dup.completionReward.pendingCount).toBe(2);
    expect(b1Dup.raffleEntriesCount).toBe(1);

    // 4. Posta 2 de 3 -> Sigue con postas pendientes (2/3), no desbloquea aún
    const s2 = await page.request.post('/api/participations', {
      data: { shoppingSlug: 'centenario', cardId: 'CEN-DEMO-002', idempotencyKey: randomUUID() },
    });
    expect(s2.status()).toBe(200);
    const b2 = await s2.json();
    expect(b2.completionReward.unlocked).toBe(false);
    expect(b2.completionReward.completedCount).toBe(2);
    expect(b2.completionReward.pendingCount).toBe(1);
    expect(b2.bonusRaffleEntriesCount).toBe(0);
    expect(b2.scanRaffleEntriesCount).toBe(2);
    expect(b2.raffleEntriesCount).toBe(2);

    // 5. Posta 3 de 3 (con solicitudes simultáneas a la última posta) -> Desbloquea exactamente 1 vez la recompensa especial
    const [s3a, s3b] = await Promise.all([
      page.request.post('/api/participations', {
        data: { shoppingSlug: 'centenario', cardId: 'CEN-DEMO-003', idempotencyKey: randomUUID() },
      }),
      page.request.post('/api/participations', {
        data: { shoppingSlug: 'centenario', cardId: 'CEN-DEMO-003', idempotencyKey: randomUUID() },
      }),
    ]);
    expect(s3a.status()).toBe(200);
    expect(s3b.status()).toBe(200);
    const b3a = await s3a.json();
    const b3b = await s3b.json();
    expect(b3a.completionReward.unlocked).toBe(true);
    expect(b3b.completionReward.unlocked).toBe(true);
    expect(b3a.completionReward.completedCount).toBe(3);
    expect(b3a.completionReward.pendingCount).toBe(0);
    expect(b3a.completionReward.referenceId).toBeTruthy();
    expect(b3a.completionReward.referenceId).toBe(b3b.completionReward.referenceId);
    expect(b3a.completionReward.rewardId).toBe(b3b.completionReward.rewardId);
    // 3 participaciones por escaneo + 1 extra por recorrido completo = 4 totales
    expect(b3a.scanRaffleEntriesCount).toBe(3);
    expect(b3a.bonusRaffleEntriesCount).toBe(1);
    expect(b3a.raffleEntriesCount).toBe(4);
    expect(b3b.raffleEntriesCount).toBe(4);
    // Si el usuario ya había ganado su premio instantáneo en Posta 1, al completar el recorrido NO recibe un segundo premio instantáneo
    if (b1.status === 'won' || b2.status === 'won') {
      expect(b3a.status).toBe('no_prize');
      expect(b3a.instantPrizeLimitReached).toBe(true);
    }

    // 6. Repetir solicitud a Posta 3 o escanear una 4ta posta no duplica la recompensa de recorrido completo
    const s3Repeat = await page.request.post('/api/participations', {
      data: { shoppingSlug: 'centenario', cardId: 'CEN-DEMO-003', idempotencyKey: randomUUID() },
    });
    const b3Repeat = await s3Repeat.json();
    expect(b3Repeat.completionReward.unlocked).toBe(true);
    expect(b3Repeat.completionReward.justUnlocked).toBe(false);
    expect(b3Repeat.completionReward.referenceId).toBe(b3a.completionReward.referenceId);
    expect(b3Repeat.bonusRaffleEntriesCount).toBe(1);
    expect(b3Repeat.raffleEntriesCount).toBe(4);

    // 7. Persistencia al recargar la campaña pública y renderizado en la PWA
    const publicRes = await page.request.get('/api/campaigns/centenario/public');
    expect(publicRes.status()).toBe(200);
    const publicBody = await publicRes.json();
    expect(publicBody.completionReward.unlocked).toBe(true);
    expect(publicBody.completionReward.referenceId).toBe(b3a.completionReward.referenceId);
    expect(publicBody.scanRaffleEntriesCount).toBe(3);
    expect(publicBody.bonusRaffleEntriesCount).toBe(1);
    expect(publicBody.raffleEntriesCount).toBe(4);

    await page.goto('/centenario#progreso', { waitUntil: 'networkidle' });
    const credential = page.getByTestId('completion-reward-credential').first();
    await expect(credential).toBeVisible();
    await expect(credential).toContainText(b3a.completionReward.referenceId);

    // 8. Aislamiento entre Centenario y UniPlaza: el progreso y la recompensa de Centenario no contaminan UniPlaza
    const uniplazaPublic = await page.request.get('/api/campaigns/uniplaza/public');
    expect(uniplazaPublic.status()).toBe(200);
    const uniplazaBody = await uniplazaPublic.json();
    expect(uniplazaBody.completionReward.unlocked).toBe(false);
    expect(uniplazaBody.completionReward.completedCount).toBe(0);
    expect(uniplazaBody.raffleEntriesCount).toBe(0);

    await ctx.close();
  });
});
