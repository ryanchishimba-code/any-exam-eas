-- Scoped undo for the hidden or later-live Step 1 pack.
-- Deletes only generationVersion usmle-step1-300-20261108-v1 on usmle-step-1.
-- Does not touch any other USMLE row.
-- Do not run unless Ryan asks to take the batch out.
DELETE FROM "QuestionBankItem"
WHERE "fieldId" = 'usmle-step-1'
  AND "generationVersion" = 'usmle-step1-300-20261108-v1'
  AND source = 'generated';
