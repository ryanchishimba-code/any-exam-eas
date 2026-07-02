import { prisma } from "@/lib/prisma";
import { recordUserLogin } from "@/lib/user-auth";
import { logActivity, startUserSession, trackEvent } from "@/lib/analytics/events";
import { EVENT_TYPES } from "@/lib/analytics/types";
import { isStaffRole } from "@/lib/permissions";
import { logAdminAction } from "@/lib/audit";

/** Analytics + last-login updates — must not block JWT/session creation. */
export function scheduleCredentialsLoginSideEffects(
  userId: string,
  role: string,
  req?: Request
): void {
  void (async () => {
    try {
      await recordUserLogin(userId);
      const sessionId = await startUserSession(userId, req);
      trackEvent({
        userId,
        sessionId,
        eventType: EVENT_TYPES.USER_LOGIN,
        category: "auth",
        req,
      });
      void logActivity({
        userId,
        action: "login",
        summary: "Signed in with email and password",
      });
      if (isStaffRole(role)) {
        void logAdminAction({
          actorId: userId,
          action: "STAFF_LOGIN",
          req,
          metadata: { method: "credentials" },
        });
      }
    } catch (err) {
      console.error("[auth] login side-effects failed:", err);
    }
  })();
}

/** Fire-and-forget last login for OAuth flows (session analytics handled separately). */
export function scheduleOAuthLoginTouch(userId: string): void {
  void recordUserLogin(userId).catch(() => undefined);
}
