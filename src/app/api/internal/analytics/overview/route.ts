import { NextResponse } from "next/server";
import { requireInternalPermission } from "@/lib/internal/auth";
import { getPlatformOverview } from "@/lib/analytics/aggregate";
import { logAdminAction } from "@/lib/audit";

export async function GET(req: Request) {
  const auth = await requireInternalPermission("analytics.view_basic");
  if (auth instanceof NextResponse) return auth;

  const overview = await getPlatformOverview(14);

  void logAdminAction({
    actorId: auth.userId,
    action: "VIEW_ANALYTICS_OVERVIEW",
    req,
  });

  return NextResponse.json({ overview });
}
