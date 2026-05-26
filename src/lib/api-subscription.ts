import { NextResponse } from "next/server";
import type { SubscriptionAccess } from "@/lib/subscription-access";

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
