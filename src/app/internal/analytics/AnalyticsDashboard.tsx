"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { AnalyticsDashboardData } from "@/lib/analytics/dashboard";

type Overview = {
  generationsToday: number;
  trialsActive: number;
  signupsToday: number;
  dailyTrend: { date: string; dau: number; generations: number }[];
};

const PIE_COLORS = ["#0ea5e9", "#8b5cf6", "#22c55e", "#f97316", "#ec4899", "#64748b"];

function daysAgo(n: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-black/10 bg-white p-4">
      <div className="text-xs text-black/60">{label}</div>
      <div className="mt-2 text-2xl font-semibold tabular-nums">{value}</div>
    </div>
  );
}

export default function AnalyticsDashboard() {
  const [dashboard, setDashboard] = useState<AnalyticsDashboardData | null>(null);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [from, setFrom] = useState(daysAgo(30));
  const [to, setTo] = useState(daysAgo(0));
  const [exporting, setExporting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [dashRes, overviewRes] = await Promise.all([
        fetch(`/api/internal/analytics/dashboard?from=${from}&to=${to}`, {
          credentials: "include",
        }),
        fetch("/api/internal/analytics/overview", { credentials: "include" }),
      ]);
      const dashJson = await dashRes.json().catch(() => ({}));
      const overviewJson = await overviewRes.json().catch(() => ({}));
      if (!dashRes.ok) throw new Error(dashJson?.error ?? `HTTP ${dashRes.status}`);
      setDashboard(dashJson.dashboard as AnalyticsDashboardData);
      if (overviewRes.ok) setOverview(overviewJson.overview as Overview);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [from, to]);

  useEffect(() => {
    void load();
    const interval = setInterval(() => void load(), 60_000);
    return () => clearInterval(interval);
  }, [load]);

  const userTypeData = useMemo(() => {
    if (!dashboard) return [];
    return [
      { name: "New", value: dashboard.newUsers },
      { name: "Returning", value: dashboard.returningUsers },
    ];
  }, [dashboard]);

  async function exportCsv() {
    setExporting(true);
    try {
      const res = await fetch(
        `/api/internal/analytics/dashboard?from=${from}&to=${to}&format=csv`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `analytics-${from}-${to}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("CSV export requires admin role.");
    } finally {
      setExporting(false);
    }
  }

  if (loading && !dashboard) {
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

  if (error && !dashboard) {
    return <p className="text-sm text-red-700">Failed: {error}</p>;
  }

  if (!dashboard) {
    return <p className="text-sm text-black/50">No analytics data yet.</p>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 rounded-xl border border-black/10 bg-white p-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-wrap gap-4">
          <label className="text-sm">
            <span className="apple-label">From</span>
            <input
              type="date"
              className="apple-input mt-1 block"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </label>
          <label className="text-sm">
            <span className="apple-label">To</span>
            <input
              type="date"
              className="apple-input mt-1 block"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </label>
          <button
            type="button"
            className="self-end rounded-full border border-black/10 px-4 py-2 text-sm hover:bg-black/[0.03]"
            onClick={() => void load()}
          >
            Refresh
          </button>
        </div>
        <button
          type="button"
          disabled={exporting}
          className="self-end rounded-full bg-[var(--color-accent)] px-5 py-2 text-sm font-medium text-white disabled:opacity-60"
          onClick={() => void exportCsv()}
        >
          {exporting ? "Exporting…" : "Export CSV"}
        </button>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total users" value={dashboard.totalUsers} />
        <StatCard label="Active users (range)" value={dashboard.activeUsers} />
        <StatCard label="Sessions" value={dashboard.totalSessions} />
        <StatCard
          label="Avg session"
          value={`${Math.floor(dashboard.avgSessionDurationSec / 60)}m ${dashboard.avgSessionDurationSec % 60}s`}
        />
        <StatCard label="Bounce rate" value={`${dashboard.bounceRate}%`} />
        <StatCard label="New users" value={dashboard.newUsers} />
        <StatCard label="Returning users" value={dashboard.returningUsers} />
        <StatCard
          label="Feedback (avg ★)"
          value={`${dashboard.feedbackSummary.total} · ${dashboard.feedbackSummary.avgRating}`}
        />
      </section>

      {overview && (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Generations today" value={overview.generationsToday} />
          <StatCard label="Trials active" value={overview.trialsActive} />
          <StatCard label="Signups today" value={overview.signupsToday} />
        </section>
      )}

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-black/10 bg-white p-4">
          <h2 className="mb-4 text-sm font-semibold">User growth</h2>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={dashboard.userGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="signups"
                  name="Signups"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="cumulative"
                  name="Cumulative"
                  stroke="#22c55e"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-black/10 bg-white p-4">
          <h2 className="mb-4 text-sm font-semibold">New vs returning</h2>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={userTypeData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  {userTypeData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-black/10 bg-white p-4">
          <h2 className="mb-4 text-sm font-semibold">Most visited pages</h2>
          <div style={{ width: "100%", height: 280 }}>
            <ResponsiveContainer>
              <BarChart data={dashboard.topPages} layout="vertical" margin={{ left: 8 }}>
                <XAxis type="number" allowDecimals={false} />
                <YAxis type="category" dataKey="path" width={120} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="views" fill="#8b5cf6" name="Views" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-black/10 bg-white p-4">
          <h2 className="mb-4 text-sm font-semibold">Time on page (avg sec)</h2>
          <div style={{ width: "100%", height: 280 }}>
            <ResponsiveContainer>
              <BarChart data={dashboard.topPages}>
                <XAxis dataKey="path" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="avgDurationSec" fill="#f97316" name="Avg seconds" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-black/10 bg-white p-4">
          <h2 className="mb-4 text-sm font-semibold">Focus areas (generations)</h2>
          <div style={{ width: "100%", height: 240 }}>
            <ResponsiveContainer>
              <BarChart data={dashboard.focusAreas}>
                <XAxis dataKey="area" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="interactions" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-black/10 bg-white p-4">
          <h2 className="mb-4 text-sm font-semibold">Device breakdown</h2>
          <div style={{ width: "100%", height: 240 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={dashboard.deviceBreakdown}
                  dataKey="count"
                  nameKey="deviceType"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(e) => String(e.name ?? "")}
                >
                  {dashboard.deviceBreakdown.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-black/10 bg-white p-4">
        <h2 className="mb-4 text-sm font-semibold">Feedback trends</h2>
        {dashboard.feedbackTrends.length === 0 ? (
          <p className="text-sm text-black/50">No feedback in this range.</p>
        ) : (
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={dashboard.feedbackTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" allowDecimals={false} />
                <YAxis yAxisId="right" orientation="right" domain={[1, 5]} />
                <Tooltip />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="count"
                  name="Submissions"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="avgRating"
                  name="Avg rating"
                  stroke="#f59e0b"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      {overview && overview.dailyTrend.length > 0 && (
        <section className="rounded-xl border border-black/10 bg-white p-4">
          <h2 className="mb-4 text-sm font-semibold">DAU & generations (rollup)</h2>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={overview.dailyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="dau" stroke="#0ea5e9" strokeWidth={2} />
                <Line type="monotone" dataKey="generations" stroke="#22c55e" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      <p className="text-xs text-black/40">
        Near real-time · auto-refresh every 60s · range {dashboard.range.from} →{" "}
        {dashboard.range.to}
      </p>
    </div>
  );
}
