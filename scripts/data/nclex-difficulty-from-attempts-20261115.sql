-- Recalibrate NCLEX difficulty tags from saved attempts.
-- DRY RUN ONLY. Do not apply without Ryan's OK.
-- A tag moves only when at least 20 scored attempts exist.
-- 75%+ correct -> 2, 45–74% -> 3, below 45% -> 5.
-- Items without that history keep their stored tag.

-- 1. Preview
WITH observed AS (
  SELECT "bankItemId" AS id,
         COUNT(*)::int AS attempts,
         SUM(CASE WHEN correct THEN 1 ELSE 0 END)::int AS correct
  FROM "QuestionAttempt"
  WHERE "fieldId" = 'nursing'
    AND "bankItemId" IS NOT NULL
    AND "bankItemId" NOT LIKE 'ngn:%'
  GROUP BY 1
  HAVING COUNT(*) >= 20
)
SELECT q.id,
       q.difficulty AS stored,
       o.attempts,
       ROUND(100.0 * o.correct / o.attempts) AS pct_correct,
       CASE
         WHEN o.correct::float / o.attempts >= 0.75 THEN 2
         WHEN o.correct::float / o.attempts >= 0.45 THEN 3
         ELSE 5
       END AS proposed
FROM "QuestionBankItem" q
JOIN observed o ON o.id = q.id
WHERE q."fieldId" = 'nursing'
  AND q.active = true
  AND q."qaPassed" = true
  AND q.difficulty IS DISTINCT FROM CASE
    WHEN o.correct::float / o.attempts >= 0.75 THEN 2
    WHEN o.correct::float / o.attempts >= 0.45 THEN 3
    ELSE 5
  END
ORDER BY o.attempts DESC
LIMIT 50;

-- 2. Backup (run only after reviewing the preview)
-- CREATE TABLE backup_nclex_difficulty_20261115 AS
-- SELECT q.id, q.difficulty, q."updatedAt"
-- FROM "QuestionBankItem" q
-- JOIN (
--   SELECT "bankItemId" AS id
--   FROM "QuestionAttempt"
--   WHERE "fieldId" = 'nursing' AND "bankItemId" IS NOT NULL AND "bankItemId" NOT LIKE 'ngn:%'
--   GROUP BY 1
--   HAVING COUNT(*) >= 20
-- ) o ON o.id = q.id
-- WHERE q."fieldId" = 'nursing';

-- 3. Update (NOT APPLIED)
-- UPDATE "QuestionBankItem" q
-- SET difficulty = CASE
--       WHEN o.correct::float / o.attempts >= 0.75 THEN 2
--       WHEN o.correct::float / o.attempts >= 0.45 THEN 3
--       ELSE 5
--     END,
--     "updatedAt" = NOW()
-- FROM (
--   SELECT "bankItemId" AS id,
--          COUNT(*)::float AS attempts,
--          SUM(CASE WHEN correct THEN 1 ELSE 0 END)::float AS correct
--   FROM "QuestionAttempt"
--   WHERE "fieldId" = 'nursing'
--     AND "bankItemId" IS NOT NULL
--     AND "bankItemId" NOT LIKE 'ngn:%'
--   GROUP BY 1
--   HAVING COUNT(*) >= 20
-- ) o
-- WHERE q.id = o.id
--   AND q."fieldId" = 'nursing';

-- 4. Undo
-- UPDATE "QuestionBankItem" q
-- SET difficulty = b.difficulty,
--     "updatedAt" = b."updatedAt"
-- FROM backup_nclex_difficulty_20261115 b
-- WHERE q.id = b.id;
