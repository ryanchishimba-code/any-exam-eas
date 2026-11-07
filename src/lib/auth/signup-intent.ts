import type { BillingInterval } from "@/lib/billing-config";
import { parseBillingInterval } from "@/lib/billing-plans";
import { parseBoardSlug } from "@/lib/auth/board-intent";
import { parseSubscriptionTier, type SubscriptionTier } from "@/lib/subscription-tiers";
import type { SignupPlan } from "@/lib/validators/auth";
import type { ExamSlug } from "@/types/edtech";

export type SignupIntent = {
  /** Invalid or missing `plan` stays on the free trial. */
  plan: SignupPlan;
  /** Invalid or missing `interval` stays monthly. */
  interval: BillingInterval;
  /** Every tier value resolves to Pro. */
  tier: SubscriptionTier;
  exam: ExamSlug | "";
  promo: string;
  /** Single-use pass from `?code=`. Empty when the visitor did not bring one. */
  passCode: string;
};

export function resolveSignupIntent(input: {
  plan?: string | null;
  interval?: string | null;
  tier?: string | null;
  exam?: string | null;
  board?: string | null;
  promo?: string | null;
  code?: string | null;
}): SignupIntent {
  const exam = parseBoardSlug(input.board) ?? parseBoardSlug(input.exam) ?? "";
  return {
    plan: input.plan === "subscribe" ? "subscribe" : "trial",
    interval: parseBillingInterval(input.interval ?? undefined),
    tier: parseSubscriptionTier(input.tier ?? undefined),
    exam,
    promo: input.promo?.trim() ?? "",
    passCode: input.code?.trim().toUpperCase() ?? "",
  };
}

export type SignedInSignupDecision =
  | { action: "checkout"; href: string }
  | { action: "start-trial"; href: string }
  | { action: "dashboard"; href: string };

/**
 * Signed-in trial visits never open Checkout. An explicit subscribe visit
 * still does. A trial that can still be started is started by the page, then
 * the learner lands on the dashboard. Everyone else on a trial link goes to
 * the dashboard too — including a trial that was already used.
 */
export function resolveSignedInSignup(input: {
  plan?: string | null;
  interval?: string | null;
  tier?: string | null;
  promo?: string | null;
  exam?: string | null;
  accessStatus?: string | null;
  trialAvailable: boolean;
}): SignedInSignupDecision {
  if (input.plan?.trim() === "subscribe") {
    return {
      action: "checkout",
      href: signupSubscribeCheckoutPath(resolveSignupIntent(input)),
    };
  }

  const status = input.accessStatus ?? "";
  if (status === "active" || status === "trialing" || !input.trialAvailable) {
    return { action: "dashboard", href: "/dashboard" };
  }

  return { action: "start-trial", href: "/dashboard?welcome=trial" };
}

/**
 * A signed-in subscribe visit reaches paid checkout. Every other visit,
 * including a trial link and a bare /signup, goes to the dashboard.
 */
export function signedInSignupRedirect(input: {
  plan?: string | null;
  interval?: string | null;
  tier?: string | null;
  promo?: string | null;
  exam?: string | null;
}): string {
  return resolveSignedInSignup({ ...input, trialAvailable: false }).href;
}

/** Paid path after account creation, or the OAuth return for Skip-trial. */
export function signupSubscribeCheckoutPath(
  intent: Pick<SignupIntent, "interval" | "tier" | "promo">
): string {
  const promo = intent.promo ? `&promo=${encodeURIComponent(intent.promo)}` : "";
  return `/checkout?plan=subscribe&interval=${intent.interval}&tier=${intent.tier}${promo}`;
}

/** Trial path after account creation. An exam goes straight to the dashboard. */
export function signupTrialDestination(exam: ExamSlug | ""): string {
  return exam
    ? "/dashboard?welcome=trial&verify=1"
    : "/select-exam?welcome=trial&verify=1";
}

/** One status for the current step. Step 2 is never announced while step 1 is showing. */
export function signupStepStatus(step: 1 | 2): { count: string; name: string } {
  if (step === 1) return { count: "Step 1 of 2", name: "Create your account" };
  return { count: "Step 2 of 2", name: "Choose your exam" };
}
