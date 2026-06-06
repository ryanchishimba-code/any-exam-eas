-- USMLE 2025–2026 quality v2: step level + extended item types

ALTER TABLE "QuestionBankItem" ADD COLUMN IF NOT EXISTS "stepLevel" TEXT;

CREATE INDEX IF NOT EXISTS "QuestionBankItem_fieldId_stepLevel_active_idx"
  ON "QuestionBankItem" ("fieldId", "stepLevel", "active");

CREATE INDEX IF NOT EXISTS "QuestionBankItem_usmle_itemType_idx"
  ON "QuestionBankItem" ("fieldId", "itemType", "blueprintDomain", "active")
  WHERE "fieldId" LIKE 'usmle-%';

COMMENT ON COLUMN "QuestionBankItem"."itemType" IS
  'mcq | vignette | sequential | abstract | drug_ad | ethics | biostats | ccs_prompt | exhibit | case_based | select_all | ordered_response | ngn_*';

COMMENT ON COLUMN "QuestionBankItem"."stepLevel" IS
  'step1 | step2 | step3 — USMLE exam level when fieldId is usmle-step-*';

-- Seed: npx tsx scripts/generate-usmle-quality-sql.mjs
-- Then: psql $DATABASE_URL -f prisma/migrations/20250612000000_usmle_quality_v2/seed_inserts.sql
