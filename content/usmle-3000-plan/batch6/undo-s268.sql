-- Restores the pre-fix text of hidden item b6-s2-68 only.
-- Requires qbi_usmle_batch6_s268_before. Does not activate or delete the row.
BEGIN;
UPDATE "QuestionBankItem" q
SET options = b.options,
    "correctAnswer" = b."correctAnswer",
    explanation = b.explanation,
    "generationMeta" = b."generationMeta",
    "updatedAt" = NOW()
FROM qbi_usmle_batch6_s268_before b
WHERE q.id = b.id
  AND q.source = 'batch6-draft'
  AND q.active = false
  AND q."qaPassed" = false
  AND q."generationMeta"->>'batchItemId' = 'b6-s2-68';
COMMIT;
