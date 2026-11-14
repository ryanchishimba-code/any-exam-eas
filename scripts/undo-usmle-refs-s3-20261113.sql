-- Undo the 2026-11-13 USMLE Step 3 citation pass.
-- Restores references on the 521 rows in qbi_usmle_refs_s3_20261113_backup.
-- Command: psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/undo-usmle-refs-s3-20261113.sql
BEGIN;
DO $check$
BEGIN
  IF to_regclass('public.qbi_usmle_refs_s3_20261113_backup') IS NULL THEN
    RAISE EXCEPTION 'backup table qbi_usmle_refs_s3_20261113_backup is missing';
  END IF;
  IF (SELECT COUNT(*) FROM qbi_usmle_refs_s3_20261113_backup) <> 521 THEN
    RAISE EXCEPTION 'backup row count %, expected 521', (SELECT COUNT(*) FROM qbi_usmle_refs_s3_20261113_backup);
  END IF;
END
$check$;
DO $restore$
DECLARE n integer;
BEGIN
  UPDATE "QuestionBankItem" AS q
  SET "references" = b."references"
  FROM qbi_usmle_refs_s3_20261113_backup AS b
  WHERE q.id = b.id
    AND q."fieldId" = 'usmle-step-3';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 521 THEN
    RAISE EXCEPTION 'undo updated % rows, expected 521', n;
  END IF;
END
$restore$;
COMMIT;
