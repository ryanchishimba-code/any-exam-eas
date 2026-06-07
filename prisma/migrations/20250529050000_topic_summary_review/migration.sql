-- High-yield topic summaries + review count tracking

ALTER TABLE "HighYieldTopic" ADD COLUMN IF NOT EXISTS "summary" TEXT NOT NULL DEFAULT '';

ALTER TABLE "UserTopicProgress" ADD COLUMN IF NOT EXISTS "reviewCount" INTEGER NOT NULL DEFAULT 0;
