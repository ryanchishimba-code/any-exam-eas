"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Flame,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import type { StudentDashboardData } from "@/lib/learning/student-dashboard";
import { StudentDashboardCharts } from "@/components/dashboard/StudentDashboardChartsLazy";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressMetricsNotice } from "@/components/legal/ProgressMetricsNotice";
import { PRACTICE_PROGRESS_LABEL } from "@/lib/site";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

function scoreBg(score: number): string {
  if (score >= 80) return "bg-blue-100 text-blue-900";
  if (score >= 60) return "bg-[var(--color-accent)]/10 text-[var(--color-accent)]";
  return "bg-amber-100 text-amber-900";
}

export function StudentDashboard() {
  const [data, setData] = useState<StudentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/learning/dashboard")
      .then((r) => r.json())
      .then((d) => setData(d.dashboard ?? null))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mt-8 space-y-6">
        <div className="h-36 animate-pulse rounded-3xl bg-black/[0.04]" />
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="h-80 animate-pulse rounded-2xl bg-black/[0.04] lg:col-span-3" />
          <div className="h-80 animate-pulse rounded-2xl bg-black/[0.04] lg:col-span-2" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <Card className="mt-8 border-dashed">
        <CardContent className="flex flex-col items-center py-14 text-center">
          <Sparkles className="mb-4 h-10 w-10 text-[var(--color-accent)]" />
          <p className="text-lg font-semibold">Your dashboard is waiting</p>
          <p className="mt-2 max-w-md text-sm text-[var(--color-ink-muted)]">
            Complete a practice session to unlock accuracy trends, weak-topic insights, and
            test history.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button href="/study/practice?mode=bank">Question bank</Button>
            <Button href="/study/practice?mode=timed" variant="secondary">
              Timed exam
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { headline, weakTopics, recentTests } = data;

  return (
    <div className="mt-8 space-y-8">
      {/* Hero + quick actions */}
      <section className="relative overflow-hidden rounded-3xl border border-black/[0.06] bg-gradient-to-br from-[var(--color-accent)]/8 via-white to-violet-500/5 p-6 shadow-sm md:p-8">
        <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-[var(--color-accent)]/10 blur-3xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="border-[var(--color-accent)]/20 bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                <Sparkles className="mr-1 h-3 w-3" />
                Your progress
              </Badge>
              {headline.studyStreakDays > 0 && (
                <Badge className="gap-1 border-amber-500/30 bg-amber-500/10 text-amber-700">
                  <Flame className="h-3 w-3" />
                  {headline.studyStreakDays} day streak
                </Badge>
              )}
            </div>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--color-ink)] md:text-3xl">
              {headline.motivationalMessage}
            </h2>
            <div className="mt-5 flex flex-wrap gap-4 text-sm">
              <StatPill
                label={PRACTICE_PROGRESS_LABEL}
                value={`${headline.readinessScore}%`}
                icon={Target}
              />
              <StatPill
                label="Overall accuracy"
                value={headline.overallAccuracy != null ? `${headline.overallAccuracy}%` : "—"}
                icon={TrendingUp}
              />
              {headline.trendDelta != null && (
                <StatPill
                  label="14-day trend"
                  value={`${headline.trendDelta >= 0 ? "+" : ""}${headline.trendDelta}%`}
                  icon={ArrowUpRight}
                  highlight={headline.trendDelta >= 0}
                />
              )}
            </div>
          </div>

          <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <Button
              href="/study/practice?mode=timed"
              className="!rounded-2xl !px-6 shadow-[0_8px_24px_rgba(0,113,227,0.25)]"
            >
              <Zap className="mr-2 h-4 w-4" />
              Timed exam
            </Button>
            <Button href="/study/practice?mode=bank" variant="secondary" className="!rounded-2xl !px-6">
              Question bank
            </Button>
          </div>
        </div>
      </section>

      {/* Charts row — Recharts loaded on demand */}
      <StudentDashboardCharts
        accuracyTrend={data.accuracyTrend}
        weakTopics={weakTopics}
      />

      {/* Recent tests */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
          <div>
            <CardTitle className="text-base">Recent tests</CardTitle>
            <CardDescription>Scores from completed practice and mock exams</CardDescription>
          </div>
          <Link
            href={ROUTES.analytics}
            className="text-xs font-medium text-[var(--color-accent)] hover:underline"
          >
            Full history
          </Link>
        </CardHeader>
        <CardContent>
          {recentTests.length > 0 ? (
            <ul className="divide-y divide-black/[0.06]">
              {recentTests.map((test) => (
                <li
                  key={test.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-[var(--color-ink)]">{test.title}</p>
                    <p className="text-xs text-[var(--color-ink-muted)]">
                      {test.field}
                      {test.correct != null && test.total != null && (
                        <> · {test.correct}/{test.total} correct</>
                      )}
                      {" · "}
                      {new Date(test.completedAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-sm font-semibold tabular-nums",
                      scoreBg(test.score)
                    )}
                  >
                    {test.score}%
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-2xl border border-dashed border-black/[0.1] bg-[var(--color-surface)] px-6 py-10 text-center">
              <p className="text-sm font-medium text-[var(--color-ink)]">No scored tests yet</p>
              <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
                Generate a mock exam or finish a timed session to see scores here.
              </p>
              <Button href="/study/practice?mode=bank" className="mt-4 !rounded-xl" variant="secondary">
                Open question bank
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <ProgressMetricsNotice className="mt-2" />
    </div>
  );
}

function StatPill({
  label,
  value,
  icon: Icon,
  highlight,
}: {
  label: string;
  value: string;
  icon: typeof Target;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-black/[0.06] bg-white/70 px-3 py-2 backdrop-blur-sm">
      <Icon
        className={cn(
          "h-4 w-4",
          highlight ? "text-blue-700" : "text-[var(--color-accent)]"
        )}
      />
      <div>
        <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--color-ink-muted)]">
          {label}
        </p>
        <p className="font-semibold tabular-nums text-[var(--color-ink)]">{value}</p>
      </div>
    </div>
  );
}
