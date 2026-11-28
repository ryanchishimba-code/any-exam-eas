-- Undo. Same statements as the migration down file.
-- Do not run on production until the backup snapshot is stored.

DROP INDEX IF EXISTS "QuestionBankItem_case_group_key_idx";
DROP INDEX IF EXISTS "QuestionBankItem_serve_topic_id_idx";
DROP INDEX IF EXISTS "QuestionBankItem_serve_subject_difficulty_id_idx";
DROP INDEX IF EXISTS "QuestionBankItem_serve_difficulty_id_idx";
