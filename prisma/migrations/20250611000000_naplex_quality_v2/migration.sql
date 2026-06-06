-- NAPLEX 2025 quality v2: extended item types + composite filter index
-- Item types: case_based, constructed_response, drag_drop, exhibit (in addition to mcq, vignette, select_all, ordered_response)

CREATE INDEX IF NOT EXISTS "QuestionBankItem_fieldId_blueprintDomain_itemType_active_idx"
  ON "QuestionBankItem" ("fieldId", "blueprintDomain", "itemType", "active");

COMMENT ON COLUMN "QuestionBankItem"."itemType" IS
  'mcq | vignette | case_based | select_all | ordered_response | constructed_response | drag_drop | exhibit | k_type | ngn_* | case_study';

-- Seed: npx tsx scripts/generate-naplex-quality-sql.mjs
-- Then: psql $DATABASE_URL -f prisma/migrations/20250611000000_naplex_quality_v2/seed_inserts.sql
