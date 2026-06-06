-- MPJE quality v2: scenario vignettes + k_type item support
ALTER TABLE "QuestionBankItem" ADD COLUMN IF NOT EXISTS "scenario" TEXT;

CREATE INDEX IF NOT EXISTS "QuestionBankItem_fieldId_itemType_active_idx"
  ON "QuestionBankItem" ("fieldId", "itemType", "active");

-- Seed data: run `node scripts/generate-mpje-quality-sql.mjs` then:
--   psql $DATABASE_URL -f prisma/migrations/20250609000000_mpje_quality_v2/seed_inserts.sql
-- Or sync automatically via ensureStaticSeedsForField('mpje') on first MPJE practice request.
