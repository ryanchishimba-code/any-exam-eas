-- Narrow undo for this batch only. Does not touch any other PANCE row.
-- Safe to review. Do not run until Ryan approves a write.
DELETE FROM "QuestionBankItem"
WHERE "fieldId" = 'pance'
  AND "generationVersion" = 'pance-200-20261108-v1'
  AND active = false
  AND "qaPassed" = false
  AND source = 'generated';
