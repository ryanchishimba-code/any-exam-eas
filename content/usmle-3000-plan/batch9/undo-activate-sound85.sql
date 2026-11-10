-- Sets only the 85 sound batch-9 rows back to inactive.
-- Does not change wording. Does not touch the 115 thin batch-9 rows or earlier hidden rows.
-- Requires qbi_usmle_batch9_sound85_activate_before_20261110, whose rows were inactive.
BEGIN;
DO $$
DECLARE
  n integer;
BEGIN
  SELECT count(*) INTO n
  FROM "QuestionBankItem" q
  JOIN qbi_usmle_batch9_sound85_activate_before_20261110 b ON b.id = q.id
  WHERE q.source = 'batch9-draft'
    AND q.active = true
    AND q."qaPassed" = true
    AND b.active = false
    AND b."qaPassed" = false
    AND q."fieldId" IN ('usmle-step-1', 'usmle-step-2');
  IF n <> 85 THEN
    RAISE EXCEPTION 'expected 85 live batch9 sound rows to deactivate, found %', n;
  END IF;

  UPDATE "QuestionBankItem" q
  SET active = false, "qaPassed" = false, "updatedAt" = NOW()
  FROM qbi_usmle_batch9_sound85_activate_before_20261110 b
  WHERE q.id = b.id
    AND q.source = 'batch9-draft'
    AND q.active = true
    AND q."qaPassed" = true
    AND b.active = false
    AND b."qaPassed" = false
    AND q."fieldId" IN ('usmle-step-1', 'usmle-step-2');

  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 85 THEN
    RAISE EXCEPTION 'deactivated % rows, expected 85', n;
  END IF;
END $$;
COMMIT;
