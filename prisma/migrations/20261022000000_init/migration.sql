-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPERADMIN', 'SHOPPING_OPERATOR', 'MERCHANT_VALIDATOR');

-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'ACTIVE', 'PAUSED', 'ENDED');

-- CreateEnum
CREATE TYPE "CardStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'RETIRED');

-- CreateEnum
CREATE TYPE "ParticipationStatus" AS ENUM ('WON', 'NO_PRIZE', 'REDEEMED', 'EXPIRED', 'VOID');

-- CreateEnum
CREATE TYPE "RedeemCodeStatus" AS ENUM ('ISSUED', 'REDEEMED', 'EXPIRED', 'REVOKED');

-- CreateTable
CREATE TABLE "shoppings" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "brandSettings" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shoppings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaigns" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "CampaignStatus" NOT NULL DEFAULT 'DRAFT',
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "rulesUrl" TEXT,
    "settings" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_shoppings" (
    "campaignId" TEXT NOT NULL,
    "shoppingId" TEXT NOT NULL,

    CONSTRAINT "campaign_shoppings_pkey" PRIMARY KEY ("campaignId","shoppingId")
);

-- CreateTable
CREATE TABLE "admin_users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'SHOPPING_OPERATOR',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_shoppings" (
    "userId" TEXT NOT NULL,
    "shoppingId" TEXT NOT NULL,

    CONSTRAINT "user_shoppings_pkey" PRIMARY KEY ("userId","shoppingId")
);

