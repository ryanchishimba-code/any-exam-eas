import { getUserAccess } from "@/lib/access-control";
import { getUserExamPreference } from "@/lib/edtech/exam-preference";
import { getReactivationInfo } from "@/lib/reactivation";

/** Compact reactivation payload stored on the JWT for post-login routing. */
export type LoginReactivationSnapshot = {
  method: "checkout" | "update_payment";
  checkoutPath?: string;
  settingsPath?: string;
};

/**
 * Fields needed to choose the post-login destination without hitting
 * /api/subscription/status or /api/user/exam-preference.
 */
export type LoginRoutingSnapshot = {
  hasAccess: boolean;
  hasAppAccess: boolean;
  status: string;
  daysRemaining: number | null;
  examSlug: string | null;
  reactivation: LoginReactivationSnapshot | null;
};

/** Load access + exam preference once at sign-in for the JWT. */
export async function loadLoginRoutingSnapshot(
  userId: string,
  email?: string | null
): Promise<LoginRoutingSnapshot> {
  const [access, pref] = await Promise.all([
    getUserAccess(userId),
    getUserExamPreference(userId),
  ]);

  let reactivation: LoginReactivationSnapshot | null = null;
  if (!access.hasPremiumAccess && !access.hasAppAccess && email) {
    try {
      const info = await getReactivationInfo({
        email,
        subscription: null,
        access: access.subscription,
      });
      if (info.available && info.method) {
        reactivation = {
          method: info.method,
          checkoutPath: info.checkoutPath || undefined,
          settingsPath: info.settingsPath || undefined,
        };
      }
    } catch (error) {
      console.warn(
        "[auth] login reactivation snapshot failed:",
        error instanceof Error ? error.message : error
      );
    }
  }

  return {
    hasAccess: access.hasPremiumAccess,
    hasAppAccess: access.hasAppAccess,
    status: access.subscription.status,
    daysRemaining: access.subscription.daysRemaining,
    examSlug: pref?.examSlug ?? null,
    reactivation,
  };
}
