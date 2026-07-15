import { redirect } from "next/navigation";
import { userHasFeature, type UserAccess } from "@/lib/access-control";
import { requirePremiumPage } from "@/lib/require-premium-page";
import type { SubscriptionFeature } from "@/lib/subscription-features";
import { PRO_FEATURE_LABELS, proUpgradeHref } from "@/lib/pro-feature-labels";

export { PRO_FEATURE_LABELS, proUpgradeHref };

/** Premium access + Pro-tier feature — redirects Basic users to pricing upgrade. */
export async function requireProFeaturePage(
  feature: SubscriptionFeature,
  callbackPath: string
): Promise<UserAccess> {
  const access = await requirePremiumPage(callbackPath);
  if (!userHasFeature(access, feature)) {
    redirect(proUpgradeHref(feature));
  }
  return access;
}
