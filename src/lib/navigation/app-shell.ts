/** Routes that use the focused app shell (top nav + sidebar / mobile bottom bar). */
export const APP_SHELL_PREFIXES = [
  "/dashboard",
  "/question-bank",
  "/analytics",
  "/full-exam",
  "/reference",
] as const;

export const MINIMAL_CHROME_PREFIXES = ["/select-exam", "/login", "/auth/login"] as const;

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
