-- Deletes only the 200 hidden USMLE batch-4 rows inserted on 2026-11-10.
-- Requires backup table qbi_usmle_batch4_200_20261110.
-- Aborts unless all 200 are still inactive, qa-failed, source batch4-draft, and on a USMLE field.
-- Does not change batch 1, batch 2, batch 3, the pilot, or any other question.
BEGIN;
DO $$
DECLARE
  n integer;
BEGIN
  SELECT count(*) INTO n
  FROM "QuestionBankItem" q
  WHERE q.id IN (SELECT id FROM qbi_usmle_batch4_200_20261110)
    AND q.source = 'batch4-draft'
    AND q.active = false
    AND q."qaPassed" = false
    AND q."fieldId" IN ('usmle-step-1', 'usmle-step-2', 'usmle-step-3');
  IF n <> 200 THEN
    RAISE EXCEPTION 'expected 200 hidden batch4 rows, found %', n;
  END IF;

  DELETE FROM "QuestionBankItem" q
  WHERE q.id IN (SELECT id FROM qbi_usmle_batch4_200_20261110)
    AND q.source = 'batch4-draft'
    AND q.active = false
    AND q."qaPassed" = false
    AND q."fieldId" IN ('usmle-step-1', 'usmle-step-2', 'usmle-step-3');

  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 200 THEN
    RAISE EXCEPTION 'deleted % rows, expected 200', n;
  END IF;
END $$;
COMMIT;
