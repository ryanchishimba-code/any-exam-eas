-- Restores the pre-fix text of hidden items b10-s1-24, b10-s1-35, b10-s1-77, and b10-s2-39 only.
-- Requires qbi_usmle_batch10_fourfixes_before. Does not activate or delete the rows.
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
FROM qbi_usmle_batch10_fourfixes_before b
WHERE q.id = b.id
  AND q.source = 'batch10-draft'
  AND q.active = false
  AND q."qaPassed" = false
  AND q."generationMeta"->>'batchItemId' IN ('b10-s1-24', 'b10-s1-35', 'b10-s1-77', 'b10-s2-39');
COMMIT;
