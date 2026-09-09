-- Hot-path indexes for dashboard and question-bank sampling.
--
-- ProgressRecord had no index of any kind, so the dashboard's "recent completed
-- exams" read scanned and sorted the whole table on every load.
--
-- QuestionBankItem already covers the serve gate (fieldId, active, qaPassed) but
-- the random-sample id probes order by id after filtering, which forced a sort
-- over every matching row in the field. Appending id makes those ordered scans.
--
-- CONCURRENTLY is deliberately omitted: Prisma runs migrations inside a
-- transaction, which Postgres forbids for concurrent index builds. These tables
-- are small enough that the brief write lock is acceptable.

CREATE INDEX IF NOT EXISTS "ProgressRecord_userId_entityType_completed_createdAt_idx"
  ON "ProgressRecord" ("userId", "entityType", "completed", "createdAt");

CREATE INDEX IF NOT EXISTS "QuestionBankItem_fieldId_active_qaPassed_id_idx"
  ON "QuestionBankItem" ("fieldId", "active", "qaPassed", "id");

CREATE INDEX IF NOT EXISTS "QuestionBankItem_fieldId_subjectId_active_qaPassed_id_idx"
  ON "QuestionBankItem" ("fieldId", "subjectId", "active", "qaPassed", "id");
