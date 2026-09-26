-- Drops ONLY the NGN pilot objects.
-- Does not touch QuestionBankItem or any other existing table.

DROP TABLE IF EXISTS ngn_item_review, ngn_item, ngn_case, ngn_import_batch;

DROP FUNCTION IF EXISTS ngn_item_review_append_only();
DROP FUNCTION IF EXISTS "canPublish"(text, integer);
