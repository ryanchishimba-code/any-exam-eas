/**
 * Hidden USMLE video Quick Bites. Edge-safe: env reads only.
 *
 * USMLE_VIDEO_QUICK_BITES_PUBLIC is read on the server at request time.
 * NEXT_PUBLIC_USMLE_VIDEO_QUICK_BITES_PUBLIC shows the sidebar link after a rebuild.
 * Both stay off until Ryan releases the videos. Staff can still open the page.
 * Rapid Review Cards and the /usmle board page do not read these flags.
 */

export const USMLE_VIDEO_QUICK_BITES_PATH = "/usmle/quick-bites";

function flagOn(raw: string | undefined): boolean {
  return raw === "1" || raw === "true";
}

export function isUsmleVideoQuickBitesPublic(): boolean {
  return flagOn(process.env.NEXT_PUBLIC_USMLE_VIDEO_QUICK_BITES_PUBLIC);
}

export function isUsmleVideoQuickBitesReleased(): boolean {
  return isUsmleVideoQuickBitesPublic() || flagOn(process.env.USMLE_VIDEO_QUICK_BITES_PUBLIC);
}

/** Videos when the flag is on, or when a signed-in staff member is previewing. */
export function usmleVideoRouteDecision(released: boolean, staff: boolean): "videos" | "cards" {
  return released || staff ? "videos" : "cards";
}
