"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookMarked, GraduationCap } from "lucide-react";
import type { StudentDashboardData } from "@/lib/learning/student-dashboard";
import type { LearningProfileSnapshot } from "@/lib/learning/types";
import { EXAM_CATALOG, examFieldIds, examSlugFromFieldId } from "@/lib/edtech/exams";
import { libraryTopicHref, spacedReviewHref } from "@/lib/edtech/practice-links";
import { getExamTopicStudyLinks } from "@/lib/library/exam-topic-bridge";
import {
  getMemoryCardIdsForTopic,
  normalizeWeakAreaTopicKey,
} from "@/lib/library/weak-area-map";
import { fullExamLaunchHref } from "@/lib/full-exam/config";
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
}: {
  examSlug: ExamSlug;
  examName: string;
}) {
  const [data, setData] = useState<AnalyticsPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`/api/learning/dashboard?examSlug=${encodeURIComponent(examSlug)}`).then((r) =>
        r.json()
      ),
      fetch("/api/learning/profile").then((r) => r.json()),
    ])
      .then(([dashRes, profileRes]) => {
        setData({
          dashboard: dashRes.dashboard,
          profile: profileRes.profile ?? null,
        });
      })
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [examSlug]);

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 animate-pulse rounded-2xl bg-black/[0.04]" />
        ))}
      </div>
    );
  }

  if (!data?.dashboard) {
    return (
      <div className="rounded-2xl border border-dashed border-black/[0.1] p-10 text-center">
        <p className="text-[var(--color-ink-muted)]">
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

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)]/10 px-4 py-1.5 text-sm font-semibold text-[var(--color-accent)]">
          {examName}
        </span>
        <span className="text-xs text-[var(--color-ink-muted)]">
          Insights below are scoped to this exam. Switch exams from the top bar.
        </span>
        <SocialShareBar
          entityType="progress"
          text={`I'm ${dashboard.headline.readinessScore}% ready for ${examName} with AnyExamEasy! 🎯`}
          url="https://www.anyexameasy.com"
          size="sm"
          className="ml-auto"
        />
      </div>

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
        {dashboard.spacedReview.dueCount > 0 ? (
          <MetricCard
            label="Spaced review due"
            value={String(dashboard.spacedReview.dueCount)}
            hint={`${dashboard.spacedReview.weakDueCount} weak items ready`}
            accent="amber"
          />
        ) : null}
      </div>

      {dashboard.spacedReview.dueCount > 0 && primaryExamSlug ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-indigo-200/70 bg-indigo-50/50 px-5 py-4">
          <p className="text-sm text-indigo-900">
            <span className="font-semibold">{dashboard.spacedReview.dueCount} questions</span> are
            due for spaced review — missed items resurface on a smart schedule.
          </p>
          <Button href={spacedReviewHref(primaryExamSlug)} variant="secondary">
            Review now
          </Button>
        </div>
      ) : null}

      {referenceRate != null ? (
        <p className="text-xs text-[var(--color-ink-muted)]">
          Reference only: published national pass rates for this exam type are often cited around{" "}
          {referenceRate}% — not a benchmark or prediction for your results.
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-[var(--color-ink)]">Accuracy trend (14 days)</h3>
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

        <section className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-[var(--color-ink)]">Weak areas — remediation</h3>
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
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-black/[0.06]">
                    <div
                      className="h-full rounded-full bg-amber-500"
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
        <section className="rounded-2xl border border-emerald-200/60 bg-emerald-50/40 p-6">
          <h3 className="font-semibold text-emerald-900">Strong topics</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {strongTopics.map((c) => (
              <li
                key={c}
                className="rounded-full bg-white px-3 py-1 text-xs font-medium text-emerald-800 ring-1 ring-emerald-200"
              >
                {c}
              </li>
            ))}
          </ul>
        </section>
      )}

      {examSlug === "pance" ? (
        <section className="rounded-2xl border border-rose-200/70 bg-rose-50/50 p-6">
          <h3 className="font-semibold text-rose-950">PANCE endurance check</h3>
          <p className="mt-2 text-sm text-rose-900/80">
            Full 300-question / 5-hour simulation aligned to NCCPA timing — build stamina before test day.
          </p>
          <Button href={fullExamLaunchHref("pance", { mode: "full" })} className="mt-4">
            Take PANCE practice exam
          </Button>
        </section>
      ) : null}

      {dashboard.recentTests.length > 0 && (
        <section>
          <h3 className="font-semibold text-[var(--color-ink)]">Recent sessions</h3>
          <ul className="mt-3 divide-y divide-black/[0.06] rounded-xl border border-black/[0.06] bg-white">
            {dashboard.recentTests.slice(0, 5).map((t) => (
              <li key={t.id} className="flex items-center justify-between px-4 py-3 text-sm">
                <span>{t.title}</span>
                <span className="font-medium tabular-nums">{t.score}%</span>
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
    <div className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-ink-muted)]">
        {label}
      </p>
      <p
        className={cn(
          "mt-2 text-3xl font-bold tabular-nums",
          accent === "emerald" && "text-emerald-600",
          accent === "amber" && "text-amber-600",
          !accent && "text-[var(--color-ink)]"
        )}
      >
        {value}
      </p>
      <p className="mt-1 text-xs text-[var(--color-ink-muted)]">{hint}</p>
    </div>
  );
}

