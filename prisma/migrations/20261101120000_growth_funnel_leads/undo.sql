-- Undo for 20261101120000_growth_funnel_leads.
-- Drops only what that migration adds: four nullable User columns and two tables.
-- Tested on Neon preview br-shy-dew-aps0t5gz (vercel-preview-20261031), then reapplied.
-- Do not run on production br-super-frog-apuqj2ol. Take a backup branch first.
-- Do not run scripts/06-rollback-DO-NOT-RUN.sql.
--
-- Prisma still treats the migration as applied until its _prisma_migrations row
-- is removed. Delete that row only when you intend to reapply with
-- `npx prisma migrate deploy`.

DROP TABLE IF EXISTS "TrialEmailSendLog";
DROP TABLE IF EXISTS "DailyQuestionLead";

ALTER TABLE "User" DROP COLUMN IF EXISTS "utmSource";
ALTER TABLE "User" DROP COLUMN IF EXISTS "utmMedium";
ALTER TABLE "User" DROP COLUMN IF EXISTS "utmCampaign";
ALTER TABLE "User" DROP COLUMN IF EXISTS "signupReferrer";
