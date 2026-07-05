-- CreateTable
CREATE TABLE "UserLegalConsent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "termsVersion" TEXT NOT NULL,
    "privacyVersion" TEXT NOT NULL,
    "acceptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "signupMethod" TEXT NOT NULL DEFAULT 'credentials',
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "metadata" TEXT,

    CONSTRAINT "UserLegalConsent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserLegalConsent_userId_key" ON "UserLegalConsent"("userId");

-- CreateIndex
CREATE INDEX "UserLegalConsent_acceptedAt_idx" ON "UserLegalConsent"("acceptedAt");

-- AddForeignKey
ALTER TABLE "UserLegalConsent" ADD CONSTRAINT "UserLegalConsent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
