-- AlterTable
ALTER TABLE "UserPreference" ADD COLUMN "marketingOptOutAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN "welcomeEmailEarliestAt" TIMESTAMP(3),
ADD COLUMN "lastPaymentReceiptInvoiceId" TEXT,
ADD COLUMN "cancellationEmailSentAt" TIMESTAMP(3);
