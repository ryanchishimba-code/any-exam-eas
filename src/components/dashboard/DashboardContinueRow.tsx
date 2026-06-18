"use client";

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookMarked,
  BookOpen,
  Clock,
  Sparkles,
} from "lucide-react";
import { FullExamModeButtons } from "@/components/exam/FullExamModeButtons";
import {
  analyticsHref,
  highYieldTopicsHref,
  questionBankHref,
  libraryHref,
} from "@/lib/edtech/practice-links";
import { dbUi } from "@/lib/study/dashboard-ui";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

type ActionCard = {
  title: string;
  description: string;
  icon: typeof BookOpen;
  wide?: boolean;
  examModes?: boolean;
  href?: string;
  cta?: string;
};

export function DashboardContinueRow({ examSlug }: { examSlug: ExamSlug }) {
  const actions: ActionCard[] = [
    {
      title: "Full Exam",
      description: "Timed simulation with live countdown.",
      icon: Clock,
      wide: true,
      examModes: true,
    },
    {
      title: "Question Bank",
      description: "Adaptive practice by topic.",
      href: questionBankHref(examSlug),
      cta: "Start practice",
      icon: BookOpen,
    },
    {
      title: "Library",
      description: "AI brief and memory cards.",
      href: libraryHref(examSlug),
      cta: "Open reference",
      icon: BookMarked,
    },
    {
      title: "High-Yield",
      description: "Review modules and summaries.",
      href: highYieldTopicsHref(examSlug),
      cta: "Browse topics",
      icon: Sparkles,
    },
    {
      title: "Analytics",
      description: "Trends, weak areas, and scores.",
      href: analyticsHref(),
      cta: "View insights",
      icon: BarChart3,
    },
  ];

  return (
    <section aria-labelledby="dashboard-continue-heading" className="space-y-3">
      <div>
        <h2 id="dashboard-continue-heading" className={dbUi.sectionTitle}>
          Continue studying
        </h2>
        <p className={cn(dbUi.sectionHint, "mt-0.5")}>Pick up where you left off — swipe for more.</p>
      </div>
      <div className={dbUi.chipRow}>
        {actions.map((action) => (
          <div
            key={action.title}
            className={action.wide ? dbUi.actionCardWide : dbUi.actionCard}
          >
            <action.icon className="h-5 w-5 text-[var(--color-accent)]" aria-hidden />
            <p className="mt-2 text-[15px] font-semibold text-[var(--color-ink)]">{action.title}</p>
            <p className="mt-0.5 text-[12px] leading-relaxed text-[var(--color-ink-muted)]">
              {action.description}
            </p>
            {action.examModes ? (
              <div className="mt-3">
                <FullExamModeButtons examSlug={examSlug} showCustomizeLink />
              </div>
            ) : (
              <Link
                href={action.href!}
                className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-[var(--color-accent)]"
              >
                {action.cta}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
