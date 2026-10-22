import { expect, test } from '@playwright/test';

test('demo seed is idempotent and QR cards stay within their shopping tenant', async ({ page }) => {
  test.skip(process.env.QA_MODE !== 'true' || !process.env.QA_ADMIN_EMAIL || !process.env.QA_ADMIN_PASSWORD, 'Requires the isolated QA database and QA superadmin.');
  test.setTimeout(120_000);

  await page.goto('/admin');
  await page.getByLabel('Correo').fill(process.env.QA_ADMIN_EMAIL!);
  await page.getByLabel('Contraseña').fill(process.env.QA_ADMIN_PASSWORD!);
  const loginResponse = page.waitForResponse((response) => response.url().includes('/api/auth/login') && response.request().method() === 'POST');
  await page.getByRole('button', { name: 'Ingresar' }).click();
  expect((await loginResponse).status()).toBe(200);
  const signedIn = await page.request.get('/api/auth/me');
  expect(signedIn.status()).toBe(200);

  await page.goto('/qa');
  await expect(page.getByText('DATOS DEMO PERSISTIDOS')).toBeVisible();
  const resetResponse = await page.request.post('/api/qa/reset', { data: { confirmation: 'RESET QA' } });
  expect(resetResponse.status()).toBe(200);
  await page.reload();
  page.on('dialog', (dialog) => dialog.accept());
  const seedButton = page.getByRole('button', { name: 'Cargar / actualizar datos demo' });
  const secondSeedResponse = page.waitForResponse((response) => response.url().includes('/api/qa/demo/seed') && response.request().method() === 'POST');
  await seedButton.click();
  expect((await secondSeedResponse).status()).toBe(200);
  await expect(page.getByRole('status')).toContainText('Datos DEMO listos');

  const firstStatus = await page.request.get('/api/qa/status');
  expect(firstStatus.status()).toBe(200);
  const first = await firstStatus.json();
  const campaignSlugs = first.campaigns.map((campaign: { slug: string }) => campaign.slug);
  expect(campaignSlugs).toContain('navidad-demo-centenario');
  expect(campaignSlugs).toContain('navidad-demo-uniplaza');
  for (const slug of ['centenario', 'uniplaza']) {
    const campaign = first.campaigns.find((item: { slug: string }) => item.slug === `navidad-demo-${slug}`);
    expect(first.prizes.filter((prize: { campaignId: string }) => prize.campaignId === campaign.id)).toHaveLength(5);
    expect(first.cards.filter((card: { campaignId: string }) => card.campaignId === campaign.id)).toHaveLength(10);
  }
  const centenarioCampaign = first.campaigns.find((item: { slug: string }) => item.slug === 'navidad-demo-centenario');
  const prizeBefore = first.prizes.filter((prize: { campaignId: string }) => prize.campaignId === centenarioCampaign.id).reduce((stock: number, prize: { remainingStock: number }) => stock + prize.remainingStock, 0);
  await expect(page.locator('.qa-qr-card')).toHaveCount(10);
  await expect(page.locator('.qa-qr-card img').first()).toHaveAttribute('alt', /CEN-DEMO-001/);

  await seedButton.click();
  await expect(page.getByRole('status')).toContainText('Datos DEMO listos');
  const secondStatus = await page.request.get('/api/qa/status');
  const second = await secondStatus.json();
  expect(second.campaigns).toHaveLength(first.campaigns.length);
  expect(second.prizes).toHaveLength(first.prizes.length);
  expect(second.cards).toHaveLength(first.cards.length);

  const crossTenant = await page.request.post('/api/participations', {
    data: { shoppingSlug: 'uniplaza', cardId: 'CEN-DEMO-001', idempotencyKey: 'e2e00000-0000-4000-8000-000000000001' },
  });
  expect(crossTenant.status()).toBe(404);
  expect((await crossTenant.json()).code).toBe('CARD_NOT_FOUND');

  await page.goto('/centenario/participar/CEN-DEMO-004');
  await expect(page.getByRole('button', { name: /Participar/ })).toBeEnabled();
  const playResponse = page.waitForResponse((response) => response.url().endsWith('/api/participations') && response.request().method() === 'POST');
  await page.getByRole('button', { name: /Participar/ }).click();
  const play = await playResponse;
  expect(play.status()).toBe(200);
  const result = await play.json();
  expect(result.status).toBe('won');
  expect(result.prize.name).toContain('DEMO — SIN VALOR COMERCIAL');
  expect(result.redeemCode).toBeTruthy();
  await expect(page.getByRole('heading', { name: '¡Encontraste tu premio!' })).toBeVisible();
  const redemption = { shoppingSlug: 'centenario', code: result.redeemCode };
  expect((await page.request.post('/api/redeems/validate', { data: redemption })).status()).toBe(200);
  const repeatRedeem = await page.request.post('/api/redeems/validate', { data: redemption });
  expect(repeatRedeem.status()).toBe(409);
  expect((await repeatRedeem.json()).code).toBe('ALREADY_REDEEMED');
  const crossTenantRedeem = await page.request.post('/api/redeems/validate', { data: { ...redemption, shoppingSlug: 'uniplaza' } });
  expect(crossTenantRedeem.status()).toBe(404);
  expect((await crossTenantRedeem.json()).code).toBe('INVALID_CODE');

  // Exercise the redesigned public game as well as the dedicated NFC route.
  await page.goto('/centenario');
  await page.getByLabel('Código de tu tarjeta').fill('CEN-DEMO-005');
  const landingPlayResponse = page.waitForResponse((response) => response.url().endsWith('/api/participations') && response.request().method() === 'POST');
  await page.getByRole('button', { name: 'Girar y descubrir' }).click();
  const landingPlay = await landingPlayResponse;
  expect(landingPlay.status()).toBe(200);
  const landingResult = await landingPlay.json();
  expect(['won', 'no_prize']).toContain(landingResult.status);
  const confirmedResult = page.locator('[role="status"][aria-live="polite"]');
  await expect(confirmedResult).toBeVisible();
  await expect(confirmedResult).toContainText(landingResult.status === 'won' ? 'PREMIO CONFIRMADO' : 'PARTICIPACIÓN REGISTRADA');
  await expect(page.getByRole('button', { name: 'Participación confirmada' })).toBeVisible();

  const afterPlayResponse = await page.request.get('/api/qa/status');
  const afterPlay = await afterPlayResponse.json();
  const centenarioPrizesAfter = afterPlay.prizes.filter((prize: { campaignId: string }) => prize.campaignId === centenarioCampaign.id);
  expect(centenarioPrizesAfter.reduce((stock: number, prize: { remainingStock: number }) => stock + prize.remainingStock, 0)).toBe(prizeBefore - 1 - (landingResult.status === 'won' ? 1 : 0));
  expect(afterPlay.participations.some((item: { card: { publicId: string } }) => item.card.publicId === 'CEN-DEMO-004')).toBe(true);
  expect(afterPlay.participations.some((item: { card: { publicId: string } }) => item.card.publicId === 'CEN-DEMO-005')).toBe(true);
  expect(afterPlay.redeems.some((item: { status: string; prize: { name: string } }) => item.status === 'REDEEMED' && item.prize.name === result.prize.name)).toBe(true);

  await page.goto('/qa');
  await page.getByRole('button', { name: 'UniPlaza Shopping' }).click();
  await expect(page.locator('.qa-qr-card')).toHaveCount(10);
  await expect(page.locator('.qa-qr-card img').first()).toHaveAttribute('alt', /UNI-DEMO-001/);
});


