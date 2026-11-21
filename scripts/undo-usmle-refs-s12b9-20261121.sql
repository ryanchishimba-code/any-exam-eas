-- Undo batch s12b9. Restores references from qbi_usmle_refs_s12b9_20261121_backup.
BEGIN;
DO $check$
BEGIN
  IF to_regclass('public.qbi_usmle_refs_s12b9_20261121_backup') IS NULL THEN
    RAISE EXCEPTION 'backup table missing';
  END IF;
  IF (SELECT COUNT(*) FROM qbi_usmle_refs_s12b9_20261121_backup) <> 14 THEN
    RAISE EXCEPTION 'backup row count %, expected 14', (SELECT COUNT(*) FROM qbi_usmle_refs_s12b9_20261121_backup);
  END IF;
END
$check$;
DO $restore$
DECLARE k integer;
BEGIN
  UPDATE "QuestionBankItem" AS q SET "references"=b."references"
  FROM qbi_usmle_refs_s12b9_20261121_backup AS b
  WHERE q.id=b.id AND q."fieldId" IN ('usmle-step-1','usmle-step-2');
  GET DIAGNOSTICS k = ROW_COUNT;
  IF k <> 14 THEN RAISE EXCEPTION 'undo updated % rows, expected 14', k; END IF;
END
$restore$;
COMMIT;
