-- MPJE state-specific practice: nullable 2-char state code on question bank items.

ALTER TABLE "QuestionBankItem" ADD COLUMN IF NOT EXISTS "stateCode" CHAR(2);

CREATE INDEX IF NOT EXISTS "QuestionBankItem_fieldId_stateCode_active_idx"
  ON "QuestionBankItem"("fieldId", "stateCode", "active");
