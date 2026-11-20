-- Scoped undo for the 2026-11-08 USMLE clone/duplicate hide.
-- Sets active and qaPassed back to the values recorded before the hide.
-- Does not delete rows. Does not touch any id outside usmle_clone_hide_20261108.
-- Snapshot: usmle-clone-hide-20261108-before (snap-lingering-hat-appph59h)
--   on branch br-super-frog-apuqj2ol, project lively-silence-56893462.
-- Backup table (id, prior_active, prior_qa_passed) lives on that branch:
--   public.usmle_clone_hide_20261108
-- Do not run unless Ryan asks to put these items back.

UPDATE "QuestionBankItem" AS q
SET active = b.prior_active,
    "qaPassed" = b.prior_qa_passed,
    "updatedAt" = NOW()
FROM usmle_clone_hide_20261108 AS b
WHERE q.id = b.id;
