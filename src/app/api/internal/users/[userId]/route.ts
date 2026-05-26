import { NextResponse } from "next/server";
import { requireInternalPermission } from "@/lib/internal/auth";
import { getCrmUserProfile } from "@/lib/crm/user-profile";
import { logAdminAction } from "@/lib/audit";
import { trackEvent } from "@/lib/analytics/events";
import { EVENT_TYPES } from "@/lib/analytics/types";

type Params = { params: Promise<{ userId: string }> };

export async function GET(req: Request, { params }: Params) {
  const auth = await requireInternalPermission("crm.view_users");
  if (auth instanceof NextResponse) return auth;

  const { userId } = await params;
  const profile = await getCrmUserProfile(userId);
  if (!profile) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  void logAdminAction({
    actorId: auth.userId,
    action: "VIEW_USER_PROFILE",
    targetType: "user",
    targetId: userId,
    req,
  });
  trackEvent({
    userId: auth.userId,
    eventType: EVENT_TYPES.ADMIN_VIEW_USER,
    category: "admin",
    metadata: { targetUserId: userId },
    req,
  });

  return NextResponse.json({ profile });
}
