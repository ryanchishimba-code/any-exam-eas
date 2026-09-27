/**
 * Checkout URLs that are not an explicit paid subscribe must never open a
 * Stripe trial or collect a card for a trial. They go to the card-free app
 * trial, or to paid checkout when that trial is already used.
 */

const SIGNUP_QUERY_KEYS = [
  "interval",
  "tier",
  "exam",
  "promo",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
] as const;

const PAID_QUERY_KEYS = ["interval", "tier", "promo", "mode", "return"] as const;

export type CheckoutQuery = Record<string, string | undefined>;

export type CheckoutEntryDecision =
  | { kind: "paid-checkout" }
  | { kind: "signup"; href: string }
  | { kind: "start-app-trial" }
  | { kind: "paid-subscribe"; href: string }
  | { kind: "dashboard" }
  | { kind: "update-payment"; href: string };

/**
 * Logged-out visitors never reach the checkout page for a trial. Middleware
 * runs before the page redirect, so this href has to be decided there.
 * `plan=subscribe` stays on the auth guard. Logged-in visitors return null
 * so the page can start an app trial or send a used trial to paid subscribe.
 */
export function loggedOutTrialCheckoutHref(
  pathname: string,
  search: string,
  loggedIn: boolean
): string | null {
  if (loggedIn) return null;
  if (pathname !== "/checkout" && !pathname.startsWith("/checkout/")) return null;
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  if (params.get("plan") === "subscribe") return null;
  const query: CheckoutQuery = {};
  params.forEach((value, key) => {
    query[key] = value;
  });
  return signupHrefFromCheckoutQuery(query);
}

export function signupHrefFromCheckoutQuery(query: CheckoutQuery): string {
  const params = new URLSearchParams();
  params.set("plan", "trial");
  for (const key of SIGNUP_QUERY_KEYS) {
    const value = query[key]?.trim();
    if (value) params.set(key, value);
  }
  return `/signup?${params.toString()}`;
}

/** Paid Checkout must never open a Stripe trial or collect a card for one. */
export function assertStripeTrialCheckoutClosed(plan: string | null | undefined): void {
  if (plan === "trial") {
    throw new Error(
      "Stripe trials are closed. Start the card-free trial from signup instead of Checkout."
    );
  }
}

export function paidSubscribeHrefFromCheckoutQuery(query: CheckoutQuery): string {
  const params = new URLSearchParams();
  params.set("plan", "subscribe");
  for (const key of PAID_QUERY_KEYS) {
    const value = query[key]?.trim();
    if (value) params.set(key, value);
  }
  if (query.reactivate === "1") params.set("reactivate", "1");
  return `/checkout?${params.toString()}`;
}

/**
 * `plan=subscribe` stays on paid checkout. Every other checkout URL, including
 * a missing plan, `plan=trial`, and `reactivate=1`, is a card-free trial route.
 */
export function resolveCheckoutEntry(input: {
  plan: string | null | undefined;
  loggedIn: boolean;
  trialAvailable: boolean;
  accessStatus?: string | null;
  query?: CheckoutQuery;
}): CheckoutEntryDecision {
  if (input.plan === "subscribe") return { kind: "paid-checkout" };

  const query = input.query ?? {};
  if (!input.loggedIn) {
    return { kind: "signup", href: signupHrefFromCheckoutQuery(query) };
  }

  if (input.accessStatus === "past_due") {
    return { kind: "update-payment", href: "/settings?billing=past_due" };
  }

  if (input.accessStatus === "active") {
    return { kind: "dashboard" };
  }

  if (input.accessStatus === "trialing") {
    if (input.trialAvailable) return { kind: "dashboard" };
    return { kind: "paid-subscribe", href: paidSubscribeHrefFromCheckoutQuery(query) };
  }

  if (input.trialAvailable) return { kind: "start-app-trial" };
  return { kind: "paid-subscribe", href: paidSubscribeHrefFromCheckoutQuery(query) };
}
