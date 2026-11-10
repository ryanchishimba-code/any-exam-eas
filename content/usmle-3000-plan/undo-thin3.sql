-- Restores the prior text of the three pilot items that were rewritten on 2026-11-09.
-- Snapshot: snap-rough-king-apmjs7ow (usmle-pilot-thin3-before).
-- Backup: qbi_usmle_pilot_thin3_before_20261109.
-- Restores stem, options, key, and rationale. Does not change active or qaPassed.
UPDATE "QuestionBankItem" AS q
SET
  scenario = b.scenario,
  question = b.question,
  options = b.options,
  "correctAnswer" = b."correctAnswer",
  explanation = b.explanation,
  difficulty = b.difficulty,
  "generationMeta" = b."generationMeta",
  "updatedAt" = NOW()
FROM qbi_usmle_pilot_thin3_before_20261109 AS b
WHERE q.id = b.id
  AND q.source = 'pilot-draft'
  AND q."fieldId" = b."fieldId"
  AND q."fieldId" IN ('usmle-step-1', 'usmle-step-2', 'usmle-step-3');
