-- Restores the 3,177 duplicate hides applied on 2026-11-08.
-- Source rows: qbi_usmle_step2_duphide_20261108 (full originals).
-- Sets active back to the backed-up value. Does not delete. Does not rewrite question text.
-- Neon snapshot before the hide: snap-withered-smoke-apxcbq4i (usmle-step2-duphide-20261108-before).
UPDATE "QuestionBankItem" AS q
SET
  active = b.active,
  "updatedAt" = b."updatedAt"
FROM qbi_usmle_step2_duphide_20261108 AS b
WHERE q.id = b.id;
