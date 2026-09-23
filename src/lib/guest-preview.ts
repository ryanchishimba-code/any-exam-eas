import { studyGuideRouteBases } from "@/lib/nclex-study-guide/guide-registry";

/**
 * Public free-win surfaces. Middleware and page loaders must allow guests here
 * so /free-guides CTAs do not bounce to login. Dashboard/admin stay gated.
 *
 * Edge-safe — imported by auth middleware via isPremiumPage().
 * Study-guide prefixes come from the book registry so a new exam cannot 404
 * guests while still living under the premium matcher.
 */
export const GUEST_PREVIEW_PREFIXES = [
  ...studyGuideRouteBases(),
  "/study/drugs300",
  "/anatomy",
];

/** Enough flashcards to feel like the real deck; full library stays behind trial. */
export const GUEST_DRUG_PREVIEW_LIMIT = 24;

export function isGuestPreviewPage(path: string): boolean {
  return GUEST_PREVIEW_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`)
  );
}
