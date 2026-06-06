-- Password reset tokens: link each token to a user account.
-- Tokens are stored as SHA-256 hashes (tokenHash), not raw values — safer than plain text.

ALTER TABLE "PasswordResetToken" ADD COLUMN IF NOT EXISTS "userId" TEXT;

-- Backfill userId from matching account email
UPDATE "PasswordResetToken" AS prt
SET "userId" = u."id"
FROM "User" AS u
WHERE prt."userId" IS NULL
  AND LOWER(prt."email") = u."email";

-- Drop orphaned rows (no matching user)
DELETE FROM "PasswordResetToken" WHERE "userId" IS NULL;

ALTER TABLE "PasswordResetToken" ALTER COLUMN "userId" SET NOT NULL;

ALTER TABLE "PasswordResetToken"
  ADD CONSTRAINT "PasswordResetToken_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX IF NOT EXISTS "PasswordResetToken_userId_idx" ON "PasswordResetToken"("userId");
CREATE INDEX IF NOT EXISTS "PasswordResetToken_expiresAt_idx" ON "PasswordResetToken"("expiresAt");
