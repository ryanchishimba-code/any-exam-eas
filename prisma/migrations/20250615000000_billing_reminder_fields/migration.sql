-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN "trialReminderForEndsAt" TIMESTAMP(3);
ALTER TABLE "Subscription" ADD COLUMN "billingReminderForPeriodEnd" TIMESTAMP(3);
