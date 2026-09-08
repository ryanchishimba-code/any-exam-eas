/** Routes that use the focused app shell (top nav + sidebar / mobile bottom bar). */
export const APP_SHELL_PREFIXES = [
  "/dashboard",
  "/question-bank",
  "/analytics",
  "/full-exam",
  "/library",
  "/anatomy",
  "/settings",
  "/study/drugs300",
  "/nclex/study-guide",
] as const;

export const MINIMAL_CHROME_PREFIXES = [
  "/select-exam",
  "/login",
  "/auth/login",
  "/signup",
  "/checkout",
] as const;

export function isAppShellRoute(pathname: string): boolean {
  return APP_SHELL_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export function isMinimalChromeRoute(pathname: string): boolean {
  return MINIMAL_CHROME_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export function hideMarketingChrome(pathname: string): boolean {
  return isAppShellRoute(pathname) || isMinimalChromeRoute(pathname);
}

/** Active full-exam simulator or results — hide mobile tab bar so footer controls stay reachable. */
export function isFullExamSessionRoute(pathname: string): boolean {
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] !== "full-exam") return false;
  if (parts.length === 3) return true;
  return parts.length === 4 && parts[3] === "results";
}

/** Study Guide chapter reader — owns its own TOC and fills the viewport. */
export function isStudyGuideReaderRoute(pathname: string): boolean {
  return pathname.startsWith("/nclex/study-guide/");
}

/**
 * Routes that keep the top nav but surrender the sidebar, page padding, and
 * mobile tab bar because the page is a full-viewport experience of its own.
 */
export function isImmersiveAppRoute(pathname: string): boolean {
  return isFullExamSessionRoute(pathname) || isStudyGuideReaderRoute(pathname);
}

/** Question bank + full-exam launcher — primary exam cannot be changed from chrome or URL. */
export function isExamPracticeLockedRoute(pathname: string): boolean {
  if (pathname === "/question-bank" || pathname.startsWith("/question-bank/")) {
    return true;
  }
  const parts = pathname.split("/").filter(Boolean);
  return parts[0] === "full-exam" && parts.length === 2;
}
