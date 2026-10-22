import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import nextEnv from '@next/env';

nextEnv.loadEnvConfig(process.cwd());

function qaTarget() {
  if (process.env.NODE_ENV === 'production' || process.env.QA_MODE !== 'true') throw new Error('QA_MODE must be true outside production.');
  const primary = new URL(process.env.DATABASE_URL ?? '');
  const qa = new URL(process.env.QA_DATABASE_URL ?? '');
  const primaryDb = primary.pathname.slice(1).toLowerCase();
  const qaDb = qa.pathname.slice(1).toLowerCase();
  const normalizeHost = (host) => ['localhost', '127.0.0.1', '[::1]', '::1'].includes(host.toLowerCase()) ? 'loopback' : host.toLowerCase();
  if (!/(^|[_-])(qa|test)([_-]|$)/i.test(qaDb) || (normalizeHost(primary.host) === normalizeHost(qa.host) && primaryDb === qaDb)) throw new Error('QA_DATABASE_URL must identify a distinct PostgreSQL database with a qa/test segment.');
  return qa.href;
}

const email = process.env.QA_ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.QA_ADMIN_PASSWORD;
if (!email || !password || password.length < 12) throw new Error('Set QA_ADMIN_EMAIL and a QA_ADMIN_PASSWORD of at least 12 characters.');
const prisma = new PrismaClient({ datasourceUrl: qaTarget() });
try {
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash, active: true, role: 'SUPERADMIN', shoppingScopes: { deleteMany: {} } },
    create: { email, name: 'QA Superadministración', passwordHash, role: 'SUPERADMIN' },
  });
  console.log(`QA superadministrator ready: ${email}`);
} finally {
  await prisma.$disconnect();
}
