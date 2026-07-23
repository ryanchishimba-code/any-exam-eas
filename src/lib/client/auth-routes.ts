export const DEFAULT_AUTH_CALLBACK = "/dashboard";

/**
 * Safe in-app redirect target after sign-in (blocks open redirects and auth loops).
 * Accepts relative paths and absolute same-app URLs (NextAuth middleware passes
 * `request.nextUrl.href` as callbackUrl).
 */
export function sanitizeCallbackUrl(
  raw: string | null | undefined,
  fallback = DEFAULT_AUTH_CALLBACK
): string {
  if (!raw || typeof raw !== "string") return fallback;
  let trimmed = raw.trim();

  // NextAuth middleware sets callbackUrl to an absolute href — keep path + query.
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const url = new URL(trimmed);
      trimmed = `${url.pathname}${url.search}${url.hash}`;
    } catch {
      return fallback;
    }
  }

  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) return fallback;
  if (trimmed.startsWith("/login") || trimmed.startsWith("/auth/login")) return fallback;
  if (trimmed.startsWith("/studygub") || trimmed.startsWith("/study-hub")) {
    return "/dashboard";
  }
  return trimmed;
}

/** OAuth and credential flows land here to run subscription-aware routing. */
export function loginCompleteUrl(callbackUrl: string): string {
  const safe = sanitizeCallbackUrl(callbackUrl);
  return `/login/complete?callbackUrl=${encodeURIComponent(safe)}`;
}
