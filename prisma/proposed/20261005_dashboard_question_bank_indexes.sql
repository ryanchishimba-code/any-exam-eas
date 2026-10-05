-- PROPOSED ONLY. Do not move this file into prisma/migrations.
-- Production deploy runs `prisma migrate deploy` and would apply anything there.
-- Ryan applies these by hand, outside a transaction, after reviewing:
--
--   psql "$DIRECT_URL" -f prisma/proposed/20261005_dashboard_question_bank_indexes.sql
--
-- CONCURRENTLY cannot run inside Prisma's migration transaction. These are
-- additive. They do not change rows, keys, or published counts.
--
-- QuestionAttempt (userId, fieldId, createdAt) already exists. The dashboard
-- 30-day aggregate also reads "correct", so the current index still heap-fetches
-- that column. This covering index lets that aggregate finish from the index.
--
-- QuestionMastery (userId, fieldId, nextDue) already exists. The spaced-review
-- weak count also filters abilityEstimate. The extra column avoids that heap fetch.

CREATE INDEX CONCURRENTLY IF NOT EXISTS "QuestionAttempt_userId_fieldId_createdAt_correct_idx"
  ON "QuestionAttempt" ("userId", "fieldId", "createdAt", "correct");

CREATE INDEX CONCURRENTLY IF NOT EXISTS "QuestionMastery_userId_fieldId_nextDue_abilityEstimate_idx"
  ON "QuestionMastery" ("userId", "fieldId", "nextDue", "abilityEstimate");
