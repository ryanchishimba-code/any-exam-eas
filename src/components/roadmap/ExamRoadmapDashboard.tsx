"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Map } from "lucide-react";
import { ExamLaunchActions } from "@/components/exam/ExamLaunchActions";
import type { ExamRoadmapData, RoadmapTopicRow } from "@/lib/learning/exam-roadmap";
import { EXAM_CATALOG, EXAM_SLUGS } from "@/lib/edtech/exams";
import { EXAM_SELECTION_THEMES } from "@/lib/edtech/exam-selection-theme";
import { roadmapHref } from "@/lib/learning/roadmap-links";
import { feUi } from "@/lib/study/full-exam-ui";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

type Props = {
  data: ExamRoadmapData;
};

const LABEL_STYLES = {
  strong: {
    badge: "bg-[var(--color-surface)] text-[var(--color-ink)] ring-[var(--color-border)]",
    bar: "bg-emerald-500",
  },
  needs_review: {
    badge: "bg-[var(--color-surface)] text-[var(--color-ink)] ring-[var(--color-border)]",
    bar: "bg-amber-500",
  },
  needs_more_work: {
    badge: "bg-[var(--color-surface)] text-[var(--color-ink)] ring-[var(--color-border)]",
    bar: "bg-rose-500",
  },
} as const;

export function ExamRoadmapDashboard({ data }: Props) {
  const exam = EXAM_CATALOG[data.examSlug];
  const theme = EXAM_SELECTION_THEMES[data.examSlug];
  const ExamIcon = theme.icon;

  const strongCount = data.topics.filter((t) => t.readinessKey === "strong").length;
  const reviewCount = data.topics.filter((t) => t.readinessKey === "needs_review").length;
  const workCount = data.topics.filter((t) => t.readinessKey === "needs_more_work").length;

  return (
    <div className={cn(feUi.page, "space-y-10")}>
      <ExamRoadmapExamTabs current={data.examSlug} />

      <header className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <span
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-gradient-to-br text-white shadow-[var(--shadow-apple-sm)]",
              theme.gradient
            )}
          >
            <ExamIcon className="h-6 w-6" aria-hidden />
          </span>
          <div>
            <p className={feUi.eyebrow}>Exam Roadmap</p>
            <h1 className={cn(feUi.title, "mt-1")}>{exam.name} Blueprint</h1>
            <p className={cn(feUi.subtitle, "mt-2 max-w-2xl")}>{data.passFocusMessage}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 sm:justify-end">
          <MetricRing
            score={data.overallReadiness}
            label="Readiness"
            ariaLabel={`Overall readiness ${data.overallReadiness}%`}
          />
          <MetricRing
            score={data.overallPushCoveragePct}
            label="Bank coverage"
            ariaLabel={`Question bank coverage ${data.overallPushCoveragePct}%`}
            muted
          />
        </div>
      </header>

      <div className={cn(feUi.panel, feUi.panelInner)}>
        <ExamLaunchActions
          examSlug={data.examSlug}
          fieldId={data.fieldId}
          hasRetake={data.launch.hasRetake}
          canContinue={data.launch.canContinue}
          focusAreas={data.launch.weakFocusAreas}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <SummaryChip label="Strong" value={strongCount} />
        <SummaryChip label="Needs Review" value={reviewCount} />
        <SummaryChip label="Needs More Work" value={workCount} />
      </div>

      {data.priorityTopics.length > 0 ? (
        <section className={cn(feUi.panel, feUi.panelInner)}>
          <div className="flex items-center gap-2">
            <Map className="h-4 w-4 text-[var(--color-ink-muted)]" aria-hidden />
            <h2 className={feUi.sectionTitle}>Focus here to pass</h2>
          </div>
          <p className={cn(feUi.sectionHint, "mt-1")}>
            Highest-impact blueprint areas based on official exam weight and your performance.
          </p>
          <ul className="mt-5 space-y-2">
            {data.priorityTopics.slice(0, 4).map((topic) => (
              <PriorityRow key={topic.categoryId} topic={topic} />
            ))}
          </ul>
        </section>
      ) : null}

      <section className="space-y-4">
        <div>
          <h2 className={feUi.sectionTitle}>Full blueprint coverage</h2>
          <p className={cn(feUi.sectionHint, "mt-1")}>
            Based on {data.blueprintSource}. Each section shows bank pushes completed and readiness.
          </p>
          <p className="mt-2 text-[12px] tabular-nums text-[var(--color-ink-muted)]">
            {data.pushesCompleted.toLocaleString()} / {data.pushesAvailable.toLocaleString()} unique
            bank items practiced
          </p>
        </div>
        <ul className="space-y-3">
          {data.topics.map((topic) => (
            <RoadmapTopicCard key={topic.categoryId} topic={topic} />
          ))}
        </ul>
      </section>

      {data.totalAttempts === 0 ? (
        <div className="rounded-[22px] border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-8 text-center">
          <p className={feUi.sectionHint}>
            Complete practice questions to populate your roadmap — each attempt maps to a blueprint
            category.
          </p>
        </div>
      ) : null}
    </div>
  );
}

