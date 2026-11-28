-- Undo the 2026-11-14 Step 3 stem repairs.
-- Restores 84 rows from qbi_usmle_s3stem_20261114_backup.
-- Command: psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/undo-usmle-s3stem-20261114.sql
BEGIN;
DO $check$
BEGIN
  IF to_regclass('public.qbi_usmle_s3stem_20261114_backup') IS NULL THEN
    RAISE EXCEPTION 'backup table missing';
  END IF;
  IF (SELECT COUNT(*) FROM qbi_usmle_s3stem_20261114_backup) <> 84 THEN
    RAISE EXCEPTION 'backup row count %, expected 84', (SELECT COUNT(*) FROM qbi_usmle_s3stem_20261114_backup);
  END IF;
END
$check$;
DO $restore$
DECLARE n integer;
BEGIN
  UPDATE "QuestionBankItem" AS q
  SET scenario=b.scenario, question=b.question, options=b.options,
      "correctAnswer"=b."correctAnswer", explanation=b.explanation,
      "contentHash"=b."contentHash", manual_correction=b.manual_correction,
      "generationMeta"=b."generationMeta", "updatedAt"=b."updatedAt",
      active=b.active
  FROM qbi_usmle_s3stem_20261114_backup AS b
  WHERE q.id=b.id;
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 84 THEN
    RAISE EXCEPTION 'undo updated % rows, expected 84', n;
  END IF;
END
$restore$;
COMMIT;
