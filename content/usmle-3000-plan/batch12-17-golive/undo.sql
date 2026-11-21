-- Return every batch 12-17 row to the hidden snapshot in
-- qbi_usmle_b12_17_prelive_20261121 (1,196 rows, taken before go-live).
-- Run only if that go-live has to be reversed.
-- Restores active, qaPassed, reviewStatus, and updatedAt.
-- Does not delete rows, so practice-exam references stay intact.
BEGIN;

DO $$
DECLARE
  n int;
  missing int;
BEGIN
  SELECT count(*) INTO n FROM qbi_usmle_b12_17_prelive_20261121;
  IF n <> 1196 THEN
    RAISE EXCEPTION 'abort: backup has % rows, expected 1196', n;
  END IF;
  SELECT count(*) INTO missing
  FROM qbi_usmle_b12_17_prelive_20261121 b
  LEFT JOIN "QuestionBankItem" q ON q.id = b.id
  WHERE q.id IS NULL;
  IF missing <> 0 THEN
    RAISE EXCEPTION 'abort: % backed-up ids are missing', missing;
  END IF;
END $$;

UPDATE "QuestionBankItem" q
SET active = b.active,
    "qaPassed" = b."qaPassed",
    "reviewStatus" = b."reviewStatus",
    "updatedAt" = b."updatedAt"
FROM qbi_usmle_b12_17_prelive_20261121 b
WHERE q.id = b.id
  AND q.source = b.source
  AND q.source IN (
    'batch12-draft',
    'batch13-draft',
    'batch14-draft',
    'batch15-draft',
    'batch16-draft',
    'batch17-draft'
  );

DO $$
DECLARE
  n int;
BEGIN
  SELECT count(*) INTO n
  FROM "QuestionBankItem" q
  JOIN qbi_usmle_b12_17_prelive_20261121 b ON b.id = q.id
  WHERE q.active = false
    AND q."qaPassed" = false
    AND q."reviewStatus" = 'pending'
    AND q."updatedAt" = b."updatedAt";
  IF n <> 1196 THEN
    RAISE EXCEPTION 'abort: restored % hidden rows, expected 1196', n;
  END IF;
END $$;

COMMIT;
