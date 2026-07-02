"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { PersonalizedPlan } from "@/lib/core/types";
import type { LearningProfileSnapshot } from "@/lib/learning/types";
import { EXAM_MODES } from "@/lib/exam/modes";
import { useAppPreferences } from "@/lib/client/use-app-preferences";
import { fieldIdForExamSlug } from "@/lib/edtech/question-bank-scope";
import { Button } from "@/components/ui/Button";
import { ProgressMetricsNotice } from "@/components/legal/ProgressMetricsNotice";
import { PRACTICE_PROGRESS_HINT, PRACTICE_PROGRESS_LABEL } from "@/lib/site";

export function LearningDashboard() {
  const { examSlug, loading: prefLoading } = useAppPreferences();
  const [profile, setProfile] = useState<LearningProfileSnapshot | null>(null);
  const [plan, setPlan] = useState<PersonalizedPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (prefLoading) return;
    if (!examSlug) {
      setProfile(null);
      setPlan(null);
      setLoading(false);
      return;
    }
    const fieldId = fieldIdForExamSlug(examSlug);
    Promise.all([
      fetch("/api/learning/profile").then((r) => r.json()),
      fetch(`/api/learning/plan?field=${encodeURIComponent(fieldId)}`).then((r) => r.json()),
    ])
      .then(([profileRes, planRes]) => {
        setProfile(profileRes.profile ?? null);
        setPlan(planRes.plan ?? null);
      })
      .catch(() => {
        setProfile(null);
        setPlan(null);
      })
      .finally(() => setLoading(false));
  }, [examSlug, prefLoading]);

  if (loading) {
    return (
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl bg-black/[0.04]" />
        ))}
      </div>
    );
  }

  if (!profile) {
    return (
      <p className="mt-6 text-sm text-[var(--color-ink-muted)]">
        Complete a practice session to unlock your progress dashboard.
      </p>
    );
  }

  return (
    <div className="mt-8 space-y-10">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label={PRACTICE_PROGRESS_LABEL} value={`${profile.readinessScore}%`} hint={PRACTICE_PROGRESS_HINT} />
        <MetricCard label="Study streak" value={`${profile.studyStreakDays}d`} hint="Consecutive study days" />
        <MetricCard
          label="Weak areas"
          value={String(profile.weakestConcepts.length)}
          hint="Concepts below practice threshold"
        />
        <MetricCard
          label="Fields tracked"
          value={String(profile.fieldReadiness.length)}
          hint="Subjects with attempt data"
        />
      </div>

      {plan && (
        <section className="rounded-2xl border border-teal-200/60 bg-gradient-to-br from-teal-50/80 to-cyan-50/40 p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-teal-700">
            Adaptive study plan
          </p>
          <h3 className="mt-2 text-lg font-semibold text-slate-900">{plan.headline}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{plan.rationale}</p>
          {plan.focusTopics.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {plan.focusTopics.map((topic) => (
                <li
                  key={topic}
                  className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-teal-800 ring-1 ring-teal-200/80"
                >
                  {topic.replace(/^(tag|subject):/, "")}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-5 flex flex-wrap gap-3">
            <Button href="/study/practice?mode=bank&style=adaptive">Adaptive practice</Button>
            <Button href="/study/practice?mode=bank&style=weak_areas" variant="secondary">
              Weak-area drill
            </Button>
          </div>
        </section>
      )}

      {profile.fieldReadiness.length > 0 && (
        <section className="apple-card p-6">
          <h3 className="text-lg font-semibold">Topic progress</h3>
          <ul className="mt-4 space-y-3">
            {profile.fieldReadiness.map((f) => (
              <li key={f.fieldId}>
                <div className="flex justify-between text-sm">
                  <span className="capitalize">{f.fieldId.replace(/-/g, " ")}</span>
                  <span className="font-medium">{f.score}%</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-black/[0.06]">
                  <div
                    className="h-full rounded-full bg-[var(--color-accent)] transition-all"
                    style={{ width: `${f.score}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {profile.weakestConcepts.length > 0 && (
        <section className="apple-card p-6">
          <h3 className="text-lg font-semibold">Weakest concepts</h3>
          <ul className="mt-4 divide-y divide-black/[0.06]">
            {profile.weakestConcepts.slice(0, 6).map((c) => (
              <li key={c.conceptKey} className="flex items-center justify-between py-3 text-sm">
                <span className="text-[var(--color-ink-muted)]">
                  {c.conceptKey.replace(/^(tag|subject):/, "")}
                </span>
                <span className="font-medium text-[var(--a11y-error-fg)]">{c.masteryScore}%</span>
              </li>
            ))}
          </ul>
          <Button href="/study/practice?mode=bank&style=weak_areas" className="mt-4">
            Weak-area practice
          </Button>
        </section>
      )}

      <section>
        <h3 className="text-lg font-semibold">Study modes</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {EXAM_MODES.map((mode) => (
            <Link
              key={mode.id}
              href={mode.href}
              className="rounded-2xl border border-black/[0.08] bg-white p-4 transition-shadow hover:shadow-sm"
            >
              <p className="font-medium">{mode.label}</p>
              <p className="mt-1 text-xs text-[var(--color-ink-muted)]">{mode.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <ProgressMetricsNotice />
    </div>
  );
}

function MetricCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-2xl border border-black/[0.08] bg-white p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-ink-muted)]">
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-[var(--color-ink-muted)]">{hint}</p>
    </div>
  );
}
