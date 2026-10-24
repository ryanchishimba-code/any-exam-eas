import { isGuestPreviewPage } from "@/lib/guest-preview";
import { studyGuideRouteBases } from "@/lib/nclex-study-guide/guide-registry";

/** Edge-safe premium route list (no Prisma). */
export const PREMIUM_PAGE_PREFIXES = [
  "/dashboard",
  "/question-bank",
  "/analytics",
  "/study",
  "/learn",
  "/generate",
  "/progress",
  "/checkout",
  "/engine",
  "/practice",
  "/mpje",
  "/full-exam",
  "/library",
  "/anatomy",
  "/study-hub",
  "/studygub",
  ...studyGuideRouteBases(),
] as const;

/** Reference books render their own trial upsell. Middleware must not send them to login. */
export function isStudyGuidePath(path: string): boolean {
  return studyGuideRouteBases().some(
    (base) => path === base || path.startsWith(`${base}/`)
  );
}

export function isPremiumPage(path: string): boolean {
  if (isGuestPreviewPage(path)) return false;
  return PREMIUM_PAGE_PREFIXES.some(
    (p) => path === p || path.startsWith(`${p}/`)
  );
}
