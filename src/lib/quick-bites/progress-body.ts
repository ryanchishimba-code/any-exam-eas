import { z } from "zod";

export const quickBiteProgressBodySchema = z.object({
  /** Current playback head in seconds (resume point). */
  playbackPositionSec: z.number().min(0).max(86_400),
  /** Watch percent at the current playback head (used to update max watchPct). */
  momentWatchPct: z.number().min(0).max(100),
  watchSecondsDelta: z.number().min(0).max(120).default(0),
  /** When true, allow saving a near-zero head over a saved resume point (start over). */
  restartFromBeginning: z.boolean().optional(),
});

export type QuickBiteProgressBody = z.infer<typeof quickBiteProgressBodySchema>;
