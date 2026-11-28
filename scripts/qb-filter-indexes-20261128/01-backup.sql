-- Backup snapshot before QuestionBankItem filter indexes.
-- Read-only. Run against the target branch and keep the result with the change ticket.
-- No row data is copied: these indexes do not rewrite question text.

SELECT indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename = 'QuestionBankItem'
  AND indexname IN (
    'QuestionBankItem_serve_difficulty_id_idx',
    'QuestionBankItem_serve_subject_difficulty_id_idx',
    'QuestionBankItem_serve_topic_id_idx',
    'QuestionBankItem_case_group_key_idx'
  )
ORDER BY indexname;
