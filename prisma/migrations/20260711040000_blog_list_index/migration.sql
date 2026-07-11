-- Speeds public blog list/detail filters (deletedAt + published + publishedAt).
CREATE INDEX IF NOT EXISTS "BlogPost_deletedAt_published_publishedAt_idx"
ON "BlogPost"("deletedAt", "published", "publishedAt");
