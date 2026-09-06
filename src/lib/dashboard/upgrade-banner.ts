import type { UserAccess } from "@/lib/access-control";
import type { StudyUsageSnapshot } from "@/lib/study/usage-limits";

export type DashboardUpgradeVariant = "trial" | "free";

export type DashboardUpgradeContext = {
  variant: DashboardUpgradeVariant;
  daysRemaining: number | null;
  usage: StudyUsageSnapshot;
};

/** Pro upgrade pitch — reused on dashboard banner. */
export const PRO_DASHBOARD_UPGRADE_MESSAGE =
  "Upgrade anytime before your trial ends — unlock unlimited questions, teachable rationales, Roadmaps, Deep Dives, Full Exams, and everything in Pro for all 6 boards.";

export const POST_TRIAL_SUBSCRIBE_MESSAGE =
  "Subscribe to continue studying — question bank, Roadmap, exams, and all study tools stay locked until you upgrade.";

/** Checkout for active trial users upgrading to paid Pro (no reactivate flag). */
export function trialUpgradeCheckoutHref(returnPath = "/dashboard"): string {
  const params = new URLSearchParams({
    plan: "subscribe",
    tier: "pro",
    interval: "monthly",
    return: returnPath,
  });
  return `/checkout?${params.toString()}`;
}

/** Default post-trial checkout destination. */
export function postTrialCheckoutHref(returnPath = "/dashboard"): string {
  const params = new URLSearchParams({
    plan: "subscribe",
    tier: "pro",
    interval: "monthly",
    reactivate: "1",
    return: returnPath,
  });
  return `/checkout?${params.toString()}`;
}

/** Show upgrade banner for every signed-in user who is not on an active Pro subscription. */
export function shouldShowDashboardUpgradeBanner(access: UserAccess): boolean {
  if (access.role === "staff") return false;
  if (access.role === "subscriber" && access.subscription.status === "active") {
    return false;
  }
  return access.role === "trial" || access.role === "free";
}

export function resolveDashboardUpgradeContext(
  access: UserAccess,
  usage: StudyUsageSnapshot
): DashboardUpgradeContext | null {
  if (access.role === "staff") return null;
  if (access.role === "subscriber" && access.subscription.status === "active") {
    return null;
  }

  if (access.role === "trial") {
    return {
      variant: "trial",
      daysRemaining: access.subscription.daysRemaining,
      usage,
    };
  }

  if (access.role === "free") {
    return {
      variant: "free",
      daysRemaining: access.subscription.daysRemaining,
      usage,
    };
  }

  return null;
}

export function dashboardUpgradePricingHref(variant: DashboardUpgradeVariant): string {
  if (variant === "free") {
    return postTrialCheckoutHref("/dashboard");
  }
  // Trial users go straight to checkout — skip the marketing pricing wall.
  return trialUpgradeCheckoutHref("/dashboard");
}
