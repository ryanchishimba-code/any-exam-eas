-- Add subscription tier (basic | pro) for tiered pricing.
ALTER TABLE "Subscription" ADD COLUMN IF NOT EXISTS "planTier" TEXT NOT NULL DEFAULT 'pro';

-- Default billing interval to annual (matches new pricing UX).
ALTER TABLE "Subscription" ALTER COLUMN "planInterval" SET DEFAULT 'yearly';
