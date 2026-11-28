-- Restore NCLEX form links from nclex_exam_question_backup_20261128.
BEGIN;
DELETE FROM nclex_full_practice_exam_questions
WHERE "examId" IN (SELECT DISTINCT "examId" FROM nclex_exam_question_backup_20261128);
INSERT INTO nclex_full_practice_exam_questions
SELECT * FROM nclex_exam_question_backup_20261128;
UPDATE nclex_full_practice_exams e
SET "blueprintSummary" = '{"psychosocial": 8, "reduction-risk": 10, "health-promotion": 8, "safety-infection": 11, "basic-care-comfort": 8, "management-of-care": 15, "pharmacology-nursing": 13, "physiological-adaptation": 12}'::jsonb,
    "updatedAt" = now()
WHERE e.id IN (SELECT DISTINCT "examId" FROM nclex_exam_question_backup_20261128);
COMMIT;
