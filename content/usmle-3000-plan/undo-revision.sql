-- Restores the pre-revision text of the 60 hidden USMLE pilot rows.
-- Snapshot before the revision: snap-shiny-term-apgcr5qz (usmle-pilot-60-revise-20261109-before).
-- Backup table: qbi_usmle_pilot_60_text_before_20261109.
-- Restores stem, options, key, and rationale only. Leaves every row inactive.
UPDATE "QuestionBankItem" AS q
SET
  scenario = b.scenario,
  question = b.question,
  options = b.options,
  "correctAnswer" = b."correctAnswer",
  explanation = b.explanation,
  difficulty = b.difficulty,
  "references" = b."references",
  "generationMeta" = b."generationMeta",
  active = false,
  "qaPassed" = false,
  "updatedAt" = NOW()
FROM qbi_usmle_pilot_60_text_before_20261109 AS b
WHERE q.id = b.id
  AND q.source = 'pilot-draft'
  AND q."fieldId" = b."fieldId"
  AND q."fieldId" IN ('usmle-step-1', 'usmle-step-2', 'usmle-step-3')
  AND b.active = false
  AND b."qaPassed" = false;
