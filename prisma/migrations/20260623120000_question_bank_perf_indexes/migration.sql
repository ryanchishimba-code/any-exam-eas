-- Question bank sampling + catalog count performance (Neon Postgres)
-- Complements existing Prisma @@index declarations on QuestionBankItem.

-- Fast id-only random start (pickRandomStartId) and contiguous window scans
CREATE INDEX IF NOT EXISTS "QuestionBankItem_fieldId_active_id_idx"
  ON "QuestionBankItem" ("fieldId", "active", "id");

-- Serve-filtered field totals (countActiveQuestions, subject catalog)
CREATE INDEX IF NOT EXISTS "QuestionBankItem_fieldId_active_qaPassed_id_idx"
  ON "QuestionBankItem" ("fieldId", "active", "qaPassed", "id");

-- Curated AANP/FNP and seed-heavy sampling (source + tags filters)
CREATE INDEX IF NOT EXISTS "QuestionBankItem_fieldId_source_active_qaPassed_idx"
  ON "QuestionBankItem" ("fieldId", "source", "active", "qaPassed");

-- Topic/subject breakdowns for question-bank hub (groupBy subjectId)
CREATE INDEX IF NOT EXISTS "QuestionBankItem_fieldId_subjectId_active_qaPassed_idx"
  ON "QuestionBankItem" ("fieldId", "subjectId", "active", "qaPassed");

-- Partial index: active serve-ready rows only (smaller btree for heavy exams)
CREATE INDEX IF NOT EXISTS "QuestionBankItem_serve_ready_field_subject_idx"
  ON "QuestionBankItem" ("fieldId", "subjectId", "id")
  WHERE "active" = true AND "qaPassed" = true;
