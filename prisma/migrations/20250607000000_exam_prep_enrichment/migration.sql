-- Exam prep enrichment: difficulty, blueprint domains, item types, references.
-- Reflects 2015–2026 trends: clinical judgment, NGN formats, NAPLEX 2025 domains, MPJE/UMPJE.

ALTER TABLE "QuestionBankItem"
  ADD COLUMN IF NOT EXISTS "difficulty" SMALLINT,
  ADD COLUMN IF NOT EXISTS "topicCategory" TEXT,
  ADD COLUMN IF NOT EXISTS "blueprintDomain" TEXT,
  ADD COLUMN IF NOT EXISTS "itemType" TEXT NOT NULL DEFAULT 'mcq',
  ADD COLUMN IF NOT EXISTS "references" JSONB;

CREATE INDEX IF NOT EXISTS "QuestionBankItem_fieldId_difficulty_active_idx"
  ON "QuestionBankItem" ("fieldId", "difficulty", "active");

CREATE INDEX IF NOT EXISTS "QuestionBankItem_fieldId_topicCategory_active_idx"
  ON "QuestionBankItem" ("fieldId", "topicCategory", "active");

CREATE INDEX IF NOT EXISTS "QuestionBankItem_fieldId_blueprintDomain_active_idx"
  ON "QuestionBankItem" ("fieldId", "blueprintDomain", "active");

CREATE INDEX IF NOT EXISTS "QuestionBankItem_fieldId_itemType_active_idx"
  ON "QuestionBankItem" ("fieldId", "itemType", "active");

-- Backfill MPJE metadata on existing rows (idempotent via tags/content).
UPDATE "QuestionBankItem"
SET
  "topicCategory" = COALESCE("topicCategory", "subjectId"),
  "blueprintDomain" = COALESCE("blueprintDomain", 'mpje-jurisprudence'),
  "difficulty" = COALESCE("difficulty", 3),
  "itemType" = COALESCE(NULLIF("itemType", ''), 'mcq')
WHERE "fieldId" = 'mpje';

UPDATE "QuestionBankItem"
SET "difficulty" = 2
WHERE "fieldId" = 'mpje'
  AND "subjectId" IN ('pharmacy-ethics', 'patient-privacy');

UPDATE "QuestionBankItem"
SET "difficulty" = 4
WHERE "fieldId" = 'mpje'
  AND "subjectId" IN ('controlled-substances', 'compounding-regulations', 'state-practice-act', 'federal-pharmacy-law');
