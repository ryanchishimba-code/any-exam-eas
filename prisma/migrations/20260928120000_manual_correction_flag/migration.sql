-- Durable lock so the nightly question-bank sync cannot overwrite a hand-corrected key.
-- manual_correction defaults to false. Key-fix scripts set it true.
-- QuestionBankSync records which ids a run updated or refused to overwrite.
-- Deploy this migration with the sync change. The new sync selects manual_correction.

ALTER TABLE "QuestionBankItem"
  ADD COLUMN IF NOT EXISTS "manual_correction" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "QuestionBankSync"
  ADD COLUMN IF NOT EXISTS "updatedItemIds" JSONB;

ALTER TABLE "QuestionBankSync"
  ADD COLUMN IF NOT EXISTS "protectedItemIds" JSONB;
