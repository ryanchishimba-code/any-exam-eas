-- Restore the 300 hidden batch 16 items from qbi_usmle_batch16_300_20261120.
-- Do not run unless those rows must be returned to the backed-up text.
-- Aborts if any backed-up id is now active or qaPassed.
BEGIN;

DO $$
DECLARE
  exposed int;
BEGIN
  SELECT count(*) INTO exposed
  FROM qbi_usmle_batch16_300_20261120 b
  JOIN "QuestionBankItem" q ON q.id = b.id
  WHERE q.active OR q."qaPassed";
  IF exposed <> 0 THEN
    RAISE EXCEPTION 'abort: % backed-up batch 16 ids are active or qaPassed', exposed;
  END IF;
END $$;

DELETE FROM "QuestionBankItem" q
USING qbi_usmle_batch16_300_20261120 b
WHERE q.id = b.id
  AND q.active = false
  AND q."qaPassed" = false
  AND q.source = 'batch16-draft';

INSERT INTO "QuestionBankItem"
SELECT * FROM qbi_usmle_batch16_300_20261120;

DO $$
DECLARE
  n int;
BEGIN
  SELECT count(*) INTO n
  FROM "QuestionBankItem" q
  JOIN qbi_usmle_batch16_300_20261120 b ON b.id = q.id
  WHERE q.source = 'batch16-draft'
    AND q.active = false
    AND q."qaPassed" = false;
  IF n <> 300 THEN
    RAISE EXCEPTION 'abort: restored % batch 16 rows, expected 300', n;
  END IF;
END $$;

COMMIT;
