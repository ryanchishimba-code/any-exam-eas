import { Flame, Target, TrendingUp, Zap } from "lucide-react";
import type { DashboardQuickStats } from "@/lib/dashboard/stats";

export function QuickStatsCards({ stats }: { stats: DashboardQuickStats }) {
  const items = [
    {
      label: "Questions answered",
      value: stats.questionsAnswered.toLocaleString(),
      icon: Zap,
    },
    {
      label: "Accuracy",
      value: stats.accuracyPercent != null ? `${stats.accuracyPercent}%` : "—",
      icon: TrendingUp,
    },
    {
      label: "Streak",
      value: `${stats.streakDays} day${stats.streakDays === 1 ? "" : "s"}`,
      icon: Flame,
    },
    {
      label: "Weak areas",
      value: stats.weakAreas[0]?.topic ?? "None yet",
      icon: Target,
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map(({ label, value, icon: Icon }) => (
        <div
          key={label}
          className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm"
        >
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <Icon className="h-3.5 w-3.5 text-[var(--color-accent)]" aria-hidden />
            {label}
          </div>
          <p className="mt-2 truncate text-xl font-semibold text-slate-900">{value}</p>
        </div>
      ))}
    </div>
  );
}