-- CreateTable
CREATE TABLE "cards" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "shoppingId" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "location" TEXT,
    "kind" TEXT NOT NULL DEFAULT 'ROULETTE',
    "status" "CardStatus" NOT NULL DEFAULT 'ACTIVE',
    "activatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prizes" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "shoppingId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "totalStock" INTEGER NOT NULL,
    "remainingStock" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL DEFAULT 1,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "maxPerPerson" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prizes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participants" (
    "id" TEXT NOT NULL,
    "sessionHash" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "shoppingId" TEXT NOT NULL,
    "consentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participations" (
    "id" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "shoppingId" TEXT NOT NULL,
    "prizeId" TEXT,
    "status" "ParticipationStatus" NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "participations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "redeem_codes" (
    "id" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "codeEncrypted" TEXT NOT NULL,
    "participationId" TEXT NOT NULL,
    "prizeId" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "shoppingId" TEXT NOT NULL,
    "status" "RedeemCodeStatus" NOT NULL DEFAULT 'ISSUED',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "redeemedAt" TIMESTAMP(3),
    "redeemedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "redeem_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_movements" (
    "id" TEXT NOT NULL,
    "prizeId" TEXT NOT NULL,
    "actorId" TEXT,
    "campaignId" TEXT NOT NULL,
    "shoppingId" TEXT NOT NULL,
    "delta" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_movements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clues" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "shoppingId" TEXT NOT NULL,
    "cardId" TEXT,
    "text" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collection_progress" (
    "id" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "collection_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collection_cards" (
    "progressId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "collectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "collection_cards_pkey" PRIMARY KEY ("progressId","cardId")
);

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "shoppingId" TEXT NOT NULL,
    "cardId" TEXT,
    "participantId" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "actorId" TEXT,
    "shoppingId" TEXT,
    "campaignId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rate_limit_buckets" (
    "key" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "resetAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rate_limit_buckets_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE UNIQUE INDEX "shoppings_slug_key" ON "shoppings"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "campaigns_slug_key" ON "campaigns"("slug");

-- CreateIndex
CREATE INDEX "campaigns_status_startsAt_endsAt_idx" ON "campaigns"("status", "startsAt", "endsAt");

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

-- CreateIndex
CREATE INDEX "cards_campaignId_status_idx" ON "cards"("campaignId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "cards_shoppingId_publicId_key" ON "cards"("shoppingId", "publicId");

-- CreateIndex
CREATE INDEX "prizes_campaignId_shoppingId_active_idx" ON "prizes"("campaignId", "shoppingId", "active");

-- CreateIndex
CREATE UNIQUE INDEX "participants_sessionHash_campaignId_shoppingId_key" ON "participants"("sessionHash", "campaignId", "shoppingId");

-- CreateIndex
CREATE INDEX "participations_campaignId_shoppingId_createdAt_idx" ON "participations"("campaignId", "shoppingId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "participations_participantId_cardId_campaignId_key" ON "participations"("participantId", "cardId", "campaignId");

-- CreateIndex
CREATE UNIQUE INDEX "participations_participantId_idempotencyKey_key" ON "participations"("participantId", "idempotencyKey");

-- CreateIndex
CREATE UNIQUE INDEX "redeem_codes_codeHash_key" ON "redeem_codes"("codeHash");

-- CreateIndex
CREATE UNIQUE INDEX "redeem_codes_participationId_key" ON "redeem_codes"("participationId");

-- CreateIndex
CREATE INDEX "redeem_codes_shoppingId_status_expiresAt_idx" ON "redeem_codes"("shoppingId", "status", "expiresAt");

-- CreateIndex
CREATE INDEX "inventory_movements_prizeId_createdAt_idx" ON "inventory_movements"("prizeId", "createdAt");

-- CreateIndex
CREATE INDEX "inventory_movements_shoppingId_createdAt_idx" ON "inventory_movements"("shoppingId", "createdAt");

-- CreateIndex
CREATE INDEX "clues_shoppingId_startsAt_endsAt_active_idx" ON "clues"("shoppingId", "startsAt", "endsAt", "active");

-- CreateIndex
CREATE UNIQUE INDEX "collection_progress_participantId_campaignId_key" ON "collection_progress"("participantId", "campaignId");

-- CreateIndex
CREATE INDEX "events_campaignId_shoppingId_eventType_createdAt_idx" ON "events"("campaignId", "shoppingId", "eventType", "createdAt");

-- CreateIndex
CREATE INDEX "events_cardId_createdAt_idx" ON "events"("cardId", "createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_shoppingId_createdAt_idx" ON "audit_logs"("shoppingId", "createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_actorId_createdAt_idx" ON "audit_logs"("actorId", "createdAt");

-- CreateIndex
CREATE INDEX "rate_limit_buckets_resetAt_idx" ON "rate_limit_buckets"("resetAt");

-- AddForeignKey
ALTER TABLE "campaign_shoppings" ADD CONSTRAINT "campaign_shoppings_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_shoppings" ADD CONSTRAINT "campaign_shoppings_shoppingId_fkey" FOREIGN KEY ("shoppingId") REFERENCES "shoppings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_shoppings" ADD CONSTRAINT "user_shoppings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "admin_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_shoppings" ADD CONSTRAINT "user_shoppings_shoppingId_fkey" FOREIGN KEY ("shoppingId") REFERENCES "shoppings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cards" ADD CONSTRAINT "cards_shoppingId_fkey" FOREIGN KEY ("shoppingId") REFERENCES "shoppings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cards" ADD CONSTRAINT "cards_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prizes" ADD CONSTRAINT "prizes_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prizes" ADD CONSTRAINT "prizes_shoppingId_fkey" FOREIGN KEY ("shoppingId") REFERENCES "shoppings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participants" ADD CONSTRAINT "participants_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participants" ADD CONSTRAINT "participants_shoppingId_fkey" FOREIGN KEY ("shoppingId") REFERENCES "shoppings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participations" ADD CONSTRAINT "participations_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "participants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participations" ADD CONSTRAINT "participations_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participations" ADD CONSTRAINT "participations_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participations" ADD CONSTRAINT "participations_shoppingId_fkey" FOREIGN KEY ("shoppingId") REFERENCES "shoppings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participations" ADD CONSTRAINT "participations_prizeId_fkey" FOREIGN KEY ("prizeId") REFERENCES "prizes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "redeem_codes" ADD CONSTRAINT "redeem_codes_participationId_fkey" FOREIGN KEY ("participationId") REFERENCES "participations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "redeem_codes" ADD CONSTRAINT "redeem_codes_prizeId_fkey" FOREIGN KEY ("prizeId") REFERENCES "prizes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "redeem_codes" ADD CONSTRAINT "redeem_codes_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "redeem_codes" ADD CONSTRAINT "redeem_codes_shoppingId_fkey" FOREIGN KEY ("shoppingId") REFERENCES "shoppings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "redeem_codes" ADD CONSTRAINT "redeem_codes_redeemedById_fkey" FOREIGN KEY ("redeemedById") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_movements" ADD CONSTRAINT "inventory_movements_prizeId_fkey" FOREIGN KEY ("prizeId") REFERENCES "prizes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_movements" ADD CONSTRAINT "inventory_movements_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_movements" ADD CONSTRAINT "inventory_movements_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_movements" ADD CONSTRAINT "inventory_movements_shoppingId_fkey" FOREIGN KEY ("shoppingId") REFERENCES "shoppings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clues" ADD CONSTRAINT "clues_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clues" ADD CONSTRAINT "clues_shoppingId_fkey" FOREIGN KEY ("shoppingId") REFERENCES "shoppings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clues" ADD CONSTRAINT "clues_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "cards"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection_progress" ADD CONSTRAINT "collection_progress_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "participants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection_progress" ADD CONSTRAINT "collection_progress_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection_cards" ADD CONSTRAINT "collection_cards_progressId_fkey" FOREIGN KEY ("progressId") REFERENCES "collection_progress"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection_cards" ADD CONSTRAINT "collection_cards_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_shoppingId_fkey" FOREIGN KEY ("shoppingId") REFERENCES "shoppings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "cards"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "participants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_shoppingId_fkey" FOREIGN KEY ("shoppingId") REFERENCES "shoppings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE SET NULL ON UPDATE CASCADE;

