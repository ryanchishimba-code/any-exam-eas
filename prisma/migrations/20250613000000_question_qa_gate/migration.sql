-- QA gate: only items with qaPassed=true are served to students after bank audit.
ALTER TABLE "QuestionBankItem" ADD COLUMN IF NOT EXISTS "qaPassed" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "QuestionBankItem" ADD COLUMN IF NOT EXISTS "qaAuditedAt" TIMESTAMP(3);

CREATE INDEX IF NOT EXISTS "QuestionBankItem_fieldId_subjectId_active_qaPassed_idx"
  ON "QuestionBankItem" ("fieldId", "subjectId", "active", "qaPassed");

CREATE INDEX IF NOT EXISTS "QuestionBankItem_fieldId_active_qaPassed_idx"
  ON "QuestionBankItem" ("fieldId", "active", "qaPassed");
