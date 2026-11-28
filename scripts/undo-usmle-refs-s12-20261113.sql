-- Undo the 2026-11-13 USMLE Step 1 and Step 2 citation pass.
-- Restores references on the 248 rows in qbi_usmle_refs_s12_20261113_backup.
-- Command: psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/undo-usmle-refs-s12-20261113.sql
BEGIN;
DO $check$
BEGIN
  IF to_regclass('public.qbi_usmle_refs_s12_20261113_backup') IS NULL THEN
    RAISE EXCEPTION 'backup table qbi_usmle_refs_s12_20261113_backup is missing';
  END IF;
  IF (SELECT COUNT(*) FROM qbi_usmle_refs_s12_20261113_backup) <> 248 THEN
    RAISE EXCEPTION 'backup row count %, expected 248', (SELECT COUNT(*) FROM qbi_usmle_refs_s12_20261113_backup);
  END IF;
END
$check$;
DO $restore$
DECLARE n integer;
BEGIN
  UPDATE "QuestionBankItem" AS q
  SET "references" = b."references"
  FROM qbi_usmle_refs_s12_20261113_backup AS b
  WHERE q.id = b.id
    AND q."fieldId" IN ('usmle-step-1', 'usmle-step-2');
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 248 THEN
    RAISE EXCEPTION 'undo updated % rows, expected 248', n;
  END IF;
END
$restore$;
COMMIT;
