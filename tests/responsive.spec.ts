import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const widths = [320, 360, 375, 390, 430, 768, 1024, 1280, 1440, 1920];
const shoppingPaths = [
  { slug: 'centenario', path: '/centenario', name: 'Centenario Shopping' },
  { slug: 'uniplaza', path: '/uniplaza', name: 'UniPlaza Shopping' },
] as const;
const themeTokens = ['--brand-primary', '--brand-accent', '--brand-surface', '--brand-font-display', '--brand-radius-card'];

async function expectNoHorizontalOverflow(page: import('@playwright/test').Page) {
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
}

test('shopping routes keep separate themes and fit the required viewport widths', async ({ page }, testInfo) => {
  const pageErrors: string[] = [];
  const campaignRequests: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  page.on('request', (request) => {
    if (request.url().includes('/api/campaigns/')) campaignRequests.push(new URL(request.url()).pathname);
  });

  const observedTokens: string[][] = [];
  for (const shopping of shoppingPaths) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(shopping.path);
    const shell = page.locator('[data-testid="campaign-stage"]');
    await expect(shell).toBeVisible();
    await expect(shell).toHaveAttribute('data-shopping', shopping.slug);
    await expect(page.getByRole('link', { name: new RegExp(shopping.name) })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Tu colección/ })).toBeVisible();
    await expect(page.getByRole('button', {
      name: shopping.slug === 'centenario' ? /Encontré una tarjeta/ : /Tengo una tarjeta/,
    })).toBeVisible();
    observedTokens.push(await shell.evaluate((node, tokens) => {
      const style = getComputedStyle(node);
      return tokens.map((token) => style.getPropertyValue(token).trim());
    }, themeTokens));

    for (const width of widths) {
      await page.setViewportSize({ width, height: 820 });
      await expectNoHorizontalOverflow(page);
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: testInfo.outputPath(`${shopping.slug}-mobile.png`), fullPage: true });
  }

  expect(observedTokens[0]).not.toEqual(observedTokens[1]);
  expect(observedTokens[0].filter((value, index) => value !== observedTokens[1][index])).toHaveLength(5);
  expect(campaignRequests).toContain('/api/campaigns/centenario/public');
  expect(campaignRequests).toContain('/api/campaigns/uniplaza/public');
  expect(pageErrors).toEqual([]);
});

test('both shopping art directions carry through every public PWA destination and NFC entry', async ({ page }) => {
  const observed: Record<string, string[]> = {};
  for (const shopping of shoppingPaths) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(shopping.path);
    for (const destination of [
      { label: 'Jugar', heading: /Girá y descubrí/i, selector: '[data-testid="campaign-wheel"]' },
      { label: 'Descubrir', heading: /Tu colección/i, selector: '[role="listitem"]' },
      { label: 'Premios', heading: /Premios/i, selector: null },
      { label: 'Mi progreso', heading: /Mi progreso/i, selector: 'section[aria-labelledby="progress-title"]' },
    ]) {
      await page.getByRole('button', { name: destination.label, exact: true }).click();
      await expect(page.getByRole('heading', { name: destination.heading }).first()).toBeVisible();
      if (destination.selector) await expect(page.locator(destination.selector).first()).toBeVisible();
      await expectNoHorizontalOverflow(page);
    }
    await page.getByRole('button', { name: 'Jugar', exact: true }).click();
    observed[shopping.slug] = await page.locator('[data-testid="campaign-wheel"]').evaluate((node) => {
      const wrap = node.parentElement;
      if (!wrap) throw new Error('No se encontró el marco de la ruleta');
      const style = getComputedStyle(wrap);
      return [style.borderTopLeftRadius, style.borderTopRightRadius, style.backgroundColor];
    });

    await page.goto(`${shopping.path}/participar/QA-TEST-01`);
    await expect(page.locator('main[data-shopping]')).toHaveAttribute('data-shopping', shopping.slug);
    await expect(page.getByRole('link', { name: `Volver a la campaña de ${shopping.name}` })).toHaveAttribute('href', shopping.path);
    await expectNoHorizontalOverflow(page);
  }
  expect(observed.centenario).not.toEqual(observed.uniplaza);
});

