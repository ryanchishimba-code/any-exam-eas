import { NextResponse } from "next/server";
import { requireInternalPermission } from "@/lib/internal/auth";
import { getPortalOverview } from "@/lib/internal/overview";
import { logAdminAction } from "@/lib/audit";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const auth = await requireInternalPermission("analytics.view_basic");
  if (auth instanceof NextResponse) return auth;

  const overview = await getPortalOverview();

  void logAdminAction({
    actorId: auth.userId,
    action: "VIEW_PORTAL_OVERVIEW",
    req,
  });

  return NextResponse.json({ overview });
}
