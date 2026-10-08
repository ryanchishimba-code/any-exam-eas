-- Same lock the nightly question-bank sync honors on QuestionBankItem.
-- Defaults to false. scripts/ngn/publish-batch1.ts sets it true on every
-- batch-1 case and item so a later importer does not overwrite clinical columns.
-- This migration does not write question rows and does not touch QuestionBankItem.

ALTER TABLE "ngn_case"
  ADD COLUMN IF NOT EXISTS "manual_correction" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "ngn_item"
  ADD COLUMN IF NOT EXISTS "manual_correction" BOOLEAN NOT NULL DEFAULT false;
