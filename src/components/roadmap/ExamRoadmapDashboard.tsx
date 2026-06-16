"use client";

import Link from "next/link";
import {
 AlertTriangle,
 ArrowRight,
 CheckCircle2,
 Map,
 Target,
} from "lucide-react";
import type { ExamRoadmapData, RoadmapTopicRow } from "@/lib/learning/exam-roadmap";
import { EXAM_CATALOG, EXAM_SLUGS } from "@/lib/edtech/exams";
import { EXAM_SELECTION_THEMES } from "@/lib/edtech/exam-selection-theme";
import { roadmapHref } from "@/lib/learning/exam-roadmap";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

type Props = {
 data: ExamRoadmapData;
};

const LABEL_STYLES = {
 strong: {
 badge: "bg-emerald-100 text-emerald-800 ring-emerald-200/80",
 bar: "bg-emerald-500",
 },
 needs_review: {
 badge: "bg-amber-100 text-amber-900 ring-amber-200/80",
 bar: "bg-amber-500",
 },
 needs_more_work: {
 badge: "bg-rose-100 text-rose-800 ring-rose-200/80",
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
 <div className="space-y-8">
 <ExamRoadmapExamTabs current={data.examSlug} />
 <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
 <div className="flex items-start gap-3">
 <span
 className={cn(
 "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-sm",
 theme.gradient
 )}
 >
 <ExamIcon className="h-6 w-6" aria-hidden />
 </span>
 <div>
 <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
 Exam Roadmap
 </p>
 <h1 className="text-[22px] font-semibold tracking-tight text-[var(--color-ink)] sm:text-[28px]">
 {exam.name} Blueprint
 </h1>
 <p className="mt-1 max-w-2xl text-[14px] leading-relaxed text-[var(--color-ink-muted)]">
 {data.passFocusMessage}
 </p>
 </div>
 </div>
 <OverallReadinessRing score={data.overallReadiness} />
 </header>

 <div className="grid gap-3 sm:grid-cols-3">
 <SummaryChip icon={CheckCircle2} label="Strong" value={strongCount} tone="emerald" />
 <SummaryChip icon={AlertTriangle} label="Needs Review" value={reviewCount} tone="amber" />
 <SummaryChip icon={Target} label="Needs More Work" value={workCount} tone="rose" />
 </div>

 {data.priorityTopics.length > 0 ? (
 <section className="rounded-2xl border border-rose-200/70 bg-gradient-to-br from-rose-50/80 to-amber-50/50 p-5">
 <div className="flex items-center gap-2">
 <Map className="h-4 w-4 text-rose-600" aria-hidden />
 <h2 className="text-base font-bold text-[var(--color-ink)]">
 Focus here to pass
 </h2>
 </div>
 <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
 Highest-impact blueprint areas based on official exam weight and your performance.
 </p>
 <ul className="mt-4 space-y-2">
 {data.priorityTopics.slice(0, 4).map((topic) => (
 <PriorityRow key={topic.categoryId} topic={topic} />
 ))}
 </ul>
 </section>
 ) : null}

 <section className="space-y-4">
 <div>
 <h2 className="text-base font-bold text-[var(--color-ink)]">
 Full blueprint coverage
 </h2>
 <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
 Based on {data.blueprintSource}. Bars update automatically as you practice.
 </p>
 </div>
 <ul className="space-y-3">
 {data.topics.map((topic) => (
 <RoadmapTopicCard key={topic.categoryId} topic={topic} />
 ))}
 </ul>
 </section>

 {data.totalAttempts === 0 ? (
 <div className="rounded-2xl border border-dashed border-black/[0.1] bg-black/[0.02] p-6 text-center">
 <p className="text-sm text-[var(--color-ink-muted)]">
 Complete practice questions to populate your roadmap — each attempt maps to a
 blueprint category.
 </p>
 <Link
 href={data.topics[0]?.practiceHref ?? roadmapHref(data.examSlug)}
 className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white"
 >
 Start practicing
 <ArrowRight className="h-4 w-4" aria-hidden />
 </Link>
 </div>
 ) : null}
 </div>
 );
}

function ExamRoadmapExamTabs({ current }: { current: ExamSlug }) {
 return (
 <div
 className="flex flex-wrap gap-2 rounded-2xl border border-black/[0.06] bg-[var(--color-surface-elevated)] p-2 shadow-sm"
 role="tablist"
 aria-label="Select exam roadmap"
 >
 {EXAM_SLUGS.map((slug) => {
 const active = slug === current;
 const theme = EXAM_SELECTION_THEMES[slug];
 const Icon = theme.icon;
 return (
 <Link
 key={slug}
 href={roadmapHref(slug)}
 role="tab"
 aria-selected={active}
 className={cn(
 "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition",
 active
 ? "bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
 : "text-[var(--color-ink-muted)] hover:bg-black/[0.03] hover:text-[var(--color-ink)]"
 )}
 >
 <Icon className="h-4 w-4" aria-hidden />
 {EXAM_CATALOG[slug].shortName}
 </Link>
 );
 })}
 </div>
 );
}

