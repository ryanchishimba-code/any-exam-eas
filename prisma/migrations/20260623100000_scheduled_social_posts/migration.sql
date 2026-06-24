-- Outbound brand posts to publish/schedule to external channels (Phase 2).
-- Timing is driven by our own cron (/api/cron/social-publish) so scheduling
-- works regardless of the publishing provider's native scheduler.

CREATE TABLE "scheduled_social_posts" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "platforms" TEXT NOT NULL,
    "media_urls" TEXT,
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "scheduled_at" TIMESTAMP(3),
    "published_at" TIMESTAMP(3),
    "external_ref" TEXT,
    "error" TEXT,
    "created_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scheduled_social_posts_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "scheduled_social_posts_status_scheduled_at_idx" ON "scheduled_social_posts"("status", "scheduled_at");
CREATE INDEX "scheduled_social_posts_created_at_idx" ON "scheduled_social_posts"("created_at");
