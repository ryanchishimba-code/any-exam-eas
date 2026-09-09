-- Give study guides an exam discriminator.
--
-- `examTrack` only ever meant NCLEX's rn/pn split, so a second exam's book had
-- no way to identify itself. That is a safety problem as well as a modelling
-- one: the ingest script deletes every chapter of a guide not seen in the
-- current run, so a NAPLEX ingest pointed at the NCLEX guide id would delete
-- the NCLEX book.
--
-- The DEFAULT backfills the existing NCLEX row, so this is safe to apply to a
-- populated table with no separate backfill step.
ALTER TABLE "sg_guides" ADD COLUMN "examSlug" TEXT NOT NULL DEFAULT 'nclex';

-- Not unique on purpose: `edition`/`version` and the publishedAt ordering in
-- getPublishedGuide are there so a draft can coexist with a published guide.
CREATE INDEX "sg_guides_examSlug_examTrack_idx" ON "sg_guides"("examSlug", "examTrack");
