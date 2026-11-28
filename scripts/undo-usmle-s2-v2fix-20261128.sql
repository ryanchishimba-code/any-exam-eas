-- Undo the 2026-11-28 v2 source-check edits. Restores the pre-change rows.
-- Does not publish anything. Batch 04 remains hidden until a later decision.
BEGIN;
UPDATE "QuestionBankItem" AS q SET
  scenario = b.scenario,
  question = b.question,
  options = b.options,
  "correctAnswer" = b."correctAnswer",
  explanation = b.explanation,
  "references" = b."references",
  "contentHash" = b."contentHash",
  active = false,
  "qaPassed" = false,
  "stepLevel" = 'step2',
  "updatedAt" = NOW()
FROM qbi_usmle_s2_v2fix_20261128_backup AS b
WHERE q.id = b.id
  AND q.source = 's2-new-20261121-hidden'
  AND q."fieldId" = 'usmle-step-2';
COMMIT;
