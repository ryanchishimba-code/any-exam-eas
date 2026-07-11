"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BarChart3, BookMarked, GraduationCap } from "lucide-react";
import { ReadinessRing } from "@/components/study/ReadinessRing";
import type { StudentDashboardData } from "@/lib/learning/student-dashboard";
import type { LearningProfileSnapshot } from "@/lib/learning/types";
import { EXAM_CATALOG, examFieldIds, examSlugFromFieldId } from "@/lib/edtech/exams";
import { recentTestHref } from "@/lib/edtech/recent-test-links";
import { libraryTopicHref, spacedReviewHref } from "@/lib/edtech/practice-links";
import { getExamTopicStudyLinks } from "@/lib/library/exam-topic-bridge";
import {
  getMemoryCardIdsForTopic,
  normalizeWeakAreaTopicKey,
} from "@/lib/library/weak-area-map";
import { fullExamLaunchHref } from "@/lib/full-exam/config";
import { studyUi } from "@/lib/study/study-ui";
import type { ExamSlug } from "@/types/edtech";
import { Button } from "@/components/ui/Button";
import { SocialShareBar } from "@/components/social/SocialShareBar";
import { cn } from "@/lib/utils";

type AnalyticsPayload = {
  dashboard: StudentDashboardData;
  profile: LearningProfileSnapshot | null;
};

/** Illustrative national pass-rate references — not verified benchmarks for this product. */
const REFERENCE_PASS_RATES: Partial<Record<ExamSlug, number>> = {
  nclex: 88,
  naplex: 89,
  pance: 92,
  usmle: 92,
};

function practiceProgressIndex(
  readiness: number,
  accuracy: number | null
): number {
  const acc = accuracy ?? readiness;
  return Math.min(100, Math.max(0, Math.round(readiness * 0.55 + acc * 0.45)));
}

