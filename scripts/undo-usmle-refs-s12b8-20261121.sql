-- Undo batch s12b8. Restores references from qbi_usmle_refs_s12b8_20261121_backup.
-- Command: psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/undo-usmle-refs-s12b8-20261121.sql
BEGIN;
DO $check$
BEGIN
  IF to_regclass('public.qbi_usmle_refs_s12b8_20261121_backup') IS NULL THEN
    RAISE EXCEPTION 'backup table missing';
  END IF;
  IF (SELECT COUNT(*) FROM qbi_usmle_refs_s12b8_20261121_backup) <> 59 THEN
    RAISE EXCEPTION 'backup row count %, expected 59', (SELECT COUNT(*) FROM qbi_usmle_refs_s12b8_20261121_backup);
  END IF;
END
$check$;
DO $restore$
DECLARE k integer;
BEGIN
  UPDATE "QuestionBankItem" AS q SET "references"=b."references"
  FROM qbi_usmle_refs_s12b8_20261121_backup AS b
  WHERE q.id=b.id AND q."fieldId" IN ('usmle-step-1','usmle-step-2');
  GET DIAGNOSTICS k = ROW_COUNT;
  IF k <> 59 THEN RAISE EXCEPTION 'undo updated % rows, expected 59', k; END IF;
END
$restore$;
COMMIT;
