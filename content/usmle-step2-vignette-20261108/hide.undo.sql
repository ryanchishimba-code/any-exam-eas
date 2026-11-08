-- Restores the 53 Step 2 CK clones to the active flag saved before they were hidden.
-- Does not delete rows and does not drop the backup table.
-- Backup table: qbi_usmle_step2_clone_hide_20261108 (53 rows, active was true).
-- Do not run unless Ryan asks to undo the hide.
UPDATE "QuestionBankItem" AS item
SET active = backup.active,
    "updatedAt" = NOW()
FROM qbi_usmle_step2_clone_hide_20261108 AS backup
WHERE item."id" = backup."id"
  AND item."fieldId" = 'usmle-step-2';
