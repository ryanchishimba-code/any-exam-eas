-- Restores the pre-fix text of hidden items b8-s1-01 and b8-s2-64 only.
-- Requires qbi_usmle_batch8_twofixes_before. Does not activate or delete the rows.
BEGIN;
UPDATE "QuestionBankItem" q
SET scenario = b.scenario,
    question = b.question,
    explanation = b.explanation,
    "contentHash" = b."contentHash",
    "generationMeta" = b."generationMeta",
    "updatedAt" = NOW()
FROM qbi_usmle_batch8_twofixes_before b
WHERE q.id = b.id
  AND q.source = 'batch8-draft'
  AND q.active = false
  AND q."qaPassed" = false
  AND q."generationMeta"->>'batchItemId' IN ('b8-s1-01', 'b8-s2-64');
COMMIT;
