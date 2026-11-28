-- Apply pass 1, batch 4. Hides 8 items by setting active = false.
-- Run the stage script first. Does not change question text or the key.
-- Command:
--   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/usmle-fullaudit-20261121/batch-04-pass1-hide-apply.sql
-- Undo:
--   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/usmle-fullaudit-20261121/batch-04-pass1-hide-undo.sql
BEGIN;
DO $check$
BEGIN
  IF to_regclass('public.qbi_usmle_fullaudit_20261121_b4_backup') IS NULL THEN
    RAISE EXCEPTION 'backup table qbi_usmle_fullaudit_20261121_b4_backup is missing';
  END IF;
  IF to_regclass('public.qbi_usmle_fullaudit_20261121_b4_stage') IS NULL THEN
    RAISE EXCEPTION 'staging table qbi_usmle_fullaudit_20261121_b4_stage is missing';
  END IF;
  IF (SELECT COUNT(*) FROM qbi_usmle_fullaudit_20261121_b4_backup) <> 8 THEN
    RAISE EXCEPTION 'backup row count %, expected 8',
      (SELECT COUNT(*) FROM qbi_usmle_fullaudit_20261121_b4_backup);
  END IF;
  IF (SELECT COUNT(*) FROM qbi_usmle_fullaudit_20261121_b4_stage) <> 8 THEN
    RAISE EXCEPTION 'stage row count %, expected 8',
      (SELECT COUNT(*) FROM qbi_usmle_fullaudit_20261121_b4_stage);
  END IF;
  IF EXISTS (
    SELECT 1
    FROM qbi_usmle_fullaudit_20261121_b4_backup AS b
    JOIN "QuestionBankItem" AS q ON q.id = b.id
    WHERE q.active IS DISTINCT FROM b.active
       OR q."correctAnswer" IS DISTINCT FROM b."correctAnswer"
       OR q.question IS DISTINCT FROM b.question
       OR q."contentHash" IS DISTINCT FROM b."contentHash"
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
    active = s.active,
    manual_correction = true,
    "generationMeta" = CASE
      WHEN q."generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb
      WHEN jsonb_typeof(q."generationMeta") = 'object' THEN jsonb_set(q."generationMeta", '{manualCorrection}', 'true'::jsonb, true)
      ELSE q."generationMeta"
    END,
    "updatedAt" = NOW()
  FROM qbi_usmle_fullaudit_20261121_b4_stage AS s
  WHERE q.id = s.id;
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 8 THEN
    RAISE EXCEPTION 'apply updated % rows, expected 8', n;
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem" AS q
    JOIN qbi_usmle_fullaudit_20261121_b4_stage AS s ON s.id = q.id
    WHERE q.active IS NOT FALSE
  ) THEN
    RAISE EXCEPTION 'a hide row is still active';
  END IF;
END
$apply$;
COMMIT;
