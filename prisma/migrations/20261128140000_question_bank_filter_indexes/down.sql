-- Undo 20261128140000_question_bank_filter_indexes.
-- Drops only the four indexes that migration adds. No row data changes.
-- Do not run on production until a backup branch exists.

DROP INDEX IF EXISTS "QuestionBankItem_case_group_key_idx";
DROP INDEX IF EXISTS "QuestionBankItem_serve_topic_id_idx";
DROP INDEX IF EXISTS "QuestionBankItem_serve_subject_difficulty_id_idx";
DROP INDEX IF EXISTS "QuestionBankItem_serve_difficulty_id_idx";
