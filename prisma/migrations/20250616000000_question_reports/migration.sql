-- CreateTable
CREATE TABLE "QuestionReport" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "bankItemId" TEXT,
    "questionKey" TEXT NOT NULL,
    "fieldId" TEXT NOT NULL,
    "examSlug" TEXT,
    "subjectId" TEXT,
    "sessionId" TEXT,
    "sessionMode" TEXT,
    "reason" TEXT NOT NULL,
    "message" TEXT,
    "selectedAnswer" TEXT,
    "status" TEXT NOT NULL DEFAULT 'open',
    "stemPreview" TEXT,
    "optionsSnapshot" TEXT,
    "correctAnswerSnapshot" TEXT,
    "analysisStatus" TEXT NOT NULL DEFAULT 'pending',
    "issueSummary" TEXT,
    "issueCodes" TEXT,
    "systemIssues" TEXT,
    "proposedFix" TEXT,
    "generationNotes" TEXT,
    "appliedAt" TIMESTAMP(3),
    "appliedById" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "resolvedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuestionReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "QuestionReport_status_createdAt_idx" ON "QuestionReport"("status", "createdAt");

-- CreateIndex
CREATE INDEX "QuestionReport_fieldId_createdAt_idx" ON "QuestionReport"("fieldId", "createdAt");

-- CreateIndex
CREATE INDEX "QuestionReport_examSlug_createdAt_idx" ON "QuestionReport"("examSlug", "createdAt");

-- CreateIndex
CREATE INDEX "QuestionReport_bankItemId_idx" ON "QuestionReport"("bankItemId");

-- CreateIndex
CREATE INDEX "QuestionReport_analysisStatus_createdAt_idx" ON "QuestionReport"("analysisStatus", "createdAt");

-- AddForeignKey
ALTER TABLE "QuestionReport" ADD CONSTRAINT "QuestionReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionReport" ADD CONSTRAINT "QuestionReport_appliedById_fkey" FOREIGN KEY ("appliedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionReport" ADD CONSTRAINT "QuestionReport_resolvedById_fkey" FOREIGN KEY ("resolvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
