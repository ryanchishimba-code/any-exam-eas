-- Restores batch 2 (Step 2 and Step 3, 79 rows) from qbi_usmle_optlen_20261121_b2_backup.
-- Command: psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/usmle-optlen-20261121/batch-02-step2-step3-undo.sql
BEGIN;
DO $check$
BEGIN
  IF to_regclass('public.qbi_usmle_optlen_20261121_b2_backup') IS NULL THEN
    RAISE EXCEPTION 'backup table qbi_usmle_optlen_20261121_b2_backup is missing';
  END IF;
  IF (SELECT COUNT(*) FROM qbi_usmle_optlen_20261121_b2_backup) <> 79 THEN
    RAISE EXCEPTION 'backup row count %, expected 79', (SELECT COUNT(*) FROM qbi_usmle_optlen_20261121_b2_backup);
  END IF;
END
$check$;
UPDATE "QuestionBankItem" AS q
SET
  options = b.options,
  "correctAnswer" = b."correctAnswer",
  explanation = b.explanation,
  manual_correction = b.manual_correction,
  "generationMeta" = b."generationMeta",
  "updatedAt" = b."updatedAt"
FROM qbi_usmle_optlen_20261121_b2_backup AS b
WHERE q.id = b.id;
DO $done$
BEGIN
  IF (
    SELECT COUNT(*)
    FROM "QuestionBankItem" AS q
    JOIN qbi_usmle_optlen_20261121_b2_backup AS b ON b.id = q.id
    WHERE q.options = b.options
      AND q."correctAnswer" = b."correctAnswer"
      AND q.explanation = b.explanation
  ) <> 79 THEN
    RAISE EXCEPTION 'undo did not restore every batch 2 row';
  END IF;
END
$done$;
DELETE FROM qbi_usmle_optlen_20261121_stage WHERE batch = 2;
COMMIT;
