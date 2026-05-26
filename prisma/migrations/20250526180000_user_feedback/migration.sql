-- User feedback submissions for public form + internal inbox
CREATE TABLE "UserFeedback" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "category" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "userId" TEXT,
    "ipHash" TEXT,
    "userAgent" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "resolvedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "UserFeedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "UserFeedback_resolvedById_fkey" FOREIGN KEY ("resolvedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX "UserFeedback_category_createdAt_idx" ON "UserFeedback"("category", "createdAt");
CREATE INDEX "UserFeedback_status_createdAt_idx" ON "UserFeedback"("status", "createdAt");
CREATE INDEX "UserFeedback_rating_idx" ON "UserFeedback"("rating");
CREATE INDEX "UserFeedback_createdAt_idx" ON "UserFeedback"("createdAt");
