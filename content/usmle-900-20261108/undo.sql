-- Scoped undo for the live Step 1 pack.
-- Deletes only generationVersion usmle-step1-300-20261108-v1 on usmle-step-1,
-- whether those rows are still hidden or already active.
-- Does not touch any other USMLE row.
-- Pre-write snapshot: usmle-step1-300-20261108-before (snap-dawn-mud-ap7gothj)
--   on br-super-frog-apuqj2ol.
-- Do not run unless Ryan asks to take the batch out.
DELETE FROM "QuestionBankItem"
WHERE "fieldId" = 'usmle-step-1'
  AND "generationVersion" = 'usmle-step1-300-20261108-v1'
  AND source = 'generated';
