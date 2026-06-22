import { AlertTriangle } from "lucide-react";
import { AdminOverviewDashboard } from "@/components/admin/AdminOverviewDashboard";
import { getAdminDashboardData } from "@/lib/admin/overview";

export const metadata = {
  title: "Admin Overview — Any Exam Easy",
};

export default async function AdminOverviewPage() {
  const data = await getAdminDashboardData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-zinc-50">
          Overview
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
          Traffic, conversions, users, and quick links to admin tools.
        </p>
      </div>

      {/* Partial-failure banner — shown when one data source was unreachable */}
      {data.fetchError && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <p>
            <strong className="font-semibold">Partial data failure:</strong> {data.fetchError}{" "}
            Metrics showing zero may be missing — refresh to retry.
          </p>
        </div>
      )}

      <AdminOverviewDashboard overview={data.overview} conversions={data.conversions} />
    </div>
  );
}
