-- Narrow undo for this batch only, hidden or live.
-- Deletes only generationVersion nclex-300-20261108-v1 generated nursing rows.
-- Does not touch any other nursing row.
-- Pre-write snapshot: nclex-300-20261108-before (snap-bold-night-ap6p0j26) on br-super-frog-apuqj2ol.
-- Do not run unless Ryan asks to take the batch back down.
DELETE FROM "QuestionBankItem"
WHERE "fieldId" = 'nursing'
  AND "generationVersion" = 'nclex-300-20261108-v1'
  AND source = 'generated';
