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
      where: { compAccessUntil: { gt: now }, plan: "comp" },
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