test('admin sign-in and shopping-specific NFC routes remain responsive', async ({ page }) => {
  test.setTimeout(120_000);
  for (const width of widths) {
    await page.setViewportSize({ width, height: 820 });
    await page.goto('/admin');
    await expect(page.getByRole('heading', { name: /Panel de administración/i })).toBeVisible();
    await expectNoHorizontalOverflow(page);
  }
  await page.setViewportSize({ width: 844, height: 390 });
  await page.goto('/admin');
  await expect(page.getByRole('heading', { name: /Panel de administración/i })).toBeVisible();
  await expectNoHorizontalOverflow(page);
  for (const shopping of shoppingPaths) {
    for (const width of widths) {
      await page.setViewportSize({ width, height: 820 });
      await page.goto(`${shopping.path}/participar/QA-TEST-01`);
      await expect(page.locator('main[data-shopping]')).toBeVisible();
      await expect(page.locator('main[data-shopping]')).toHaveAttribute('data-shopping', shopping.slug);
      await expectNoHorizontalOverflow(page);
    }
    await page.setViewportSize({ width: 844, height: 390 });
    await page.goto(`${shopping.path}/participar/QA-TEST-01`);
    await expect(page.locator('main[data-shopping]')).toHaveAttribute('data-shopping', shopping.slug);
    await expectNoHorizontalOverflow(page);
  }
});

test('wheel is reachable by keyboard, stays within 320px, and does not spin in reduced motion', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  for (const shopping of shoppingPaths) {
    await page.goto(shopping.path);
    await page.getByRole('button', { name: 'Jugar', exact: true }).click();
    const wheel = page.locator('[data-testid="campaign-wheel"]');
    await expect(wheel).toBeVisible();
    const bounds = await wheel.boundingBox();
    expect(bounds?.width).toBeLessThanOrEqual(320);
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toBeVisible();
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await wheel.evaluate((node) => node.setAttribute('data-spinning', 'true'));
    await expect(wheel).toHaveCSS('animation-name', 'none');
  }
});

test('gateway, text scaling, and reduced-motion layout remain usable', async ({ page }) => {
  await page.setViewportSize({ width: 844, height: 390 });
  await page.goto('/');
  await expect(page.getByRole('link', { name: /Centenario Shopping/ })).toHaveAttribute('href', '/centenario');
  await expect(page.getByRole('link', { name: /UniPlaza Shopping/ })).toHaveAttribute('href', '/uniplaza');
  await expectNoHorizontalOverflow(page);

  await page.goto('/uniplaza');
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  await expectNoHorizontalOverflow(page);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.getByRole('button', { name: 'Jugar', exact: true }).click();
  const wheel = page.locator('[data-testid="campaign-wheel"]');
  await wheel.evaluate((node) => node.setAttribute('data-spinning', 'true'));
  await expect(wheel).toHaveCSS('animation-name', 'none');
  const qaResponse = await page.request.get('/api/qa/status');
  expect([401, 404]).toContain(qaResponse.status());
});

test('public campaign, admin sign-in, and offline page meet axe WCAG 2.2 AA checks', async ({ page }) => {
  for (const shopping of shoppingPaths) {
    await page.goto(shopping.path);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
    expect(results.violations.map(({ id, impact, description, nodes }) => ({ id, impact, description, nodes: nodes.map((node) => ({ target: node.target, summary: node.failureSummary })) })), JSON.stringify(results.violations)).toEqual([]);
  }
  await page.goto('/admin');
  const adminResults = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  expect(adminResults.violations.map(({ id, impact, description, nodes }) => ({ id, impact, description, nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })) }))).toEqual([]);
  await page.goto('/offline');
  await expect(page.getByRole('heading', { name: /sin conexión/i })).toBeVisible();
  await expect(page.getByText(/no se registran sin conexión/i)).toBeVisible();
});

test('shopping manifests use isolated names, route scopes, and install icons', async ({ page }) => {
  const manifests = [];
  for (const shopping of shoppingPaths) {
    const response = await page.request.get(`/manifest-${shopping.slug}.webmanifest`);
    expect(response.status()).toBe(200);
    const manifest = await response.json();
    expect(manifest.name).toContain(shopping.name);
    expect(manifest.start_url).toBe(shopping.path);
    expect(manifest.scope).toBe(shopping.path);
    expect(manifest.display).toBe('standalone');
    expect(manifest.icons.map((icon: { sizes: string }) => icon.sizes)).toContain('192x192');
    expect(manifest.icons.map((icon: { sizes: string }) => icon.sizes)).toContain('512x512');
    manifests.push(manifest);
    await page.goto(shopping.path);
    await expect(page.locator('link[rel="manifest"]')).toHaveAttribute('href', `/manifest-${shopping.slug}.webmanifest`);
  }
  expect(manifests[0].theme_color).not.toBe(manifests[1].theme_color);
  const worker = await page.request.get('/sw.js');
  expect(worker.ok()).toBe(true);
  const workerSource = await worker.text();
  expect(workerSource).toContain("url.pathname.startsWith('/api/')");
  expect(workerSource).toContain("url.pathname.startsWith('/admin')");
  expect(workerSource).toContain("url.pathname.startsWith('/qa')");
});
