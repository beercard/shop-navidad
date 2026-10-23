-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_campaignId_fkey";

-- AlterTable
ALTER TABLE "cards" ADD COLUMN     "locationId" TEXT;

-- AlterTable
ALTER TABLE "redeem_codes" ADD COLUMN     "redeemedMerchantId" TEXT;

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "dedupeKey" TEXT,
ADD COLUMN     "locationId" TEXT,
ALTER COLUMN "campaignId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "locations" (
    "id" TEXT NOT NULL,
    "shoppingId" TEXT NOT NULL,
    "campaignId" TEXT,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sector" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "merchants" (
    "id" TEXT NOT NULL,
    "shoppingId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sector" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "merchants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "merchant_users" (
    "userId" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "merchant_users_pkey" PRIMARY KEY ("userId","merchantId")
);

-- CreateTable
CREATE TABLE "prize_merchants" (
    "prizeId" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prize_merchants_pkey" PRIMARY KEY ("prizeId","merchantId")
);

-- CreateTable
CREATE TABLE "otp_challenges" (
    "id" TEXT NOT NULL,
    "shoppingId" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "phoneHash" TEXT NOT NULL,
    "phoneLast4" TEXT NOT NULL,
    "otpHash" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "consentAt" TIMESTAMP(3) NOT NULL,
    "consentVersion" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "otp_challenges_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "locations_shoppingId_active_idx" ON "locations"("shoppingId", "active");

-- CreateIndex
CREATE INDEX "locations_campaignId_idx" ON "locations"("campaignId");

-- CreateIndex
CREATE UNIQUE INDEX "locations_shoppingId_slug_key" ON "locations"("shoppingId", "slug");

-- CreateIndex
CREATE INDEX "merchants_shoppingId_active_idx" ON "merchants"("shoppingId", "active");

-- CreateIndex
CREATE UNIQUE INDEX "merchants_shoppingId_slug_key" ON "merchants"("shoppingId", "slug");

-- CreateIndex
CREATE INDEX "merchant_users_merchantId_idx" ON "merchant_users"("merchantId");

-- CreateIndex
CREATE INDEX "prize_merchants_merchantId_idx" ON "prize_merchants"("merchantId");

-- CreateIndex
CREATE INDEX "otp_challenges_shoppingId_phoneHash_createdAt_idx" ON "otp_challenges"("shoppingId", "phoneHash", "createdAt");

-- CreateIndex
CREATE INDEX "otp_challenges_campaignId_expiresAt_idx" ON "otp_challenges"("campaignId", "expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "events_dedupeKey_key" ON "events"("dedupeKey");

-- AddForeignKey
ALTER TABLE "cards" ADD CONSTRAINT "cards_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "redeem_codes" ADD CONSTRAINT "redeem_codes_redeemedMerchantId_fkey" FOREIGN KEY ("redeemedMerchantId") REFERENCES "merchants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_shoppingId_fkey" FOREIGN KEY ("shoppingId") REFERENCES "shoppings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "merchants" ADD CONSTRAINT "merchants_shoppingId_fkey" FOREIGN KEY ("shoppingId") REFERENCES "shoppings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "merchant_users" ADD CONSTRAINT "merchant_users_userId_fkey" FOREIGN KEY ("userId") REFERENCES "admin_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "merchant_users" ADD CONSTRAINT "merchant_users_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "merchants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prize_merchants" ADD CONSTRAINT "prize_merchants_prizeId_fkey" FOREIGN KEY ("prizeId") REFERENCES "prizes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prize_merchants" ADD CONSTRAINT "prize_merchants_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "merchants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "otp_challenges" ADD CONSTRAINT "otp_challenges_shoppingId_fkey" FOREIGN KEY ("shoppingId") REFERENCES "shoppings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "otp_challenges" ADD CONSTRAINT "otp_challenges_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

