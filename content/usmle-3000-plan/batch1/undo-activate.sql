-- Sets the 188 activated batch-1 rows back to inactive.
-- Does not change wording. Does not touch the 12 rows that stayed hidden.
-- Requires qbi_usmle_batch1_activate_before_20261110, whose rows were inactive.
BEGIN;
DO $$
DECLARE
  n integer;
BEGIN
  SELECT count(*) INTO n
  FROM "QuestionBankItem" q
  JOIN qbi_usmle_batch1_activate_before_20261110 b ON b.id = q.id
  WHERE q.source = 'batch1-draft'
    AND q.active = true
    AND q."qaPassed" = true
    AND b.active = false
    AND b."qaPassed" = false
    AND q."fieldId" IN ('usmle-step-1', 'usmle-step-2', 'usmle-step-3');
  IF n <> 188 THEN
    RAISE EXCEPTION 'expected 188 live batch1 rows to deactivate, found %', n;
  END IF;

  UPDATE "QuestionBankItem" q
  SET active = false, "qaPassed" = false, "updatedAt" = NOW()
  FROM qbi_usmle_batch1_activate_before_20261110 b
  WHERE q.id = b.id
    AND q.source = 'batch1-draft'
    AND q.active = true
    AND q."qaPassed" = true
    AND b.active = false
    AND b."qaPassed" = false
    AND q."fieldId" IN ('usmle-step-1', 'usmle-step-2', 'usmle-step-3');

  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 188 THEN
    RAISE EXCEPTION 'deactivated % rows, expected 188', n;
  END IF;
END $$;
COMMIT;
