import { spawnSync } from 'node:child_process';
import nextEnv from '@next/env';

nextEnv.loadEnvConfig(process.cwd());

function validateQaTarget() {
  if (process.env.NODE_ENV === 'production' || process.env.QA_MODE !== 'true') throw new Error('QA_MODE must be true outside production.');
  const primary = new URL(process.env.DATABASE_URL ?? '');
  const qa = new URL(process.env.QA_DATABASE_URL ?? '');
  const primaryDb = primary.pathname.slice(1).toLowerCase();
  const qaDb = qa.pathname.slice(1).toLowerCase();
  const normalizeHost = (host) => ['localhost', '127.0.0.1', '[::1]', '::1'].includes(host.toLowerCase()) ? 'loopback' : host.toLowerCase();
  if (!/(^|[_-])(qa|test)([_-]|$)/i.test(qaDb) || (normalizeHost(primary.host) === normalizeHost(qa.host) && primaryDb === qaDb)) throw new Error('QA_DATABASE_URL must identify a distinct PostgreSQL database with a qa/test segment.');
  return qa.href;
}

try {
  const url = validateQaTarget();
  const result = spawnSync(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['prisma', 'migrate', 'deploy'], {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: { ...process.env, DATABASE_URL: url },
  });
  if (result.error) throw result.error;
  process.exitCode = result.status ?? 1;
} catch (error) {
  console.error(error instanceof Error ? error.message : 'Could not validate QA database target.');
  process.exitCode = 1;
}
