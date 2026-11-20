-- Restores the four Step 3 repairs and the PPV hide applied after the clone cleanup.
-- Backup table: qbi_usmle_step3_repair_20261108 (5 original rows).
-- Snapshot before the change: snap-soft-dust-appo6wq8.
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
FROM qbi_usmle_step3_repair_20261108 AS b
WHERE q.id = b.id;
