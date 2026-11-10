-- Restores the pre-rewrite text of the 17 thin batch-1 items.
-- Does not change active or qaPassed. Requires qbi_usmle_batch1_thin17_before.
BEGIN;
UPDATE "QuestionBankItem" q
SET scenario = b.scenario,
    question = b.question,
    options = b.options,
    "correctAnswer" = b."correctAnswer",
    explanation = b.explanation,
    "contentHash" = b."contentHash",
    "updatedAt" = NOW()
FROM qbi_usmle_batch1_thin17_before b
WHERE q.id = b.id
  AND q.source = 'batch1-draft'
  AND q.active = false
  AND q."qaPassed" = false;
COMMIT;
