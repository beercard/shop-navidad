import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import nextEnv from '@next/env';

nextEnv.loadEnvConfig(process.cwd());

const targetUrls = [process.env.DATABASE_URL, process.env.QA_DATABASE_URL].filter(Boolean);

for (const url of [...new Set(targetUrls)]) {
  const prisma = new PrismaClient({ datasourceUrl: url });
  try {
    const centenario = await prisma.shopping.upsert({ where: { slug: 'centenario' }, update: { name: 'Centenario Shopping' }, create: { slug: 'centenario', name: 'Centenario Shopping' } });
    const uniplaza = await prisma.shopping.upsert({ where: { slug: 'uniplaza' }, update: { name: 'UniPlaza Shopping' }, create: { slug: 'uniplaza', name: 'UniPlaza Shopping' } });

    if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
      if (process.env.ADMIN_PASSWORD.length < 12) throw new Error('ADMIN_PASSWORD must be at least 12 characters.');
      const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
      await prisma.adminUser.upsert({
        where: { email: process.env.ADMIN_EMAIL.toLowerCase() },
        update: { passwordHash, active: true, role: 'SUPERADMIN' },
        create: { email: process.env.ADMIN_EMAIL.toLowerCase(), name: 'Administración general', passwordHash, role: 'SUPERADMIN' },
      });
      console.log(`Created or updated the initial admin account: ${process.env.ADMIN_EMAIL.toLowerCase()}`);
    } else {
      console.log('Shopping records are ready. Set ADMIN_EMAIL and ADMIN_PASSWORD to create the first admin account.');
    }
    console.log(`Ready: ${centenario.name} and ${uniplaza.name} at ${url}.`);
  } catch (err) {
    console.warn(`Could not seed ${url}: ${err.message}`);
  } finally {
    await prisma.$disconnect();
  }
}
