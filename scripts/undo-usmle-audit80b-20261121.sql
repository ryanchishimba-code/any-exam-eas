-- Undo the USMLE 80-per-step audit. Restores 175 rows from
-- qbi_usmle_audit80b_20261121_backup.
-- Command:
--   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/undo-usmle-audit80b-20261121.sql
BEGIN;
DO $check$
BEGIN
  IF to_regclass('public.qbi_usmle_audit80b_20261121_backup') IS NULL THEN
    RAISE EXCEPTION 'backup table qbi_usmle_audit80b_20261121_backup is missing';
  END IF;
  IF (SELECT COUNT(*) FROM qbi_usmle_audit80b_20261121_backup) <> 175 THEN
    RAISE EXCEPTION 'backup row count %, expected 175',
      (SELECT COUNT(*) FROM qbi_usmle_audit80b_20261121_backup);
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
    "references" = b."references",
    "contentHash" = b."contentHash",
    active = b.active,
    manual_correction = b.manual_correction,
    "generationMeta" = b."generationMeta",
    "updatedAt" = b."updatedAt"
  FROM qbi_usmle_audit80b_20261121_backup AS b
  WHERE q.id = b.id;
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 175 THEN
    RAISE EXCEPTION 'undo updated % rows, expected 175', n;
  END IF;
END
$restore$;
COMMIT;
