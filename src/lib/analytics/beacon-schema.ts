import { z } from "zod";

export const analyticsBeaconSchema = z.object({
  path: z.string().min(1).max(500),
  durationSec: z.coerce.number().min(0).max(86_400).optional(),
  referrer: z.string().max(500).optional(),
  sessionId: z.string().max(64).optional(),
});
