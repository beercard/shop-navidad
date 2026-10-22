-- Give every campaign exactly one owning shopping. Refuse ambiguous shared
-- campaigns so an operator can resolve them explicitly before deployment.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM "campaign_shoppings"
    GROUP BY "campaignId"
    HAVING COUNT(DISTINCT "shoppingId") > 1
  ) THEN
    RAISE EXCEPTION 'A campaign is linked to multiple shoppings; split it into shopping-owned campaigns before applying this migration.';
  END IF;
END $$;

ALTER TABLE "campaigns" ADD COLUMN "shoppingId" TEXT;

UPDATE "campaigns" AS campaign
SET "shoppingId" = link."shoppingId"
FROM "campaign_shoppings" AS link
WHERE link."campaignId" = campaign."id";

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM "campaigns" WHERE "shoppingId" IS NULL) THEN
    RAISE EXCEPTION 'A campaign has no shopping owner; assign it before applying this migration.';
  END IF;
END $$;

ALTER TABLE "campaigns" ALTER COLUMN "shoppingId" SET NOT NULL;
CREATE INDEX "campaigns_shoppingId_status_startsAt_endsAt_idx" ON "campaigns"("shoppingId", "status", "startsAt", "endsAt");
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_shoppingId_fkey" FOREIGN KEY ("shoppingId") REFERENCES "shoppings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
DROP TABLE "campaign_shoppings";
