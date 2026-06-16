-- USMLE full-length block-style practice exams (2026 blueprint)

CREATE TABLE "usmle_full_practice_exams" (
    "id" TEXT NOT NULL,
    "examNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "stepLevel" TEXT NOT NULL,
    "questionCount" INTEGER NOT NULL,
    "blueprintSummary" JSONB,
    "formatSummary" JSONB,
    "taskSummary" JSONB,
    "batchId" TEXT,
    "generationVersion" TEXT,
    "qaPassed" BOOLEAN NOT NULL DEFAULT false,
    "qaReport" JSONB,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usmle_full_practice_exams_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "usmle_full_practice_exam_questions" (
    "id" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "questionBankItemId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "blueprintSystem" TEXT,
    "physicianTask" TEXT,
    "itemFormat" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usmle_full_practice_exam_questions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "usmle_full_practice_exams_examNumber_key" ON "usmle_full_practice_exams"("examNumber");
CREATE INDEX "usmle_full_practice_exams_active_examNumber_idx" ON "usmle_full_practice_exams"("active", "examNumber");
CREATE INDEX "usmle_full_practice_exams_stepLevel_active_idx" ON "usmle_full_practice_exams"("stepLevel", "active");

CREATE UNIQUE INDEX "usmle_full_practice_exam_questions_examId_sortOrder_key" ON "usmle_full_practice_exam_questions"("examId", "sortOrder");
CREATE UNIQUE INDEX "usmle_full_practice_exam_questions_examId_questionBankItemId_key" ON "usmle_full_practice_exam_questions"("examId", "questionBankItemId");
CREATE INDEX "usmle_full_practice_exam_questions_examId_idx" ON "usmle_full_practice_exam_questions"("examId");
CREATE INDEX "usmle_full_practice_exam_questions_questionBankItemId_idx" ON "usmle_full_practice_exam_questions"("questionBankItemId");

ALTER TABLE "usmle_full_practice_exam_questions" ADD CONSTRAINT "usmle_full_practice_exam_questions_examId_fkey" FOREIGN KEY ("examId") REFERENCES "usmle_full_practice_exams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "usmle_full_practice_exam_questions" ADD CONSTRAINT "usmle_full_practice_exam_questions_questionBankItemId_fkey" FOREIGN KEY ("questionBankItemId") REFERENCES "QuestionBankItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
