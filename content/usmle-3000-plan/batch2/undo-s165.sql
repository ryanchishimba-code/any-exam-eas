-- Restores the pouch-question wording of b2-s1-65 from just before the embryology correction.
-- Does not change active or qaPassed. Requires qbi_usmle_batch2_s165_before.
BEGIN;
UPDATE "QuestionBankItem" q
SET question = b.question,
    explanation = b.explanation,
    "contentHash" = b."contentHash",
    "updatedAt" = NOW()
FROM qbi_usmle_batch2_s165_before b
WHERE q.id = b.id
  AND q.source = 'batch2-draft'
  AND q."generationMeta"->>'batchItemId' = 'b2-s1-65';
COMMIT;
