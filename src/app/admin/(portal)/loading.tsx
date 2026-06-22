/**
 * Admin portal loading skeleton.
 *
 * Next.js shows this file automatically while any async Server Component
 * in the (portal) route group is awaiting — most importantly while
 * getAdminDashboardData() fetches from Neon Postgres on the overview page.
 *
 * The layout mirrors AdminOverviewDashboard so the transition is seamless.
 */

function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-slate-200 dark:bg-zinc-800 ${className}`}
      aria-hidden
    />
  );
}

function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <SkeletonBlock className="h-3 w-24" />
      <SkeletonBlock className="mt-3 h-7 w-16" />
    </div>
  );
}

function ChartSkeleton({ title }: { title: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-sm font-semibold text-slate-900 dark:text-zinc-100">{title}</p>
      <SkeletonBlock className="mt-4 h-56 w-full" />
    </div>
  );
}

export default function AdminPortalLoading() {
  return (
    <div className="space-y-8" aria-label="Loading admin dashboard…" aria-busy>
      {/* Heading */}
      <div className="space-y-2">
        <SkeletonBlock className="h-7 w-48" />
        <SkeletonBlock className="h-4 w-72" />
      </div>

      {/* Key metrics band */}
      <section className="rounded-2xl border border-indigo-200/60 bg-gradient-to-br from-indigo-50/90 to-white p-5 dark:border-indigo-500/20 dark:from-indigo-950/40 dark:to-zinc-900">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <SkeletonBlock className="h-3 w-32" />
            <SkeletonBlock className="h-3 w-64" />
          </div>
          <SkeletonBlock className="h-9 w-28 rounded-full" />
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      </section>

      {/* Quick links */}
      <section>
        <SkeletonBlock className="mb-4 h-3 w-20" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <SkeletonBlock className="h-10 w-10 rounded-lg" />
              <div className="flex-1 space-y-2">
                <SkeletonBlock className="h-3.5 w-28" />
                <SkeletonBlock className="h-3 w-36" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Charts row 1 */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartSkeleton title="Traffic trend (7d)" />
        <ChartSkeleton title="Conversions (7d)" />
      </div>

      {/* Charts row 2 */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartSkeleton title="Funnel breakdown (7d)" />
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Top CTAs (7d)</p>
          <ul className="mt-4 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <li key={i} className="flex items-center justify-between gap-3">
                <SkeletonBlock className="h-3 w-40" />
                <SkeletonBlock className="h-3 w-8" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
