-- Restore the 100 hidden batch 17 items from qbi_usmle_batch17_100_20261120.
-- Do not run unless those rows must be returned to the backed-up text.
-- Aborts if any backed-up id is now active or qaPassed.
BEGIN;

DO $$
DECLARE
  exposed int;
BEGIN
  SELECT count(*) INTO exposed
  FROM qbi_usmle_batch17_100_20261120 b
  JOIN "QuestionBankItem" q ON q.id = b.id
  WHERE q.active OR q."qaPassed";
  IF exposed <> 0 THEN
    RAISE EXCEPTION 'abort: % backed-up batch 17 ids are active or qaPassed', exposed;
  END IF;
END $$;

DELETE FROM "QuestionBankItem" q
USING qbi_usmle_batch17_100_20261120 b
WHERE q.id = b.id
  AND q.active = false
  AND q."qaPassed" = false
  AND q.source = 'batch17-draft';

INSERT INTO "QuestionBankItem"
SELECT * FROM qbi_usmle_batch17_100_20261120;

DO $$
DECLARE
  n int;
BEGIN
  SELECT count(*) INTO n
  FROM "QuestionBankItem" q
  JOIN qbi_usmle_batch17_100_20261120 b ON b.id = q.id
  WHERE q.source = 'batch17-draft'
    AND q.active = false
    AND q."qaPassed" = false;
  IF n <> 100 THEN
    RAISE EXCEPTION 'abort: restored % batch 17 rows, expected 100', n;
  END IF;
END $$;

COMMIT;