function OverallReadinessRing({ score }: { score: number }) {
 const tone =
 score >= 80 ? "text-emerald-600" : score >= 65 ? "text-amber-600" : "text-rose-600";
 return (
 <div className="flex shrink-0 flex-col items-center rounded-2xl border border-black/[0.06] bg-[var(--color-surface-elevated)] px-6 py-4 shadow-sm">
 <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
 Overall readiness
 </p>
 <p className={cn("mt-1 text-4xl font-bold tabular-nums", tone)}>{score}%</p>
 <p className="mt-1 text-[11px] text-[var(--color-ink-muted)]">Blueprint-weighted</p>
 </div>
 );
}

function SummaryChip({
 icon: Icon,
 label,
 value,
 tone,
}: {
 icon: typeof CheckCircle2;
 label: string;
 value: number;
 tone: "emerald" | "amber" | "rose";
}) {
 const colors = {
 emerald: "border-emerald-200/70 bg-emerald-50/60 text-emerald-900",
 amber: "border-amber-200/70 bg-amber-50/60 text-amber-950",
 rose: "border-rose-200/70 bg-rose-50/60 text-rose-900",
 };
 return (
 <div className={cn("rounded-xl border px-4 py-3", colors[tone])}>
 <div className="flex items-center gap-2 text-sm font-semibold">
 <Icon className="h-4 w-4" aria-hidden />
 {label}
 </div>
 <p className="mt-1 text-2xl font-bold tabular-nums">{value}</p>
 </div>
 );
}

function PriorityRow({ topic }: { topic: RoadmapTopicRow }) {
 const styles = LABEL_STYLES[topic.readinessKey];
 return (
 <li className="flex flex-col gap-2 rounded-xl border border-white/80 bg-[var(--color-surface-elevated)]/90 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
 <div>
 <p className="font-semibold text-[var(--color-ink)]">{topic.label}</p>
 <p className="text-xs text-[var(--color-ink-muted)]">
 {topic.blueprintWeightPct}% of exam · {topic.readinessScore}% ready
 </p>
 </div>
 <div className="flex flex-wrap items-center gap-2">
 <span
 className={cn(
 "rounded-full px-2.5 py-1 text-[11px] font-bold ring-1",
 styles.badge
 )}
 >
 {topic.readinessLabel}
 </span>
 <Link
 href={topic.practiceHref}
 className="inline-flex items-center gap-1 rounded-lg bg-[var(--color-accent)] px-3 py-1.5 text-xs font-bold text-white"
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
 <li className="rounded-2xl border border-black/[0.06] bg-[var(--color-surface-elevated)] p-4 shadow-sm sm:p-5">
 <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
 <div className="min-w-0 flex-1">
 <div className="flex flex-wrap items-center gap-2">
 <h3 className="font-semibold text-[var(--color-ink)]">{topic.label}</h3>
 <span className="rounded-full bg-black/[0.04] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--color-ink-muted)]">
 {topic.blueprintWeightPct}% of exam
 </span>
 <span
 className={cn(
 "rounded-full px-2.5 py-1 text-[11px] font-bold ring-1",
 styles.badge
 )}
 >
 {topic.readinessLabel}
 </span>
 </div>
 {topic.highYieldTopics.length > 0 ? (
 <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
 High-yield: {topic.highYieldTopics.slice(0, 4).join(", ")}
 </p>
 ) : null}
 <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
 {topic.attempts > 0
 ? `${topic.correct}/${topic.attempts} correct (${topic.accuracy}%)`
 : "No practice data yet — start this topic to track readiness"}
 </p>
 </div>
 <div className="flex shrink-0 flex-wrap gap-2">
 {topic.deepDiveHref ? (
 <Link
 href={topic.deepDiveHref}
 className="rounded-lg border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-800 hover:bg-violet-100"
 >
 Deep dive
 </Link>
 ) : null}
 <Link
 href={topic.practiceHref}
 className="rounded-lg bg-[var(--color-accent)] px-3 py-1.5 text-xs font-bold text-white hover:opacity-90"
 >
 Practice 15
 </Link>
 </div>
 </div>

 <div className="mt-4">
 <div className="mb-1 flex items-center justify-between text-[11px] font-medium text-[var(--color-ink-muted)]">
 <span>Readiness</span>
 <span className="tabular-nums">{topic.readinessScore}%</span>
 </div>
 <div
 className="h-2.5 overflow-hidden rounded-full bg-black/[0.06]"
 role="progressbar"
 aria-valuenow={topic.readinessScore}
 aria-valuemin={0}
 aria-valuemax={100}
 aria-label={`${topic.label} readiness ${topic.readinessScore}% — ${topic.readinessLabel}`}
 >
 <div
 className={cn("h-full rounded-full transition-[width]", styles.bar)}
 style={{ width: `${topic.readinessScore}%` }}
 />
 </div>
 </div>
 </li>
 );
}
