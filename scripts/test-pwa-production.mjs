import { spawnSync } from 'node:child_process';
import path from 'node:path';

const result = spawnSync(process.execPath, [path.resolve('node_modules/playwright/cli.js'), 'test', 'tests/pwa-production.spec.ts'], {
  cwd: process.cwd(),
  env: { ...process.env, PW_SERVER: 'production', CI: 'true' },
  stdio: 'inherit',
});

process.exit(result.status ?? 1);
