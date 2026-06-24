-- Social / community integration (Phase 1)
-- Tables: user_social_posts (moderated UGC), social_shares (engagement tracking),
-- social_accounts (brand channel tokens, encrypted at rest).
--
-- Access control is enforced in the application layer (see src/lib/social/* and
-- the /api/admin/social routes) to match the rest of this codebase, which uses a
-- single trusted Prisma/Neon connection. RLS is intentionally NOT used here:
-- the app connects as the table owner, which bypasses RLS, so policies would
-- provide no real enforcement without a dedicated restricted role + per-request
-- session context. If DB-level RLS is desired later, provision a separate Neon
-- role and set `app.user_id` per request before enabling policies.

-- ── user_social_posts ────────────────────────────────────────────────────────
CREATE TABLE "user_social_posts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "exam_type" TEXT,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "reviewed_at" TIMESTAMP(3),
    "reviewed_by_id" TEXT,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_social_posts_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "user_social_posts_approved_deleted_at_created_at_idx" ON "user_social_posts"("approved", "deleted_at", "created_at");
CREATE INDEX "user_social_posts_user_id_created_at_idx" ON "user_social_posts"("user_id", "created_at");
CREATE INDEX "user_social_posts_exam_type_approved_deleted_at_idx" ON "user_social_posts"("exam_type", "approved", "deleted_at");

ALTER TABLE "user_social_posts"
    ADD CONSTRAINT "user_social_posts_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ── social_shares ────────────────────────────────────────────────────────────
CREATE TABLE "social_shares" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "platform" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT,
    "url" TEXT,
    "session_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "social_shares_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "social_shares_platform_created_at_idx" ON "social_shares"("platform", "created_at");
CREATE INDEX "social_shares_entity_type_created_at_idx" ON "social_shares"("entity_type", "created_at");
CREATE INDEX "social_shares_created_at_idx" ON "social_shares"("created_at");

ALTER TABLE "social_shares"
    ADD CONSTRAINT "social_shares_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ── social_accounts ──────────────────────────────────────────────────────────
CREATE TABLE "social_accounts" (
    "id" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "display_name" TEXT,
    "external_id" TEXT,
    "access_token_cipher" TEXT,
    "refresh_token_cipher" TEXT,
    "scope" TEXT,
    "expires_at" TIMESTAMP(3),
    "connected" BOOLEAN NOT NULL DEFAULT false,
    "created_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "social_accounts_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "social_accounts_platform_key" ON "social_accounts"("platform");
