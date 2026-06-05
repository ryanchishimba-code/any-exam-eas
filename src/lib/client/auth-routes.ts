/** Safe in-app redirect target after sign-in (blocks open redirects and auth loops). */
export function sanitizeCallbackUrl(
  raw: string | null | undefined,
  fallback = "/study-hub"
): string {
  if (!raw || typeof raw !== "string") return fallback;
  const trimmed = raw.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) return fallback;
  if (trimmed.startsWith("/login")) return fallback;
  if (trimmed.startsWith("/studygub") || trimmed.startsWith("/dashboard")) {
    return "/study-hub";
  }
  return trimmed;
}

/** OAuth and credential flows land here to run subscription-aware routing. */
export function loginCompleteUrl(callbackUrl: string): string {
  const safe = sanitizeCallbackUrl(callbackUrl);
  return `/login/complete?callbackUrl=${encodeURIComponent(safe)}`;
}
