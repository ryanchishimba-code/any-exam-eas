-- NCLEX-NGN quality v2: scenario field stores concise vignettes for nursing items.
-- itemType values: ngn_bowtie, ngn_matrix, ngn_highlight, case_study, select_all, ordered_response, vignette

ALTER TABLE "QuestionBankItem" ADD COLUMN IF NOT EXISTS "scenario" TEXT;

CREATE INDEX IF NOT EXISTS "QuestionBankItem_nursing_ngn_idx"
  ON "QuestionBankItem" ("fieldId", "itemType", "active")
  WHERE "fieldId" = 'nursing';

-- Seed: node scripts/generate-ngn-quality-sql.mjs
-- Then: psql $DATABASE_URL -f prisma/migrations/20250610000000_nclex_ngn_quality_v2/seed_inserts.sql
