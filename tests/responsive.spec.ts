import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const widths = [320, 360, 375, 390, 430, 768, 1024, 1280, 1440, 1920];
const shoppingPaths = [
  { slug: 'centenario', path: '/centenario', name: 'Centenario Shopping' },
  { slug: 'uniplaza', path: '/uniplaza', name: 'UniPlaza Shopping' },
] as const;
const themeTokens = ['--brand-primary', '--brand-accent', '--brand-surface', '--brand-font-display', '--brand-radius-card'];

test('each shopping has an independent public route, theme, and responsive layout', async ({ page }, testInfo) => {
  const pageErrors: string[] = [];
  const campaignRequests: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  page.on('request', (request) => {
    if (request.url().includes('/api/campaigns/')) campaignRequests.push(new URL(request.url()).pathname);
  });

  const observedTokens: string[][] = [];
  for (const shopping of shoppingPaths) {
    await page.goto(shopping.path);
    const shell = page.locator('main.site-shell');
    await expect(shell).toBeVisible();
    await expect(shell).toHaveAttribute('data-shopping', shopping.slug);
    await expect(page.getByText(shopping.name, { exact: false }).first()).toBeVisible();
    await expect(page.locator('.shopping-switch')).toHaveCount(0);
    observedTokens.push(await shell.evaluate((node, tokens) => {
      const style = getComputedStyle(node);
      return tokens.map((token) => style.getPropertyValue(token).trim());
    }, themeTokens));

    for (const width of widths) {
      await page.setViewportSize({ width, height: 820 });
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
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

test('admin login and tenant-locked NFC routes remain responsive without a database', async ({ page }) => {
  test.setTimeout(120_000);
  for (const width of widths) {
    await page.setViewportSize({ width, height: 820 });
    await page.goto('/admin');
    await expect(page.getByRole('heading', { name: /Panel de administración/i })).toBeVisible();
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
  for (const shopping of shoppingPaths) {
    for (const width of widths) {
      await page.setViewportSize({ width, height: 820 });
      await page.goto(`${shopping.path}/participar/QA-TEST-01`);
      await expect(page.locator('main.site-shell')).toHaveAttribute('data-shopping', shopping.slug);
      await expect(page.getByText(shopping.name, { exact: false }).first()).toBeVisible();
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    }
  }
});

test('wheel fits mobile and keyboard focus remains visible in both experiences', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  for (const shopping of shoppingPaths) {
    await page.goto(shopping.path);
    const wheel = page.locator('.wheel');
    await expect(wheel).toBeVisible();
    const wheelBounds = await wheel.boundingBox();
    expect(wheelBounds?.width).toBeLessThanOrEqual(320);
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toBeVisible();
  }
});

test('gateway, mobile landscape, text zoom, and reduced motion remain usable', async ({ page }) => {
  await page.setViewportSize({ width: 844, height: 390 });
  await page.goto('/');
  await expect(page.getByRole('link', { name: /Centenario Shopping/ })).toHaveAttribute('href', '/centenario');
  await expect(page.getByRole('link', { name: /UniPlaza Shopping/ })).toHaveAttribute('href', '/uniplaza');
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

  await page.goto('/uniplaza');
  await page.evaluate(() => { document.documentElement.style.fontSize = '125%'; });
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.locator('.wheel').evaluate((node) => node.classList.add('wheel-spinning'));
  await expect(page.locator('.wheel')).toHaveCSS('animation-name', 'none');
  const qaResponse = await page.request.get('/api/qa/status');
  expect([401, 404]).toContain(qaResponse.status());
});

test('both public experiences and admin login have no axe findings for WCAG 2.2 AA tags', async ({ page }) => {
  for (const shopping of shoppingPaths) {
    await page.goto(shopping.path);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
    expect(results.violations.map(({ id, impact, description, nodes }) => ({ id, impact, description, nodes: nodes.map((node) => ({ target: node.target, summary: node.failureSummary })) }))).toEqual([]);
  }
  await page.goto('/admin');
  const adminResults = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  expect(adminResults.violations.map(({ id, impact, description, nodes }) => ({ id, impact, description, nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })) }))).toEqual([]);
});
