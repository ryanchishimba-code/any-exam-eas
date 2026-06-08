-- Add structured review module JSON for premium textbook-style topics
ALTER TABLE "HighYieldTopic" ADD COLUMN IF NOT EXISTS "reviewModule" JSONB;
