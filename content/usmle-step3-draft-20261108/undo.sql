-- Scoped undo for the live Step 3 pack.
-- Deletes only generationVersion usmle-step3-300-20261108-v1 on usmle-step-3.
-- Does not touch any other USMLE row.
-- Pre-write snapshot: usmle-step3-300-20261108-before (snap-green-band-apf2zoef)
--   on br-super-frog-apuqj2ol.
-- Do not run unless Ryan asks to take the batch out.
DELETE FROM "QuestionBankItem"
WHERE "fieldId" = 'usmle-step-3'
  AND "generationVersion" = 'usmle-step3-300-20261108-v1'
  AND source = 'generated';
