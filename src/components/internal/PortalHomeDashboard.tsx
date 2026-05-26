"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { PortalOverview } from "@/lib/internal/overview";

export function PortalHomeDashboard() {
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
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-xl border border-black/5 bg-black/[0.03]"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-red-700">Could not load overview: {error}</p>;
  }

  if (!overview) {
    return <p className="text-sm text-black/50">No overview data yet.</p>;
  }

  const cards = [
    { label: "Total users", value: overview.totalUsers },
    { label: "Active subscribers", value: overview.activeSubscribers },
    { label: "Trial users", value: overview.activeTrials },
    { label: "Active today", value: overview.activeToday },
    { label: "Signups (7d)", value: overview.recentSignups },
    { label: "Open feedback", value: overview.openFeedback },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Portal overview</h1>
        <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
          Real-time snapshot of platform health and engagement.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-xl border border-black/10 bg-white p-5 transition-shadow hover:shadow-sm"
          >
            <p className="text-xs text-black/55">{c.label}</p>
            <p className="mt-2 text-3xl font-semibold tabular-nums">{c.value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-black/10 bg-white p-5">
          <h2 className="text-sm font-semibold">Quick actions</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link className="text-[var(--color-accent)] hover:underline" href="/internal/users">
                Search & manage users →
              </Link>
            </li>
            <li>
              <Link
                className="text-[var(--color-accent)] hover:underline"
                href="/internal/feedback"
              >
                Review open feedback →
              </Link>
            </li>
            <li>
              <Link
                className="text-[var(--color-accent)] hover:underline"
                href="/internal/analytics"
              >
                Full analytics dashboard →
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
                <li
                  key={t.tool}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="capitalize text-black/80">{t.tool}</span>
                  <span className="font-medium tabular-nums">{t.count}</span>
                </li>
              ))}
            </ul>
          )}
          {overview.avgQuizScore != null && (
            <p className="mt-4 text-xs text-black/55">
              Avg quiz score: {overview.avgQuizScore}%
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
