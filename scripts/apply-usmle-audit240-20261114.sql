-- Apply the staged USMLE 240-item audit to live "QuestionBankItem" rows.
-- Run scripts/stage-usmle-audit240-20261114.sql first.
-- Refuses to write if a live row no longer matches the backup snapshot.
-- Command:
--   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/apply-usmle-audit240-20261114.sql
-- Undo:
--   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/undo-usmle-audit240-20261114.sql
BEGIN;
DO $check$
BEGIN
  IF to_regclass('public.qbi_usmle_audit240_20261114_backup') IS NULL THEN
    RAISE EXCEPTION 'backup table qbi_usmle_audit240_20261114_backup is missing';
  END IF;
  IF to_regclass('public.qbi_usmle_audit240_20261114_stage') IS NULL THEN
    RAISE EXCEPTION 'staging table qbi_usmle_audit240_20261114_stage is missing';
  END IF;
  IF (SELECT COUNT(*) FROM qbi_usmle_audit240_20261114_backup) <> 236 THEN
    RAISE EXCEPTION 'backup row count %, expected 236',
      (SELECT COUNT(*) FROM qbi_usmle_audit240_20261114_backup);
  END IF;
  IF (SELECT COUNT(*) FROM qbi_usmle_audit240_20261114_stage) <> 236 THEN
    RAISE EXCEPTION 'stage row count %, expected 236',
      (SELECT COUNT(*) FROM qbi_usmle_audit240_20261114_stage);
  END IF;
  IF EXISTS (
    SELECT 1
    FROM qbi_usmle_audit240_20261114_backup AS b
    JOIN "QuestionBankItem" AS q ON q.id = b.id
    WHERE q."contentHash" IS DISTINCT FROM b."contentHash"
  ) THEN
    RAISE EXCEPTION 'a live row changed after the backup snapshot; apply aborted';
  END IF;
END
$check$;
DO $apply$
DECLARE n integer;
BEGIN
  UPDATE "QuestionBankItem" AS q
  SET
    scenario = s.scenario,
    question = s.question,
    options = s.options,
    "correctAnswer" = s.correct_answer,
    explanation = s.explanation,
    difficulty = s.difficulty,
    "blueprintDomain" = s.blueprint_domain,
    "blueprintTopic" = s.blueprint_topic,
    "references" = s."references",
    "contentHash" = s.content_hash,
    active = s.active,
    manual_correction = true,
    "generationMeta" = CASE
      WHEN q."generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb
      WHEN jsonb_typeof(q."generationMeta") = 'object' THEN jsonb_set(q."generationMeta", '{manualCorrection}', 'true'::jsonb, true)
      ELSE q."generationMeta"
    END,
    "updatedAt" = NOW()
  FROM qbi_usmle_audit240_20261114_stage AS s
  WHERE q.id = s.id;
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 236 THEN
    RAISE EXCEPTION 'apply updated % rows, expected 236', n;
  END IF;
END
$apply$;
COMMIT;
