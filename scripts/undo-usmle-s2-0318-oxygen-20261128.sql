-- Undo the 0318 option rewrite. Restores the backed-up text and hash.
-- Leaves active and qaPassed as they are, so a later go-live is not reversed.
BEGIN;
UPDATE "QuestionBankItem" AS q SET
  scenario = b.scenario,
  question = b.question,
  options = b.options,
  "correctAnswer" = b."correctAnswer",
  explanation = b.explanation,
  "references" = b."references",
  "contentHash" = b."contentHash",
  "updatedAt" = NOW()
FROM qbi_usmle_s2_0318_20261128_backup AS b
WHERE q.id = b.id
  AND q.id = 's2n202611210318'
  AND q.source = 's2-new-20261121-hidden'
  AND q."fieldId" = 'usmle-step-2';
COMMIT;
