-- Restores the pre-rewrite text of the 90 thin batch-2 items.
-- Does not change active or qaPassed. Requires qbi_usmle_batch2_thin90_before.
-- Does not touch the 12 hidden batch-1 holdouts.
BEGIN;
UPDATE "QuestionBankItem" q
SET scenario = b.scenario,
    question = b.question,
    options = b.options,
    "correctAnswer" = b."correctAnswer",
    explanation = b.explanation,
    "contentHash" = b."contentHash",
    "references" = b."references",
    "generationMeta" = b."generationMeta",
    "updatedAt" = NOW()
FROM qbi_usmle_batch2_thin90_before b
WHERE q.id = b.id
  AND q.source = 'batch2-draft'
  AND q.active = false
  AND q."qaPassed" = false;
COMMIT;
