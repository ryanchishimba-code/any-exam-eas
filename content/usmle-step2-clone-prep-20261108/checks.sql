-- SELECT only. Safe to run before any draft SQL.
-- Student-facing Step 2 gate used by question-bank-db.ts, exam-options.ts,
-- active-inventory, live-board-counts, and served-bank-stats-cache.ts.
-- Blank stepLevel is included. stepLevel = 'step3' is excluded.
SELECT
  COUNT(*) FILTER (
    WHERE active AND "qaPassed" AND ("stepLevel" IS NULL OR "stepLevel" <> 'step3')
  ) AS student_route_includes_blank_step,
  COUNT(*) FILTER (
    WHERE active AND "qaPassed" AND "stepLevel" = 'step2'
  ) AS step_level_exactly_step2,
  COUNT(*) FILTER (
    WHERE active AND "qaPassed" AND ("stepLevel" IS NULL OR btrim("stepLevel") = '')
  ) AS blank_step_level
FROM "QuestionBankItem"
WHERE "fieldId" = 'usmle-step-2';
