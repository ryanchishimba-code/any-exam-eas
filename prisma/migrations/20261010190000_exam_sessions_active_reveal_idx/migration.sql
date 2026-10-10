-- Reveal checks this user's in-progress sittings touched within 24 hours.
-- Index range on (userId, status, updatedAt); older abandoned rows are not scanned.
CREATE INDEX IF NOT EXISTS "exam_sessions_userId_status_updatedAt_idx"
ON "exam_sessions"("userId", "status", "updatedAt");
