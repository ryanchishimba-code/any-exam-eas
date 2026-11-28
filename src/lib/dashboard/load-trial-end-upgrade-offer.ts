import type { UserAccessRole } from "@/lib/access-control";
import { ensureTrialUpgradeOfferForUser } from "@/lib/billing/trial-upgrade-offer-db";
import {
  shouldResolveTrialEndOffer,
  trialEndUpgradeOfferEligibility,
} from "@/lib/dashboard/trial-end-upgrade-offer";

export type DashboardTrialEndOffer = {
  token: string;
  expiresAt: string;
};

/**
 * Reuse a live unused offer, or issue one, when the student is in the
 * post-trial window. Throws if the database read fails so the dashboard
 * can keep the regular Subscribe banner.
 */
export async function loadDashboardTrialEndOffer(input: {
  userId: string;
  role: UserAccessRole;
  subscriptionStatus: string;
  trialEndsAt: Date | string | null;
  questionsAnswered: number;
  now?: Date;
}): Promise<DashboardTrialEndOffer | null> {
  const now = input.now ?? new Date();
  if (!shouldResolveTrialEndOffer({ ...input, now })) return null;

  const issued = await ensureTrialUpgradeOfferForUser({
    userId: input.userId,
    now,
  });
  if (!issued.ok) return null;

  const decision = trialEndUpgradeOfferEligibility({
    userId: input.userId,
    role: input.role,
    subscriptionStatus: input.subscriptionStatus,
    trialEndsAt: input.trialEndsAt,
    questionsAnswered: input.questionsAnswered,
    paid: false,
    offer: {
      id: issued.offerId,
      userId: input.userId,
      expiresAt: issued.expiresAt,
      redeemedAt: null,
    },
    now,
  });
  if (!decision.show || !issued.token) return null;
  return { token: issued.token, expiresAt: issued.expiresAt.toISOString() };
}
