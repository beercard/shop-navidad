import type { PrismaClient } from '@prisma/client';
export function seedDemo(prisma: PrismaClient): Promise<{
  counts: Record<string, number>;
  campaigns: { shopping: string; campaignId: string; campaignName: string; cardIds: string[] }[];
  validUntil: string;
}>;
