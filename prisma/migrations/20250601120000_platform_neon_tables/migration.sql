-- Platform tables: promo codes, exam sessions, AI content, flashcards, topics, textbooks
-- Run: npx prisma migrate deploy (or db push in dev)

ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "clerkId" TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS "User_clerkId_key" ON "User"("clerkId");

ALTER TABLE "Subscription" ADD COLUMN IF NOT EXISTS "plan" TEXT;

CREATE TABLE IF NOT EXISTS "PromoCode" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "discountPercent" INTEGER,
    "discountAmount" DOUBLE PRECISION,
    "expiryDate" TIMESTAMP(3),
    "maxUses" INTEGER,
    "currentUses" INTEGER NOT NULL DEFAULT 0,
    "stripeCouponId" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "PromoCode_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "PromoCode_code_key" ON "PromoCode"("code");

CREATE TABLE IF NOT EXISTS "PromoRedemption" (
    "id" TEXT NOT NULL,
    "promoCodeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PromoRedemption_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "PromoRedemption_promoCodeId_fkey" FOREIGN KEY ("promoCodeId") REFERENCES "PromoCode"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PromoRedemption_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "PromoRedemption_promoCodeId_userId_key" ON "PromoRedemption"("promoCodeId", "userId");
CREATE INDEX IF NOT EXISTS "PromoRedemption_userId_idx" ON "PromoRedemption"("userId");

CREATE TABLE IF NOT EXISTS "exam_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "examType" TEXT NOT NULL,
    "fieldId" TEXT,
    "title" TEXT,
    "status" TEXT NOT NULL DEFAULT 'in_progress',
    "score" DOUBLE PRECISION,
    "weakAreas" JSONB,
    "answers" JSONB NOT NULL DEFAULT '[]',
    "analysis" JSONB,
    "questionCount" INTEGER NOT NULL DEFAULT 0,
    "timeLimitSec" INTEGER,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "exam_sessions_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "exam_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "exam_sessions_userId_examType_createdAt_idx" ON "exam_sessions"("userId", "examType", "createdAt");

CREATE TABLE IF NOT EXISTS "generated_questions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "examType" TEXT NOT NULL,
    "topic" TEXT,
    "questionText" TEXT NOT NULL,
    "options" JSONB NOT NULL,
    "answer" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "source" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "generated_questions_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "generated_questions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "generated_questions_userId_examType_createdAt_idx" ON "generated_questions"("userId", "examType", "createdAt");

CREATE TABLE IF NOT EXISTS "flashcards" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "examType" TEXT NOT NULL,
    "front" TEXT NOT NULL,
    "back" TEXT NOT NULL,
    "topic" TEXT,
    "dueDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "interval" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "easeFactor" DOUBLE PRECISION NOT NULL DEFAULT 2.5,
    "repetitions" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "flashcards_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "flashcards_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "flashcards_userId_examType_dueDate_idx" ON "flashcards"("userId", "examType", "dueDate");

CREATE TABLE IF NOT EXISTS "exam_topics" (
    "id" TEXT NOT NULL,
    "examType" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "parentSlug" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "exam_topics_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "exam_topics_examType_slug_key" ON "exam_topics"("examType", "slug");
CREATE INDEX IF NOT EXISTS "exam_topics_examType_sortOrder_idx" ON "exam_topics"("examType", "sortOrder");

CREATE TABLE IF NOT EXISTS "textbook_uploads" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "examType" TEXT,
    "title" TEXT NOT NULL,
    "blobUrl" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL DEFAULT 'application/pdf',
    "pageCount" INTEGER,
    "chunkCount" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'processing',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "textbook_uploads_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "textbook_uploads_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "textbook_uploads_userId_createdAt_idx" ON "textbook_uploads"("userId", "createdAt");

-- Seed default promo codes (idempotent)
INSERT INTO "PromoCode" ("id", "code", "discountPercent", "maxUses", "currentUses", "active", "updatedAt")
VALUES
  ('promo_welcome10', 'WELCOME10', 10, NULL, 0, true, CURRENT_TIMESTAMP),
  ('promo_study20', 'STUDY20', 20, 500, 0, true, CURRENT_TIMESTAMP)
ON CONFLICT ("code") DO NOTHING;
