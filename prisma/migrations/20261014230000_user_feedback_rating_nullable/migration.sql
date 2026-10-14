-- A missing contact rating was stored as 0 because this column was NOT NULL.
-- Make it nullable and turn those sentinels into NULL so averages skip them.
-- Existing 1–5 scores stay. The rating index stays.

ALTER TABLE "UserFeedback" ALTER COLUMN "rating" DROP NOT NULL;

UPDATE "UserFeedback"
SET "rating" = NULL
WHERE "rating" = 0;
