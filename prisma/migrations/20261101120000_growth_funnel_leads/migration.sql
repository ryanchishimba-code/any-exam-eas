-- Growth attribution, daily-question leads, and the trial email send log.
-- Prepared for production. Do not apply this file to the production branch.
-- The dev/preview branch is br-shy-dew-aps0t5gz (vercel-preview-20261031).

ALTER TABLE "User" ADD COLUMN "utmSource" TEXT;
ALTER TABLE "User" ADD COLUMN "utmMedium" TEXT;
ALTER TABLE "User" ADD COLUMN "utmCampaign" TEXT;
ALTER TABLE "User" ADD COLUMN "signupReferrer" TEXT;

CREATE TABLE "DailyQuestionLead" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "examSlug" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "confirmTokenHash" TEXT NOT NULL,
    "unsubscribeTokenHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "confirmedAt" TIMESTAMP(3),
    "unsubscribedAt" TIMESTAMP(3),

    CONSTRAINT "DailyQuestionLead_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "DailyQuestionLead_email_key" ON "DailyQuestionLead"("email");
CREATE UNIQUE INDEX "DailyQuestionLead_confirmTokenHash_key" ON "DailyQuestionLead"("confirmTokenHash");
CREATE UNIQUE INDEX "DailyQuestionLead_unsubscribeTokenHash_key" ON "DailyQuestionLead"("unsubscribeTokenHash");
CREATE INDEX "DailyQuestionLead_status_idx" ON "DailyQuestionLead"("status");

CREATE TABLE "TrialEmailSendLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "trialEndsAt" TIMESTAMP(3) NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrialEmailSendLog_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "TrialEmailSendLog_userId_kind_trialEndsAt_key" ON "TrialEmailSendLog"("userId", "kind", "trialEndsAt");
CREATE INDEX "TrialEmailSendLog_kind_sentAt_idx" ON "TrialEmailSendLog"("kind", "sentAt");

ALTER TABLE "TrialEmailSendLog" ADD CONSTRAINT "TrialEmailSendLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
