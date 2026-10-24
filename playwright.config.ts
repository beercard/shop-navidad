import { defineConfig, devices } from '@playwright/test';

const productionPwa = process.env.PW_SERVER === 'production';
const remoteBaseUrl = process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 2,
  reporter: 'list',
  use: { ...devices['Desktop Chrome'], baseURL: remoteBaseUrl || 'http://127.0.0.1:3000', trace: 'retain-on-failure' },
  webServer: remoteBaseUrl ? undefined : { command: productionPwa ? 'npm run start -- --hostname 127.0.0.1 --port 3000' : 'npm run dev -- --hostname 127.0.0.1 --port 3000', url: 'http://127.0.0.1:3000', reuseExistingServer: !process.env.CI, timeout: 120_000 },
});
