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
});
