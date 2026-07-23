"use client";

import Link from "next/link";
import { ArrowRight, Map } from "lucide-react";
import type { ExamRoadmapData, RoadmapTopicRow } from "@/lib/learning/exam-roadmap";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import { EXAM_SELECTION_THEMES } from "@/lib/edtech/exam-selection-theme";
import { fullExamHref } from "@/lib/routes";
import { dbUi } from "@/lib/study/dashboard-ui";
import { cn } from "@/lib/utils";

type Props = {
  data: ExamRoadmapData;
};

const BADGE_STYLES = {
  strong: "bg-[var(--color-surface)] text-[var(--color-ink)] ring-[var(--color-border)]",
  needs_review: "bg-amber-500/10 text-amber-800 ring-amber-500/20",
  needs_more_work: "bg-rose-500/10 text-rose-800 ring-rose-500/20",
} as const;

export function ExamRoadmapDashboard({ data }: Props) {
  const exam = EXAM_CATALOG[data.examSlug];
  const theme = EXAM_SELECTION_THEMES[data.examSlug];
  const ExamIcon = theme.icon;
  const priorities = data.priorityTopics.slice(0, 3);
  const topPriority = priorities[0];
  const fullExam = fullExamHref(data.examSlug);

  const primaryCta = data.launch.canContinue
    ? { href: fullExam, label: "Continue exam" }
    : topPriority
      ? { href: topPriority.practiceHref, label: "Practice weakest" }
      : { href: fullExam, label: "Start a practice exam" };

  return (
    <div className={cn(dbUi.page, "space-y-6")}>
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-[var(--shadow-apple-sm)]",
              theme.gradient
            )}
          >
            <ExamIcon className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className={dbUi.eyebrow}>Exam roadmap</p>
            <h1 className={cn(dbUi.title, "mt-0.5")}>{exam.name}</h1>
            <p className={cn(dbUi.subtitle, "mt-1.5 max-w-xl")}>{data.passFocusMessage}</p>
          </div>
        </div>
        <ReadinessScore score={data.overallReadiness} />
      </header>

      {priorities.length > 0 ? (
        <section className="space-y-2.5" aria-labelledby="roadmap-focus-heading">
          <div className="flex items-center gap-2 px-0.5">
            <Map className="h-3.5 w-3.5 text-[var(--color-accent)]" aria-hidden />
            <h2 id="roadmap-focus-heading" className={dbUi.sectionTitle}>
              Focus here to pass
            </h2>
          </div>
          <ul className={dbUi.listSurface}>
            {priorities.map((topic) => (
              <PriorityRow key={topic.categoryId} topic={topic} />
            ))}
          </ul>
        </section>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <Link href={primaryCta.href} className={dbUi.primaryBtn}>
          {primaryCta.label}
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
        <Link href={fullExam} className="text-[12px] font-semibold text-[var(--color-ink-muted)] hover:text-[var(--color-accent)] hover:underline">
          Full exam options
        </Link>
      </div>

      {data.totalAttempts === 0 && priorities.length === 0 ? (
        <div className={cn(dbUi.surface, "px-4 py-5 text-center")}>
          <p className={dbUi.sectionHint}>No practice yet — start here to build your roadmap.</p>
          <Link href={fullExam} className={cn(dbUi.primaryBtn, "mt-3")}>
            Start practicing
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
      ) : null}

      <details className="group rounded-2xl border border-[var(--color-border)]/60 bg-[var(--color-surface-elevated)] open:pb-1">
        <summary className="cursor-pointer list-none px-4 py-3.5 text-[13px] font-semibold text-[var(--color-ink)] marker:content-none [&::-webkit-details-marker]:hidden">
          <span className="flex items-center justify-between gap-3">
            <span>All blueprint areas</span>
            <span className="text-[12px] font-medium text-[var(--color-ink-muted)] group-open:hidden">
              Show {data.topics.length}
            </span>
            <span className="hidden text-[12px] font-medium text-[var(--color-ink-muted)] group-open:inline">
              Hide
            </span>
          </span>
        </summary>
        <ul className="divide-y divide-[var(--color-border)]/60 border-t border-[var(--color-border)]/60">
          {data.topics.map((topic) => (
            <BlueprintRow key={topic.categoryId} topic={topic} />
          ))}
        </ul>
      </details>
    </div>
  );
}

function ReadinessScore({ score }: { score: number }) {
  const clamped = Math.max(0, Math.min(100, score));
  return (
    <div
      className="flex shrink-0 flex-col items-end"
      aria-label={`Overall readiness ${clamped}%`}
    >
      <span className="text-[28px] font-semibold tabular-nums tracking-tight text-[var(--color-ink)] sm:text-[32px]">
        {clamped}%
      </span>
      <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-ink-muted)]">
        Readiness
      </span>
    </div>
  );
}

function PriorityRow({ topic }: { topic: RoadmapTopicRow }) {
  return (
    <li className={dbUi.listRow}>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-semibold text-[var(--color-ink)]">{topic.label}</p>
        <p className={dbUi.sectionHint}>
          {topic.blueprintWeightPct}% of exam · {topic.readinessScore}% ready
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span
          className={cn(
            "hidden rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 sm:inline",
            BADGE_STYLES[topic.readinessKey]
          )}
        >
          {topic.readinessLabel}
        </span>
        <Link
          href={topic.practiceHref}
          className="text-[12px] font-semibold text-[var(--color-accent)] hover:underline"
        >
          Practice
        </Link>
      </div>
    </li>
  );
}

function BlueprintRow({ topic }: { topic: RoadmapTopicRow }) {
  return (
    <li className="flex items-center gap-3 px-4 py-3">
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-semibold text-[var(--color-ink)]">{topic.label}</p>
        <p className={dbUi.sectionHint}>
          {topic.blueprintWeightPct}% of exam · {topic.readinessLabel}
        </p>
      </div>
      <span className="shrink-0 text-[12px] font-semibold tabular-nums text-[var(--color-ink-muted)]">
        {topic.readinessScore}%
      </span>
      <Link
        href={topic.practiceHref}
        className="shrink-0 text-[12px] font-semibold text-[var(--color-accent)] hover:underline"
      >
        Practice
      </Link>
    </li>
  );
}
