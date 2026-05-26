import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getSubscriptionAccess } from "@/lib/subscription-access";
import { MONTHLY_PRICE_USD, TRIAL_DAYS } from "@/lib/stripe";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const access = await getSubscriptionAccess(session.user.id);

  return NextResponse.json({
    ...access,
    trialEndsAt: access.trialEndsAt?.toISOString() ?? null,
    trialDays: TRIAL_DAYS,
    monthlyPriceUsd: MONTHLY_PRICE_USD,
  });
}
