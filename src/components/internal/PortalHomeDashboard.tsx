"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import type { PortalOverview } from "@/lib/internal/overview";
import { InlineError } from "@/components/ui/StatusMessage";

type PortalLinks = {
  analytics: string;
  users: string;
  feedback: string;
};

const DEFAULT_LINKS: PortalLinks = {
  analytics: "/internal/analytics",
  users: "/internal/users",
  feedback: "/internal/feedback",
};

export function PortalHomeDashboard({
  links = DEFAULT_LINKS,
  showTitle = true,
}: {
  links?: PortalLinks;
  showTitle?: boolean;
} = {}) {
  const [overview, setOverview] = useState<PortalOverview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/internal/overview", { credentials: "include" })
      .then(async (r) => {
        const data = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(data?.error ?? `HTTP ${r.status}`);
        return data.overview as PortalOverview;
      })
      .then(setOverview)
      .catch((e) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-xl border border-black/5 bg-black/[0.03]"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return <InlineError>Could not load overview: {error}</InlineError>;
  }

  if (!overview) {
    return <p className="text-sm text-black/50">No overview data yet.</p>;
  }

  const { traffic } = overview;

  const userCards = [
    { label: "Total users", value: overview.totalUsers },
    { label: "Active subscribers", value: overview.activeSubscribers },
    { label: "Trial users", value: overview.activeTrials },
    { label: "Active today", value: overview.activeToday },
    { label: "Signups (7d)", value: overview.recentSignups },
    { label: "Open feedback", value: overview.openFeedback },
  ];

  const trafficCards = [
    { label: "Page views today", value: traffic.pageViewsToday },
    { label: "Unique visitors today", value: traffic.uniqueVisitorsToday },
    { label: "Page views (7d)", value: traffic.pageViews7d },
    { label: "Unique visitors (7d)", value: traffic.uniqueVisitors7d },
    {
      label: "Signup rate (7d)",
      value:
        traffic.viewsToSignupRate != null ? `${traffic.viewsToSignupRate}%` : "—",
    },
    { label: "Signups (7d)", value: traffic.signups7d },
  ];

  return (
    <div className="space-y-8">
      {showTitle ? (
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Portal overview</h1>
          <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
            Real-time snapshot of platform health, web traffic, and user needs.
          </p>
        </div>
      ) : null}

      <section className="rounded-2xl border border-indigo-200/70 bg-gradient-to-br from-indigo-50/80 to-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-indigo-900/80">
              Web traffic
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Beacon-tracked page views across marketing and product pages.
            </p>
          </div>
          <Link
            href={links.analytics}
            className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
          >
            Full traffic & analytics →
          </Link>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trafficCards.map((c) => (
            <div key={c.label} className="rounded-xl border border-indigo-100 bg-white/90 p-4">
              <p className="text-xs text-slate-500">{c.label}</p>
              <p className="mt-2 text-2xl font-semibold tabular-nums text-slate-900">{c.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-indigo-100 bg-white/90 p-4">
            <h3 className="text-sm font-semibold text-slate-900">Traffic trend (7d)</h3>
            <div className="mt-3 h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={traffic.trend7d}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} width={36} />
                  <Tooltip />
                  <Line type="monotone" dataKey="views" name="Page views" stroke="#4f46e5" strokeWidth={2} />
                  <Line type="monotone" dataKey="visitors" name="Visitors" stroke="#0ea5e9" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border border-indigo-100 bg-white/90 p-4">
            <h3 className="text-sm font-semibold text-slate-900">Top pages (7d)</h3>
            {traffic.topPages7d.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">No page views recorded yet.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {traffic.topPages7d.map((p) => (
                  <li key={p.path} className="flex items-center justify-between gap-3 text-sm">
                    <span className="truncate font-medium text-slate-800">{p.path}</span>
                    <span className="shrink-0 tabular-nums text-slate-500">{p.views}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Users & billing
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {userCards.map((c) => (
            <div
              key={c.label}
              className="rounded-xl border border-black/10 bg-white p-5 transition-shadow hover:shadow-sm"
            >
              <p className="text-xs text-black/55">{c.label}</p>
              <p className="mt-2 text-3xl font-semibold tabular-nums">{c.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-black/10 bg-white p-5">
          <h2 className="text-sm font-semibold">Quick actions</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link className="text-[var(--color-accent)] hover:underline" href={links.users}>
                Search & manage users →
              </Link>
            </li>
            <li>
              <Link className="text-[var(--color-accent)] hover:underline" href={links.feedback}>
                Review open feedback →
              </Link>
            </li>
            <li>
              <Link className="text-[var(--color-accent)] hover:underline" href={links.analytics}>
                Traffic, engagement & revenue →
              </Link>
            </li>
          </ul>
        </div>

        <div className="rounded-xl border border-black/10 bg-white p-5">
          <h2 className="text-sm font-semibold">Study tool usage (7d)</h2>
          {overview.studyToolUsage.length === 0 ? (
            <p className="mt-3 text-sm text-black/50">No generation activity yet.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {overview.studyToolUsage.map((t) => (
                <li key={t.tool} className="flex items-center justify-between text-sm">
                  <span className="capitalize text-black/80">{t.tool}</span>
                  <span className="font-medium tabular-nums">{t.count}</span>
                </li>
              ))}
            </ul>
          )}
          {overview.avgQuizScore != null ? (
            <p className="mt-4 text-xs text-black/55">Avg quiz score: {overview.avgQuizScore}%</p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
