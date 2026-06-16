"use client";

import Link from "next/link";
import { ArrowRight, Map } from "lucide-react";
import type { ExamRoadmapData } from "@/lib/learning/exam-roadmap";
import { roadmapHref } from "@/lib/learning/exam-roadmap";
import { dbUi } from "@/lib/study/dashboard-ui";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

export function DashboardRoadmapPreview({
 examSlug,
 roadmap,
}: {
 examSlug: ExamSlug;
 roadmap: ExamRoadmapData;
}) {
 const priorities = roadmap.priorityTopics.slice(0, 3);
 if (priorities.length === 0 && roadmap.overallReadiness >= 80) {
 return (
 <section aria-labelledby="dashboard-roadmap-heading" className="space-y-3">
 <Header examSlug={examSlug} overall={roadmap.overallReadiness} />
 <p className={cn(dbUi.sectionHint, "rounded-xl border border-emerald-200/70 bg-emerald-50/50 px-4 py-3")}>
 Strong across all blueprint areas — keep timed practice to stay exam-ready.
 </p>
 </section>
 );
 }

 return (
 <section aria-labelledby="dashboard-roadmap-heading" className="space-y-3">
 <Header examSlug={examSlug} overall={roadmap.overallReadiness} />
 <p className={dbUi.sectionHint}>{roadmap.passFocusMessage}</p>
 <ul className="space-y-2">
 {priorities.map((topic) => (
 <li
 key={topic.categoryId}
 className="flex items-center justify-between gap-3 rounded-xl border border-black/[0.06] bg-black/[0.02] px-3 py-2.5"
 >
 <div className="min-w-0">
 <p className="truncate text-[13px] font-semibold text-[var(--color-ink)]">
 {topic.label}
 </p>
 <p className="text-[11px] text-[var(--color-ink-muted)]">
 {topic.blueprintWeightPct}% of exam · {topic.readinessLabel}
 </p>
 </div>
 <div className="flex shrink-0 items-center gap-2">
 <span className="text-[12px] font-bold tabular-nums text-[var(--color-ink-muted)]">
 {topic.readinessScore}%
 </span>
 <Link
 href={topic.practiceHref}
 className="text-[11px] font-bold text-[var(--color-accent)] hover:underline"
 >
 Practice
 </Link>
 </div>
 </li>
 ))}
 </ul>
 </section>
 );
}

function Header({ examSlug, overall }: { examSlug: ExamSlug; overall: number }) {
 return (
 <div className="flex flex-wrap items-end justify-between gap-2">
 <div>
 <div className="flex items-center gap-2">
 <Map className="h-4 w-4 text-indigo-600" aria-hidden />
 <h2 id="dashboard-roadmap-heading" className={dbUi.sectionTitle}>
 Exam Roadmap
 </h2>
 </div>
 <p className={cn(dbUi.sectionHint, "mt-0.5")}>
 Official blueprint readiness — {overall}% overall
 </p>
 </div>
 <Link
 href={roadmapHref(examSlug)}
 className="inline-flex items-center gap-1 text-[12px] font-semibold text-[var(--color-accent)] hover:underline"
 >
 Full roadmap
 <ArrowRight className="h-3.5 w-3.5" aria-hidden />
 </Link>
 </div>
 );
}
