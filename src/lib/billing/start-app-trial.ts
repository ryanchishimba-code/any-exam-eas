import { trialEndsAtFromNow } from "@/lib/billing-config";
import { parseBillingInterval } from "@/lib/billing-plans";
import { scheduleTrialStartAlert } from "@/lib/billing/trial-alert";
import { prisma } from "@/lib/prisma";
import { hasConsumedTrial, recordTrialUsed } from "@/lib/trial-eligibility";
import { parseSubscriptionTier, type SubscriptionTier } from "@/lib/subscription-tiers";
import type { BillingInterval } from "@/lib/billing-config";

/**
 * Same subscription row signup writes for plan=trial: status trialing, no
 * Stripe customer charge, and a consumed-trial flag. Does not open Checkout.
 */
export async function startCardFreeTrialForUser(params: {
  userId: string;
  email: string;
  tier?: SubscriptionTier | string | null;
  interval?: BillingInterval | string | null;
  signupSource?: string | null;
}): Promise<{ started: boolean }> {
  if (await hasConsumedTrial(params.email)) return { started: false };

  const existing = await prisma.subscription.findUnique({
    where: { userId: params.userId },
  });
  if (existing?.status === "active" || existing?.status === "trialing" || existing?.status === "past_due") {
    return { started: false };
  }

  const data = {
    status: "trialing" as const,
    trialEndsAt: trialEndsAtFromNow(),
    plan: "trial" as const,
    planTier: parseSubscriptionTier(params.tier ?? existing?.planTier),
    planInterval: parseBillingInterval(params.interval ?? existing?.planInterval),
    canceledAt: null,
    // Drop a leftover Stripe subscription id so a canceled sub's webhook cannot
    // end this card-free trial. The customer id stays for a later paid checkout.
    stripeSubscriptionId: null,
  };

  if (existing) {
    await prisma.subscription.update({
      where: { id: existing.id },
      data,
    });
  } else {
    await prisma.subscription.create({
      data: { userId: params.userId, ...data },
    });
  }

  await recordTrialUsed(params.email, params.userId);
  void import("@/lib/trial-email-triggers").then((m) =>
    m.triggerWelcomeTrialEmail(params.userId)
  );
  scheduleTrialStartAlert({
    userId: params.userId,
    source: params.signupSource ?? null,
  });
  return { started: true };
}
