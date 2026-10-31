-- Cross-device progress for the NCLEX, NAPLEX, and FNP flashcard feeds.
-- PANCE progress stays in pance_feed_progress.

CREATE TABLE "exam_feed_progress" (
    "userId" TEXT NOT NULL,
    "examSlug" TEXT NOT NULL,
    "mastered" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "reviewQueue" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "lastSeenCardId" TEXT,
    "lastSeenAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exam_feed_progress_pkey" PRIMARY KEY ("userId","examSlug")
);

ALTER TABLE "exam_feed_progress" ADD CONSTRAINT "exam_feed_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
