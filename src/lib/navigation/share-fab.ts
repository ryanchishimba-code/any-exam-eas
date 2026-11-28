/**
 * Public pages where the study "share progress" button does not belong.
 * App-shell and full-exam routes are handled separately in ShareFab.
 */
const SHARE_FAB_HIDDEN_PREFIXES = [
  "/login",
  "/signup",
  "/auth",
  "/pricing",
  "/about",
  "/daily",
  "/nclex",
  "/usmle",
  "/naplex",
  "/pance",
  "/fnp",
  "/aanp-fnp",
  "/npte",
  "/npte-pt",
  "/toolkit",
  "/blog",
  "/free-guides",
  "/free-practice-questions",
  "/how-questions-are-reviewed",
  "/employers",
  "/community",
  "/compare",
  "/feedback",
  "/contact",
  "/legal",
  "/resources",
  "/dev",
  "/faq",
  "/nclex-study-guide",
  "/naplex-study-guide",
  "/pance-study-guide",
  "/aanp-fnp-study-guide",
  "/usmle-study-guide",
  "/npte-pt-study-guide",
] as const;

export function isShareFabHiddenRoute(pathname: string | null | undefined): boolean {
  if (!pathname || pathname === "/") return true;
  return SHARE_FAB_HIDDEN_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}
