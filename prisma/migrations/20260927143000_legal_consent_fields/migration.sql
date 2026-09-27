-- Additive legal-compliance columns.
-- Do not apply this migration to production without the owner's OK.
-- quoteConsentVersion: text version of the pass check-in quote permission.
-- annualRenewalReminderForPeriodEnd: dedupes the ~30-day annual renewal email.

ALTER TABLE "ExamPassCheckIn" ADD COLUMN IF NOT EXISTS "quoteConsentVersion" TEXT;

ALTER TABLE "Subscription" ADD COLUMN IF NOT EXISTS "annualRenewalReminderForPeriodEnd" TIMESTAMP(3);
