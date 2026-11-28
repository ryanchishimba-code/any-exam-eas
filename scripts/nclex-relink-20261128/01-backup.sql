-- Backup of NCLEX form links before the 2026-11-28 relink.
-- Read-only until the apply script creates the restore table.
CREATE TABLE IF NOT EXISTS nclex_exam_question_backup_20261128 AS
SELECT l.*
FROM nclex_full_practice_exam_questions l
JOIN nclex_full_practice_exams e ON e.id = l."examId"
WHERE e.active AND e."questionCount" = 85
  AND e."examNumber" BETWEEN 1 AND 43;
