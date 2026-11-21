-- Restore the 800 hidden batch 14-17 items from qbi_usmle_b14_17_pass2_20261121.
-- Do not run unless those rows must be returned to the text from before this pass.
-- Aborts if any backed-up id is now active or qaPassed.
BEGIN;

DO $$
DECLARE
  exposed int;
BEGIN
  SELECT count(*) INTO exposed
  FROM qbi_usmle_b14_17_pass2_20261121 b
  JOIN "QuestionBankItem" q ON q.id = b.id
  WHERE q.active OR q."qaPassed";
  IF exposed <> 0 THEN
    RAISE EXCEPTION 'abort: % backed-up batch 14-17 ids are active or qaPassed', exposed;
  END IF;
END $$;

DELETE FROM "QuestionBankItem" q
USING qbi_usmle_b14_17_pass2_20261121 b
WHERE q.id = b.id
  AND q.active = false
  AND q."qaPassed" = false
  AND q.source IN ('batch14-draft','batch15-draft','batch16-draft','batch17-draft');

INSERT INTO "QuestionBankItem"
SELECT * FROM qbi_usmle_b14_17_pass2_20261121;

DO $$
DECLARE
  n int;
BEGIN
  SELECT count(*) INTO n
  FROM "QuestionBankItem" q
  JOIN qbi_usmle_b14_17_pass2_20261121 b ON b.id = q.id
  WHERE q.source IN ('batch14-draft','batch15-draft','batch16-draft','batch17-draft')
    AND q.active = false
    AND q."qaPassed" = false;
  IF n <> 800 THEN
    RAISE EXCEPTION 'abort: restored % batch 14-17 rows, expected 800', n;
  END IF;
END $$;

COMMIT;
