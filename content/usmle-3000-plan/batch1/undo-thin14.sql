-- Restores the pre-rewrite text of the 14 thin batch-1 items.
-- Does not change active or qaPassed. Requires qbi_usmle_batch1_thin14_before.
BEGIN;
UPDATE "QuestionBankItem" q
SET scenario = b.scenario,
    question = b.question,
    options = b.options,
    "correctAnswer" = b."correctAnswer",
    explanation = b.explanation,
    "contentHash" = b."contentHash",
    "updatedAt" = NOW()
FROM qbi_usmle_batch1_thin14_before b
WHERE q.id = b.id
  AND q.source = 'batch1-draft'
  AND q."generationMeta"->>'batchItemId' = ANY (ARRAY[
    'b1-s1-05','b1-s1-21','b1-s1-34','b1-s1-51','b1-s1-53','b1-s1-54','b1-s1-56',
    'b1-s1-60','b1-s1-64','b1-s1-70','b1-s2-43','b1-s2-50','b1-s2-59','b1-s2-66'
  ]);
COMMIT;
