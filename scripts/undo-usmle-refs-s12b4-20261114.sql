-- Undo batch 4. Restores references on the 56 rows in qbi_usmle_refs_s12b4_20261114_backup.
-- Command: psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/undo-usmle-refs-s12b4-20261114.sql
BEGIN;
DO $check$
BEGIN
  IF to_regclass('public.qbi_usmle_refs_s12b4_20261114_backup') IS NULL THEN
    RAISE EXCEPTION 'backup table qbi_usmle_refs_s12b4_20261114_backup is missing';
  END IF;
  IF (SELECT COUNT(*) FROM qbi_usmle_refs_s12b4_20261114_backup) <> 56 THEN
    RAISE EXCEPTION 'backup row count %, expected 56', (SELECT COUNT(*) FROM qbi_usmle_refs_s12b4_20261114_backup);
  END IF;
END
$check$;
DO $restore$
DECLARE n integer;
BEGIN
  UPDATE "QuestionBankItem" AS q SET "references"=b."references"
  FROM qbi_usmle_refs_s12b4_20261114_backup AS b
  WHERE q.id=b.id AND q."fieldId" IN ('usmle-step-1','usmle-step-2');
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 56 THEN RAISE EXCEPTION 'undo updated % rows, expected 56', n; END IF;
END
$restore$;
COMMIT;
