import { PrismaClient } from '@prisma/client';
import { qaDatabaseUrl } from '@/lib/qa-safety';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const selectedDatabase = process.env.QA_MODE === 'true' && process.env.NODE_ENV !== 'production'
  ? qaDatabaseUrl()
  : process.env.DATABASE_URL;
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  ...(selectedDatabase ? { datasourceUrl: selectedDatabase } : {}),
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
