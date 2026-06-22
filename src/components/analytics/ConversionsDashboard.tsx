"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { InlineError } from "@/components/ui/StatusMessage";
import { CONVERSION_EVENTS, type ConversionsDashboardData } from "@/lib/analytics/conversion-types";

const PIE_COLORS = ["#0ea5e9", "#8b5cf6", "#22c55e", "#f97316", "#ec4899"];

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

const EVENT_LABELS: Record<string, string> = {
  [CONVERSION_EVENTS.CTA_CLICKED]: "CTA clicks",
  [CONVERSION_EVENTS.PRICING_VIEWED]: "Pricing views",
  [CONVERSION_EVENTS.PLAN_SELECTED]: "Plan selected",
  [CONVERSION_EVENTS.TRIAL_STARTED]: "Trials started",
  [CONVERSION_EVENTS.SIGNUP_COMPLETED]: "Signups",
};

export function ConversionsDashboard() {
  const [dashboard, setDashboard] = useState<ConversionsDashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [from, setFrom] = useState(daysAgo(30));
  const [to, setTo] = useState(daysAgo(0));

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/internal/analytics/conversions?from=${from}&to=${to}`,
        { credentials: "include" }
      );
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error ?? `HTTP ${res.status}`);
      setDashboard(json.dashboard as ConversionsDashboardData);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [from, to]);

  useEffect(() => {
    void load();
  }, [load]);

  const funnelData = useMemo(() => {
    if (!dashboard) return [];
    return Object.entries(dashboard.totals).map(([eventName, count]) => ({
      eventName,
      label: EVENT_LABELS[eventName] ?? eventName,
      count,
    }));
  }, [dashboard]);

  const pieData = useMemo(() => funnelData.filter((d) => d.count > 0), [funnelData]);

  if (loading && !dashboard) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-xl border border-black/5 bg-black/[0.03]"
          />
        ))}
      </div>
    );
  }

  if (error && !dashboard) {
    return <InlineError>Failed: {error}</InlineError>;
  }

  if (!dashboard) {
    return <p className="text-sm text-black/50">No conversion data yet.</p>;
  }

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-4 text-sm text-indigo-950">
        <p className="font-medium">Hybrid tracking (GA4 + Postgres)</p>
        <p className="mt-1 text-indigo-900/80">
          These charts read from our Neon <code className="text-xs">ConversionEvent</code> table.
          GA4 receives the same event names for ads — mark them as conversions in GA4 Admin → Events.
        </p>
      </div>

      <div className="flex flex-wrap gap-4 rounded-xl border border-black/10 bg-white p-4">
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

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {funnelData.map((item) => (
          <StatCard key={item.eventName} label={item.label} value={item.count} />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-black/10 bg-white p-4">
          <h2 className="mb-4 text-sm font-semibold">Conversions over time</h2>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={dashboard.dailyTotals}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="total" name="All conversions" stroke="#4f46e5" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-black/10 bg-white p-4">
          <h2 className="mb-4 text-sm font-semibold">Funnel mix</h2>
          {pieData.length === 0 ? (
            <p className="text-sm text-black/50">No events in this range.</p>
          ) : (
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={pieData} dataKey="count" nameKey="label" cx="50%" cy="50%" outerRadius={90} label>
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-black/10 bg-white p-4">
          <h2 className="mb-4 text-sm font-semibold">Top CTAs</h2>
          {dashboard.ctaBreakdown.length === 0 ? (
            <p className="text-sm text-black/50">No CTA clicks yet.</p>
          ) : (
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <BarChart data={dashboard.ctaBreakdown.slice(0, 8)} layout="vertical" margin={{ left: 8 }}>
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis
                    type="category"
                    dataKey="cta_name"
                    width={120}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0ea5e9" name="Clicks" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-black/10 bg-white p-4">
          <h2 className="mb-4 text-sm font-semibold">Plans selected</h2>
          {dashboard.planBreakdown.length === 0 ? (
            <p className="text-sm text-black/50">No plan selections yet.</p>
          ) : (
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <BarChart data={dashboard.planBreakdown}>
                  <XAxis dataKey="plan_type" tick={{ fontSize: 10 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#22c55e" name="Selections" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </section>

      <section className="rounded-xl border border-black/10 bg-white p-4">
        <h2 className="mb-4 text-sm font-semibold">Recent conversions</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-black/10 text-xs text-black/60">
                <th className="px-3 py-2 font-medium">Time</th>
                <th className="px-3 py-2 font-medium">Event</th>
                <th className="px-3 py-2 font-medium">User</th>
                <th className="px-3 py-2 font-medium">Source</th>
                <th className="px-3 py-2 font-medium">Properties</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.recent.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-3 py-6 text-center text-black/50">
                    No events in this range.
                  </td>
                </tr>
              ) : (
                dashboard.recent.map((row) => (
                  <tr key={row.id} className="border-b border-black/[0.04] last:border-0">
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-black/70">
                      {new Date(row.createdAt).toLocaleString()}
                    </td>
                    <td className="px-3 py-2 font-medium">{row.eventName}</td>
                    <td className="px-3 py-2 text-xs text-black/70">
                      {row.userEmail ?? row.userId?.slice(0, 8) ?? "—"}
                    </td>
                    <td className="px-3 py-2 text-xs">{row.source}</td>
                    <td className="px-3 py-2 max-w-xs truncate text-xs text-black/60 font-mono">
                      {JSON.stringify(row.properties)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <p className="text-xs text-black/40">
        Range {dashboard.range.from} → {dashboard.range.to} · sourced from Neon Postgres
      </p>
    </div>
  );
}
