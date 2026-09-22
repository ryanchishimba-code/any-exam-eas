-- One row per user + session + question so a retried session end cannot
-- double-count analytics. Nullable sessionId stays unrestricted (Postgres
-- treats NULLs as distinct), which preserves legacy attempts that had no session.

DELETE FROM "QuestionAttempt" AS newer
WHERE newer."sessionId" IS NOT NULL
  AND EXISTS (
    SELECT 1
    FROM "QuestionAttempt" AS older
    WHERE older."userId" = newer."userId"
      AND older."sessionId" = newer."sessionId"
      AND older."questionKey" = newer."questionKey"
      AND older."id" <> newer."id"
      AND (
        older."createdAt" < newer."createdAt"
        OR (older."createdAt" = newer."createdAt" AND older."id" < newer."id")
      )
  );

CREATE UNIQUE INDEX "QuestionAttempt_userId_sessionId_questionKey_key"
ON "QuestionAttempt"("userId", "sessionId", "questionKey");
