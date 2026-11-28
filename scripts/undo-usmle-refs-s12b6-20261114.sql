-- Undo batch 6. Restores references on the 14 rows in qbi_usmle_refs_s12b6_20261114_backup.
-- Command: psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/undo-usmle-refs-s12b6-20261114.sql
BEGIN;
DO $check$
BEGIN
  IF to_regclass('public.qbi_usmle_refs_s12b6_20261114_backup') IS NULL THEN
    RAISE EXCEPTION 'backup table missing';
  END IF;
  IF (SELECT COUNT(*) FROM qbi_usmle_refs_s12b6_20261114_backup) <> 14 THEN
    RAISE EXCEPTION 'backup row count %, expected 14', (SELECT COUNT(*) FROM qbi_usmle_refs_s12b6_20261114_backup);
  END IF;
END
$check$;
DO $restore$
DECLARE k integer;
BEGIN
  UPDATE "QuestionBankItem" AS q SET "references"=b."references"
  FROM qbi_usmle_refs_s12b6_20261114_backup AS b
  WHERE q.id=b.id AND q."fieldId" IN ('usmle-step-1','usmle-step-2');
  GET DIAGNOSTICS k = ROW_COUNT;
  IF k <> 14 THEN RAISE EXCEPTION 'undo updated % rows, expected 14', k; END IF;
END
$restore$;
COMMIT;
