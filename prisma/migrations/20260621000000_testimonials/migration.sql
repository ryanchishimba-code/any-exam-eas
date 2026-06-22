-- Admin-managed marketing testimonials with moderation + soft-delete (undo) support.
-- Only rows with status = 'approved' AND "deletedAt" IS NULL are surfaced publicly.
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "exam" TEXT NOT NULL,
    "quote" TEXT NOT NULL,
    "longQuote" TEXT,
    "outcome" TEXT,
    "detail" TEXT,
    "initials" TEXT,
    "photoUrl" TEXT,
    "avatarGradient" TEXT,
    "rating" SMALLINT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "deletedAt" TIMESTAMP(3),
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Testimonial_status_deletedAt_sortOrder_idx" ON "Testimonial"("status", "deletedAt", "sortOrder");
CREATE INDEX "Testimonial_deletedAt_createdAt_idx" ON "Testimonial"("deletedAt", "createdAt");
