-- Undo pass 1, batch 4. Restores active, manual_correction, generationMeta, and updatedAt
-- for the 8 hidden rows from qbi_usmle_fullaudit_20261121_b4_backup.
-- Command:
--   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/usmle-fullaudit-20261121/batch-04-pass1-hide-undo.sql
BEGIN;
DO $check$
BEGIN
  IF to_regclass('public.qbi_usmle_fullaudit_20261121_b4_backup') IS NULL THEN
    RAISE EXCEPTION 'backup table qbi_usmle_fullaudit_20261121_b4_backup is missing';
  END IF;
  IF (SELECT COUNT(*) FROM qbi_usmle_fullaudit_20261121_b4_backup) <> 8 THEN
    RAISE EXCEPTION 'backup row count %, expected 8',
      (SELECT COUNT(*) FROM qbi_usmle_fullaudit_20261121_b4_backup);
  END IF;
END
$check$;
DO $restore$
DECLARE n integer;
BEGIN
  UPDATE "QuestionBankItem" AS q
  SET
    active = b.active,
    manual_correction = b.manual_correction,
    "generationMeta" = b."generationMeta",
    "updatedAt" = b."updatedAt"
  FROM qbi_usmle_fullaudit_20261121_b4_backup AS b
  WHERE q.id = b.id;
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 8 THEN
    RAISE EXCEPTION 'undo updated % rows, expected 8', n;
  END IF;
END
$restore$;
COMMIT;
