import { isGuestPreviewPage } from "@/lib/guest-preview";

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
  "/nclex/study-guide",
  "/naplex/study-guide",
  "/aanp-fnp/study-guide",
] as const;

/** Reference books render their own trial upsell. Middleware must not send them to login. */
export function isStudyGuidePath(path: string): boolean {
  return (
    path === "/nclex/study-guide" ||
    path.startsWith("/nclex/study-guide/") ||
    path === "/naplex/study-guide" ||
    path.startsWith("/naplex/study-guide/") ||
    path === "/aanp-fnp/study-guide" ||
    path.startsWith("/aanp-fnp/study-guide/")
  );
}

export function isPremiumPage(path: string): boolean {
  if (isGuestPreviewPage(path)) return false;
  return PREMIUM_PAGE_PREFIXES.some(
    (p) => path === p || path.startsWith(`${p}/`)
  );
}
