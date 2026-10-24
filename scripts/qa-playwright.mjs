import { spawnSync } from 'node:child_process';
import nextEnv from '@next/env';

nextEnv.loadEnvConfig(process.cwd());
if (process.env.NODE_ENV === 'production' || process.env.QA_MODE !== 'true') {
  console.error('test:qa requires QA_MODE=true outside production.');
  process.exit(1);
}

const specs = process.argv.slice(2);
const result = spawnSync(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['playwright', 'test', ...(specs.length ? specs : ['tests/qa-demo.spec.ts'])], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
  env: process.env,
});
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
