"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DashboardQuickStats } from "@/lib/dashboard/stats";

type SessionRow = {
  id: string;
  examType: string;
  score: number | null;
  status: string;
  completedAt: Date | null;
  createdAt: Date;
};

export function PerformanceAnalytics({
  stats,
  sessions,
}: {
  stats: DashboardQuickStats;
  sessions: SessionRow[];
}) {
  const [examFilter, setExamFilter] = useState<string>("all");

  const filtered = useMemo(
    () =>
      examFilter === "all"
        ? sessions
        : sessions.filter((s) => s.examType === examFilter),
    [sessions, examFilter]
  );

  const weakChart = stats.weakAreas.map((w) => ({
    topic: w.topic.length > 24 ? `${w.topic.slice(0, 22)}…` : w.topic,
    weight: w.weight,
  }));

  return (
    <div className="mt-10 space-y-10">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Questions answered" value={String(stats.questionsAnswered)} />
        <StatCard
          label="Accuracy (30d)"
          value={stats.accuracyPercent != null ? `${stats.accuracyPercent}%` : "—"}
        />
        <StatCard label="Streak" value={`${stats.streakDays} days`} />
      </div>

      {weakChart.length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Weak topics</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weakChart} layout="vertical" margin={{ left: 8, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="topic" width={120} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="weight" radius={4}>
                  {weakChart.map((_, i) => (
                    <Cell key={i} fill={["#0071e3", "#5856d6", "#ff9500", "#ff375f"][i % 4]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">Session history</h2>
          <select
            value={examFilter}
            onChange={(e) => setExamFilter(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="all">All exams</option>
            <option value="nclex">NCLEX</option>
            <option value="usmle">USMLE</option>
            <option value="naplex">NAPLEX</option>
            <option value="top500">Top 500</option>
          </select>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-slate-500">
                <th className="py-2 pr-4">Exam</th>
                <th className="py-2 pr-4">Score</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-500">
                    No sessions yet. Start a practice exam from an exam hub.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="border-b border-slate-100">
                    <td className="py-3 pr-4 font-medium uppercase">{s.examType}</td>
                    <td className="py-3 pr-4">
                      {s.score != null ? `${Math.round(s.score)}%` : "—"}
                    </td>
                    <td className="py-3 pr-4 capitalize">{s.status}</td>
                    <td className="py-3 text-slate-500">
                      {(s.completedAt ?? s.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <p className="text-sm text-slate-500">
        AI insights: connect OPENAI_API_KEY to generate personalized summaries from session
        data via <code className="rounded bg-slate-100 px-1">/api/ai/insights</code> (optional).
      </p>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}
