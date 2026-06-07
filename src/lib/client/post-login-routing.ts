import { sanitizeCallbackUrl } from "@/lib/client/auth-routes";
import { ROUTES } from "@/lib/routes";

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

  const headingToDashboard =
    safe === ROUTES.dashboard ||
    safe.startsWith(`${ROUTES.dashboard}/`) ||
    safe.startsWith("/study-hub") ||
    safe.startsWith("/studygub");

  if (headingToDashboard && !examSlug) {
    return ROUTES.selectExam;
  }

  if (!status?.hasAccess) {
    return "/pricing?paywall=1";
  }

  if (
    safe.startsWith("/study") ||
    safe.startsWith("/generate") ||
    safe.startsWith("/learn") ||
    safe.startsWith(ROUTES.dashboard) ||
    safe.startsWith("/study-hub") ||
    safe.startsWith(ROUTES.questionBank) ||
    safe.startsWith(ROUTES.analytics) ||
    safe.startsWith(ROUTES.fullExam)
  ) {
    if (safe.startsWith("/studygub") || safe.startsWith("/study-hub")) {
      return ROUTES.dashboard;
    }
    return safe;
  }

  return examSlug ? ROUTES.dashboard : ROUTES.selectExam;
}
