-- Per-question SRS for adaptive engine
CREATE TABLE "QuestionMastery" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "questionKey" TEXT NOT NULL,
    "fieldId" TEXT NOT NULL,
    "easeFactor" DOUBLE PRECISION NOT NULL DEFAULT 2.5,
    "intervalDays" INTEGER NOT NULL DEFAULT 0,
    "repetitions" INTEGER NOT NULL DEFAULT 0,
    "nextDue" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "abilityEstimate" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "lastAttemptAt" TIMESTAMP(3),
    "correctStreak" INTEGER NOT NULL DEFAULT 0,
    "yieldScore" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuestionMastery_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "QuestionMastery_userId_questionKey_key" ON "QuestionMastery"("userId", "questionKey");
CREATE INDEX "QuestionMastery_userId_fieldId_nextDue_idx" ON "QuestionMastery"("userId", "fieldId", "nextDue");
CREATE INDEX "QuestionMastery_userId_nextDue_idx" ON "QuestionMastery"("userId", "nextDue");

ALTER TABLE "QuestionMastery" ADD CONSTRAINT "QuestionMastery_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
