-- Restores the pre-fix text of hidden items b9-s1-59 and b9-s2-20 only.
-- Requires qbi_usmle_batch9_twofixes_before. Does not activate or delete the rows.
-- b9-s1-01 of batch 8 is unrelated. This file does not touch it.
BEGIN;
UPDATE "QuestionBankItem" q
SET scenario = b.scenario,
    question = b.question,
    options = b.options,
    "correctAnswer" = b."correctAnswer",
    explanation = b.explanation,
    "contentHash" = b."contentHash",
    "generationMeta" = b."generationMeta",
    "updatedAt" = NOW()
FROM qbi_usmle_batch9_twofixes_before b
WHERE q.id = b.id
  AND q.source = 'batch9-draft'
  AND q.active = false
  AND q."qaPassed" = false
  AND q."generationMeta"->>'batchItemId' IN ('b9-s1-59', 'b9-s2-20');
COMMIT;
