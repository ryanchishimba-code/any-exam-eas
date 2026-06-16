-- NCLEX-RN full-length practice exam infrastructure (2026 blueprint).

CREATE TABLE IF NOT EXISTS "nclex_full_practice_exams" (
  "id"                TEXT NOT NULL,
  "examNumber"        INTEGER NOT NULL,
  "title"             TEXT NOT NULL,
  "questionCount"     INTEGER NOT NULL,
  "blueprintSummary"  JSONB,
  "caseStudySummary"  JSONB,
  "batchId"           TEXT,
  "generationVersion" TEXT,
  "qaPassed"          BOOLEAN NOT NULL DEFAULT false,
  "qaReport"          JSONB,
  "active"            BOOLEAN NOT NULL DEFAULT true,
  "createdAt"         TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"         TIMESTAMP(3) NOT NULL,
  CONSTRAINT "nclex_full_practice_exams_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "nclex_full_practice_exams_examNumber_key"
  ON "nclex_full_practice_exams"("examNumber");

CREATE INDEX IF NOT EXISTS "nclex_full_practice_exams_active_examNumber_idx"
  ON "nclex_full_practice_exams"("active", "examNumber");

CREATE TABLE IF NOT EXISTS "nclex_full_practice_exam_questions" (
  "id"                  TEXT NOT NULL,
  "examId"              TEXT NOT NULL,
  "questionBankItemId"  TEXT NOT NULL,
  "sortOrder"           INTEGER NOT NULL,
  "clientNeedsCategory" TEXT,
  "itemFormat"          TEXT,
  "createdAt"           TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "nclex_full_practice_exam_questions_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "nclex_full_practice_exam_questions_examId_fkey"
    FOREIGN KEY ("examId") REFERENCES "nclex_full_practice_exams"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "nclex_full_practice_exam_questions_questionBankItemId_fkey"
    FOREIGN KEY ("questionBankItemId") REFERENCES "QuestionBankItem"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "nclex_full_practice_exam_questions_examId_sortOrder_key"
  ON "nclex_full_practice_exam_questions"("examId", "sortOrder");

CREATE UNIQUE INDEX IF NOT EXISTS "nclex_full_practice_exam_questions_examId_questionBankItemId_key"
  ON "nclex_full_practice_exam_questions"("examId", "questionBankItemId");

CREATE INDEX IF NOT EXISTS "nclex_full_practice_exam_questions_examId_idx"
  ON "nclex_full_practice_exam_questions"("examId");

CREATE INDEX IF NOT EXISTS "nclex_full_practice_exam_questions_questionBankItemId_idx"
  ON "nclex_full_practice_exam_questions"("questionBankItemId");
