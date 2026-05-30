"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { LearningProfileSnapshot } from "@/lib/learning/types";
import { EXAM_MODES } from "@/lib/exam/modes";
import { Button } from "@/components/ui/Button";

export function LearningDashboard() {
  const [profile, setProfile] = useState<LearningProfileSnapshot | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/learning/profile")
      .then((r) => r.json())
      .then((d) => setProfile(d.profile ?? null))
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, []);

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
        Complete a practice session to unlock your mastery dashboard.
      </p>
    );
  }

  return (
    <div className="mt-8 space-y-10">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Readiness" value={`${profile.readinessScore}%`} hint="Exam readiness index" />
        <MetricCard label="Study streak" value={`${profile.studyStreakDays}d`} hint="Consecutive study days" />
        <MetricCard
          label="Weak areas"
          value={String(profile.weakestConcepts.length)}
          hint="Concepts below mastery threshold"
        />
        <MetricCard
          label="Fields tracked"
          value={String(profile.fieldReadiness.length)}
          hint="Subjects with attempt data"
        />
      </div>

      {profile.fieldReadiness.length > 0 && (
        <section className="apple-card p-6">
          <h3 className="text-lg font-semibold">Subject mastery</h3>
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
                <span className="font-medium text-red-600">{c.masteryScore}%</span>
              </li>
            ))}
          </ul>
          <Button href="/study/practice?mode=weak" className="mt-4">
            Weak-area drill
          </Button>
        </section>
      )}

      <section>
        <h3 className="text-lg font-semibold">Exam modes</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
