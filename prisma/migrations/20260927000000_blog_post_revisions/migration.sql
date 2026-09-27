-- Snapshots written by scripts/upgrade-blog-posts.ts before a post is replaced.
CREATE TABLE "blog_post_revisions" (
    "id" TEXT NOT NULL,
    "blogPostId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "snapshot" JSONB NOT NULL,
    "reason" TEXT NOT NULL DEFAULT 'pre-upgrade',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blog_post_revisions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "blog_post_revisions_slug_createdAt_idx" ON "blog_post_revisions"("slug", "createdAt");

CREATE INDEX "blog_post_revisions_blogPostId_createdAt_idx" ON "blog_post_revisions"("blogPostId", "createdAt");

ALTER TABLE "blog_post_revisions" ADD CONSTRAINT "blog_post_revisions_blogPostId_fkey" FOREIGN KEY ("blogPostId") REFERENCES "BlogPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
