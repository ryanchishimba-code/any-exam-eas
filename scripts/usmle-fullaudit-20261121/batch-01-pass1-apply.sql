-- Apply pass 1, batch 1. Run the stage script first.
-- Refuses to write if a live row has changed since the backup snapshot.
-- Do not run against production until this draft is accepted.
-- Command:
--   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/usmle-fullaudit-20261121/batch-01-pass1-apply.sql
-- Undo:
--   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/usmle-fullaudit-20261121/batch-01-pass1-undo.sql
BEGIN;
DO $check$
BEGIN
  IF to_regclass('public.qbi_usmle_fullaudit_20261121_b1_backup') IS NULL THEN
    RAISE EXCEPTION 'backup table qbi_usmle_fullaudit_20261121_b1_backup is missing';
  END IF;
  IF to_regclass('public.qbi_usmle_fullaudit_20261121_b1_stage') IS NULL THEN
    RAISE EXCEPTION 'staging table qbi_usmle_fullaudit_20261121_b1_stage is missing';
  END IF;
  IF (SELECT COUNT(*) FROM qbi_usmle_fullaudit_20261121_b1_backup) <> 26 THEN
    RAISE EXCEPTION 'backup row count %, expected 26',
      (SELECT COUNT(*) FROM qbi_usmle_fullaudit_20261121_b1_backup);
  END IF;
  IF (SELECT COUNT(*) FROM qbi_usmle_fullaudit_20261121_b1_stage) <> 26 THEN
    RAISE EXCEPTION 'stage row count %, expected 26',
      (SELECT COUNT(*) FROM qbi_usmle_fullaudit_20261121_b1_stage);
  END IF;
  IF EXISTS (
    SELECT 1
    FROM qbi_usmle_fullaudit_20261121_b1_backup AS b
    JOIN "QuestionBankItem" AS q ON q.id = b.id
    WHERE q."contentHash" IS DISTINCT FROM b."contentHash"
       OR q."correctAnswer" IS DISTINCT FROM b."correctAnswer"
       OR q.question IS DISTINCT FROM b.question
       OR q.options IS DISTINCT FROM b.options
       OR q.active IS DISTINCT FROM b.active
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
    "blueprintDomain" = NULLIF(s.blueprint_domain, ''),
    "blueprintTopic" = NULLIF(s.blueprint_topic, ''),
    "fieldId" = s.field_id,
    "stepLevel" = NULLIF(s.step_level, ''),
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
  FROM qbi_usmle_fullaudit_20261121_b1_stage AS s
  WHERE q.id = s.id;
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 26 THEN
    RAISE EXCEPTION 'apply updated % rows, expected 26', n;
  END IF;
END
$apply$;
COMMIT;
