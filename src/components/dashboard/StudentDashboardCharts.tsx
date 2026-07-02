"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TrendingUp } from "lucide-react";
import type { AccuracyTrendPoint, WeakTopicRow } from "@/lib/learning/student-dashboard";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const WEAK_COLORS = ["#0071e3", "#5856d6", "#ff9500", "#ff375f", "#30d158", "#64d2ff"];

type ChartPoint = AccuracyTrendPoint & { accuracy?: number };

export function StudentDashboardCharts({
  accuracyTrend,
  weakTopics,
}: {
  accuracyTrend: AccuracyTrendPoint[];
  weakTopics: WeakTopicRow[];
}) {
  const chartData = useMemo(
    () =>
      accuracyTrend.map((p) => ({
        ...p,
        accuracy: p.accuracy ?? undefined,
      })),
    [accuracyTrend]
  );

  const hasTrendData = chartData.some((p) => p.accuracy != null);

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="text-base">Accuracy trend</CardTitle>
          <CardDescription>Daily performance over the last 14 days</CardDescription>
        </CardHeader>
        <CardContent>
          {hasTrendData ? (
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="accuracyFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11, fill: "var(--color-ink-muted)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 11, fill: "var(--color-ink-muted)" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.[0]) return null;
                      const row = payload[0].payload as ChartPoint;
                      return (
                        <div className="rounded-xl border border-black/[0.06] bg-white px-3 py-2 text-xs shadow-md">
                          <p className="font-medium text-[var(--color-ink)]">{row.label}</p>
                          <p className="text-[var(--color-ink-muted)]">
                            {row.accuracy != null ? `${row.accuracy}% correct` : "No attempts"}
                            {row.attempts > 0 && ` · ${row.attempts} Q`}
                          </p>
                        </div>
                      );
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="accuracy"
                    stroke="var(--color-accent)"
                    strokeWidth={2.5}
                    fill="url(#accuracyFill)"
                    connectNulls={false}
                    dot={{ r: 3, fill: "var(--color-accent)", strokeWidth: 0 }}
                    activeDot={{ r: 5 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyChartHint />
          )}
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Weak topics</CardTitle>
          <CardDescription>Focus here for the fastest score lift</CardDescription>
        </CardHeader>
        <CardContent>
          {weakTopics.length > 0 ? (
            <div className="space-y-5">
              <div className="mx-auto h-[140px] w-full max-w-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={weakTopics}
                      dataKey="weight"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={42}
                      outerRadius={62}
                      paddingAngle={2}
                    >
                      {weakTopics.map((_, i) => (
                        <Cell key={i} fill={WEAK_COLORS[i % WEAK_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.[0]) return null;
                        const row = payload[0].payload as WeakTopicRow;
                        return (
                          <div className="rounded-xl border border-black/[0.06] bg-white px-3 py-2 text-xs shadow-md">
                            <p className="font-medium text-[var(--color-ink)]">{row.name}</p>
                            <p className="text-[var(--color-ink-muted)]">
                              {row.masteryScore}% topic progress · {row.attempts} attempts
                            </p>
                          </div>
                        );
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <ul className="space-y-3">
                {weakTopics.slice(0, 5).map((topic, i) => (
                  <li key={topic.id}>
                    <div className="mb-1 flex items-center justify-between gap-2 text-xs">
                      <span className="flex items-center gap-2 truncate font-medium text-[var(--color-ink)]">
                        <span
                          className="h-2 w-2 shrink-0 rounded-full"
                          style={{ backgroundColor: WEAK_COLORS[i % WEAK_COLORS.length] }}
                        />
                        {topic.name}
                      </span>
                      <span className="shrink-0 tabular-nums text-[var(--color-ink-muted)]">
                        {topic.masteryScore}%
                      </span>
                    </div>
                    <Progress value={topic.masteryScore} className="h-1.5" />
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-[var(--color-ink-muted)]">
              Answer more questions to map your weak topics.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function EmptyChartHint() {
  return (
    <div className="flex h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-black/[0.1] bg-[var(--color-surface)] text-center">
      <TrendingUp className="mb-3 h-8 w-8 text-[var(--color-ink-muted)]/60" />
      <p className="text-sm font-medium text-[var(--color-ink)]">No accuracy data yet</p>
      <p className="mt-1 max-w-xs text-xs text-[var(--color-ink-muted)]">
        Your trend line appears after you answer questions on any study session.
      </p>
      <Button href="/study/practice" className="mt-4 !rounded-xl" variant="secondary">
        Start a session
      </Button>
    </div>
  );
}
