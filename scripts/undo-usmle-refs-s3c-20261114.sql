-- Undo the third 2026-11-14 USMLE Step 3 citation batch.
-- Restores references on the 40 rows in qbi_usmle_refs_s3c_20261114_backup.
-- Command: psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/undo-usmle-refs-s3c-20261114.sql
BEGIN;
DO $check$
BEGIN
  IF to_regclass('public.qbi_usmle_refs_s3c_20261114_backup') IS NULL THEN
    RAISE EXCEPTION 'backup table qbi_usmle_refs_s3c_20261114_backup is missing';
  END IF;
  IF (SELECT COUNT(*) FROM qbi_usmle_refs_s3c_20261114_backup) <> 40 THEN
    RAISE EXCEPTION 'backup row count %, expected 40', (SELECT COUNT(*) FROM qbi_usmle_refs_s3c_20261114_backup);
  END IF;
END
$check$;
DO $restore$
DECLARE n integer;
BEGIN
  UPDATE "QuestionBankItem" AS q
  SET "references" = b."references"
  FROM qbi_usmle_refs_s3c_20261114_backup AS b
  WHERE q.id = b.id AND q."fieldId" = 'usmle-step-3';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 40 THEN
    RAISE EXCEPTION 'undo updated % rows, expected 40', n;
  END IF;
END
$restore$;
COMMIT;
