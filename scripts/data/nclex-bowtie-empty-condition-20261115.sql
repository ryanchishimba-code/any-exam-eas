-- NCLEX bow-tie items whose condition column is empty.
-- DRY RUN ONLY. Do not apply without Ryan's OK.
-- Root cause in the player: a listed conditionOptions array with no choices
-- still counted as "Selection complete" after the action and monitor picks.
-- The player now refuses that state. This script is the optional bank hide.

-- 1. Preview
SELECT id, "itemType", active, "qaPassed",
       LEFT(question, 180) AS question
FROM "QuestionBankItem"
WHERE "fieldId" = 'nursing'
  AND active = true
  AND "qaPassed" = true
  AND lower("itemType") IN ('ngn_bowtie', 'bow_tie', 'bowtie')
  AND (
    question ILIKE '%breastfeed%'
    OR COALESCE(scenario, '') ILIKE '%breastfeed%'
    OR options::text ILIKE '%breastfeed%'
  )
  AND (
    options::text ~ '"conditionOptions"[[:space:]]*:[[:space:]]*\[[[:space:]]*\]'
    OR options::text ~ '"conditions"[[:space:]]*:[[:space:]]*\[[[:space:]]*\]'
  );

-- 2. Backup (run only when the preview rows are the ones to hide)
-- CREATE TABLE backup_nclex_bowtie_empty_condition_20261115 AS
-- SELECT id, active, "qaPassed", "updatedAt"
-- FROM "QuestionBankItem"
-- WHERE id IN (
--   SELECT id FROM "QuestionBankItem"
--   WHERE "fieldId" = 'nursing'
--     AND active = true
--     AND "qaPassed" = true
--     AND lower("itemType") IN ('ngn_bowtie', 'bow_tie', 'bowtie')
--     AND (
--       question ILIKE '%breastfeed%'
--       OR COALESCE(scenario, '') ILIKE '%breastfeed%'
--       OR options::text ILIKE '%breastfeed%'
--     )
--     AND (
--       options::text ~ '"conditionOptions"[[:space:]]*:[[:space:]]*\[[[:space:]]*\]'
--       OR options::text ~ '"conditions"[[:space:]]*:[[:space:]]*\[[[:space:]]*\]'
--     )
-- );

-- 3. Hide (NOT APPLIED)
-- UPDATE "QuestionBankItem" q
-- SET active = false,
--     "qaPassed" = false,
--     "updatedAt" = NOW()
-- FROM backup_nclex_bowtie_empty_condition_20261115 b
-- WHERE q.id = b.id;

-- 4. Undo
-- UPDATE "QuestionBankItem" q
-- SET active = b.active,
--     "qaPassed" = b."qaPassed",
--     "updatedAt" = b."updatedAt"
-- FROM backup_nclex_bowtie_empty_condition_20261115 b
-- WHERE q.id = b.id;
