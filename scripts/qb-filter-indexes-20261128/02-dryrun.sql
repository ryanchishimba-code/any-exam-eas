-- Dry run. Explain only. Do not create indexes on production from this file.
-- Apply is prisma/migrations/20261128140000_question_bank_filter_indexes/migration.sql
-- after this plan shows an index scan on a non-production branch.

EXPLAIN
SELECT id
FROM "QuestionBankItem"
WHERE "fieldId" = 'nursing'
  AND active = true
  AND "qaPassed" = true
  AND difficulty = 4
ORDER BY id
LIMIT 20;

EXPLAIN
SELECT "itemType", "fieldId", COALESCE(options::jsonb->>'caseGroupId', '')
FROM "QuestionBankItem"
WHERE active = true
  AND "itemType" IN ('case_study', 'unfolding_case', 'case_based')
  AND left(btrim(options), 1) = '{'
  AND COALESCE(options::jsonb->>'caseGroupId', '') <> '';
