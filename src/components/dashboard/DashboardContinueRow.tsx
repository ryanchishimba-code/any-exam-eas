"use client";

import Link from "next/link";
import { ArrowRight, BarChart3, BookMarked, BookOpen, Clock, Sparkles } from "lucide-react";
import { FullExamModeButtons } from "@/components/exam/FullExamModeButtons";
import {
  analyticsHref,
  highYieldTopicsHref,
  questionBankHref,
  libraryHref,
} from "@/lib/edtech/practice-links-core";
import { dbUi } from "@/lib/study/dashboard-ui";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

type ActionItem = {
  title: string;
  description: string;
  icon: typeof BookOpen;
  href?: string;
  examModes?: boolean;
};

export function DashboardContinueRow({ examSlug }: { examSlug: ExamSlug }) {
  const actions: ActionItem[] = [
    {
      title: "Question Bank",
      description: "Adaptive practice by topic",
      href: questionBankHref(examSlug),
      icon: BookOpen,
    },
    {
      title: "Library",
      description: "Memory cards and tools",
      href: libraryHref(examSlug),
      icon: BookMarked,
    },
    {
      title: "High-Yield Topics",
      description: "Summaries and review modules",
      href: highYieldTopicsHref(examSlug),
      icon: Sparkles,
    },
    {
      title: "Analytics",
      description: "Trends and weak areas",
      href: analyticsHref(),
      icon: BarChart3,
    },
  ];

  return (
    <section aria-labelledby="dashboard-continue-heading" className="space-y-2.5">
      <h2 id="dashboard-continue-heading" className={cn(dbUi.sectionTitle, "px-0.5")}>
        Continue studying
      </h2>

      <div className={dbUi.exploreGrid}>
        {actions.map((action) => (
          <Link key={action.title} href={action.href!} className={dbUi.exploreLink}>
            <action.icon className="h-4 w-4 shrink-0 text-[var(--color-accent)]" aria-hidden />
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-[var(--color-ink)]">{action.title}</p>
              <p className={dbUi.sectionHint}>{action.description}</p>
            </div>
            <ArrowRight
              className="h-3.5 w-3.5 shrink-0 text-[var(--color-ink-muted)]/40 group-hover:text-[var(--color-accent)]"
              aria-hidden
            />
          </Link>
        ))}
      </div>

      <div className={cn(dbUi.surface, "p-4")}>
        <div className="flex items-start gap-3">
          <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-accent)]" aria-hidden />
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-semibold text-[var(--color-ink)]">Full Exam</p>
            <p className={cn(dbUi.sectionHint, "mt-0.5")}>Timed simulation with live countdown.</p>
            <div className="mt-3">
              <FullExamModeButtons examSlug={examSlug} showCustomizeLink />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
