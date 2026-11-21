-- Put the 521 hidden batch 12-17 items back to the text in
-- qbi_usmle_b12_17_pass6pre_20261121.
-- That snapshot was taken after the fifth pass and before this sixth pass.
-- Every one of these rows was hidden. Run only to undo the sixth pass.
-- It does not touch items that are already live.
BEGIN;

DO $$
DECLARE
  n int;
  missing int;
BEGIN
  SELECT count(*) INTO n FROM qbi_usmle_b12_17_pass6pre_20261121;
  IF n <> 521 THEN
    RAISE EXCEPTION 'abort: backup has % rows, expected 521', n;
  END IF;
  SELECT count(*) INTO missing
  FROM qbi_usmle_b12_17_pass6pre_20261121 b
  LEFT JOIN "QuestionBankItem" q ON q.id = b.id
  WHERE q.id IS NULL;
  IF missing <> 0 THEN
    RAISE EXCEPTION 'abort: % backed-up ids are missing', missing;
  END IF;
END $$;

UPDATE "QuestionBankItem" q
SET question = b.question,
    options = b.options,
    "correctAnswer" = b."correctAnswer",
    explanation = b.explanation,
    scenario = b.scenario,
    difficulty = b.difficulty,
    "contentHash" = b."contentHash",
    "generationMeta" = b."generationMeta",
    "references" = b."references",
    "blueprintDomain" = b."blueprintDomain",
    "blueprintTopic" = b."blueprintTopic",
    "topicCategory" = b."topicCategory",
    "updatedAt" = b."updatedAt",
    active = false,
    "qaPassed" = false,
    "reviewStatus" = 'pending'
FROM qbi_usmle_b12_17_pass6pre_20261121 b
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
  JOIN qbi_usmle_b12_17_pass6pre_20261121 b ON b.id = q.id
  WHERE q."blueprintDomain" IS NOT DISTINCT FROM b."blueprintDomain"
    AND q."blueprintTopic" IS NOT DISTINCT FROM b."blueprintTopic"
    AND q."correctAnswer" = b."correctAnswer"
    AND q.active = false
    AND q."qaPassed" = false
    AND q."reviewStatus" = 'pending';
  IF n <> 521 THEN
    RAISE EXCEPTION 'abort: restored % hidden rows, expected 521', n;
  END IF;
END $$;

COMMIT;
