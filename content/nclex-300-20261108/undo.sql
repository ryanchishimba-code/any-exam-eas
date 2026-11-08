-- Narrow undo for this batch only, hidden or later made live.
-- Does not touch any other nursing row.
DELETE FROM "QuestionBankItem"
WHERE "fieldId" = 'nursing'
  AND "generationVersion" = 'nclex-300-20261108-v1'
  AND source = 'generated';
