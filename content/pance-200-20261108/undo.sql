-- Narrow undo for this batch only, hidden or live.
-- Deletes only generationVersion pance-200-20261108-v1 generated PANCE rows.
-- Does not touch any other PANCE row.
-- Pre-write snapshot: pance-200-20261108-before (snap-lucky-boat-apilmuj8) on br-super-frog-apuqj2ol.
-- Do not run unless Ryan asks to take the batch back down.
DELETE FROM "QuestionBankItem"
WHERE "fieldId" = 'pance'
  AND "generationVersion" = 'pance-200-20261108-v1'
  AND source = 'generated';
