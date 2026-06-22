"use client";

import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BarChart3,
  FileText,
  MessageSquare,
  Settings,
  Users,
} from "lucide-react";
import { CONVERSION_EVENTS } from "@/lib/analytics/conversion-types";
import type { AdminDashboardData } from "@/lib/admin/overview";
import { ROUTES } from "@/lib/routes";

const CONVERSION_LABELS: Record<string, string> = {
  [CONVERSION_EVENTS.CTA_CLICKED]: "CTA clicks",
  [CONVERSION_EVENTS.PRICING_VIEWED]: "Pricing views",
  [CONVERSION_EVENTS.PLAN_SELECTED]: "Plan selected",
  [CONVERSION_EVENTS.TRIAL_STARTED]: "Trial starts",
  [CONVERSION_EVENTS.SIGNUP_COMPLETED]: "Signups",
};

type QuickLink = {
  href: string;
  label: string;
  description: string;
  icon: typeof Users;
  external?: boolean;
  placeholder?: boolean;
};

const QUICK_LINKS: QuickLink[] = [
  {
    href: ROUTES.admin.analytics,
    label: "Traffic & analytics",
    description: "Page views, funnels, revenue",
    icon: BarChart3,
  },
  {
    href: ROUTES.admin.users,
    label: "User management",
    description: "Search accounts & access",
    icon: Users,
  },
  {
    href: ROUTES.admin.content,
    label: "Content management",
    description: "Blog posts & YouTube embeds",
    icon: FileText,
  },
  {
    href: ROUTES.admin.feedback,
    label: "Feedback inbox",
    description: "Review user messages",
    icon: MessageSquare,
  },
  {
    href: ROUTES.settings,
    label: "Site settings",
    description: "Account & billing prefs",
    icon: Settings,
  },
];

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-xs font-medium text-slate-500 dark:text-zinc-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold tabular-nums text-slate-900 dark:text-zinc-50">
        {value}
      </p>
      {hint ? <p className="mt-1 text-[0.6875rem] text-slate-400 dark:text-zinc-500">{hint}</p> : null}
    </div>
  );
}

