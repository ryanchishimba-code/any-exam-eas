import { prisma } from "@/lib/prisma";
import {
  MARKETING_PHASE_1,
  type MarketingPass,
} from "@/lib/promo/marketing-phase";

export type ActiveCompUser = {
  email: string;
  compAccessUntil: Date;
  audience: string | null;
  campaign: string | null;
};

export type MarketingReport = {
  campaign: string;
  passes: MarketingPass[];
  activeCompUsers: ActiveCompUser[];
};

/**
 * People whose access is still the pass. A live paid subscription or an open
 * pay-once window is excluded so the tracker does not double-count them.
 * Leftover pass days after a cancel stay on the list.
 */
export function activeCompSubscriptionWhere(now: Date) {
  return {
    compAccessUntil: { gt: now },
    AND: [
      {
        NOT: {
          status: { in: ["active", "trialing"] },
          stripeSubscriptionId: { not: null },
        },
      },
      {
        NOT: {
          purchaseType: "one_time",
          status: "active",
          accessEndsAt: { gt: now },
        },
      },
    ],
  };
}

export async function loadMarketingReport(now = new Date()): Promise<MarketingReport> {
  const [codes, subscriptions] = await Promise.all([
    prisma.promoCode.findMany({
      where: { campaign: MARKETING_PHASE_1 },
      include: {
        redemptions: {
          orderBy: { createdAt: "desc" },
          include: { user: { select: { email: true } } },
        },
      },
      orderBy: { code: "asc" },
    }),
    prisma.subscription.findMany({
      where: activeCompSubscriptionWhere(now),
      include: { user: { select: { email: true, promoRedemptions: {
        orderBy: { createdAt: "desc" },
        take: 1,
        include: { promoCode: { select: { audience: true, campaign: true } } },
      } } } },
      orderBy: { compAccessUntil: "asc" },
    }),
  ]);

  const passes: MarketingPass[] = codes.map((code) => {
    const redemption = code.redemptions[0];
    return {
      code: code.code,
      audience: code.audience,
      campaign: code.campaign,
      currentUses: code.currentUses,
      redeemedAt: redemption?.createdAt ?? null,
      redeemerEmail: redemption?.user.email ?? null,
    };
  });

  const activeCompUsers: ActiveCompUser[] = subscriptions.flatMap((subscription) => {
    const until = subscription.compAccessUntil;
    if (!until) return [];
    const redemption = subscription.user.promoRedemptions[0];
    return [
      {
        email: subscription.user.email,
        compAccessUntil: until,
        audience: redemption?.promoCode.audience ?? null,
        campaign: redemption?.promoCode.campaign ?? null,
      },
    ];
  });

  return { campaign: MARKETING_PHASE_1, passes, activeCompUsers };
}
