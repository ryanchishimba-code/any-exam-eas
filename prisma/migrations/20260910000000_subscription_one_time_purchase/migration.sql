-- Let a Subscription row represent a one-time purchase, not just a recurring sub.
--
-- Learners can now choose "pay once" at checkout: the same amount for the same
-- length of access, but Stripe never charges again. Such a purchase has no
-- `stripeSubscriptionId`, so `evaluateSubscriptionAccess` needs another way to
-- tell a paid row apart from an orphan/test-mode row — that is `purchaseType`
-- plus `accessEndsAt`.
--
-- The DEFAULT backfills every existing row as 'subscription', so this is safe
-- to apply to a populated table with no separate backfill step.
ALTER TABLE "Subscription" ADD COLUMN "purchaseType" TEXT NOT NULL DEFAULT 'subscription';

-- Hard expiry for one-time purchases. NULL for recurring subs, which keep using
-- currentPeriodEnd (that value moves forward on each successful invoice).
ALTER TABLE "Subscription" ADD COLUMN "accessEndsAt" TIMESTAMP(3);

-- Unique so a replayed checkout.session.completed / charge webhook cannot
-- extend access twice for the same payment.
ALTER TABLE "Subscription" ADD COLUMN "stripePaymentIntentId" TEXT;
CREATE UNIQUE INDEX "Subscription_stripePaymentIntentId_key" ON "Subscription"("stripePaymentIntentId");

-- Nightly expiry sweep and access checks both filter on these together.
CREATE INDEX "Subscription_purchaseType_accessEndsAt_idx" ON "Subscription"("purchaseType", "accessEndsAt");
