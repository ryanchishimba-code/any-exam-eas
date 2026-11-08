-- DRAFT. Restores rows from qbi_usmle_step2_cloneprep_20261108.
-- Run only if backup.sql has been applied and a later apply needs to be reversed.
-- Does not delete QuestionBankItem rows. Does not drop the backup table.
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
FROM qbi_usmle_step2_cloneprep_20261108 AS b
WHERE q.id = b.id;