function ExamRoadmapExamTabs({ current }: { current: ExamSlug }) {
  return (
    <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Exam roadmaps">
      {EXAM_SLUGS.map((slug) => {
        const active = slug === current;
        return (
          <Link
            key={slug}
            href={roadmapHref(slug)}
            role="tab"
            aria-selected={active}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition",
              active
                ? "bg-[var(--color-ink)] text-[var(--color-bg)]"
                : "text-[var(--color-ink-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-ink)]"
            )}
          >
            {EXAM_CATALOG[slug].shortName}
          </Link>
        );
      })}
    </div>
  );
}

function MetricRing({
  score,
  label,
  ariaLabel,
  muted,
}: {
  score: number;
  label: string;
  ariaLabel: string;
  muted?: boolean;
}) {
  const clamped = Math.max(0, Math.min(100, score));
  const r = 34;
  const c = 2 * Math.PI * r;
  const offset = c - (clamped / 100) * c;
  return (
    <div className="flex flex-col items-center gap-1.5" aria-label={ariaLabel}>
      <div className="relative h-[88px] w-[88px]">
        <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
          <circle
            cx="40"
            cy="40"
            r={r}
            fill="none"
            stroke="var(--color-border)"
            strokeWidth="6"
          />
          <circle
            cx="40"
            cy="40"
            r={r}
            fill="none"
            stroke={muted ? "var(--color-ink-muted)" : "var(--color-accent)"}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[20px] font-semibold tabular-nums tracking-tight text-[var(--color-ink)]">
            {clamped}%
          </span>
        </div>
      </div>
      <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-ink-muted)]">
        {label}
      </span>
    </div>
  );
}

function SummaryChip({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[16px] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 py-3.5 shadow-[var(--shadow-apple-sm)]">
      <p className="text-[12px] font-medium text-[var(--color-ink-muted)]">{label}</p>
      <p className="mt-1 text-[24px] font-semibold tabular-nums tracking-tight text-[var(--color-ink)]">
        {value}
      </p>
    </div>
  );
}

