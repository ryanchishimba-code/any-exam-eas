-- Subscription billing fields + trial abuse prevention
ALTER TABLE "Subscription" ADD COLUMN "planInterval" TEXT NOT NULL DEFAULT 'monthly';
ALTER TABLE "Subscription" ADD COLUMN "gracePeriodEndsAt" DATETIME;
ALTER TABLE "Subscription" ADD COLUMN "compAccessUntil" DATETIME;
ALTER TABLE "Subscription" ADD COLUMN "canceledAt" DATETIME;

CREATE TABLE "TrialEligibility" (
    "email" TEXT NOT NULL PRIMARY KEY,
    "usedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT
);
