-- Restores the 9 hides and 3 teaching fixes applied from quality-review batch 1.
-- Backup table: qbi_usmle_step2_batch1fix_20261108 (12 original rows).
-- Snapshot before the change: snap-dry-tree-ap9mv29h.
-- Does not delete rows.
UPDATE "QuestionBankItem" AS q
SET
  active = b.active,
  question = b.question,
  scenario = b.scenario,
  options = b.options,
  "correctAnswer" = b."correctAnswer",
  explanation = b.explanation,
  "blueprintTopic" = b."blueprintTopic",
  "blueprintDomain" = b."blueprintDomain",
  "subjectId" = b."subjectId",
  "references" = b."references",
  source = b.source,
  "updatedAt" = b."updatedAt"
FROM qbi_usmle_step2_batch1fix_20261108 AS b
WHERE q.id = b.id;
