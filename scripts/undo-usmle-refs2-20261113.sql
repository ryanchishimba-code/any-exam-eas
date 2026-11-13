-- Undo the second 2026-11-13 USMLE citation pass.
-- Restores references on the 179 rows in qbi_usmle_refs2_20261113_backup.
-- Command: psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/undo-usmle-refs2-20261113.sql
BEGIN;
DO $check$
BEGIN
  IF to_regclass('public.qbi_usmle_refs2_20261113_backup') IS NULL THEN
    RAISE EXCEPTION 'backup table qbi_usmle_refs2_20261113_backup is missing';
  END IF;
  IF (SELECT COUNT(*) FROM qbi_usmle_refs2_20261113_backup) <> 179 THEN
    RAISE EXCEPTION 'backup row count %, expected 179', (SELECT COUNT(*) FROM qbi_usmle_refs2_20261113_backup);
  END IF;
END
$check$;
DO $restore$
DECLARE n integer;
BEGIN
  UPDATE "QuestionBankItem" AS q
  SET "references" = b."references"
  FROM qbi_usmle_refs2_20261113_backup AS b
  WHERE q.id = b.id;
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 179 THEN
    RAISE EXCEPTION 'undo updated % rows, expected 179', n;
  END IF;
END
$restore$;
COMMIT;
