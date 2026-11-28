import { NextResponse } from "next/server";
import { requireAuthenticatedApi } from "@/lib/api-access";
import { canPlayQuickBites } from "@/lib/quick-bites/access";
import { isUsmleVideoQuickBitesReleased } from "@/lib/quick-bites/usmle-video-flags";

const HIDDEN = { error: "Episode not found" } as const;

const LOCKED = {
  error: "A paid membership is required to watch Quick Bites: USMLE.",
  code: "USMLE_VIDEO_QUICK_BITES_LOCKED",
} as const;

export type UsmleVideoPlayerGate =
  | { ok: true; userId: string; staff: boolean; released: boolean }
  | { ok: false; response: NextResponse };

/** Held wave-4 episodes play only for staff while the library flag is off. */
export function usmleHeldEpisodeIsServable(
  episode: { held?: boolean } | undefined,
  opts: { staff: boolean; released: boolean }
): boolean {
  if (!episode) return false;
  if (!episode.held) return true;
  return opts.staff && !opts.released;
}

/**
 * Anonymous callers get the auth response (401). Flag off: signed-in
 * non-staff get 404. Flag on: paid members and staff. No free sample.
 */
export async function requireUsmleVideoPlayer(request: Request): Promise<UsmleVideoPlayerGate> {
  const released = isUsmleVideoQuickBitesReleased();
  const auth = await requireAuthenticatedApi(request);
  if (!auth.ok) return { ok: false, response: auth.response };
  const staff = auth.access.role === "staff";
  if (!released && !staff) {
    return { ok: false, response: NextResponse.json(HIDDEN, { status: 404 }) };
  }
  if (staff) return { ok: true, userId: auth.userId, staff, released };
  if (!canPlayQuickBites(auth.access)) {
    return { ok: false, response: NextResponse.json(LOCKED, { status: 403 }) };
  }
  return { ok: true, userId: auth.userId, staff, released };
}
