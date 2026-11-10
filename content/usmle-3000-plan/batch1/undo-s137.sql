-- Restores the pre-fix wording of batch item b1-s1-37 only.
-- Does not change active or qaPassed. Requires qbi_usmle_batch1_s137_before.
BEGIN;
UPDATE "QuestionBankItem" q
SET options = b.options,
    "correctAnswer" = b."correctAnswer",
    explanation = b.explanation,
    "updatedAt" = NOW()
FROM qbi_usmle_batch1_s137_before b
WHERE q.id = b.id
  AND q.source = 'batch1-draft'
  AND q.active = false
  AND q."qaPassed" = false
  AND q."generationMeta"->>'batchItemId' = 'b1-s1-37';
COMMIT;
