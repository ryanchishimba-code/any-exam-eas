-- Sets only the 96 sound batch-3 rows back to inactive.
-- Does not change wording. Does not touch the 104 thin batch-3 rows, the 122 thin batch-2 rows, or the 12 batch-1 holdouts.
-- Requires qbi_usmle_batch3_sound96_activate_before_20261110, whose rows were inactive.
BEGIN;
DO $$
DECLARE
  n integer;
BEGIN
  SELECT count(*) INTO n
  FROM "QuestionBankItem" q
  JOIN qbi_usmle_batch3_sound96_activate_before_20261110 b ON b.id = q.id
  WHERE q.source = 'batch3-draft'
    AND q.active = true
    AND q."qaPassed" = true
    AND b.active = false
    AND b."qaPassed" = false
    AND q."fieldId" IN ('usmle-step-1', 'usmle-step-2');
  IF n <> 96 THEN
    RAISE EXCEPTION 'expected 96 live batch3 sound rows to deactivate, found %', n;
  END IF;

  UPDATE "QuestionBankItem" q
  SET active = false, "qaPassed" = false, "updatedAt" = NOW()
  FROM qbi_usmle_batch3_sound96_activate_before_20261110 b
  WHERE q.id = b.id
    AND q.source = 'batch3-draft'
    AND q.active = true
    AND q."qaPassed" = true
    AND b.active = false
    AND b."qaPassed" = false
    AND q."fieldId" IN ('usmle-step-1', 'usmle-step-2');

  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 96 THEN
    RAISE EXCEPTION 'deactivated % rows, expected 96', n;
  END IF;
END $$;
COMMIT;
