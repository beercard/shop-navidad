import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { expect, test } from '@playwright/test';

test('capture public campaign mobile and desktop views', async ({ page }) => {
  test.setTimeout(120_000);
  const output = path.resolve('docs/ux-redesign/v4');
  await mkdir(output, { recursive: true });
  for (const slug of ['centenario', 'uniplaza']) {
    const destinations = [
      { id: 'inicio', label: 'Inicio', heading: /La magia está|La ciudad/i },
      { id: 'jugar', label: 'Jugar', heading: /Girá y descubrí/i },
      { id: 'descubrir', label: 'Descubrir', heading: /Tu colección/i },
      { id: 'premios', label: 'Premios', heading: /Premios/i },
      { id: 'progreso', label: 'Mi progreso', heading: /Mi progreso/i },
    ] as const;
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: width >= 768 ? 1000 : 844 });
      const campaignResponse = page.waitForResponse((response) => response.url().includes(`/api/campaigns/${slug}/public`));
      await page.goto(`/${slug}`);
      await campaignResponse;
      await expect(page.locator('[data-testid="campaign-stage"]')).toHaveAttribute('data-shopping', slug);
      await expect(page.getByRole('button', { name: slug === 'centenario' ? /Encontré una tarjeta/ : /Tengo una tarjeta/ })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Tu colección' })).toBeVisible();
      await expect(page.getByRole('list', { name: 'Cómo participar' }).getByRole('listitem')).toHaveCount(3);
      for (const destination of destinations) {
        if (destination.id !== 'inicio') await page.getByRole('button', { name: destination.label, exact: true }).click();
        await expect(page.getByRole('heading', { name: destination.heading }).first()).toBeVisible();
        const layout = await page.evaluate(() => ({ viewport: innerWidth, page: document.documentElement.scrollWidth }));
        expect(layout.page, `${slug}/${destination.id} at ${width}px overflows to ${layout.page}px`).toBeLessThanOrEqual(layout.viewport);
        if (width === 390) await page.screenshot({ path: path.join(output, `${slug}-${destination.id}-390.png`), fullPage: true });
        if (width === 1440) await page.screenshot({ path: path.join(output, `${slug}-${destination.id}-1440.png`), fullPage: true });
      }
    }
  }
});
