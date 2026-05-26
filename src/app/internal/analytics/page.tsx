import { NextResponse } from "next/server";
import { requireInternalPermission } from "@/lib/internal/auth";
import AnalyticsDashboard from "./AnalyticsDashboard";

export default async function InternalAnalyticsPage() {
  const auth = await requireInternalPermission("analytics.view_basic");
  if (auth instanceof NextResponse) {
    return (
      <p className="text-sm text-amber-800">
        You do not have permission to view analytics. Contact an administrator.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
        <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
          Engagement, subscriptions, and study performance trends.
        </p>
      </div>
      <AnalyticsDashboard />
    </div>
  );
}

