import { NextResponse } from "next/server";
import { getUserAccess } from "@/lib/access-control";
import { cacheGetOrSet, cacheKey, CACHE_TTL } from "@/lib/cache";
import { MONTHLY_PRICE_USD, YEARLY_PRICE_USD, TRIAL_DAYS } from "@/lib/billing-config";
import { requireSessionGuard } from "@/lib/session-guard";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const guard = await requireSessionGuard(req);
  if (!guard.ok) return guard.response;

  const access = await cacheGetOrSet(
    cacheKey(["subscription-status", guard.userId]),
    CACHE_TTL.subscriptionStatus,
    () => getUserAccess(guard.userId)
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
