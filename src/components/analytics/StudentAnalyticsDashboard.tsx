"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookMarked } from "lucide-react";
import type { StudentDashboardData } from "@/lib/learning/student-dashboard";
import type { LearningProfileSnapshot } from "@/lib/learning/types";
import { EXAM_FIELD_OPTIONS } from "@/lib/exam-prep/practice-modes";
import { examSlugFromFieldId } from "@/lib/edtech/exams";
import { referenceTopicHref } from "@/lib/edtech/practice-links";
import {
  getMemoryCardIdsForTopic,
  normalizeWeakAreaTopicKey,
} from "@/lib/reference/weak-area-map";
import { mpjePracticeExamHref } from "@/lib/study-hub/config";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type AnalyticsPayload = {
  dashboard: StudentDashboardData;
  profile: LearningProfileSnapshot | null;
};

/** Illustrative national pass-rate references — not verified benchmarks for this product. */
const REFERENCE_PASS_RATES: Record<string, number> = {
  nursing: 88,
  pharmacy: 89,
  mpje: 75,
  "usmle-step-2": 92,
};

function practiceProgressIndex(
  readiness: number,
  accuracy: number | null
): number {
  const acc = accuracy ?? readiness;
  return Math.min(100, Math.max(0, Math.round(readiness * 0.55 + acc * 0.45)));
}

export function StudentAnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsPayload | null>(null);
  const [fieldFilter, setFieldFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/learning/dashboard").then((r) => r.json()),
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
  }, []);

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
  const primaryField = profile?.fieldReadiness?.[0]?.fieldId ?? "nursing";
  const progressIndex = practiceProgressIndex(
    profile?.readinessScore ?? dashboard.headline.readinessScore,
    dashboard.headline.overallAccuracy
  );
  const referenceRate =
    REFERENCE_PASS_RATES[fieldFilter === "all" ? primaryField : fieldFilter];

  const weakTopics =
    fieldFilter === "all"
      ? dashboard.weakTopics
      : dashboard.weakTopics.filter((t) => t.fieldId === fieldFilter);

  const strongTopics =
    profile?.strongestConcepts?.slice(0, 5).map((c) => c.conceptKey) ?? [];

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap gap-2">
        <FilterChip
          active={fieldFilter === "all"}
          onClick={() => setFieldFilter("all")}
          label="All exams"
        />
        {EXAM_FIELD_OPTIONS.map((e) => (
          <FilterChip
            key={e.id}
            active={fieldFilter === e.fieldParam}
            onClick={() => setFieldFilter(e.fieldParam)}
            label={e.label}
          />
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Practice progress index"
          value={`${progressIndex}%`}
          hint="In-app metric only — not an exam pass prediction"
        />
        <MetricCard
          label="Readiness score"
          value={`${profile?.readinessScore ?? dashboard.headline.readinessScore}%`}
          hint="Composite from your practice activity"
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
            href={`/question-bank?field=${fieldFilter === "all" ? primaryField : fieldFilter}&style=weak_areas`}
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

      {fieldFilter === "mpje" || primaryField === "mpje" ? (
        <section className="rounded-2xl border border-amber-200/70 bg-amber-50/50 p-6">
          <h3 className="font-semibold text-amber-950">MPJE endurance check</h3>
          <p className="mt-2 text-sm text-amber-900/80">
            Full 120-question / 2.5-hour simulator with state-specific + federal law. Passing
            practice threshold: 75%.
          </p>
          <Button href={mpjePracticeExamHref("OK")} className="mt-4">
            Take MPJE practice exam
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

/** Links a weak topic to its recommended memory cards on /reference, when any exist. */
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
      href={referenceTopicHref(examSlug, topicKey)}
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

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-4 py-1.5 text-sm font-medium transition",
        active
          ? "bg-[var(--color-accent)] text-white"
          : "bg-black/[0.04] text-[var(--color-ink-muted)] hover:bg-black/[0.08]"
      )}
    >
      {label}
    </button>
  );
}
