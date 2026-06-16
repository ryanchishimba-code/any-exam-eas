-- PANCE question bank enrichment (QuestionBankItem rows with fieldId = 'pance').
-- Supports blueprint task tagging, generation provenance, and editorial review workflow.

ALTER TABLE "QuestionBankItem" ADD COLUMN IF NOT EXISTS "taskCategory" TEXT;
ALTER TABLE "QuestionBankItem" ADD COLUMN IF NOT EXISTS "blueprintTopic" TEXT;
ALTER TABLE "QuestionBankItem" ADD COLUMN IF NOT EXISTS "generationVersion" TEXT;
ALTER TABLE "QuestionBankItem" ADD COLUMN IF NOT EXISTS "reviewStatus" TEXT;
ALTER TABLE "QuestionBankItem" ADD COLUMN IF NOT EXISTS "lastReviewedAt" TIMESTAMP(3);
ALTER TABLE "QuestionBankItem" ADD COLUMN IF NOT EXISTS "generationMeta" JSONB;

CREATE INDEX IF NOT EXISTS "QuestionBankItem_fieldId_taskCategory_active_idx"
  ON "QuestionBankItem"("fieldId", "taskCategory", "active");

CREATE INDEX IF NOT EXISTS "QuestionBankItem_fieldId_reviewStatus_active_idx"
  ON "QuestionBankItem"("fieldId", "reviewStatus", "active");

CREATE INDEX IF NOT EXISTS "QuestionBankItem_fieldId_blueprintTopic_active_idx"
  ON "QuestionBankItem"("fieldId", "blueprintTopic", "active");
