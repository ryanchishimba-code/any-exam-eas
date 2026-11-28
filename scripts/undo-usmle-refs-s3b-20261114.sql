-- Undo the 2026-11-14 USMLE Step 3 citation batch.
-- Restores references on the 248 rows in qbi_usmle_refs_s3b_20261114_backup.
-- Command: psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/undo-usmle-refs-s3b-20261114.sql
BEGIN;
DO $check$
BEGIN
  IF to_regclass('public.qbi_usmle_refs_s3b_20261114_backup') IS NULL THEN
    RAISE EXCEPTION 'backup table qbi_usmle_refs_s3b_20261114_backup is missing';
  END IF;
  IF (SELECT COUNT(*) FROM qbi_usmle_refs_s3b_20261114_backup) <> 248 THEN
    RAISE EXCEPTION 'backup row count %, expected 248', (SELECT COUNT(*) FROM qbi_usmle_refs_s3b_20261114_backup);
  END IF;
END
$check$;
DO $restore$
DECLARE n integer;
BEGIN
  UPDATE "QuestionBankItem" AS q
  SET "references" = b."references"
  FROM qbi_usmle_refs_s3b_20261114_backup AS b
  WHERE q.id = b.id
    AND q."fieldId" = 'usmle-step-3';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 248 THEN
    RAISE EXCEPTION 'undo updated % rows, expected 248', n;
  END IF;
END
$restore$;
COMMIT;
