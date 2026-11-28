-- Restores the 400 hidden batch-12 and batch-13 rows to the pre-apply backup.
-- Requires qbi_usmle_b12_b13_preapply_20261120.
-- Aborts if any of those rows is now active or qa-passed.
-- Does not change any other question, including the served bank.
BEGIN;
DO $$
DECLARE
  n integer;
BEGIN
  SELECT count(*) INTO n
  FROM "QuestionBankItem" q
  JOIN qbi_usmle_b12_b13_preapply_20261120 b ON b.id = q.id
  WHERE q.active = true OR q."qaPassed" = true;
  IF n <> 0 THEN
    RAISE EXCEPTION 'refusing undo: % backed-up rows are no longer hidden', n;
  END IF;
END $$;

DELETE FROM "QuestionBankItem" q
WHERE q.id IN (SELECT id FROM qbi_usmle_b12_b13_preapply_20261120)
  AND q.active = false
  AND q."qaPassed" = false
  AND q.source IN ('batch12-draft', 'batch13-draft');

INSERT INTO "QuestionBankItem"
SELECT * FROM qbi_usmle_b12_b13_preapply_20261120;

DO $$
DECLARE
  n integer;
BEGIN
  SELECT count(*) INTO n FROM "QuestionBankItem" q
  WHERE q.id IN (SELECT id FROM qbi_usmle_b12_b13_preapply_20261120);
  IF n <> 400 THEN
    RAISE EXCEPTION 'undo restored % rows, expected 400', n;
  END IF;
END $$;
COMMIT;
