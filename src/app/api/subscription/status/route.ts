import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUserAccess } from "@/lib/access-control";
import { cacheGetOrSet, cacheKey, CACHE_TTL } from "@/lib/cache";
import { MONTHLY_PRICE_USD, YEARLY_PRICE_USD, TRIAL_DAYS } from "@/lib/stripe";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const access = await cacheGetOrSet(
    cacheKey(["subscription-status", session.user.id]),
    CACHE_TTL.subscriptionStatus,
    () => getUserAccess(session.user.id)
  );
  const sub = access.subscription;

  return NextResponse.json({
    ...sub,
    hasAccess: access.hasPremiumAccess,
    role: access.role,
    accountStatus: access.accountStatus,
    emailVerified: access.emailVerified,
    blockReason: access.blockReason,
    trialEndsAt: sub.trialEndsAt?.toISOString() ?? null,
    trialDays: TRIAL_DAYS,
    monthlyPriceUsd: MONTHLY_PRICE_USD,
    yearlyPriceUsd: YEARLY_PRICE_USD,
  });
}
