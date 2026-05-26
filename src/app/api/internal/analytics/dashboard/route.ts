import { NextResponse } from "next/server";
import { requireInternalPermission } from "@/lib/internal/auth";
import {
  dashboardToCsv,
  getAnalyticsDashboard,
} from "@/lib/analytics/dashboard";
import { getBillingMetrics } from "@/lib/analytics/billing-metrics";
import { logAdminAction } from "@/lib/audit";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const auth = await requireInternalPermission("analytics.view_basic");
  if (auth instanceof NextResponse) return auth;

  const url = new URL(req.url);
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  const format = url.searchParams.get("format");

  const dashboard = await getAnalyticsDashboard(from, to);
  const billing = await getBillingMetrics(
    new Date(`${dashboard.range.from}T00:00:00.000Z`),
    new Date(`${dashboard.range.to}T23:59:59.999Z`)
  );

  void logAdminAction({
    actorId: auth.userId,
    action: format === "csv" ? "EXPORT_ANALYTICS_CSV" : "VIEW_ANALYTICS_DASHBOARD",
    metadata: { from: dashboard.range.from, to: dashboard.range.to },
    req,
  });

  if (format === "csv") {
    const exportAuth = await requireInternalPermission("analytics.export");
    if (exportAuth instanceof NextResponse) return exportAuth;

    const csv = dashboardToCsv(dashboard);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="analytics-${dashboard.range.from}-${dashboard.range.to}.csv"`,
      },
    });
  }

  return NextResponse.json({ dashboard, billing });
}
