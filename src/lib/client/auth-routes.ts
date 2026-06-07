export const DEFAULT_AUTH_CALLBACK = "/dashboard";

/** Safe in-app redirect target after sign-in (blocks open redirects and auth loops). */
export function sanitizeCallbackUrl(
  raw: string | null | undefined,
  fallback = DEFAULT_AUTH_CALLBACK
): string {
  if (!raw || typeof raw !== "string") return fallback;
  const trimmed = raw.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) return fallback;
  if (trimmed.startsWith("/login")) return fallback;
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
