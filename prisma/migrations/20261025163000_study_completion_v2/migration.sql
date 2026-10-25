-- Study completion meter v2: Quick Bite watch progress and per-chapter study guide progress.
-- Ship with the draft PR only. Do not apply to production until this migration is reviewed and approved.

CREATE TABLE "sg_chapter_progress" (
    "userId" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "scrollPct" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "verifiedSeconds" INTEGER NOT NULL DEFAULT 0,
    "lastReadAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sg_chapter_progress_pkey" PRIMARY KEY ("userId","chapterId")
);

CREATE TABLE "quick_bite_progress" (
    "userId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "watchPct" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "watchSeconds" INTEGER NOT NULL DEFAULT 0,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quick_bite_progress_pkey" PRIMARY KEY ("userId","slug")
);

CREATE INDEX "sg_chapter_progress_userId_lastReadAt_idx" ON "sg_chapter_progress"("userId", "lastReadAt");

CREATE INDEX "quick_bite_progress_userId_updatedAt_idx" ON "quick_bite_progress"("userId", "updatedAt");

ALTER TABLE "sg_chapter_progress" ADD CONSTRAINT "sg_chapter_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "sg_chapter_progress" ADD CONSTRAINT "sg_chapter_progress_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "sg_chapters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "quick_bite_progress" ADD CONSTRAINT "quick_bite_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
