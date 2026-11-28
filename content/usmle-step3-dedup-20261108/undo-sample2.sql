-- Restores the two COPD repairs and four hides from the second Step 3 sample.
-- The anxiety row was backed up and was not changed.
-- Backup table: qbi_usmle_step3_sample2fix_20261109 (7 original rows).
-- Snapshot before the change: snap-sparkling-bonus-ap4elo3m.
-- Does not delete rows.
UPDATE "QuestionBankItem" AS q
SET
  active = b.active,
  question = b.question,
  scenario = b.scenario,
  options = b.options,
  "correctAnswer" = b."correctAnswer",
  explanation = b.explanation,
  "references" = b."references",
  source = b.source,
  "updatedAt" = b."updatedAt"
FROM qbi_usmle_step3_sample2fix_20261109 AS b
WHERE q.id = b.id;
