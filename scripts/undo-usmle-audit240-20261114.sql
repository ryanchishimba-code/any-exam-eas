-- Undo the USMLE 240-item audit. Restores 236 rows from
-- qbi_usmle_audit240_20261114_backup.
-- Command:
--   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/undo-usmle-audit240-20261114.sql
BEGIN;
DO $check$
BEGIN
  IF to_regclass('public.qbi_usmle_audit240_20261114_backup') IS NULL THEN
    RAISE EXCEPTION 'backup table qbi_usmle_audit240_20261114_backup is missing';
  END IF;
  IF (SELECT COUNT(*) FROM qbi_usmle_audit240_20261114_backup) <> 236 THEN
    RAISE EXCEPTION 'backup row count %, expected 236',
      (SELECT COUNT(*) FROM qbi_usmle_audit240_20261114_backup);
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
  FROM qbi_usmle_audit240_20261114_backup AS b
  WHERE q.id = b.id;
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 236 THEN
    RAISE EXCEPTION 'undo updated % rows, expected 236', n;
  END IF;
END
$restore$;
COMMIT;
