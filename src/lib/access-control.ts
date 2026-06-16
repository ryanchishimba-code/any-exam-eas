import type { Subscription } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isStaffRole } from "@/lib/permissions";
import {
  evaluateSubscriptionAccess,
  expireTrialIfNeeded,
  subscriptionHasFeature,
  type SubscriptionAccess,
} from "@/lib/subscription-access";
import { hasFeatureAccess, type SubscriptionFeature } from "@/lib/subscription-features";

export { isPremiumPage, PREMIUM_PAGE_PREFIXES } from "@/lib/premium-routes";

export type UserAccessRole =
  | "guest"
  | "trial"
  | "subscriber"
  | "expired"
  | "staff";

export type UserAccess = {
  userId: string;
  role: UserAccessRole;
  accountStatus: string;
  emailVerified: boolean;
  subscription: SubscriptionAccess;
  hasPremiumAccess: boolean;
  blockReason?: "suspended" | "subscription" | "email_unverified";
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
      status: "active",
      canStartCheckout: false,
    };
  }

  return base;
}

/** Full access decision for a signed-in user (subscription + account + staff). */
export async function getUserAccess(userId: string): Promise<UserAccess> {
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
        status: "none",
        tier: "pro",
        planDuration: "yearly",
        trialEndsAt: null,
        daysRemaining: null,
        canStartCheckout: true,
        needsPaymentMethod: false,
      },
      hasPremiumAccess: false,
      blockReason: "subscription",
    };
  }

  const staff = isStaffRole(user.role);
  let sub = user.subscription;
  sub = await expireTrialIfNeeded(sub);
  let subscription = evaluateSubscriptionAccess(sub);
  subscription = applyCompAndGrace(sub, subscription);

  if (staff) {
    subscription = { ...subscription, hasAccess: true, canStartCheckout: false };
  }

  const emailVerified = !!user.emailVerified;
  // Premium access is never reduced for discount codes — only subscription/account state.
  let hasPremiumAccess = subscription.hasAccess && user.accountStatus === "active";
  let blockReason: UserAccess["blockReason"];

  if (user.accountStatus === "suspended") {
    hasPremiumAccess = false;
    blockReason = "suspended";
  } else if (!subscription.hasAccess && !staff) {
    blockReason = "subscription";
  } else if (REQUIRE_EMAIL_VERIFICATION && !emailVerified && !staff) {
    hasPremiumAccess = false;
    blockReason = "email_unverified";
  }

  return {
    userId: user.id,
    role: mapAccessRole(staff, subscription),
    accountStatus: user.accountStatus,
    emailVerified,
    subscription,
    hasPremiumAccess,
    blockReason,
  };
}
