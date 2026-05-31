-- Top 300 Drugs review: quarterly cycles + spaced-repetition progress

CREATE TABLE "DrugReviewCycle" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cycleKey" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "drugsTotal" INTEGER NOT NULL DEFAULT 300,
    "cardsReviewed" INTEGER NOT NULL DEFAULT 0,
    "cardsMastered" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DrugReviewCycle_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DrugCardProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cycleKey" TEXT NOT NULL,
    "drugId" TEXT NOT NULL,
    "generic" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "indication" TEXT NOT NULL,
    "repetitions" INTEGER NOT NULL DEFAULT 0,
    "easeFactor" DOUBLE PRECISION NOT NULL DEFAULT 2.5,
    "intervalDays" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "nextReviewAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastReviewAt" TIMESTAMP(3),
    "lastGrade" INTEGER,
    "lapseCount" INTEGER NOT NULL DEFAULT 0,
    "mastered" BOOLEAN NOT NULL DEFAULT false,
    "mnemonic" TEXT,
    "mnemonicAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DrugCardProgress_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "DrugReviewCycle_userId_cycleKey_key" ON "DrugReviewCycle"("userId", "cycleKey");
CREATE INDEX "DrugReviewCycle_userId_endsAt_idx" ON "DrugReviewCycle"("userId", "endsAt");

CREATE UNIQUE INDEX "DrugCardProgress_userId_cycleKey_drugId_key" ON "DrugCardProgress"("userId", "cycleKey", "drugId");
CREATE INDEX "DrugCardProgress_userId_cycleKey_nextReviewAt_idx" ON "DrugCardProgress"("userId", "cycleKey", "nextReviewAt");
CREATE INDEX "DrugCardProgress_userId_cycleKey_mastered_idx" ON "DrugCardProgress"("userId", "cycleKey", "mastered");

ALTER TABLE "DrugReviewCycle" ADD CONSTRAINT "DrugReviewCycle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DrugCardProgress" ADD CONSTRAINT "DrugCardProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
