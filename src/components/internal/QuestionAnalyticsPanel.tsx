"use client";

import { useCallback, useEffect, useState } from "react";

type Overview = {
  totalAttempts: number;
  accuracy: number;
  avgDurationMs: number | null;
  byField: { field: string; attempts: number; accuracy: number }[];
  mostMissed: { questionKey: string; missCount: number; preview: string }[];
};

export function QuestionAnalyticsPanel() {
  const [days, setDays] = useState(30);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/internal/questions/analytics?days=${days}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to load");
      setOverview(data.overview as Overview);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Question analytics</h1>
          <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
            Accuracy, timing, and most-missed items from study sessions.
          </p>
        </div>
        <select
          className="apple-input"
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      {loading && <p className="text-sm text-[var(--color-ink-muted)]">Loading…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {overview && !loading && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat label="Attempts" value={overview.totalAttempts} />
            <Stat label="Accuracy" value={`${overview.accuracy}%`} />
            <Stat
              label="Avg time"
              value={
                overview.avgDurationMs != null
                  ? `${(overview.avgDurationMs / 1000).toFixed(1)}s`
                  : "—"
              }
            />
          </div>

          {overview.byField.length > 0 && (
            <section className="rounded-xl border border-black/10 bg-white p-6">
              <h2 className="text-sm font-semibold">By field</h2>
              <ul className="mt-4 divide-y divide-black/[0.06]">
                {overview.byField.map((row) => (
                  <li
                    key={row.field}
                    className="flex items-center justify-between py-3 text-sm"
                  >
                    <span className="font-medium capitalize">{row.field}</span>
                    <span className="text-[var(--color-ink-muted)]">
                      {row.attempts} attempts · {row.accuracy}% correct
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="rounded-xl border border-black/10 bg-white p-6">
            <h2 className="text-sm font-semibold">Most missed</h2>
            {overview.mostMissed.length === 0 ? (
              <p className="mt-3 text-sm text-[var(--color-ink-muted)]">
                No missed attempts in this window yet.
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {overview.mostMissed.map((row) => (
                  <li
                    key={row.questionKey}
                    className="rounded-lg bg-[var(--color-surface)] px-4 py-3 text-sm"
                  >
                    <p className="line-clamp-2 font-medium">{row.preview}</p>
                    <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
                      {row.missCount} miss{row.missCount === 1 ? "" : "es"}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-black/10 bg-white p-4">
      <p className="text-xs text-black/60">{label}</p>
      <p className="mt-2 text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}
