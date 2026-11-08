-- Scoped undo for the live Step 2 CK pack.
-- Deletes only generationVersion usmle-step2-300-20261108-v1 on usmle-step-2.
-- Does not touch any other USMLE row.
-- Pre-write snapshot: usmle-step2-300-20261108-before (snap-dark-lab-apxbse8p)
--   on br-super-frog-apuqj2ol.
-- Do not run unless Ryan asks to take the batch out.
DELETE FROM "QuestionBankItem"
WHERE "fieldId" = 'usmle-step-2'
  AND "generationVersion" = 'usmle-step2-300-20261108-v1'
  AND source = 'generated';
