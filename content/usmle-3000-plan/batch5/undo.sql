-- Deletes only the 200 hidden USMLE batch-5 rows inserted on 2026-11-10.
-- Requires backup table qbi_usmle_batch5_200_20261110.
-- Aborts unless all 200 are still inactive, qa-failed, source batch5-draft, and on a USMLE field.
-- Does not change earlier batches, the pilot, or any other question.
BEGIN;
DO $$
DECLARE
  n integer;
BEGIN
  SELECT count(*) INTO n
  FROM "QuestionBankItem" q
  WHERE q.id IN (SELECT id FROM qbi_usmle_batch5_200_20261110)
    AND q.source = 'batch5-draft'
    AND q.active = false
    AND q."qaPassed" = false
    AND q."fieldId" IN ('usmle-step-1', 'usmle-step-2', 'usmle-step-3');
  IF n <> 200 THEN
    RAISE EXCEPTION 'expected 200 hidden batch5 rows, found %', n;
  END IF;

  DELETE FROM "QuestionBankItem" q
  WHERE q.id IN (SELECT id FROM qbi_usmle_batch5_200_20261110)
    AND q.source = 'batch5-draft'
    AND q.active = false
    AND q."qaPassed" = false
    AND q."fieldId" IN ('usmle-step-1', 'usmle-step-2', 'usmle-step-3');

  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 200 THEN
    RAISE EXCEPTION 'deleted % rows, expected 200', n;
  END IF;
END $$;
COMMIT;
