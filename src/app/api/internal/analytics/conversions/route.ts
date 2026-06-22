import { NextResponse } from "next/server";
import { requireInternalPermission } from "@/lib/internal/auth";
import { getConversionsDashboard } from "@/lib/analytics/conversions";
import { logAdminAction } from "@/lib/audit";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const auth = await requireInternalPermission("analytics.view_basic");
  if (auth instanceof NextResponse) return auth;

  const url = new URL(req.url);
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");

  const dashboard = await getConversionsDashboard(from, to);

  void logAdminAction({
    actorId: auth.userId,
    action: "VIEW_CONVERSIONS_DASHBOARD",
    metadata: { from: dashboard.range.from, to: dashboard.range.to },
    req,
  });

  return NextResponse.json({ dashboard });
}