export function AdminOverviewDashboard({ overview, conversions }: AdminDashboardData) {
  const { traffic } = overview;
  const { totals, dailyTotals, ctaBreakdown, recent } = conversions;

  const conversionChartData = Object.entries(totals).map(([eventName, count]) => ({
    eventName,
    label: CONVERSION_LABELS[eventName] ?? eventName,
    count,
  }));

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-indigo-200/60 bg-gradient-to-br from-indigo-50/90 to-white p-5 dark:border-indigo-500/20 dark:from-indigo-950/40 dark:to-zinc-900">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-indigo-900/80 dark:text-indigo-200/90">
              Key metrics (7 days)
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-zinc-400">
              Internal DB (Neon) — same events mirrored to GA4 for ads attribution.
            </p>
          </div>
          <Link
            href={ROUTES.admin.analytics}
            className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400"
          >
            Full analytics →
          </Link>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
          <StatCard label="Page views (7d)" value={traffic.pageViews7d} />
          <StatCard label="Unique visitors (7d)" value={traffic.uniqueVisitors7d} />
          <StatCard label="Trial starts" value={totals[CONVERSION_EVENTS.TRIAL_STARTED]} hint="GA4 + DB" />
          <StatCard label="Signups" value={totals[CONVERSION_EVENTS.SIGNUP_COMPLETED]} hint="GA4 + DB" />
          <StatCard label="CTA clicks" value={totals[CONVERSION_EVENTS.CTA_CLICKED]} />
          <StatCard label="Pricing views" value={totals[CONVERSION_EVENTS.PRICING_VIEWED]} />
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-400">
          Quick links
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {QUICK_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-indigo-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-indigo-500/40"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-slate-900 group-hover:text-indigo-700 dark:text-zinc-100 dark:group-hover:text-indigo-300">
                    {link.label}
                  </span>
                  <span className="mt-0.5 block text-xs text-slate-500 dark:text-zinc-400">
                    {link.description}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Traffic trend (7d)</h3>
          <div className="mt-4 h-56 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={traffic.trend7d}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-zinc-700" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} width={36} />
                <Tooltip />
                <Line type="monotone" dataKey="views" name="Page views" stroke="#4f46e5" strokeWidth={2} />
                <Line type="monotone" dataKey="visitors" name="Visitors" stroke="#0ea5e9" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Conversions (7d)</h3>
          <div className="mt-4 h-56 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyTotals}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-zinc-700" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} width={36} />
                <Tooltip />
                <Line type="monotone" dataKey="total" name="All conversions" stroke="#22c55e" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Funnel breakdown (7d)</h3>
          <div className="mt-4 h-56 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={conversionChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fontSize: 9 }} interval={0} angle={-20} textAnchor="end" height={60} />
                <YAxis allowDecimals={false} width={32} />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" name="Events" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Top CTAs (7d)</h3>
          {ctaBreakdown.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500 dark:text-zinc-400">No CTA clicks recorded yet.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {ctaBreakdown.slice(0, 8).map((row) => (
                <li
                  key={`${row.cta_name}-${row.location}`}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <span className="truncate text-slate-800 dark:text-zinc-200">
                    {row.cta_name}
                    <span className="ml-1 text-xs text-slate-400 dark:text-zinc-500">· {row.location}</span>
                  </span>
                  <span className="shrink-0 tabular-nums font-medium text-slate-600 dark:text-zinc-400">
                    {row.count}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Top pages (7d)</h3>
          {traffic.topPages7d.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500 dark:text-zinc-400">No page views yet.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {traffic.topPages7d.map((p) => (
                <li key={p.path} className="flex items-center justify-between gap-3 text-sm">
                  <span className="truncate font-medium text-slate-800 dark:text-zinc-200">{p.path}</span>
                  <span className="shrink-0 tabular-nums text-slate-500 dark:text-zinc-400">{p.views}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Users & billing</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li className="flex justify-between">
              <span className="text-slate-600 dark:text-zinc-400">Total users</span>
              <span className="font-medium tabular-nums text-slate-900 dark:text-zinc-100">
                {overview.totalUsers}
              </span>
            </li>
            <li className="flex justify-between">
              <span className="text-slate-600 dark:text-zinc-400">Active subscribers</span>
              <span className="font-medium tabular-nums">{overview.activeSubscribers}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-slate-600 dark:text-zinc-400">Active trials</span>
              <span className="font-medium tabular-nums">{overview.activeTrials}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-slate-600 dark:text-zinc-400">Open feedback</span>
              <span className="font-medium tabular-nums">{overview.openFeedback}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-slate-600 dark:text-zinc-400">Signup rate (7d)</span>
              <span className="font-medium tabular-nums">
                {traffic.viewsToSignupRate != null ? `${traffic.viewsToSignupRate}%` : "—"}
              </span>
            </li>
          </ul>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Recent conversions</h3>
          <Link
            href={ROUTES.admin.analytics}
            className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400"
          >
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs text-slate-500 dark:border-zinc-700 dark:text-zinc-400">
                <th className="px-2 py-2 font-medium">Time</th>
                <th className="px-2 py-2 font-medium">Event</th>
                <th className="px-2 py-2 font-medium">User</th>
                <th className="px-2 py-2 font-medium">Source</th>
              </tr>
            </thead>
            <tbody>
              {recent.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-2 py-6 text-center text-slate-400 dark:text-zinc-500">
                    No conversion events in the last 7 days.
                  </td>
                </tr>
              ) : (
                recent.slice(0, 12).map((row) => (
                  <tr key={row.id} className="border-b border-slate-100 last:border-0 dark:border-zinc-800">
                    <td className="whitespace-nowrap px-2 py-2 text-xs text-slate-500 dark:text-zinc-400">
                      {new Date(row.createdAt).toLocaleString()}
                    </td>
                    <td className="px-2 py-2 font-medium text-slate-800 dark:text-zinc-200">
                      {CONVERSION_LABELS[row.eventName] ?? row.eventName}
                    </td>
                    <td className="max-w-[140px] truncate px-2 py-2 text-xs text-slate-500 dark:text-zinc-400">
                      {row.userEmail ?? "—"}
                    </td>
                    <td className="px-2 py-2 text-xs text-slate-500 dark:text-zinc-400">{row.source}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <p className="text-xs text-slate-400 dark:text-zinc-500">
        GA4 receives the same conversion event names for marketing. Full charts live under Traffic & analytics.
      </p>
    </div>
  );
}
