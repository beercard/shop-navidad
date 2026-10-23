import { expect, test } from '@playwright/test';

test('production PWA installs, controls routes, and falls back offline without caching private responses', async ({ page, context }) => {
  test.skip(process.env.PW_SERVER !== 'production', 'Run against the production build with npm run test:pwa:production.');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/offline');
  await expect(page.getByRole('heading', { name: /Te quedaste sin conexión/ })).toBeVisible();

  const installed = await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.ready;
    const offline = await caches.match(new URL('/offline', location.origin).href);
    const entries = await Promise.all((await caches.keys()).map(async (key) => (await caches.open(key)).keys()));
    return {
      script: registration.active?.scriptURL,
      offlineShellCached: Boolean(offline),
      cachedPaths: entries.flat().map((request) => new URL(request.url).pathname),
    };
  });
  expect(installed.script).toContain('/sw.js');
  expect(installed.offlineShellCached).toBe(true);
  expect(installed.cachedPaths.some((path) => path.startsWith('/api/'))).toBe(false);
  expect(installed.cachedPaths.some((path) => path.startsWith('/admin'))).toBe(false);
  expect(installed.cachedPaths.some((path) => path.startsWith('/participar/'))).toBe(false);

  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
  for (const shopping of ['centenario', 'uniplaza']) {
    await page.goto(`/${shopping}/participar/QA-CACHE-ROUTE`);
    await expect(page.locator(`main[data-shopping="${shopping}"]`)).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Encontraste una tarjeta' })).toBeVisible();
  }
  const participationPaths = await page.evaluate(async () =>
    (await Promise.all((await caches.keys()).map(async (key) => (await caches.open(key)).keys())))
      .flat()
      .map((request) => new URL(request.url).pathname)
      .filter((path) => /^\/(?:centenario|uniplaza)\/participar(?:\/|$)/.test(path)),
  );
  expect(participationPaths).toEqual([]);

  await context.setOffline(true);
  try {
    await page.goto('/uniplaza');
    await expect(page.getByRole('heading', { name: /Te quedaste sin conexión/ })).toBeVisible();
    await expect(page.getByText(/giros y canjes necesitan una respuesta del servidor/i)).toBeVisible();
  } finally {
    await context.setOffline(false);
  }
});
