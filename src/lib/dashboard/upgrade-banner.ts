import type { UserAccess } from "@/lib/access-control";
import type { StudyUsageSnapshot } from "@/lib/study/usage-limits";
import type { SubscriptionTier } from "@/lib/subscription-tiers";

export type DashboardUpgradeVariant = "trial" | "free" | "basic";

export type DashboardUpgradeContext = {
  variant: DashboardUpgradeVariant;
  daysRemaining: number | null;
  planTier: SubscriptionTier;
  usage: StudyUsageSnapshot;
};

/** Pro upgrade pitch — reused on dashboard banner. */
export const PRO_DASHBOARD_UPGRADE_MESSAGE =
  "Unlock unlimited questions, rich goat-mode rationales, AI Tutor, and more. Upgrade to Pro today.";

/** Show upgrade banner for every signed-in user who is not on an active Pro subscription. */
export function shouldShowDashboardUpgradeBanner(access: UserAccess): boolean {
  if (access.role === "staff") return false;
  if (
    access.role === "subscriber" &&
    access.subscription.status === "active" &&
    access.subscription.tier === "pro"
  ) {
    return false;
  }
  if (access.role === "trial" || access.role === "free") return true;
  if (
    access.role === "subscriber" &&
    access.subscription.status === "active" &&
    access.subscription.tier === "basic"
  ) {
    return true;
  }
  return false;
}

export function resolveDashboardUpgradeContext(
  access: UserAccess,
  usage: StudyUsageSnapshot
): DashboardUpgradeContext | null {
  if (access.role === "staff") return null;

  const { subscription } = access;

  if (
    access.role === "subscriber" &&
    subscription.status === "active" &&
    subscription.tier === "pro"
  ) {
    return null;
  }

  if (access.role === "trial") {
    return {
      variant: "trial",
      daysRemaining: subscription.daysRemaining,
      planTier: subscription.tier,
      usage,
    };
  }

  if (access.role === "free") {
    return {
      variant: "free",
      daysRemaining: subscription.daysRemaining,
      planTier: subscription.tier,
      usage,
    };
  }

  if (
    access.role === "subscriber" &&
    subscription.status === "active" &&
    subscription.tier === "basic"
  ) {
    return {
      variant: "basic",
      daysRemaining: null,
      planTier: "basic",
      usage,
    };
  }

  return null;
}

export function dashboardUpgradePricingHref(variant: DashboardUpgradeVariant): string {
  const params = new URLSearchParams({
    upgrade: "pro",
    highlight: "pro",
    from: "dashboard",
    context: variant,
  });
  return `/pricing?${params.toString()}`;
}
