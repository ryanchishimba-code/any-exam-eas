import { Flame, Target, TrendingUp, Zap } from "lucide-react";
import type { DashboardQuickStats } from "@/lib/dashboard/stats";

export function ProgressOverview({ stats }: { stats: DashboardQuickStats }) {
  const items = [
    {
      label: "Questions",
      value: stats.questionsAnswered > 0 ? stats.questionsAnswered.toLocaleString() : "—",
      icon: Zap,
    },
    {
      label: "Accuracy",
      value: stats.accuracyPercent != null ? `${stats.accuracyPercent}%` : "—",
      icon: TrendingUp,
    },
    {
      label: "Streak",
      value: stats.streakDays > 0 ? `${stats.streakDays}d` : "—",
      icon: Flame,
    },
    {
      label: "Focus area",
      value: stats.weakAreas[0]?.topic ?? "—",
      icon: Target,
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map(({ label, value, icon: Icon }) => (
        <div
          key={label}
          className="rounded-xl border border-slate-200/80 bg-white px-4 py-3 shadow-sm"
        >
          <div className="flex items-center gap-1.5 text-[0.6875rem] font-semibold uppercase tracking-wide text-slate-500">
            <Icon className="h-3.5 w-3.5 text-[var(--color-accent)]" aria-hidden />
            {label}
          </div>
          <p className="mt-1.5 truncate text-lg font-semibold text-slate-900">{value}</p>
        </div>
      ))}
    </div>
  );
}
