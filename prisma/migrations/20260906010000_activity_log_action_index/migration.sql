-- Speed study usage counters that filter ActivityLog by userId + action + createdAt.
CREATE INDEX IF NOT EXISTS "ActivityLog_userId_action_createdAt_idx"
ON "ActivityLog"("userId", "action", "createdAt");
