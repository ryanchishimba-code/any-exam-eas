-- Undo the 2026-11-13 USMLE content fix.
-- Restores every backed-up column for the 153 rows in qbi_usmle_fix_20261113_backup.
-- Run with psql against Neon project lively-silence-56893462, database anyexameasy.
-- Command: psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/undo-usmle-fix-20261113.sql
BEGIN;
DO $check$
BEGIN
  IF to_regclass('public.qbi_usmle_fix_20261113_backup') IS NULL THEN
    RAISE EXCEPTION 'backup table qbi_usmle_fix_20261113_backup is missing';
  END IF;
  IF (SELECT COUNT(*) FROM qbi_usmle_fix_20261113_backup) <> 153 THEN
    RAISE EXCEPTION 'backup row count %, expected 153', (SELECT COUNT(*) FROM qbi_usmle_fix_20261113_backup);
  END IF;
END
$check$;
DO $restore$
DECLARE n integer;
BEGIN
  UPDATE "QuestionBankItem" AS q
  SET
    scenario = b.scenario,
    question = b.question,
    options = b.options,
    "correctAnswer" = b."correctAnswer",
    explanation = b.explanation,
    "references" = b."references",
    "contentHash" = b."contentHash",
    active = b.active,
    manual_correction = b.manual_correction,
    "generationMeta" = b."generationMeta",
    "updatedAt" = b."updatedAt"
  FROM qbi_usmle_fix_20261113_backup AS b
  WHERE q.id = b.id;
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 153 THEN
    RAISE EXCEPTION 'undo updated % rows, expected 153', n;
  END IF;
END
$restore$;
COMMIT;
