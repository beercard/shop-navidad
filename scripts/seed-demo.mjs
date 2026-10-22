import { PrismaClient } from '@prisma/client';
import nextEnv from '@next/env';
import { seedDemo } from '../src/lib/demo-seed.mjs';

nextEnv.loadEnvConfig(process.cwd(), true);

function targetUrl() {
  if (process.env.NODE_ENV === 'production' || process.env.QA_MODE !== 'true') throw new Error('seed:demo solo está habilitado con QA_MODE=true fuera de producción.');
  const primary = new URL(process.env.DATABASE_URL ?? '');
  const qa = new URL(process.env.QA_DATABASE_URL ?? '');
  const primaryDb = primary.pathname.slice(1).toLowerCase();
  const qaDb = qa.pathname.slice(1).toLowerCase();
  const normalizeHost = (host) => ['localhost', '127.0.0.1', '[::1]', '::1'].includes(host.toLowerCase()) ? 'loopback' : host.toLowerCase();
  if (!['postgres:', 'postgresql:'].includes(primary.protocol) || !['postgres:', 'postgresql:'].includes(qa.protocol) || !/(^|[_-])(qa|test)([_-]|$)/i.test(qaDb) || (normalizeHost(primary.host) === normalizeHost(qa.host) && primaryDb === qaDb)) {
    throw new Error('QA_DATABASE_URL debe identificar una base PostgreSQL distinta, con qa/test en su nombre.');
  }
  return qa.href;
}

const prisma = new PrismaClient({ datasourceUrl: targetUrl() });
try {
  const summary = await seedDemo(prisma);
  console.log('Demo seed completed safely in the isolated QA database.');
  console.log(JSON.stringify(summary, null, 2));
} catch (error) {
  console.error(error instanceof Error ? error.message : 'Demo seed failed.');
  process.exitCode = 1;
} finally { await prisma.$disconnect(); }
