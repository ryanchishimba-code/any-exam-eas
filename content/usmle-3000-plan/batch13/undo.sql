-- Deletes only the 200 hidden USMLE batch-13 rows.
-- Requires backup table qbi_usmle_batch13_200_20261120.
-- Aborts unless all 200 are still inactive, not qa-passed, source batch13-draft, and on a USMLE Step 1 or Step 2 field.
BEGIN;
DO $$
DECLARE
  n integer;
BEGIN
  SELECT count(*) INTO n
  FROM "QuestionBankItem" q
  WHERE q.id IN (SELECT id FROM qbi_usmle_batch13_200_20261120)
    AND q.source = 'batch13-draft'
    AND q.active = false
    AND q."qaPassed" = false
    AND q."fieldId" IN ('usmle-step-1', 'usmle-step-2');
  IF n <> 200 THEN
    RAISE EXCEPTION 'expected 200 hidden batch13 rows, found %', n;
  END IF;

  DELETE FROM "QuestionBankItem" q
  WHERE q.id IN (SELECT id FROM qbi_usmle_batch13_200_20261120)
    AND q.source = 'batch13-draft'
    AND q.active = false
    AND q."qaPassed" = false
    AND q."fieldId" IN ('usmle-step-1', 'usmle-step-2');

  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 200 THEN
    RAISE EXCEPTION 'deleted % rows, expected 200', n;
  END IF;
END $$;
COMMIT;
