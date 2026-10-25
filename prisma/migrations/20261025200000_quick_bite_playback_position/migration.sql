-- Last playback head for resume (separate from max watchPct used for completion credit).
-- Do not apply to production until reviewed and approved.

ALTER TABLE "quick_bite_progress" ADD COLUMN "playbackPositionSec" DOUBLE PRECISION NOT NULL DEFAULT 0;
