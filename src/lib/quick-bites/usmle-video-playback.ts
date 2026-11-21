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
  | { ok: true; userId: string }
  | { ok: false; response: NextResponse };

/**
 * Flag off: 404 for everyone except staff.
 * Flag on: paid members and staff. No free sample.
 */
export async function requireUsmleVideoPlayer(request: Request): Promise<UsmleVideoPlayerGate> {
  const released = isUsmleVideoQuickBitesReleased();
  const auth = await requireAuthenticatedApi(request);
  const staff = auth.ok && auth.access.role === "staff";
  if (!released && !staff) {
    return { ok: false, response: NextResponse.json(HIDDEN, { status: 404 }) };
  }
  if (staff && auth.ok) return { ok: true, userId: auth.userId };
  if (!auth.ok) return { ok: false, response: auth.response };
  if (!canPlayQuickBites(auth.access)) {
    return { ok: false, response: NextResponse.json(LOCKED, { status: 403 }) };
  }
  return { ok: true, userId: auth.userId };
}
