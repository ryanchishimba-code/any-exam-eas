-- Additive "Did you pass?" check-in.
-- Not applied to production by the landing redesign PR.
-- Do not compute or display a pass rate from these rows.
-- result: passed | not_yet | not_taken | dismissed
-- quote is stored only when shareQuoteConsent is true.

CREATE TABLE IF NOT EXISTS "ExamPassCheckIn" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "examSlug" TEXT,
    "result" TEXT NOT NULL,
    "quote" TEXT,
    "shareQuoteConsent" BOOLEAN NOT NULL DEFAULT false,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExamPassCheckIn_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "ExamPassCheckIn_userId_recordedAt_idx"
    ON "ExamPassCheckIn"("userId", "recordedAt");

DO $$ BEGIN
    ALTER TABLE "ExamPassCheckIn"
        ADD CONSTRAINT "ExamPassCheckIn_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "User"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;
