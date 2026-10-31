-- Cross-device progress for the paid PANCE flashcard feed.
-- Apply on the Neon preview branch only until the owner approves production.

CREATE TABLE "pance_feed_progress" (
    "userId" TEXT NOT NULL,
    "mastered" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "reviewQueue" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "lastSeenCardId" TEXT,
    "lastSeenAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pance_feed_progress_pkey" PRIMARY KEY ("userId")
);

ALTER TABLE "pance_feed_progress" ADD CONSTRAINT "pance_feed_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
