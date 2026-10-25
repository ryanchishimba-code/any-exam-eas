-- Server-verified study engagement (daily aggregates + heartbeat meta).
-- PR #290 only — do not apply to production until reviewed.

CREATE TABLE "study_engagement_daily" (
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "surface" TEXT NOT NULL,
    "activeSeconds" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "study_engagement_daily_pkey" PRIMARY KEY ("userId","date","surface")
);

CREATE TABLE "study_engagement_heartbeat_meta" (
    "userId" TEXT NOT NULL,
    "lastAcceptedAt" TIMESTAMP(3),
    "ignoredTooFastCount" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "study_engagement_heartbeat_meta_pkey" PRIMARY KEY ("userId")
);

CREATE INDEX "study_engagement_daily_userId_date_idx" ON "study_engagement_daily"("userId", "date");

ALTER TABLE "study_engagement_daily" ADD CONSTRAINT "study_engagement_daily_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "study_engagement_heartbeat_meta" ADD CONSTRAINT "study_engagement_heartbeat_meta_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
