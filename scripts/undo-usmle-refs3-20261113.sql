-- Undo the third 2026-11-13 citation pass.
-- Restores references on 49 rows in qbi_usmle_refs3_20261113_backup.
-- Command: psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/undo-usmle-refs3-20261113.sql
BEGIN;
DO $check$
BEGIN
  IF to_regclass('public.qbi_usmle_refs3_20261113_backup') IS NULL THEN
    RAISE EXCEPTION 'backup table missing';
  END IF;
  IF (SELECT COUNT(*) FROM qbi_usmle_refs3_20261113_backup) <> 49 THEN
    RAISE EXCEPTION 'backup row count %, expected 49', (SELECT COUNT(*) FROM qbi_usmle_refs3_20261113_backup);
  END IF;
END
$check$;
DO $restore$
DECLARE n integer;
BEGIN
  UPDATE "QuestionBankItem" AS q SET "references"=b."references"
  FROM qbi_usmle_refs3_20261113_backup AS b WHERE q.id=b.id;
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 49 THEN
    RAISE EXCEPTION 'undo updated % rows, expected 49', n;
  END IF;
END
$restore$;
COMMIT;
