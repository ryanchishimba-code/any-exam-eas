-- CreateTable
CREATE TABLE "npte_pt_full_practice_exams" (
    "id" TEXT NOT NULL,
    "examNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "questionCount" INTEGER NOT NULL,
    "blueprintSummary" JSONB,
    "taskSummary" JSONB,
    "batchId" TEXT,
    "generationVersion" TEXT,
    "qaPassed" BOOLEAN NOT NULL DEFAULT false,
    "qaReport" JSONB,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "npte_pt_full_practice_exams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "npte_pt_full_practice_exam_questions" (
    "id" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "questionBankItemId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "contentCategory" TEXT,
    "taskCategory" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "npte_pt_full_practice_exam_questions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "npte_pt_full_practice_exams_examNumber_key" ON "npte_pt_full_practice_exams"("examNumber");

-- CreateIndex
CREATE INDEX "npte_pt_full_practice_exams_active_examNumber_idx" ON "npte_pt_full_practice_exams"("active", "examNumber");

-- CreateIndex
CREATE UNIQUE INDEX "npte_pt_full_practice_exam_questions_examId_sortOrder_key" ON "npte_pt_full_practice_exam_questions"("examId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "npte_pt_full_practice_exam_questions_examId_questionBankItemId_key" ON "npte_pt_full_practice_exam_questions"("examId", "questionBankItemId");

-- CreateIndex
CREATE INDEX "npte_pt_full_practice_exam_questions_examId_idx" ON "npte_pt_full_practice_exam_questions"("examId");

-- CreateIndex
CREATE INDEX "npte_pt_full_practice_exam_questions_questionBankItemId_idx" ON "npte_pt_full_practice_exam_questions"("questionBankItemId");

-- AddForeignKey
ALTER TABLE "npte_pt_full_practice_exam_questions" ADD CONSTRAINT "npte_pt_full_practice_exam_questions_examId_fkey" FOREIGN KEY ("examId") REFERENCES "npte_pt_full_practice_exams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "npte_pt_full_practice_exam_questions" ADD CONSTRAINT "npte_pt_full_practice_exam_questions_questionBankItemId_fkey" FOREIGN KEY ("questionBankItemId") REFERENCES "QuestionBankItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