export function StudentAnalyticsDashboard({
  examSlug,
  examName,
  initialData,
}: {
  examSlug: ExamSlug;
  examName: string;
  initialData?: AnalyticsPayload;
}) {
  const [data, setData] = useState<AnalyticsPayload | null>(initialData ?? null);
  const [loading, setLoading] = useState(!initialData);

  useEffect(() => {
    // Prefer fresh server payload when exam changes; otherwise fetch client-side.
    if (initialData) {
      setData(initialData);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    Promise.all([
      fetch(`/api/learning/dashboard?examSlug=${encodeURIComponent(examSlug)}`).then((r) =>
        r.json()
      ),
      fetch("/api/learning/profile").then((r) => r.json()),
    ])
      .then(([dashRes, profileRes]) => {
        if (cancelled) return;
        setData({
          dashboard: dashRes.dashboard,
          profile: profileRes.profile ?? null,
        });
      })
      .catch(() => {
        if (!cancelled) setData(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [examSlug, initialData]);

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-[20px] bg-[var(--color-surface)]"
          />
        ))}
      </div>
    );
  }

  if (!data?.dashboard) {
    return (
      <div className={studyUi.emptyState}>
        <p>
          Complete practice sessions to unlock adaptive analytics and progress insights.
        </p>
        <Button href="/question-bank" className="mt-4">
          Start practicing
        </Button>
      </div>
    );
  }

  const { dashboard, profile } = data;
  const fieldIds = examFieldIds(examSlug);
  const primaryField = EXAM_CATALOG[examSlug].fieldId;
  const progressIndex = practiceProgressIndex(
    dashboard.headline.readinessScore,
    dashboard.headline.overallAccuracy
  );
  const referenceRate = REFERENCE_PASS_RATES[examSlug];

  // The API already scopes the payload to this exam; keep a defensive client
  // filter so nothing from another exam can ever leak into the view.
  const weakTopics = dashboard.weakTopics.filter((t) => fieldIds.includes(t.fieldId));

  const strongTopics =
    profile?.strongestConcepts
      ?.filter((c) => fieldIds.includes(c.fieldId))
      .slice(0, 5)
      .map((c) => c.conceptKey) ?? [];
  const primaryExamSlug = examSlug;

  const srsDue = dashboard.spacedReview.dueCount;

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className={studyUi.eyebrow}>Analytics</p>
          <h1 className={studyUi.title}>Your {examName} insights</h1>
          <p className={cn(studyUi.subtitle, "mt-1 max-w-xl")}>
            Readiness, accuracy trends, and weak areas — scoped to your active exam.
          </p>
        </div>
        <SocialShareBar
          entityType="progress"
          text={`I'm ${dashboard.headline.readinessScore}% ready for ${examName} with AnyExamEasy! 🎯`}
          url="https://www.anyexameasy.com"
          size="sm"
        />
      </header>

      <section
        className={cn(
          studyUi.panel,
          studyUi.panelPad,
          "flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8"
        )}
      >
        <ReadinessRing score={dashboard.headline.readinessScore} />
        <div className="min-w-0 flex-1 space-y-2">
          <p className={studyUi.eyebrow}>Readiness</p>
          <p className="text-[20px] font-semibold tracking-tight text-[var(--color-ink)] sm:text-[22px]">
            {dashboard.headline.readinessScore >= 75
              ? "You're in strong shape — keep the momentum."
              : dashboard.headline.readinessScore >= 50
                ? "Solid progress — focus weak areas to climb faster."
                : "Early stage — consistent practice builds readiness quickly."}
          </p>
          <p className={studyUi.sectionHint}>
            {dashboard.headline.overallAccuracy != null
              ? `${dashboard.headline.overallAccuracy}% accuracy across ${dashboard.headline.totalAttempts} attempts`
              : `${dashboard.headline.totalAttempts} attempts logged`}
            {dashboard.headline.studyStreakDays > 0
              ? ` · ${dashboard.headline.studyStreakDays}-day streak`
              : ""}
          </p>
        </div>
      </section>

      {srsDue > 0 ? (
        <section className={cn(studyUi.panel, studyUi.panelPad, "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between")}>
          <div>
            <p className={studyUi.eyebrow}>Spaced review</p>
            <p className="mt-1 text-[17px] font-semibold text-[var(--color-ink)]">
              {srsDue} question{srsDue === 1 ? "" : "s"} due now
            </p>
            <p className={cn(studyUi.sectionHint, "mt-0.5")}>
              {dashboard.spacedReview.weakDueCount} flagged as weak — clear them before they slip.
            </p>
          </div>
          <Link
            href={spacedReviewHref(primaryExamSlug, Math.min(25, Math.max(10, srsDue)))}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-apple-sm)] transition hover:opacity-90"
          >
            Review due
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </section>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Practice progress index"
          value={`${progressIndex}%`}
          hint="In-app metric only — not an exam pass prediction"
        />
        <MetricCard
          label="Readiness score"
          value={`${dashboard.headline.readinessScore}%`}
          hint={`Composite from your ${examName} practice`}
        />
        <MetricCard
          label="Overall accuracy"
          value={
            dashboard.headline.overallAccuracy != null
              ? `${dashboard.headline.overallAccuracy}%`
              : "—"
          }
          hint={`${dashboard.headline.totalAttempts} attempts`}
        />
        <MetricCard
          label="Study streak"
          value={`${dashboard.headline.studyStreakDays}d`}
          hint={dashboard.headline.motivationalMessage}
        />
      </div>

      {referenceRate != null ? (
        <p className="text-xs text-[var(--color-ink-muted)]">
          Reference only: published national pass rates for this exam type are often cited around{" "}
          {referenceRate}% — not a benchmark or prediction for your results.
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <section className={studyUi.chartPanel}>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-[var(--color-ink-muted)]" aria-hidden />
            <h3 className={studyUi.sectionTitle}>Accuracy trend (14 days)</h3>
          </div>
          <div className="mt-4 flex h-40 items-end gap-1">
            {dashboard.accuracyTrend.map((p) => (
              <div key={p.date} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-t bg-[var(--color-accent)]/70 transition-all"
                  style={{
                    height: p.accuracy != null ? `${Math.max(8, p.accuracy)}%` : "4px",
                    opacity: p.attempts ? 1 : 0.25,
                  }}
                  title={p.accuracy != null ? `${p.accuracy}%` : "No data"}
                />
                <span className="text-[9px] text-[var(--color-ink-muted)]">{p.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={studyUi.chartPanel}>
          <h3 className={studyUi.sectionTitle}>Weak areas — remediation</h3>
          {weakTopics.length === 0 ? (
            <p className="mt-4 text-sm text-[var(--color-ink-muted)]">
              No weak topics detected yet. Keep practicing!
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {weakTopics.slice(0, 6).map((t) => (
                <li key={t.id}>
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <span className="font-medium">{t.name}</span>
                    <span className="flex items-center gap-2">
                      <WeakTopicDeepDiveLink conceptKey={t.id} fieldId={t.fieldId} />
                      <WeakTopicCardsLink conceptKey={t.id} fieldId={t.fieldId} />
                      <span className="tabular-nums text-[var(--color-ink-muted)]">
                        {t.masteryScore}%
                      </span>
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[var(--color-border)]">
                    <div
                      className="h-full rounded-full bg-[var(--color-accent)]"
                      style={{ width: `${t.masteryScore}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
          <Button
            href={`/question-bank?field=${primaryField}&style=weak_areas`}
            variant="secondary"
            className="mt-4 w-full"
          >
            Practice weak areas
          </Button>
        </section>
      </div>

      {strongTopics.length > 0 && (
        <section className={cn(studyUi.panel, studyUi.panelPad, "border-[var(--color-accent)]/20 bg-[var(--color-accent)]/[0.04]")}>
          <h3 className={studyUi.sectionTitle}>Strong topics</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {strongTopics.map((c) => (
              <li
                key={c}
                className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 py-1 text-xs font-medium text-[var(--color-ink)]"
              >
                {c}
              </li>
            ))}
          </ul>
        </section>
      )}

      {examSlug === "pance" ? (
        <section className={cn(studyUi.panel, studyUi.panelPad)}>
          <h3 className={studyUi.sectionTitle}>PANCE endurance check</h3>
          <p className={cn(studyUi.sectionHint, "mt-2")}>
            Full 300-question / 5-hour simulation aligned to NCCPA timing — build stamina before test day.
          </p>
          <Button href={fullExamLaunchHref("pance", { mode: "full" })} className="mt-4">
            Take PANCE practice exam
          </Button>
        </section>
      ) : null}

      {dashboard.recentTests.length > 0 && (
        <section>
          <h3 className={studyUi.sectionTitle}>Recent sessions</h3>
          <ul className={cn(studyUi.panel, "mt-3 divide-y divide-[var(--color-border)]")}>
            {dashboard.recentTests.slice(0, 5).map((t) => (
              <li key={t.id}>
                <Link
                  href={recentTestHref(primaryExamSlug, t)}
                  className="flex items-center justify-between px-4 py-3 text-sm transition hover:bg-[var(--color-surface)]"
                >
                  <span className="font-medium text-[var(--color-ink)]">{t.title}</span>
                  <span className="font-semibold tabular-nums text-[var(--color-ink)]">
                    {t.score}%
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

/** Deep dive link for a weak topic when a review module exists. */
function WeakTopicDeepDiveLink({
  conceptKey,
  fieldId,
}: {
  conceptKey: string;
  fieldId: string;
}) {
  const topicKey = normalizeWeakAreaTopicKey(conceptKey);
  const examSlug = examSlugFromFieldId(fieldId);
  if (!examSlug) return null;
  const links = getExamTopicStudyLinks(examSlug, topicKey);
  if (!links.deepDiveHref) return null;

  return (
    <Link
      href={links.deepDiveHref}
      className="inline-flex items-center gap-1 rounded-full bg-violet-600 px-2 py-0.5 text-[11px] font-semibold text-white transition hover:bg-violet-700"
    >
      <GraduationCap className="h-3 w-3" aria-hidden />
      Deep dive
    </Link>
  );
}

/** Links a weak topic to its recommended memory cards on /library, when any exist. */
function WeakTopicCardsLink({
  conceptKey,
  fieldId,
}: {
  conceptKey: string;
  fieldId: string;
}) {
  const topicKey = normalizeWeakAreaTopicKey(conceptKey);
  const examSlug = examSlugFromFieldId(fieldId);
  if (!examSlug || getMemoryCardIdsForTopic(topicKey).length === 0) return null;

  return (
    <Link
      href={libraryTopicHref(examSlug, topicKey)}
      className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-semibold text-violet-700 ring-1 ring-violet-200 transition hover:bg-violet-100"
    >
      <BookMarked className="h-3 w-3" aria-hidden />
      Memory cards
    </Link>
  );
}

function MetricCard({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint: string;
  accent?: "emerald" | "amber";
}) {
  return (
    <div className={studyUi.metricCard}>
      <p className={studyUi.eyebrow}>{label}</p>
      <p
        className={cn(
          "mt-2 text-3xl font-bold tabular-nums tracking-tight",
          accent === "emerald" && "text-emerald-600",
          accent === "amber" && "text-amber-600",
          !accent && "text-[var(--color-ink)]"
        )}
      >
        {value}
      </p>
      <p className={cn(studyUi.sectionHint, "mt-1")}>{hint}</p>
    </div>
  );
}

