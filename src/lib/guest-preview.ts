/**
 * Public free-win surfaces. Middleware and page loaders must allow guests here
 * so /free-guides CTAs do not bounce to login. Dashboard/admin stay gated.
 *
 * Study-guide books are premium-only (trial or paid). They stay on
 * PREMIUM_PAGE_PREFIXES and are not listed here.
 *
 * Edge-safe — imported by auth middleware via isPremiumPage().
 */
export const GUEST_PREVIEW_PREFIXES = ["/study/drugs300", "/anatomy"] as const;

/** Enough flashcards to feel like the real deck; full library stays behind trial. */
export const GUEST_DRUG_PREVIEW_LIMIT = 24;

export function isGuestPreviewPage(path: string): boolean {
  return GUEST_PREVIEW_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`)
  );
}
