-- Question Bank Curation Engine — pgvector embeddings + curation metadata
CREATE EXTENSION IF NOT EXISTS vector;

ALTER TABLE "QuestionBankItem"
  ADD COLUMN IF NOT EXISTS "embedding" vector(3072),
  ADD COLUMN IF NOT EXISTS "quality_score" DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS "cluster_id" TEXT,
  ADD COLUMN IF NOT EXISTS "keep_recommendation" BOOLEAN,
  ADD COLUMN IF NOT EXISTS "review_flag" BOOLEAN,
  ADD COLUMN IF NOT EXISTS "curation_meta" JSONB;

CREATE INDEX IF NOT EXISTS "QuestionBankItem_cluster_id_idx"
  ON "QuestionBankItem" ("cluster_id");

CREATE INDEX IF NOT EXISTS "QuestionBankItem_curation_field_idx"
  ON "QuestionBankItem" ("fieldId", "keep_recommendation", "quality_score");
