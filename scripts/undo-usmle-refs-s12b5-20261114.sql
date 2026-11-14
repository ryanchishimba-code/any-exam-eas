-- Undo batch 5. Restores references on the 32 rows in qbi_usmle_refs_s12b5_20261114_backup.
-- Command: psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/undo-usmle-refs-s12b5-20261114.sql
BEGIN;
DO $check$
BEGIN
  IF to_regclass('public.qbi_usmle_refs_s12b5_20261114_backup') IS NULL THEN
    RAISE EXCEPTION 'backup table qbi_usmle_refs_s12b5_20261114_backup is missing';
  END IF;
  IF (SELECT COUNT(*) FROM qbi_usmle_refs_s12b5_20261114_backup) <> 32 THEN
    RAISE EXCEPTION 'backup row count %, expected 32', (SELECT COUNT(*) FROM qbi_usmle_refs_s12b5_20261114_backup);
  END IF;
END
$check$;
DO $restore$
DECLARE k integer;
BEGIN
  UPDATE "QuestionBankItem" AS q SET "references"=b."references"
  FROM qbi_usmle_refs_s12b5_20261114_backup AS b
  WHERE q.id=b.id AND q."fieldId" IN ('usmle-step-1','usmle-step-2');
  GET DIAGNOSTICS k = ROW_COUNT;
  IF k <> 32 THEN RAISE EXCEPTION 'undo updated % rows, expected 32', k; END IF;
END
$restore$;
COMMIT;
