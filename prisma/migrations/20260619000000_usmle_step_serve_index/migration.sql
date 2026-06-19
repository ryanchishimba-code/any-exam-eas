-- Serve-filtered per-step counting/selection for USMLE step separation.
-- Speeds up grouped counts and sampling filtered by (fieldId, stepLevel, active, qaPassed).
CREATE INDEX IF NOT EXISTS "QuestionBankItem_fieldId_stepLevel_active_qaPassed_idx"
  ON "QuestionBankItem" ("fieldId", "stepLevel", "active", "qaPassed");
