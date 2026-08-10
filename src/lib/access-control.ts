import type { Subscription } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isStaffRole } from "@/lib/permissions";
import {
  evaluateSubscriptionAccess,
  normalizeSubscriptionForRead,
  subscriptionHasFeature,
  type SubscriptionAccess,
} from "@/lib/subscription-access";
import { hasFeatureAccess, type SubscriptionFeature } from "@/lib/subscription-features";
import { CACHE_TTL, cacheGetOrSetDeduped, cacheKey, CACHE_STALE } from "@/lib/cache";

export { isPremiumPage, PREMIUM_PAGE_PREFIXES } from "@/lib/premium-routes";

export type UserAccessRole =
  | "guest"
  | "trial"
  | "subscriber"
  | "free"
  | "expired"
  | "staff";

export type UserAccess = {
  userId: string;
  role: UserAccessRole;
  accountStatus: string;
  emailVerified: boolean;
  subscription: SubscriptionAccess;
  /** Active trial or paid subscription — full product access (subject to tier). */
  hasPremiumAccess: boolean;
  /** Post-trial restricted tier — login + dashboard only (study locked). */
  hasFreeTierAccess: boolean;
  /** Dashboard and account surfaces (trial, paid, or free). */
  hasAppAccess: boolean;
  /** Question bank / study entry — trial and paid only (not post-trial free). */
  hasStudyAccess: boolean;
  blockReason?: "suspended" | "deleted" | "subscription" | "email_unverified";
};

export { subscriptionHasFeature };
export type { SubscriptionFeature };

/** Check whether the user can access a tier-gated feature. Staff always allowed. */
export function userHasFeature(
  access: UserAccess,
  feature: SubscriptionFeature
): boolean {
  if (access.role === "staff") return true;
  return hasFeatureAccess(
    {
      tier: access.subscription.tier,
      planDuration: access.subscription.planDuration,
      hasAccess: access.hasPremiumAccess,
    },
    feature
  );
}

const REQUIRE_EMAIL_VERIFICATION =
  process.env.REQUIRE_EMAIL_VERIFICATION === "true";

function mapAccessRole(
  staff: boolean,
  subscription: SubscriptionAccess
): UserAccessRole {
  if (staff) return "staff";
  if (subscription.hasFreeAccess) return "free";
  if (subscription.hasAccess && subscription.status === "trialing") return "trial";
  if (subscription.hasAccess && subscription.status === "active") return "subscriber";
  return "expired";
}

function applyCompAndGrace(
  subscription: Subscription | null,
  base: SubscriptionAccess
): SubscriptionAccess {
  if (!subscription) return base;

  const now = new Date();

  if (subscription.compAccessUntil && subscription.compAccessUntil > now) {
    return {
      ...base,
      hasAccess: true,
      hasFreeAccess: false,
      status: "active",
      canStartCheckout: false,
    };
  }

  return base;
}

/** Full access decision for a signed-in user (subscription + account + staff). */
export async function getUserAccess(userId: string): Promise<UserAccess> {
  return cacheGetOrSetDeduped(
    cacheKey(["user-access", userId]),
    CACHE_TTL.userAccess,
    () => resolveUserAccess(userId),
    { staleTtlMs: CACHE_STALE.userAccess }
  );
}

async function resolveUserAccess(userId: string): Promise<UserAccess> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      role: true,
      accountStatus: true,
      emailVerified: true,
      subscription: true,
    },
  });

  if (!user) {
    return {
      userId,
      role: "expired",
      accountStatus: "unknown",
      emailVerified: false,
      subscription: {
        hasAccess: false,
        hasFreeAccess: false,
        status: "none",
        tier: "pro",
        planDuration: "yearly",
        trialEndsAt: null,
        daysRemaining: null,
        canStartCheckout: true,
        needsPaymentMethod: false,
      },
      hasPremiumAccess: false,
      hasFreeTierAccess: false,
      hasAppAccess: false,
      hasStudyAccess: false,
      blockReason: "subscription",
    };
  }

  const staff = isStaffRole(user.role);
  const sub = normalizeSubscriptionForRead(user.subscription);
  let subscription = evaluateSubscriptionAccess(sub);
  subscription = applyCompAndGrace(sub, subscription);

  if (staff) {
    subscription = { ...subscription, hasAccess: true, hasFreeAccess: false, canStartCheckout: false };
  }

  const emailVerified = !!user.emailVerified;
  let hasFreeTierAccess =
    !staff && subscription.hasFreeAccess && user.accountStatus === "active";
  let hasPremiumAccess =
    subscription.hasAccess && user.accountStatus === "active" && !hasFreeTierAccess;
  let hasAppAccess = (hasPremiumAccess || hasFreeTierAccess || staff) && user.accountStatus === "active";
  /** Post-trial free keeps dashboard only — study requires premium/trial/staff. */
  let hasStudyAccess = (hasPremiumAccess || staff) && user.accountStatus === "active";
  let blockReason: UserAccess["blockReason"];

  if (user.accountStatus === "deleted") {
    hasPremiumAccess = false;
    hasFreeTierAccess = false;
    hasAppAccess = false;
    hasStudyAccess = false;
    blockReason = "deleted";
  } else if (user.accountStatus === "suspended") {
    hasPremiumAccess = false;
    hasFreeTierAccess = false;
    hasAppAccess = false;
    hasStudyAccess = false;
    blockReason = "suspended";
  } else if (!hasPremiumAccess && !hasFreeTierAccess && !staff) {
    blockReason = "subscription";
  } else if (REQUIRE_EMAIL_VERIFICATION && !emailVerified && !staff) {
    hasPremiumAccess = false;
    hasFreeTierAccess = false;
    hasAppAccess = false;
    hasStudyAccess = false;
    blockReason = "email_unverified";
  }

  return {
    userId: user.id,
    role: mapAccessRole(staff, subscription),
    accountStatus: user.accountStatus,
    emailVerified,
    subscription,
    hasPremiumAccess,
    hasFreeTierAccess,
    hasAppAccess,
    hasStudyAccess,
    blockReason,
  };
}
