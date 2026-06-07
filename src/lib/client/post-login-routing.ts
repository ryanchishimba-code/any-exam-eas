import { sanitizeCallbackUrl } from "@/lib/client/auth-routes";

export type PostLoginSubscriptionStatus = {
  hasAccess?: boolean;
};

/** Pure routing logic — used after sign-in and in unit tests. */
export function resolvePostLoginDestination(
  callbackUrl: string,
  status: PostLoginSubscriptionStatus | null,
  examSlug: string | null | undefined
): string {
  const safe = sanitizeCallbackUrl(callbackUrl);

  if (safe.startsWith("/select-exam")) {
    return safe;
  }

  const headingToStudyHub =
    safe === "/study-hub" ||
    safe.startsWith("/study-hub/") ||
    safe.startsWith("/dashboard") ||
    safe.startsWith("/studygub");

  if (headingToStudyHub && !examSlug) {
    return "/select-exam";
  }

  if (!status?.hasAccess) {
    return "/pricing?paywall=1";
  }

  if (
    safe.startsWith("/study") ||
    safe.startsWith("/generate") ||
    safe.startsWith("/learn") ||
    safe.startsWith("/dashboard") ||
    safe.startsWith("/study-hub")
  ) {
    return safe.startsWith("/dashboard") || safe.startsWith("/studygub")
      ? "/study-hub"
      : safe;
  }

  return examSlug ? "/study-hub" : "/select-exam";
}