function DualProgress({
  pushCoveragePct,
  readinessScore,
  label,
}: {
  pushCoveragePct: number;
  readinessScore: number;
  label: string;
}) {
  const styles =
    readinessScore >= 80
      ? LABEL_STYLES.strong
      : readinessScore >= 65
        ? LABEL_STYLES.needs_review
        : LABEL_STYLES.needs_more_work;

  return (
    <div className="mt-4 space-y-3">
      <div>
        <div className="mb-1 flex items-center justify-between text-[11px] font-medium text-[var(--color-ink-muted)]">
          <span>Bank pushes</span>
          <span className="tabular-nums">{pushCoveragePct}%</span>
        </div>
        <div
          className="h-2 overflow-hidden rounded-full bg-[var(--color-surface)]"
          role="progressbar"
          aria-valuenow={pushCoveragePct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${label} bank coverage ${pushCoveragePct}%`}
        >
          <div
            className="h-full rounded-full bg-[var(--color-ink)]/35 transition-[width]"
            style={{ width: `${pushCoveragePct}%` }}
          />
        </div>
      </div>
      <div>
        <div className="mb-1 flex items-center justify-between text-[11px] font-medium text-[var(--color-ink-muted)]">
          <span>Readiness</span>
          <span className="tabular-nums">{readinessScore}%</span>
        </div>
        <div
          className="h-2 overflow-hidden rounded-full bg-[var(--color-surface)]"
          role="progressbar"
          aria-valuenow={readinessScore}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${label} readiness ${readinessScore}%`}
        >
          <div
            className={cn("h-full rounded-full transition-[width]", styles.bar)}
            style={{ width: `${readinessScore}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function PriorityRow({ topic }: { topic: RoadmapTopicRow }) {
  const styles = LABEL_STYLES[topic.readinessKey];
  return (
    <li className="flex flex-col gap-3 rounded-[14px] bg-[var(--color-surface)] px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-semibold tracking-tight text-[var(--color-ink)]">{topic.label}</p>
        <p className="mt-0.5 text-[12px] text-[var(--color-ink-muted)]">
          {topic.blueprintWeightPct}% of exam · {topic.pushCoveragePct}% bank ·{" "}
          {topic.readinessScore}% ready
          {topic.gapToPass != null && topic.gapToPass > 0 ? (
            <span> · {topic.gapToPass} pts to pass target</span>
          ) : null}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1",
            styles.badge
          )}
        >
          {topic.readinessLabel}
        </span>
        <Link
          href={topic.practiceHref}
          className="inline-flex items-center gap-1 rounded-full bg-[var(--color-accent)] px-3.5 py-1.5 text-[12px] font-semibold text-white"
        >
          Practice
          <ArrowRight className="h-3 w-3" aria-hidden />
        </Link>
      </div>
    </li>
  );
}

function RoadmapTopicCard({ topic }: { topic: RoadmapTopicRow }) {
  const styles = LABEL_STYLES[topic.readinessKey];
  return (
    <li
      className={cn(
        feUi.panel,
        "px-5 py-5 shadow-[var(--shadow-apple-sm)] sm:px-6"
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[16px] font-semibold tracking-tight text-[var(--color-ink)]">
              {topic.label}
            </h3>
            <span className="rounded-full bg-[var(--color-surface)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
              {topic.blueprintWeightPct}% of exam
            </span>
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1",
                styles.badge
              )}
            >
              {topic.readinessLabel}
            </span>
          </div>
          {topic.highYieldTopics.length > 0 ? (
            <p className="mt-1.5 text-[12px] text-[var(--color-ink-muted)]">
              High-yield: {topic.highYieldTopics.slice(0, 4).join(", ")}
            </p>
          ) : null}
          <p className="mt-1 text-[12px] text-[var(--color-ink-muted)]">
            {topic.pushesAvailable > 0
              ? `${topic.pushesCompleted}/${topic.pushesAvailable} bank items · `
              : null}
            {topic.attempts > 0
              ? `${topic.correct}/${topic.attempts} correct (${topic.accuracy}%)`
              : "No practice data yet — start this topic to track readiness"}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          {topic.deepDiveHref ? (
            <SecondaryLink href={topic.deepDiveHref}>Deep dive</SecondaryLink>
          ) : null}
          {topic.topicsHubHref ? (
            <SecondaryLink href={topic.topicsHubHref}>Topics</SecondaryLink>
          ) : null}
          {topic.drugClassHref ? (
            <SecondaryLink href={topic.drugClassHref}>Drugs</SecondaryLink>
          ) : null}
          {topic.presetHref ? (
            <SecondaryLink href={topic.presetHref}>
              {topic.presetLabel ?? "Preset"}
            </SecondaryLink>
          ) : null}
          <Link
            href={topic.practiceHref}
            className="rounded-full bg-[var(--color-accent)] px-3.5 py-1.5 text-[12px] font-semibold text-white hover:opacity-90"
          >
            Practice 15
          </Link>
        </div>
      </div>

      <DualProgress
        pushCoveragePct={topic.pushCoveragePct}
        readinessScore={topic.readinessScore}
        label={topic.label}
      />
    </li>
  );
}

function SecondaryLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3.5 py-1.5 text-[12px] font-semibold text-[var(--color-ink)] hover:bg-[var(--color-surface)]"
    >
      {children}
    </Link>
  );
}
