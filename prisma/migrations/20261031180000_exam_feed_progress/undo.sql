-- Undo 20261031180000_exam_feed_progress.
-- Drops only the table that migration added, then removes its Prisma history row.
-- Does not change any other table.

ALTER TABLE "exam_feed_progress" DROP CONSTRAINT IF EXISTS "exam_feed_progress_userId_fkey";
DROP TABLE IF EXISTS "exam_feed_progress";
DELETE FROM "_prisma_migrations" WHERE "migration_name" = '20261031180000_exam_feed_progress';
