-- Undo pass 1, batch 2. Restores 16 rows from qbi_usmle_fullaudit_20261121_b2_backup.
-- Command:
--   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/usmle-fullaudit-20261121/batch-02-pass1-undo.sql
BEGIN;
DO $check$
BEGIN
  IF to_regclass('public.qbi_usmle_fullaudit_20261121_b2_backup') IS NULL THEN
    RAISE EXCEPTION 'backup table qbi_usmle_fullaudit_20261121_b2_backup is missing';
  END IF;
  IF (SELECT COUNT(*) FROM qbi_usmle_fullaudit_20261121_b2_backup) <> 16 THEN
    RAISE EXCEPTION 'backup row count %, expected 16',
      (SELECT COUNT(*) FROM qbi_usmle_fullaudit_20261121_b2_backup);
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
    difficulty = b.difficulty,
    "blueprintDomain" = b."blueprintDomain",
    "blueprintTopic" = b."blueprintTopic",
    "fieldId" = b."fieldId",
    "stepLevel" = b."stepLevel",
    "references" = b."references",
    "contentHash" = b."contentHash",
    active = b.active,
    manual_correction = b.manual_correction,
    "generationMeta" = b."generationMeta",
    "updatedAt" = b."updatedAt"
  FROM qbi_usmle_fullaudit_20261121_b2_backup AS b
  WHERE q.id = b.id;
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 16 THEN
    RAISE EXCEPTION 'undo updated % rows, expected 16', n;
  END IF;
END
$restore$;
COMMIT;
