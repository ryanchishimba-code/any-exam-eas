-- Readiness checks and optional real-exam outcomes.
-- Additive only: new tables and foreign keys. No changes to existing columns.

CREATE TABLE "ReadinessCheck" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "examSlug" TEXT NOT NULL,
    "fieldId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "isBaseline" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'in_progress',
    "itemCount" INTEGER NOT NULL,
    "correctCount" INTEGER,
    "answeredCount" INTEGER NOT NULL DEFAULT 0,
    "overallLevel" TEXT,
    "areasOnTrack" INTEGER,
    "areasScored" INTEGER,
    "areaCount" INTEGER,
    "summaryLine" TEXT,
    "areaSnapshot" JSONB,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReadinessCheck_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ReadinessCheckItem" (
    "id" TEXT NOT NULL,
    "checkId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "questionBankItemId" TEXT NOT NULL,
    "areaId" TEXT NOT NULL,
    "areaLabel" TEXT NOT NULL,
    "response" TEXT,
    "correct" BOOLEAN,
    "answeredAt" TIMESTAMP(3),

    CONSTRAINT "ReadinessCheckItem_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ExamOutcome" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "examSlug" TEXT NOT NULL,
    "fieldId" TEXT NOT NULL,
    "examDate" TEXT,
    "result" TEXT NOT NULL,
    "readinessCheckId" TEXT,
    "snapshot" JSONB,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExamOutcome_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ReadinessCheck_userId_examSlug_status_completedAt_idx" ON "ReadinessCheck"("userId", "examSlug", "status", "completedAt");
CREATE INDEX "ReadinessCheck_userId_fieldId_createdAt_idx" ON "ReadinessCheck"("userId", "fieldId", "createdAt");

CREATE UNIQUE INDEX "ReadinessCheckItem_checkId_sortOrder_key" ON "ReadinessCheckItem"("checkId", "sortOrder");
CREATE UNIQUE INDEX "ReadinessCheckItem_checkId_questionBankItemId_key" ON "ReadinessCheckItem"("checkId", "questionBankItemId");
CREATE INDEX "ReadinessCheckItem_questionBankItemId_idx" ON "ReadinessCheckItem"("questionBankItemId");

CREATE INDEX "ExamOutcome_examSlug_result_idx" ON "ExamOutcome"("examSlug", "result");
CREATE INDEX "ExamOutcome_userId_examSlug_recordedAt_idx" ON "ExamOutcome"("userId", "examSlug", "recordedAt");

ALTER TABLE "ReadinessCheck" ADD CONSTRAINT "ReadinessCheck_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ReadinessCheckItem" ADD CONSTRAINT "ReadinessCheckItem_checkId_fkey" FOREIGN KEY ("checkId") REFERENCES "ReadinessCheck"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ReadinessCheckItem" ADD CONSTRAINT "ReadinessCheckItem_questionBankItemId_fkey" FOREIGN KEY ("questionBankItemId") REFERENCES "QuestionBankItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ExamOutcome" ADD CONSTRAINT "ExamOutcome_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ExamOutcome" ADD CONSTRAINT "ExamOutcome_readinessCheckId_fkey" FOREIGN KEY ("readinessCheckId") REFERENCES "ReadinessCheck"("id") ON DELETE SET NULL ON UPDATE CASCADE;
