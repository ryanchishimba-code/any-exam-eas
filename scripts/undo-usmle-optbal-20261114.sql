-- Undo the 2026-11-14 option-balance pass.
-- Restores 1454 rows from qbi_usmle_optbal_20261114_backup.
-- Command: psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/undo-usmle-optbal-20261114.sql
BEGIN;
DO $check$
BEGIN
  IF to_regclass('public.qbi_usmle_optbal_20261114_backup') IS NULL THEN
    RAISE EXCEPTION 'backup table missing';
  END IF;
  IF (SELECT COUNT(*) FROM qbi_usmle_optbal_20261114_backup) <> 1454 THEN
    RAISE EXCEPTION 'backup row count %, expected 1454', (SELECT COUNT(*) FROM qbi_usmle_optbal_20261114_backup);
  END IF;
END
$check$;
DO $restore$
DECLARE n integer;
BEGIN
  UPDATE "QuestionBankItem" AS q
  SET options=b.options, manual_correction=b.manual_correction,
      "generationMeta"=b."generationMeta", "updatedAt"=b."updatedAt"
  FROM qbi_usmle_optbal_20261114_backup AS b
  WHERE q.id=b.id;
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1454 THEN
    RAISE EXCEPTION 'undo updated % rows, expected 1454', n;
  END IF;
END
$restore$;
COMMIT;
