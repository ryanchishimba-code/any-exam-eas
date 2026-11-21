-- Remove the 250 hidden Step 1 items from batch 18.
-- Snapshot: qbi_usmle_batch18_250_20261121.
-- Run only to undo the insert. It does not touch live questions.
BEGIN;

DO $$
DECLARE
  n int;
  exposed int;
BEGIN
  SELECT count(*) INTO n FROM qbi_usmle_batch18_250_20261121;
  IF n <> 250 THEN
    RAISE EXCEPTION 'abort: backup has % rows, expected 250', n;
  END IF;
  SELECT count(*) INTO exposed
  FROM qbi_usmle_batch18_250_20261121
  WHERE active OR "qaPassed" OR "reviewStatus" <> 'pending';
  IF exposed <> 0 THEN
    RAISE EXCEPTION 'abort: % backup rows are not hidden', exposed;
  END IF;
END $$;

DELETE FROM "QuestionBankItem" q
USING qbi_usmle_batch18_250_20261121 b
WHERE q.id = b.id
  AND q.source = 'batch18-draft'
  AND q.active = false
  AND q."qaPassed" = false
  AND q."reviewStatus" = 'pending';

DO $$
DECLARE
  n int;
BEGIN
  SELECT count(*) INTO n
  FROM "QuestionBankItem" q
  JOIN qbi_usmle_batch18_250_20261121 b ON b.id = q.id;
  IF n <> 0 THEN
    RAISE EXCEPTION 'abort: % batch 18 rows remain', n;
  END IF;
END $$;

COMMIT;
