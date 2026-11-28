-- Apply the staged USMLE 80-per-step audit to live "QuestionBankItem" rows.
-- Run scripts/stage-usmle-audit80b-20261121.sql first.
-- Refuses to write if a live row no longer matches the backup snapshot.
-- Do not run this until the dry run is accepted. It is not part of CI.
-- Command:
--   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/apply-usmle-audit80b-20261121.sql
-- Undo:
--   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/undo-usmle-audit80b-20261121.sql
BEGIN;
DO $check$
BEGIN
  IF to_regclass('public.qbi_usmle_audit80b_20261121_backup') IS NULL THEN
    RAISE EXCEPTION 'backup table qbi_usmle_audit80b_20261121_backup is missing';
  END IF;
  IF to_regclass('public.qbi_usmle_audit80b_20261121_stage') IS NULL THEN
    RAISE EXCEPTION 'staging table qbi_usmle_audit80b_20261121_stage is missing';
  END IF;
  IF (SELECT COUNT(*) FROM qbi_usmle_audit80b_20261121_backup) <> 175 THEN
    RAISE EXCEPTION 'backup row count %, expected 175',
      (SELECT COUNT(*) FROM qbi_usmle_audit80b_20261121_backup);
  END IF;
  IF (SELECT COUNT(*) FROM qbi_usmle_audit80b_20261121_stage) <> 175 THEN
    RAISE EXCEPTION 'stage row count %, expected 175',
      (SELECT COUNT(*) FROM qbi_usmle_audit80b_20261121_stage);
  END IF;
  IF EXISTS (
    SELECT 1
    FROM qbi_usmle_audit80b_20261121_backup AS b
    JOIN "QuestionBankItem" AS q ON q.id = b.id
    WHERE q."contentHash" IS DISTINCT FROM b."contentHash"
       OR q."correctAnswer" IS DISTINCT FROM b."correctAnswer"
       OR q.question IS DISTINCT FROM b.question
       OR q.explanation IS DISTINCT FROM b.explanation
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
  FROM qbi_usmle_audit80b_20261121_stage AS s
  WHERE q.id = s.id;
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 175 THEN
    RAISE EXCEPTION 'apply updated % rows, expected 175', n;
  END IF;
END
$apply$;
COMMIT;
