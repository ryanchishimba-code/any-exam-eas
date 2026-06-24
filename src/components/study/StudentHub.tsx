"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import type { StudentDashboardData } from "@/lib/learning/student-dashboard";
import type { SubjectCatalogEntry } from "@/lib/subjects/catalog";
import { StudyModePicker } from "@/components/StudyModePicker";
import { ReadinessRing } from "@/components/ui/ReadinessRing";
import { StreakBadge } from "@/components/ui/StreakBadge";
import { Button } from "@/components/ui/Button";
import { AppleLink } from "@/components/ui/AppleLink";
import { ProgressMetricsNotice } from "@/components/legal/ProgressMetricsNotice";
import { formatTrialEntryPrice, formatTrialLabel } from "@/lib/site";
import { displayFirstName } from "@/lib/display-name";

export function StudentHub({ suppressHero = false }: { suppressHero?: boolean }) {
  const { data: session } = useSession();
  const [dashboard, setDashboard] = useState<StudentDashboardData | null>(null);
  const [subjects, setSubjects] = useState<SubjectCatalogEntry[]>([]);
  const [loading, setLoading] = useState(!!session?.user);

  useEffect(() => {
    fetch("/api/catalog/subjects")
      .then((r) => r.json())
      .then((d) => setSubjects(d.subjects ?? []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!session?.user) {
      setLoading(false);
      return;
    }
    fetch("/api/learning/dashboard")
      .then((r) => r.json())
      .then((d) => setDashboard(d.dashboard ?? null))
      .catch(() => setDashboard(null))
      .finally(() => setLoading(false));
  }, [session?.user]);

  const headline = dashboard?.headline;
  const featured = subjects.filter((s) => s.trending || s.recommended).slice(0, 5);
  const rest = subjects.filter((s) => !featured.includes(s));

  return (
    <div className="space-y-16">
      {!suppressHero && (
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between"
      >
        <div className="max-w-lg">
          {headline && headline.studyStreakDays > 0 && (
            <div className="mb-4">
              <StreakBadge days={headline.studyStreakDays} />
            </div>
          )}

          <h2 className="apple-headline">
            {session?.user?.name
              ? `Welcome back, ${displayFirstName(session.user.name)}.`
              : "Your exam prep hub."}
          </h2>
          <p className="apple-subhead mt-3 max-w-md">
            {headline?.motivationalMessage ??
              "Board-style question banks, practice exams, and progress tracking — built to support your exam prep."}
          </p>

          {!session?.user && (
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Button href="/signup?plan=trial">
                Start {formatTrialLabel()} — {formatTrialEntryPrice()} today
              </Button>
              <AppleLink href="/login">Log in</AppleLink>
            </div>
          )}
        </div>

        {session?.user && !loading && headline && (
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-10">
            <ReadinessRing score={headline.readinessScore} />
            <div className="space-y-3">
              <dl className="space-y-3 text-sm">
              <StatRow
                label="Accuracy"
                value={
                  headline.overallAccuracy != null
                    ? `${headline.overallAccuracy}%`
                    : "—"
                }
              />
              <StatRow label="Attempts" value={String(headline.totalAttempts)} />
              {headline.trendDelta != null && (
                <StatRow
                  label="14-day trend"
                  value={`${headline.trendDelta >= 0 ? "+" : ""}${headline.trendDelta}%`}
                  highlight={headline.trendDelta >= 0}
                />
              )}
              </dl>
              <ProgressMetricsNotice className="max-w-xs text-center sm:text-left" />
            </div>
          </div>
        )}

        {session?.user && loading && (
          <div className="h-24 w-24 animate-pulse rounded-full bg-black/[0.04]" />
        )}
      </motion.section>
      )}

      {session?.user && (
        <section className="flex flex-wrap gap-x-8 gap-y-2 border-y border-black/[0.06] py-6">
          <AppleLink href="/study/drugs300">Top 500 Drugs</AppleLink>
          <AppleLink href="/study/practice?mode=timed">Timed exam</AppleLink>
          <AppleLink href="/study/practice?mode=bank">Question bank</AppleLink>
        </section>
      )}

      {subjects.length > 0 && (
        <section>
          <h3 className="text-xs font-medium uppercase tracking-wide text-[var(--color-ink-muted)]">
            Subjects
          </h3>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[...featured, ...rest].slice(0, 6).map((subject, i) => (
              <motion.div
                key={subject.fieldId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link
                  href={`/study/practice?field=${subject.fieldId}`}
                  className="apple-tile block p-5 text-left"
                >
                  <p className="font-semibold tracking-tight text-[var(--color-ink)]">
                    {subject.label}
                  </p>
                  <p className="mt-1 text-xs text-[var(--color-ink-muted)]">{subject.boardExam}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h3 className="apple-headline text-[clamp(1.25rem,3vw,1.75rem)]">Choose a mode.</h3>
        <div className="mt-8">
          <StudyModePicker />
        </div>
      </section>

      {session?.user && dashboard && dashboard.recentTests.length > 0 && (
        <section>
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="text-xs font-medium uppercase tracking-wide text-[var(--color-ink-muted)]">
              Recent tests
            </h3>
            <AppleLink href="/study-hub">View Study Hub</AppleLink>
          </div>
          <ul className="mt-4 divide-y divide-black/[0.06]">
            {dashboard.recentTests.slice(0, 3).map((t) => (
              <li key={t.id} className="flex items-center justify-between py-3.5 text-sm">
                <span className="truncate text-[var(--color-ink)]">{t.title}</span>
                <span className="ml-3 shrink-0 tabular-nums text-[var(--color-ink-muted)]">
                  {t.score}%
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function StatRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-8">
      <dt className="text-[var(--color-ink-muted)]">{label}</dt>
      <dd
        className={`font-medium tabular-nums ${
          highlight ? "text-[var(--color-accent)]" : "text-[var(--color-ink)]"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
