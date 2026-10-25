-- Undo for prisma/migrations/20261025200000_quick_bite_playback_position/migration.sql
-- Run only if rolling back the playbackPositionSec column (drops resume positions; watchPct unchanged).

ALTER TABLE "quick_bite_progress" DROP COLUMN IF EXISTS "playbackPositionSec";
