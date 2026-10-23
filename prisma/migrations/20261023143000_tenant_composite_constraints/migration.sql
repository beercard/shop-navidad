-- Enforce shopping/campaign ownership at the database boundary, even if an
-- application query accidentally combines identifiers from different tenants.
-- Existing single-column foreign keys remain in place; these compound keys add
-- tenant consistency without changing or deleting any data.

CREATE UNIQUE INDEX "campaigns_id_shoppingId_key" ON "campaigns"("id", "shoppingId");
CREATE UNIQUE INDEX "cards_id_shoppingId_campaignId_key" ON "cards"("id", "shoppingId", "campaignId");
CREATE UNIQUE INDEX "prizes_id_shoppingId_campaignId_key" ON "prizes"("id", "shoppingId", "campaignId");
CREATE UNIQUE INDEX "participants_id_shoppingId_campaignId_key" ON "participants"("id", "shoppingId", "campaignId");
CREATE UNIQUE INDEX "participations_id_shoppingId_campaignId_key" ON "participations"("id", "shoppingId", "campaignId");
CREATE UNIQUE INDEX "redeem_codes_participationId_shoppingId_campaignId_key" ON "redeem_codes"("participationId", "shoppingId", "campaignId");

ALTER TABLE "cards"
  ADD CONSTRAINT "cards_campaignId_shoppingId_fkey"
  FOREIGN KEY ("campaignId", "shoppingId") REFERENCES "campaigns"("id", "shoppingId") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "prizes"
  ADD CONSTRAINT "prizes_campaignId_shoppingId_fkey"
  FOREIGN KEY ("campaignId", "shoppingId") REFERENCES "campaigns"("id", "shoppingId") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "participants"
  ADD CONSTRAINT "participants_campaignId_shoppingId_fkey"
  FOREIGN KEY ("campaignId", "shoppingId") REFERENCES "campaigns"("id", "shoppingId") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "participations"
  ADD CONSTRAINT "participations_participantId_shoppingId_campaignId_fkey"
  FOREIGN KEY ("participantId", "shoppingId", "campaignId") REFERENCES "participants"("id", "shoppingId", "campaignId") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "participations_cardId_shoppingId_campaignId_fkey"
  FOREIGN KEY ("cardId", "shoppingId", "campaignId") REFERENCES "cards"("id", "shoppingId", "campaignId") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "participations_campaignId_shoppingId_fkey"
  FOREIGN KEY ("campaignId", "shoppingId") REFERENCES "campaigns"("id", "shoppingId") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "participations_prizeId_shoppingId_campaignId_fkey"
  FOREIGN KEY ("prizeId", "shoppingId", "campaignId") REFERENCES "prizes"("id", "shoppingId", "campaignId") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "redeem_codes"
  ADD CONSTRAINT "redeem_codes_participationId_shoppingId_campaignId_fkey"
  FOREIGN KEY ("participationId", "shoppingId", "campaignId") REFERENCES "participations"("id", "shoppingId", "campaignId") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "redeem_codes_prizeId_shoppingId_campaignId_fkey"
  FOREIGN KEY ("prizeId", "shoppingId", "campaignId") REFERENCES "prizes"("id", "shoppingId", "campaignId") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "redeem_codes_campaignId_shoppingId_fkey"
  FOREIGN KEY ("campaignId", "shoppingId") REFERENCES "campaigns"("id", "shoppingId") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "inventory_movements"
  ADD CONSTRAINT "inventory_movements_prizeId_shoppingId_campaignId_fkey"
  FOREIGN KEY ("prizeId", "shoppingId", "campaignId") REFERENCES "prizes"("id", "shoppingId", "campaignId") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "inventory_movements_campaignId_shoppingId_fkey"
  FOREIGN KEY ("campaignId", "shoppingId") REFERENCES "campaigns"("id", "shoppingId") ON DELETE RESTRICT ON UPDATE CASCADE;
