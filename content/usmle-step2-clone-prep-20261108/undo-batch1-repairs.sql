-- Restores the 5 repairs and 3 hides applied after the 87-item source check.
-- Backup table: qbi_usmle_step2_batch1repair_20261108 (8 original rows).
-- Snapshot before the change: snap-jolly-dew-ap8mb6gg.
-- Does not delete rows. Does not touch 1913c60e-caa5-4343-a0be-bb0c19e1a9d4.
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
FROM qbi_usmle_step2_batch1repair_20261108 AS b
WHERE q.id = b.id;
