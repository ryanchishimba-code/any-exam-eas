-- Undo the 2026-11-14 citation pass.
-- Restores references on 57 rows in qbi_usmle_refs4_20261114_backup.
-- Command: psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/undo-usmle-refs4-20261114.sql
BEGIN;
DO $check$
BEGIN
  IF to_regclass('public.qbi_usmle_refs4_20261114_backup') IS NULL THEN
    RAISE EXCEPTION 'backup table missing';
  END IF;
  IF (SELECT COUNT(*) FROM qbi_usmle_refs4_20261114_backup) <> 57 THEN
    RAISE EXCEPTION 'backup row count %, expected 57', (SELECT COUNT(*) FROM qbi_usmle_refs4_20261114_backup);
  END IF;
END
$check$;
DO $restore$
DECLARE n integer;
BEGIN
  UPDATE "QuestionBankItem" AS q SET "references" = b."references"
  FROM qbi_usmle_refs4_20261114_backup AS b WHERE q.id = b.id;
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 57 THEN
    RAISE EXCEPTION 'undo updated % rows, expected 57', n;
  END IF;
END
$restore$;
COMMIT;
