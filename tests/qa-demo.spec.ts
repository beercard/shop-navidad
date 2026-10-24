import { expect, test } from '@playwright/test';
import { randomUUID } from 'node:crypto';

test.use({ actionTimeout: 15_000, navigationTimeout: 60_000 });

test('demo seed is idempotent, campaign reads are side-effect free, and QR cards stay in their tenant', async ({ page, request, browser }) => {
  test.skip(process.env.QA_MODE !== 'true' || !process.env.QA_ADMIN_EMAIL || !process.env.QA_ADMIN_PASSWORD, 'Requires the isolated QA database and QA superadmin.');
  test.setTimeout(300_000);

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

  const publicCampaign = second.campaigns.find((campaign: { slug: string }) => campaign.slug === 'navidad-demo-centenario');
  const participantsBeforeRead = await page.request.get(`/api/admin/participants?shoppingSlug=centenario&campaignId=${publicCampaign.id}`);
  expect(participantsBeforeRead.status()).toBe(200);
  const participantCountBeforeRead = (await participantsBeforeRead.json()).pagination.total;
  const anonymousCampaignRead = await request.get('/api/campaigns/centenario/public');
  expect(anonymousCampaignRead.status()).toBe(200);
  expect(anonymousCampaignRead.headers()['set-cookie']).toBeUndefined();
  const participantsAfterRead = await page.request.get(`/api/admin/participants?shoppingSlug=centenario&campaignId=${publicCampaign.id}`);
  expect((await participantsAfterRead.json()).pagination.total).toBe(participantCountBeforeRead);

  const locationSlug = `qa-scan-${randomUUID().slice(0, 8)}`;
  const locationCreate = await page.request.post('/api/admin/locations', { data: { shoppingSlug: 'centenario', campaignId: publicCampaign.id, slug: locationSlug, name: 'Entrada QA' } });
  expect(locationCreate.status()).toBe(201);
  const location = (await locationCreate.json()).location;
  if (first.baseUrl) {
    const qrFile = await page.request.get(`/api/admin/locations/${location.id}/qr?shoppingSlug=centenario`);
    expect(qrFile.status()).toBe(200);
    expect(qrFile.headers()['content-type']).toContain('image/svg+xml');
    expect(await qrFile.text()).toContain('<svg');
    const crossShopQr = await page.request.get(`/api/admin/locations/${location.id}/qr?shoppingSlug=uniplaza`);
    expect(crossShopQr.status()).toBe(404);
  }
  const visit = await page.request.get(`/nfc/centenario/${locationSlug}`, { maxRedirects: 0 });
  expect(visit.status()).toBe(307);
  expect(visit.headers().location).toContain('/centenario?location=');
  const firstLocationState = await page.request.get('/api/admin/locations?shoppingSlug=centenario');
  const firstVisitCount = (await firstLocationState.json()).locations.find((item: { id: string }) => item.id === location.id)._count.events;
  await page.request.get(`/nfc/centenario/${locationSlug}`, { maxRedirects: 0 });
  const repeatLocationState = await page.request.get('/api/admin/locations?shoppingSlug=centenario');
  expect((await repeatLocationState.json()).locations.find((item: { id: string }) => item.id === location.id)._count.events).toBe(firstVisitCount);
  expect((await page.request.patch(`/api/admin/locations/${location.id}`, { data: { shoppingSlug: 'uniplaza', active: false } })).status()).toBe(404);
  expect((await page.request.patch(`/api/admin/locations/${location.id}`, { data: { shoppingSlug: 'centenario', active: false } })).status()).toBe(200);
  expect((await page.request.get(`/nfc/centenario/${locationSlug}`, { maxRedirects: 0 })).status()).toBe(404);

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
  expect(result.redeemQr).toMatch(/^data:image\/png;base64,/);
  await expect(page.getByRole('heading', { name: '¡Encontraste tu premio!' })).toBeVisible();
  const redemption = { shoppingSlug: 'centenario', code: result.redeemCode };
  const merchantSuffix = randomUUID().slice(0, 8);
  const merchantResponse = await page.request.post('/api/admin/merchants', { data: { shoppingSlug: 'centenario', slug: `qa-tienda-${merchantSuffix}`, name: 'Comercio de QA' } });
  expect(merchantResponse.status()).toBe(201);
  const merchant = (await merchantResponse.json()).merchant;
  const otherMerchantResponse = await page.request.post('/api/admin/merchants', { data: { shoppingSlug: 'centenario', slug: `qa-otro-${merchantSuffix}`, name: 'Otro comercio de QA' } });
  expect(otherMerchantResponse.status()).toBe(201);
  const otherMerchant = (await otherMerchantResponse.json()).merchant;
  const prizeRows = (await (await page.request.get('/api/admin/prizes?shoppingSlug=centenario')).json()).prizes;
  const prizeId = prizeRows.find((prize: { name: string }) => prize.name === result.prize.name).id;
  expect((await page.request.put(`/api/admin/merchants/${merchant.id}/prizes`, { data: { shoppingSlug: 'centenario', prizeIds: [prizeId] } })).status()).toBe(200);
  const validatorEmail = `qa-${randomUUID()}@example.invalid`;
  const validatorPassword = `Qa-${randomUUID()}-A1!`;
  const validatorCreate = await page.request.post('/api/admin/users', { data: { name: 'Validador QA', email: validatorEmail, password: validatorPassword, role: 'MERCHANT_VALIDATOR', shoppingSlugs: ['centenario'], merchantIds: [merchant.id] } });
  expect(validatorCreate.status()).toBe(201);
  const validatorUser = (await validatorCreate.json()).user;
  const resetPasswordResponse = await page.request.post(`/api/admin/users/${validatorUser.id}/password`);
  expect(resetPasswordResponse.status()).toBe(200);
  const resetPassword = await resetPasswordResponse.json();
  expect(resetPassword.temporaryPassword).toBeTruthy();
  const effectiveValidatorPassword = resetPassword.temporaryPassword as string;
  const merchantContext = await browser.newContext();
  const merchantPage = await merchantContext.newPage();
  try {
    await merchantPage.goto('/merchant');
    await merchantPage.getByLabel('Correo').fill(validatorEmail);
    await merchantPage.getByLabel('Contraseña').fill(effectiveValidatorPassword);
    const merchantLogin = merchantPage.waitForResponse((response) => response.url().includes('/api/auth/login') && response.request().method() === 'POST');
    await merchantPage.getByRole('button', { name: 'Ingresar' }).click();
    expect((await merchantLogin).status()).toBe(200);
    await expect(merchantPage.getByRole('heading', { name: merchant.name })).toBeVisible();
    await expect(merchantPage.getByText('Canjes de hoy')).toBeVisible();
    await expect(merchantPage.getByText('Centenario Shopping')).toBeVisible();
    await expect(merchantPage.getByRole('combobox')).toHaveCount(0);
    const unauthorizedLookup = await merchantPage.request.post('/api/merchant/coupons/lookup', { data: { merchantSlug: otherMerchant.slug, code: result.redeemCode } });
    expect(unauthorizedLookup.status()).toBe(403);
    await merchantPage.getByRole('button', { name: 'Escanear QR' }).click();
    await merchantPage.getByRole('button', { name: 'Permitir cámara y escanear' }).click();
    await expect(merchantPage.getByRole('region', { name: 'Escaneá el QR' }).getByRole('alert')).toContainText(/cámara|permiso/i);
    await merchantPage.getByRole('button', { name: 'Cerrar', exact: true }).click();
    await merchantPage.getByRole('button', { name: 'Ingresar código manualmente' }).click();
    await merchantPage.getByLabel('Código del cupón').fill(result.redeemCode);
    const lookupResponse = merchantPage.waitForResponse((response) => response.url().includes('/api/merchant/coupons/lookup') && response.request().method() === 'POST');
    await merchantPage.getByRole('button', { name: 'Consultar cupón' }).click();
    expect((await lookupResponse).status()).toBe(200);
    await expect(merchantPage.getByRole('heading', { name: result.prize.name })).toBeVisible();
    expect(await merchantPage.locator('body').innerText()).not.toContain('Teléfono');
    const merchantRedeemResponse = merchantPage.waitForResponse((response) => response.url().includes('/api/merchant/coupons/redeem') && response.request().method() === 'POST');
    await merchantPage.getByRole('button', { name: 'Confirmar canje' }).click();
    const merchantRedeem = await merchantRedeemResponse;
    expect(merchantRedeem.status()).toBe(200);
    await expect(merchantPage.getByRole('heading', { name: 'Cupón canjeado correctamente' })).toBeVisible();
    const repeatRedeem = await merchantPage.request.post('/api/merchant/coupons/redeem', { data: { merchantSlug: merchant.slug, code: result.redeemCode } });
    expect(repeatRedeem.status()).toBe(200);
    expect((await repeatRedeem.json()).alreadyRedeemed).toBe(true);
    const history = await merchantPage.request.get(`/api/merchant/coupons/history?merchantSlug=${merchant.slug}`);
    expect(history.status()).toBe(200);
    const historyBody = await history.json();
    expect(historyBody.redemptions).toHaveLength(1);
    expect(historyBody.todayCount).toBe(1);
    expect(historyBody.redemptions[0].maskedCode).toMatch(/^••••-/);
    expect(historyBody.redemptions[0].redeemedBy.name).toBe('Validador QA');
    expect(JSON.stringify(historyBody)).not.toContain(result.redeemCode);
    await merchantPage.getByRole('button', { name: 'Validar otro cupón' }).click();
    await merchantPage.getByRole('button', { name: /Historial/ }).click();
    await expect(merchantPage.getByRole('heading', { name: 'Historial de canjes' })).toBeVisible();
    await expect(merchantPage.getByText(/Validador QA/)).toBeVisible();
    await merchantPage.getByRole('button', { name: 'Seguridad' }).click();
    await merchantPage.getByText('Cambiar contraseña').click();
    await merchantPage.getByLabel('Contraseña actual').fill(effectiveValidatorPassword);
    const changedPassword = `New-${randomUUID()}-Secure!`;
    await merchantPage.getByLabel('Nueva contraseña').fill(changedPassword);
    const changePasswordResponse = merchantPage.waitForResponse((response) => response.url().includes('/api/auth/password') && response.request().method() === 'POST');
    await merchantPage.getByRole('button', { name: 'Guardar contraseña' }).click();
    expect((await changePasswordResponse).status()).toBe(200);
    await expect(merchantPage.getByText('Contraseña actualizada. La sesión segura sigue activa en este dispositivo.')).toBeVisible();
    expect((await merchantPage.request.get('/api/auth/me')).status()).toBe(200);
  } finally { await merchantContext.close(); }
  const crossTenantRedeem = await page.request.post('/api/redeems/validate', { data: { ...redemption, shoppingSlug: 'uniplaza' } });
  expect(crossTenantRedeem.status()).toBe(404);
  expect((await crossTenantRedeem.json()).code).toBe('INVALID_CODE');

  // Exercise the redesigned public game as well as the dedicated NFC route.
  await page.goto('/centenario?campaign=navidad-demo-centenario');
  await page.getByRole('button', { name: 'Encontré una tarjeta' }).click();
  await page.getByLabel('Código de tu tarjeta').fill('CEN-DEMO-005');
  const landingPlayResponse = page.waitForResponse((response) => response.url().endsWith('/api/participations') && response.request().method() === 'POST');
  await page.getByRole('button', { name: 'Girar y descubrir' }).click();
  const landingPlay = await landingPlayResponse;
  expect(landingPlay.status()).toBe(200);
  const landingResult = await landingPlay.json();
  expect(['won', 'no_prize']).toContain(landingResult.status);
  await expect(page.getByText(landingResult.status === 'won' ? 'Premio confirmado' : 'Participación registrada', { exact: true })).toBeVisible();
  await expect(page.getByText(landingResult.status === 'won' ? 'PREMIO CONFIRMADO' : 'SIN PREMIO ESTA VEZ', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Buscar otra tarjeta' })).toBeVisible();

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


