-- Undo the 2026-11-28 source-check edits. Restores the pre-change hidden rows.
-- Does not publish anything.
BEGIN;
UPDATE "QuestionBankItem" AS q SET
  scenario = b.scenario,
  question = b.question,
  options = b.options,
  "correctAnswer" = b."correctAnswer",
  explanation = b.explanation,
  "references" = b."references",
  difficulty = b.difficulty,
  "blueprintDomain" = b."blueprintDomain",
  "blueprintTopic" = b."blueprintTopic",
  "subjectId" = b."subjectId",
  "taskCategory" = b."taskCategory",
  "contentHash" = b."contentHash",
  active = false,
  "qaPassed" = false,
  "stepLevel" = 'step2',
  "updatedAt" = NOW()
FROM qbi_usmle_s2_sourcecheck_20261128_backup AS b
WHERE q.id = b.id
  AND q.source = 's2-new-20261121-hidden'
  AND q."fieldId" = 'usmle-step-2';
COMMIT;
