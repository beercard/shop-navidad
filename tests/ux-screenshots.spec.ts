import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { expect, test } from '@playwright/test';

const phase = process.env.UX_SCREENSHOT_PHASE === 'before' ? 'before' : 'after';

test('capture public campaign mobile and desktop views', async ({ page }) => {
  const output = path.resolve('docs/ux-redesign');
  await mkdir(output, { recursive: true });
  for (const slug of ['centenario', 'uniplaza']) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/${slug}`);
    await expect(page.locator('[data-testid="campaign-stage"]')).toHaveAttribute('data-shopping', slug);
    await expect(page.getByRole('heading', { name: /Tu colección/ })).toBeVisible();
    await page.screenshot({ path: path.join(output, `${phase}-${slug}-mobile.png`), fullPage: true });

    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.screenshot({ path: path.join(output, `${phase}-${slug}-desktop.png`), fullPage: true });
  }
});