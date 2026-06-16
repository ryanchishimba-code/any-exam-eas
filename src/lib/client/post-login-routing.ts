import { sanitizeCallbackUrl } from "@/lib/client/auth-routes";
import { ROUTES } from "@/lib/routes";

export type PostLoginSubscriptionStatus = {
  hasAccess?: boolean;
  status?: string;
  reactivation?: {
    method: "checkout" | "update_payment";
    checkoutPath?: string;
    settingsPath?: string;
  } | null;
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

  if (!status?.hasAccess) {
    if (
      safe.startsWith("/checkout") ||
      safe.startsWith("/signup") ||
      safe.startsWith("/pricing") ||
      safe.startsWith("/settings")
    ) {
      return safe;
    }

    if (status?.reactivation?.method === "update_payment" && status.reactivation.settingsPath) {
      return status.reactivation.settingsPath;
    }

    if (status?.reactivation?.checkoutPath) {
      return status.reactivation.checkoutPath;
    }

    if (status?.status === "past_due") {
      return "/settings?billing=past_due";
    }

    return "/settings?reactivate=1";
  }

  const headingToDashboard =
    safe === ROUTES.dashboard ||
    safe.startsWith(`${ROUTES.dashboard}/`) ||
    safe.startsWith("/study-hub") ||
    safe.startsWith("/studygub");

  if (headingToDashboard && !examSlug) {
    return ROUTES.selectExam;
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
