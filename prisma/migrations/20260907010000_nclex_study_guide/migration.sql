-- NCLEX Study Guide reader tables (book/PDF surface — not QBank)

CREATE TABLE IF NOT EXISTS "sg_guides" (
  "id" TEXT NOT NULL,
  "examTrack" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "edition" TEXT NOT NULL DEFAULT '1',
  "version" TEXT NOT NULL DEFAULT '0.1.0',
  "publishedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "sg_guides_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "sg_guides_examTrack_idx" ON "sg_guides"("examTrack");

CREATE TABLE IF NOT EXISTS "sg_chapters" (
  "id" TEXT NOT NULL,
  "guideId" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "sortOrder" INTEGER NOT NULL,
  "title" TEXT NOT NULL,
  "sectionLabel" TEXT NOT NULL DEFAULT '',
  "estimatedMinutes" INTEGER NOT NULL DEFAULT 5,
  "bodyMd" TEXT NOT NULL DEFAULT '',
  "bodyHtml" TEXT NOT NULL DEFAULT '',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "sg_chapters_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "sg_chapters_guideId_slug_key" ON "sg_chapters"("guideId", "slug");
CREATE INDEX IF NOT EXISTS "sg_chapters_guideId_sortOrder_idx" ON "sg_chapters"("guideId", "sortOrder");

DO $$ BEGIN
  ALTER TABLE "sg_chapters"
    ADD CONSTRAINT "sg_chapters_guideId_fkey"
    FOREIGN KEY ("guideId") REFERENCES "sg_guides"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "sg_highlights" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "chapterId" TEXT NOT NULL,
  "startOffset" INTEGER NOT NULL,
  "endOffset" INTEGER NOT NULL,
  "selectedText" TEXT NOT NULL,
  "color" TEXT NOT NULL DEFAULT 'yellow',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "sg_highlights_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "sg_highlights_userId_chapterId_startOffset_endOffset_key"
  ON "sg_highlights"("userId", "chapterId", "startOffset", "endOffset");
CREATE INDEX IF NOT EXISTS "sg_highlights_userId_chapterId_idx" ON "sg_highlights"("userId", "chapterId");

DO $$ BEGIN
  ALTER TABLE "sg_highlights"
    ADD CONSTRAINT "sg_highlights_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "sg_highlights"
    ADD CONSTRAINT "sg_highlights_chapterId_fkey"
    FOREIGN KEY ("chapterId") REFERENCES "sg_chapters"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "sg_bookmarks" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "chapterId" TEXT NOT NULL,
  "anchorId" TEXT NOT NULL,
  "label" TEXT NOT NULL DEFAULT '',
  "scrollPct" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "sg_bookmarks_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "sg_bookmarks_userId_chapterId_anchorId_key"
  ON "sg_bookmarks"("userId", "chapterId", "anchorId");
CREATE INDEX IF NOT EXISTS "sg_bookmarks_userId_chapterId_idx" ON "sg_bookmarks"("userId", "chapterId");

DO $$ BEGIN
  ALTER TABLE "sg_bookmarks"
    ADD CONSTRAINT "sg_bookmarks_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "sg_bookmarks"
    ADD CONSTRAINT "sg_bookmarks_chapterId_fkey"
    FOREIGN KEY ("chapterId") REFERENCES "sg_chapters"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "sg_notes" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "chapterId" TEXT NOT NULL,
  "highlightId" TEXT,
  "body" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "sg_notes_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "sg_notes_userId_chapterId_idx" ON "sg_notes"("userId", "chapterId");

DO $$ BEGIN
  ALTER TABLE "sg_notes"
    ADD CONSTRAINT "sg_notes_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "sg_notes"
    ADD CONSTRAINT "sg_notes_chapterId_fkey"
    FOREIGN KEY ("chapterId") REFERENCES "sg_chapters"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "sg_notes"
    ADD CONSTRAINT "sg_notes_highlightId_fkey"
    FOREIGN KEY ("highlightId") REFERENCES "sg_highlights"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "sg_reading_progress" (
  "userId" TEXT NOT NULL,
  "guideId" TEXT NOT NULL,
  "chapterId" TEXT NOT NULL,
  "scrollPct" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "lastReadAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "sg_reading_progress_pkey" PRIMARY KEY ("userId", "guideId")
);

CREATE INDEX IF NOT EXISTS "sg_reading_progress_userId_chapterId_idx"
  ON "sg_reading_progress"("userId", "chapterId");

DO $$ BEGIN
  ALTER TABLE "sg_reading_progress"
    ADD CONSTRAINT "sg_reading_progress_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "sg_reading_progress"
    ADD CONSTRAINT "sg_reading_progress_guideId_fkey"
    FOREIGN KEY ("guideId") REFERENCES "sg_guides"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "sg_reading_progress"
    ADD CONSTRAINT "sg_reading_progress_chapterId_fkey"
    FOREIGN KEY ("chapterId") REFERENCES "sg_chapters"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Seed one placeholder guide + chapter so the reader renders (no clinical content).
INSERT INTO "sg_guides" ("id", "examTrack", "title", "edition", "version", "publishedAt", "createdAt", "updatedAt")
VALUES (
  'sg_guide_nclex_rn_placeholder',
  'rn',
  'NCLEX-RN Study Guide',
  '1',
  '0.1.0-placeholder',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "sg_chapters" (
  "id", "guideId", "slug", "sortOrder", "title", "sectionLabel",
  "estimatedMinutes", "bodyMd", "bodyHtml", "createdAt", "updatedAt"
)
VALUES (
  'sg_chapter_manuscript_pending',
  'sg_guide_nclex_rn_placeholder',
  'manuscript-pending',
  1,
  'Manuscript pending',
  'Placeholder',
  5,
  E'# Manuscript pending\n\n## Chapter title pending\n\nBody pending.\n\nPaste the full manuscript into `/content/nclex-study-guide/` and run the ingest script.\n',
  E'<h1 id="manuscript-pending">Manuscript pending</h1><h2 id="chapter-title-pending">Chapter title pending</h2><p>Body pending.</p><p>Paste the full manuscript into <code>/content/nclex-study-guide/</code> and run the ingest script.</p>',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT ("id") DO NOTHING;
