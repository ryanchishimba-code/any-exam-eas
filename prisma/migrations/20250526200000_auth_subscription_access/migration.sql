-- Subscription billing fields + trial abuse prevention
ALTER TABLE "Subscription" ADD COLUMN "planInterval" TEXT NOT NULL DEFAULT 'monthly';
ALTER TABLE "Subscription" ADD COLUMN "gracePeriodEndsAt" TIMESTAMP(3);
ALTER TABLE "Subscription" ADD COLUMN "compAccessUntil" TIMESTAMP(3);
ALTER TABLE "Subscription" ADD COLUMN "canceledAt" TIMESTAMP(3);

CREATE TABLE "TrialEligibility" (
    "email" TEXT NOT NULL PRIMARY KEY,
    "usedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT
);
