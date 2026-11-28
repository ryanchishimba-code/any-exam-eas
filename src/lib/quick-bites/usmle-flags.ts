/**
 * Client-safe USMLE Quick Bites flags. No session or database imports.
 *
 * NEXT_PUBLIC_USMLE_QUICK_BITES_PUBLIC turns on the sidebar link after a rebuild.
 * USMLE_QUICK_BITES_PUBLIC is server-only and is read at request time.
 * Either flag releases the library to students. Until then, students get a 404
 * and admins can preview. The homepage and /usmle do not read these flags.
 */

/** Canonical student URL. The flag env var names are unchanged. */
export const USMLE_QUICK_BITES_PATH = "/usmle/rapid-review";
/** Previous URL. The page there redirects to USMLE_QUICK_BITES_PATH. */
export const USMLE_QUICK_BITES_LEGACY_PATH = "/usmle/quick-bites";

export function isUsmleQuickBitesPublic(): boolean {
  const raw = process.env.NEXT_PUBLIC_USMLE_QUICK_BITES_PUBLIC ?? "";
  return raw === "1" || raw === "true";
}

export function isUsmleQuickBitesReleased(): boolean {
  if (isUsmleQuickBitesPublic()) return true;
  const raw = process.env.USMLE_QUICK_BITES_PUBLIC ?? "";
  return raw === "1" || raw === "true";
}
