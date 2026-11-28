-- Serve-filter indexes for question bank and full-exam reads.
-- Partial indexes stay small: only active, qaPassed rows are served.
-- The case-group index matches the grouped eligibility lookup
-- (field, item type, caseGroupId) so that pass is an index scan.
--
-- Not applied to production in this change. Dry-run on a Neon branch first.
-- Undo: prisma/migrations/20261128140000_question_bank_filter_indexes/down.sql

CREATE INDEX IF NOT EXISTS "QuestionBankItem_serve_difficulty_id_idx"
  ON "QuestionBankItem" ("fieldId", difficulty, id)
  WHERE active = true AND "qaPassed" = true;

CREATE INDEX IF NOT EXISTS "QuestionBankItem_serve_subject_difficulty_id_idx"
  ON "QuestionBankItem" ("fieldId", "subjectId", difficulty, id)
  WHERE active = true AND "qaPassed" = true;

CREATE INDEX IF NOT EXISTS "QuestionBankItem_serve_topic_id_idx"
  ON "QuestionBankItem" ("fieldId", "topicCategory", id)
  WHERE active = true AND "qaPassed" = true;

CREATE INDEX IF NOT EXISTS "QuestionBankItem_case_group_key_idx"
  ON "QuestionBankItem" (
    "itemType",
    "fieldId",
    (COALESCE(options::jsonb->>'caseGroupId', ''))
  )
  WHERE active = true
    AND "itemType" IN ('case_study', 'unfolding_case', 'case_based')
    AND left(btrim(options), 1) = '{';
