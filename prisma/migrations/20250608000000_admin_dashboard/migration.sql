-- Admin dashboard prerequisites (idempotent).
-- User.role and UserFeedback already exist in schema; this migration documents indexes.

-- Role column (default 'user') — supports admin | support_staff | moderator | super_admin
CREATE INDEX IF NOT EXISTS "User_role_idx" ON "User" ("role");

-- Feedback inbox for admin customer service
CREATE INDEX IF NOT EXISTS "UserFeedback_userId_idx" ON "UserFeedback" ("userId");

-- Promote dev admin (optional — safe no-op if user missing)
-- UPDATE "User" SET role = 'admin' WHERE email = 'dev@anyexameasy.test';
