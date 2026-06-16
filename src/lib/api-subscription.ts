import { NextResponse } from "next/server";
import type { SubscriptionAccess } from "@/lib/subscription-access";
import type { SubscriptionFeature } from "@/lib/subscription-features";
import { PRO_FEATURE_LABELS } from "@/lib/require-pro-feature";

export function subscriptionRequiredResponse(access: SubscriptionAccess) {
  return NextResponse.json(
    {
      error: "Subscription required",
      code: "SUBSCRIPTION_REQUIRED",
      status: access.status,
      trialEndsAt: access.trialEndsAt?.toISOString() ?? null,
    },
    { status: 403 }
  );
}

export function proFeatureRequiredResponse(
  access: SubscriptionAccess,
  feature: SubscriptionFeature
) {
  return NextResponse.json(
    {
      error: `Pro plan required for ${PRO_FEATURE_LABELS[feature]}`,
      code: "PRO_FEATURE_REQUIRED",
      feature,
      tier: access.tier,
      upgradeUrl: `/pricing?upgrade=pro&feature=${encodeURIComponent(feature)}`,
    },
    { status: 403 }
  );
}
