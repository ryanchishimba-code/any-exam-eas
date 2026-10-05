-- PROPOSED ONLY. Do not move this file into prisma/migrations.
-- Production deploy runs `prisma migrate deploy` and would apply anything there.
-- Ryan applies these by hand, outside a transaction, on the direct Neon host
-- (not the pooler), after reviewing:
--
--   psql "$DIRECT_URL" -f prisma/proposed/20261005_dashboard_question_bank_indexes.sql
--
-- CONCURRENTLY cannot run inside Prisma's migration transaction. These are
-- additive. They do not change rows, keys, or published counts.
--
-- Tested 2026-10-05 on Neon branch br-sweet-art-apwovmo9, a copy of production
-- branch br-super-frog-apuqj2ol (project lively-silence-56893462). Not applied
-- to production. The branch was left without these indexes after the rollback
-- proof below.
--
-- Volume on that copy: 1,636 QuestionAttempt rows, 646 QuestionMastery rows.
-- Heaviest learner: 909 attempts, 382 of them on field "nursing", 41 mastery
-- rows. Warm EXPLAIN (ANALYZE, BUFFERS), median of runs 2-5:
--   dashboard 30-day aggregate: 0.16 ms Index Scan on
--     QuestionAttempt_userId_fieldId_createdAt_idx, then 0.17 ms Index Only
--     Scan on the new index (3 heap fetches). After DROP, back to the old scan.
--   spaced-review counts: 0.40 ms bitmap on
--     QuestionMastery_userId_fieldId_nextDue_idx (47 index rows, 41 heap
--     rows), then 0.39 ms bitmap on the new index (41 index rows). After
--     DROP, back to the old index.
--   question-bank attempt list for that learner: seq scan, about 0.49 ms
--     before and 0.51 ms after. The selected columns are not covered.
--   question-bank catalog count (usmle-step-3, 8,678 active qaPassed rows):
--     Index Only Scan on QuestionBankItem_fieldId_active_qaPassed_idx,
--     1.57 ms before and after. These two indexes do not touch that table.
-- At today's volume the new indexes do not make the pages faster. They keep
-- the aggregate on an index-only plan as attempt history grows.
--
-- Non-blocking: while an uncommitted UPDATE held a row, CREATE INDEX
-- CONCURRENTLY on QuestionAttempt waited in phase "waiting for writers
-- before build" holding ShareUpdateExclusiveLock. It did not take
-- AccessExclusiveLock. A concurrent SELECT count and a second UPDATE both
-- finished inside a 3 second lock_timeout. The second UPDATE was rolled back.
-- The same CONCURRENTLY form is used for the mastery index.
--
-- Backup: no row rewrite, so no backup table. The branch copy is the test
-- backup. Production is unchanged.
-- Rollback, on the direct host, outside a transaction:
--   DROP INDEX CONCURRENTLY IF EXISTS "QuestionAttempt_userId_fieldId_createdAt_correct_idx";
--   DROP INDEX CONCURRENTLY IF EXISTS "QuestionMastery_userId_fieldId_nextDue_abilityEstimate_idx";
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
