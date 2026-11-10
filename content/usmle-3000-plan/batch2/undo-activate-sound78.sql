-- Sets only the 78 sound batch-2 rows back to inactive.
-- Does not change wording. Does not touch the 122 thin batch-2 rows or the 12 batch-1 holdouts.
-- Requires qbi_usmle_batch2_sound78_activate_before_20261110, whose rows were inactive.
BEGIN;
DO $$
DECLARE
  n integer;
BEGIN
  SELECT count(*) INTO n
  FROM "QuestionBankItem" q
  JOIN qbi_usmle_batch2_sound78_activate_before_20261110 b ON b.id = q.id
  WHERE q.source = 'batch2-draft'
    AND q.active = true
    AND q."qaPassed" = true
    AND b.active = false
    AND b."qaPassed" = false
    AND q."fieldId" IN ('usmle-step-1', 'usmle-step-2');
  IF n <> 78 THEN
    RAISE EXCEPTION 'expected 78 live batch2 sound rows to deactivate, found %', n;
  END IF;

  UPDATE "QuestionBankItem" q
  SET active = false, "qaPassed" = false, "updatedAt" = NOW()
  FROM qbi_usmle_batch2_sound78_activate_before_20261110 b
  WHERE q.id = b.id
    AND q.source = 'batch2-draft'
    AND q.active = true
    AND q."qaPassed" = true
    AND b.active = false
    AND b."qaPassed" = false
    AND q."fieldId" IN ('usmle-step-1', 'usmle-step-2');

  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 78 THEN
    RAISE EXCEPTION 'deactivated % rows, expected 78', n;
  END IF;
END $$;
COMMIT;
