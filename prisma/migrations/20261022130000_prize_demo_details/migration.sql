ALTER TABLE "prizes" ADD COLUMN "details" JSONB NOT NULL DEFAULT '{}'::jsonb;
