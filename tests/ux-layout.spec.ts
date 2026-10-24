import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

// Revisión de diseño automatizable: sin desbordes horizontales, objetivos táctiles y accesibilidad (axe).
// Complementa tests/responsive.spec.ts, que ya cubre las rutas públicas de campaña.
const widths = [320, 360, 375, 390, 430, 768, 1024, 1440];
const routes = ['/merchant', '/admin', '/centenario/participar/CEN-DEMO-001', '/uniplaza/participar/UNI-DEMO-001'];

for (const route of routes) {
  test(`sin scroll horizontal en ${route} (8 anchos)`, async ({ page }) => {
    for (const width of widths) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto(route, { waitUntil: 'networkidle' });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, `${route} desborda ${overflow}px a ${width}px`).toBeLessThanOrEqual(0);
    }
  });
}

test('portal de comercios: acciones principales con objetivo táctil >= 44 px (acceso)', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  await page.goto('/merchant', { waitUntil: 'networkidle' });
  for (const locator of [page.getByRole('button', { name: 'Ingresar' }), page.getByLabel('Correo'), page.getByLabel('Contraseña')]) {
    const box = await locator.boundingBox();
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
  }
});

for (const route of ['/merchant', '/admin', '/centenario/participar/CEN-DEMO-001', '/uniplaza/participar/UNI-DEMO-001', '/centenario', '/uniplaza']) {
  test(`accesibilidad (axe, WCAG A/AA) en ${route}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route, { waitUntil: 'networkidle' });
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    const serious = results.violations.filter((violation) => violation.impact === 'serious' || violation.impact === 'critical');
    expect(serious.map((violation) => `${violation.id}: ${violation.nodes.slice(0, 3).map((node) => node.target.join(' ')).join(' | ')}`)).toEqual([]);
  });
}


test('panel autenticado: ninguna sección desborda en móvil (tablas apiladas)', async ({ page }) => {
  test.skip(process.env.QA_MODE !== 'true' || !process.env.QA_ADMIN_EMAIL, 'Requiere la base QA aislada y el administrador QA.');
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/admin');
  await page.getByLabel('Correo').fill(process.env.QA_ADMIN_EMAIL!);
  await page.getByLabel('Contraseña').fill(process.env.QA_ADMIN_PASSWORD!);
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await expect(page.getByRole('heading', { name: 'Resumen' })).toBeVisible();
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    for (const section of ['Resumen', 'Tarjetas', 'Participantes y colección', 'Usuarios y roles', 'Comercios', 'Auditoría']) {
      await page.getByRole('button', { name: section, exact: true }).click();
      await expect(page.getByRole('heading', { name: section, exact: true }).first()).toBeVisible();
      await page.waitForLoadState('networkidle');
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, `Panel › ${section} desborda ${overflow}px a ${width}px`).toBeLessThanOrEqual(0);
    }
  }
});
