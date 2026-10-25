-- AlterTable
ALTER TABLE "participants" ADD COLUMN IF NOT EXISTS "phone" TEXT;
ALTER TABLE "participants" ADD COLUMN IF NOT EXISTS "phoneNormalized" TEXT;
ALTER TABLE "participants" ADD COLUMN IF NOT EXISTS "phoneHash" TEXT;
ALTER TABLE "participants" ADD COLUMN IF NOT EXISTS "recoveryCodeHash" TEXT;
ALTER TABLE "participants" ADD COLUMN IF NOT EXISTS "consentVersion" TEXT;
ALTER TABLE "participants" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "participants_campaign_shopping_phoneHash_idx" ON "participants"("campaignId", "shoppingId", "phoneHash");

-- CreatePartialUniqueIndex
-- Enforces strictly 1 participant per phone per campaign & shopping when phone is set,
-- while allowing legacy participants without phone (NULL) to coexist safely.
CREATE UNIQUE INDEX IF NOT EXISTS "participants_phone_campaign_unique" 
ON "participants"("shoppingId", "campaignId", "phoneHash") 
WHERE "phoneHash" IS NOT NULL;
