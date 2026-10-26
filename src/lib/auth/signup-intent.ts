import type { BillingInterval } from "@/lib/billing-config";
import { parseBillingInterval } from "@/lib/billing-plans";
import { isExamSlug } from "@/lib/edtech/exams";
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
};

export function resolveSignupIntent(input: {
  plan?: string | null;
  interval?: string | null;
  tier?: string | null;
  exam?: string | null;
  promo?: string | null;
}): SignupIntent {
  return {
    plan: input.plan === "subscribe" ? "subscribe" : "trial",
    interval: parseBillingInterval(input.interval ?? undefined),
    tier: parseSubscriptionTier(input.tier ?? undefined),
    exam: input.exam && isExamSlug(input.exam) ? input.exam : "",
    promo: input.promo?.trim() ?? "",
  };
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
