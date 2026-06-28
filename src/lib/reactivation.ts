import type { Subscription } from "@prisma/client";
import type { BillingInterval } from "@/lib/billing-config";
import type { SubscriptionAccess } from "@/lib/subscription-access";
import { hasConsumedTrial } from "@/lib/trial-eligibility";

export type ReactivationMethod = "checkout" | "update_payment";

export type ReactivationInfo = {
  available: boolean;
  method: ReactivationMethod | null;
  checkoutPlan: "trial" | "subscribe";
  checkoutPath: string;
  settingsPath: string;
  message: string;
  trialAvailable: boolean;
};

export const REACTIVATION_DEFAULT_INTERVAL: BillingInterval = "yearly";

export function appendReturnParam(path: string, returnPath: string): string {
  const sep = path.includes("?") ? "&" : "?";
  return `${path}${sep}return=${encodeURIComponent(returnPath)}`;
}

export function buildCheckoutPath(
  plan: "trial" | "subscribe",
  reactivate = true,
  tier: "basic" | "pro" = "pro"
): string {
  const params = new URLSearchParams({
    plan,
    tier,
    interval: REACTIVATION_DEFAULT_INTERVAL,
  });
  if (reactivate) params.set("reactivate", "1");
  return `/checkout?${params.toString()}`;
}

/** Where to send lapsed users to restore premium access after login or paywall. */
export async function getReactivationInfo(params: {
  email: string;
  subscription: Subscription | null;
  access: SubscriptionAccess;
}): Promise<ReactivationInfo> {
  const trialAvailable = !(await hasConsumedTrial(params.email));
  const settingsPath = "/settings?reactivate=1";

  if (params.access.hasAccess) {
    return {
      available: false,
      method: null,
      checkoutPlan: "subscribe",
      checkoutPath: buildCheckoutPath("subscribe", false),
      settingsPath: "/settings",
      message: "",
      trialAvailable,
    };
  }

  if (params.access.status === "past_due") {
    return {
      available: true,
      method: "update_payment",
      checkoutPlan: "subscribe",
      checkoutPath: "",
      settingsPath: "/settings?billing=past_due",
      message:
        "Your last payment failed. Update your payment method in Settings to restore full access.",
      trialAvailable: false,
    };
  }

  const checkoutPlan = trialAvailable ? "trial" : "subscribe";
  const checkoutPath = buildCheckoutPath(checkoutPlan);

  const isCanceled =
    params.access.status === "canceled" || params.subscription?.status === "canceled";
  const message = isCanceled
    ? "Welcome back. Your subscription was canceled — resubscribe anytime to pick up where you left off."
    : params.access.status === "trial_expired"
      ? "Your trial has ended — you still have dashboard access and a few free questions. Upgrade to unlock unlimited practice."
      : "Welcome back. Reactivate your account to restore full study access.";

  return {
    available: true,
    method: "checkout",
    checkoutPlan,
    checkoutPath,
    settingsPath,
    message,
    trialAvailable,
  };
}

export function reactivationRedirectForPaywall(
  reactivation: ReactivationInfo,
  callbackPath: string
): string {
  if (!reactivation.available) {
    return `/pricing?paywall=1&return=${encodeURIComponent(callbackPath)}`;
  }
  if (reactivation.method === "update_payment") {
    return appendReturnParam(reactivation.settingsPath, callbackPath);
  }
  return appendReturnParam(reactivation.checkoutPath, callbackPath);
}

/** Redirect target when a signed-in user lacks premium access. */
export async function resolvePaywallRedirect(
  userId: string,
  email: string | null | undefined,
  callbackPath: string,
  access: SubscriptionAccess
): Promise<string> {
  const sub = await import("@/lib/prisma").then((m) =>
    m.prisma.subscription.findUnique({ where: { userId } })
  );

  if (!email) {
    return appendReturnParam("/settings?reactivate=1", callbackPath);
  }

  const reactivation = await getReactivationInfo({
    email,
    subscription: sub,
    access,
  });

  if (!reactivation.available) {
    return `/pricing?paywall=1&return=${encodeURIComponent(callbackPath)}`;
  }

  return reactivationRedirectForPaywall(reactivation, callbackPath);
}
