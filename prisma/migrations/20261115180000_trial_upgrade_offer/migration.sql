-- Per-user 48-hour, 25% off first payment. One row per user.
-- The link token is created by scripts/trial-upgrade-offer.mts, not by this migration.

CREATE TABLE "trial_upgrade_offers" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "redeemedAt" TIMESTAMP(3),

    CONSTRAINT "trial_upgrade_offers_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "trial_upgrade_offers_userId_key" ON "trial_upgrade_offers"("userId");

CREATE UNIQUE INDEX "trial_upgrade_offers_token_key" ON "trial_upgrade_offers"("token");

CREATE INDEX "trial_upgrade_offers_expiresAt_idx" ON "trial_upgrade_offers"("expiresAt");

ALTER TABLE "trial_upgrade_offers" ADD CONSTRAINT "trial_upgrade_offers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
