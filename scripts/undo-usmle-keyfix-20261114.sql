-- Undo the 2026-11-14 key-fix pass.
-- Restores 6 rows from qbi_usmle_keyfix_20261114_backup.
-- Command: psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/undo-usmle-keyfix-20261114.sql
BEGIN;
DO $check$
BEGIN
  IF to_regclass('public.qbi_usmle_keyfix_20261114_backup') IS NULL THEN
    RAISE EXCEPTION 'backup table missing';
  END IF;
  IF (SELECT COUNT(*) FROM qbi_usmle_keyfix_20261114_backup) <> 6 THEN
    RAISE EXCEPTION 'backup row count %, expected 6', (SELECT COUNT(*) FROM qbi_usmle_keyfix_20261114_backup);
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
      "generationMeta"=b."generationMeta", "updatedAt"=b."updatedAt"
  FROM qbi_usmle_keyfix_20261114_backup AS b
  WHERE q.id=b.id;
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 6 THEN
    RAISE EXCEPTION 'undo updated % rows, expected 6', n;
  END IF;
END
$restore$;
COMMIT;
