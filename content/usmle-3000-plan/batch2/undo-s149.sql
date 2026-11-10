-- Restores the pre-fix wording of batch-2 item b2-s1-49 only.
-- Does not change active or qaPassed. Requires qbi_usmle_batch2_s149_before.
BEGIN;
UPDATE "QuestionBankItem" q
SET options = b.options,
    explanation = b.explanation,
    "updatedAt" = NOW()
FROM qbi_usmle_batch2_s149_before b
WHERE q.id = b.id
  AND q.source = 'batch2-draft'
  AND q."generationMeta"->>'batchItemId' = 'b2-s1-49';
COMMIT;
