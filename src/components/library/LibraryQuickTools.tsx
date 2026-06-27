"use client";

import Link from "next/link";
import {
  BarChart3,
  Bone,
  BookOpen,
  Calculator,
  Clock,
  ChevronRight,
  Layers,
  Microscope,
  Sparkles,
  Target,
} from "lucide-react";
import {
  analyticsHref,
  anatomyHref,
  highYieldTopicsHref,
  practiceTopicHref,
  questionBankHref,
  libraryTopicHref,
  top500Href,
} from "@/lib/edtech/practice-links";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import { hasClinicalStudyTools } from "@/lib/edtech/exam-content-scope";
import { libUi } from "@/lib/library/library-ui";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

const EXAM_ID_TOPIC: Partial<Record<ExamSlug, { label: string; topicKey: string }>> = {
  naplex: { label: "ID & Antibiotics", topicKey: "infectious-disease-rx" },
  usmle: { label: "Infectious Disease", topicKey: "internal-medicine" },
  nclex: { label: "Infection Control", topicKey: "infection-control" },
};

const CLINICAL_CALC_EXAMS: ExamSlug[] = ["naplex", "usmle", "nclex", "pance", "aanp-fnp", "npte-pt"];

type Tool = {
  label: string;
  href: string;
  icon: typeof BookOpen;
};

export function LibraryQuickTools({ examSlug }: { examSlug: ExamSlug }) {
  const fieldId = EXAM_CATALOG[examSlug].fieldId;
  const clinical = hasClinicalStudyTools(examSlug);
  const tools: Tool[] = [
    ...(clinical
      ? [
          { label: "Top 500 Drugs", href: top500Href(examSlug), icon: Layers },
          { label: "Anatomy", href: anatomyHref(examSlug), icon: Bone },
        ]
      : []),
    {
      label: "High-Yield",
      href: highYieldTopicsHref(examSlug),
      icon: Sparkles,
    },
    {
      label: "Question Bank",
      href: questionBankHref(examSlug),
      icon: BookOpen,
    },
    {
      label: "Weak Areas",
      href: `${questionBankHref(examSlug)}&style=weak_areas`,
      icon: Target,
    },
    {
      label: "Analytics",
      href: analyticsHref(),
      icon: BarChart3,
    },
  ];

  const idTopic = EXAM_ID_TOPIC[examSlug];
  if (idTopic) {
    tools.splice(2, 0, {
      label: idTopic.label,
      href: libraryTopicHref(examSlug, idTopic.topicKey),
      icon: Microscope,
    });
  }
  if (CLINICAL_CALC_EXAMS.includes(examSlug)) {
    tools.splice(idTopic ? 3 : 2, 0, {
      label: "Calculators",
      href: "#hub-calculators",
      icon: Calculator,
    });
  }

  if (examSlug === "naplex") {
    tools.push({
      label: "Calculations",
      href: `${questionBankHref(examSlug)}&subjectId=compounding-calculations`,
      icon: Calculator,
    });
  } else {
    tools.push({
      label: "Timed Exam",
      href: practiceTopicHref(examSlug, "mixed", 20),
      icon: Clock,
    });
  }

  return (
    <section id="hub-tools" aria-labelledby="quick-tools-heading" className="space-y-3">
      <div className="px-0.5">
        <h2 id="quick-tools-heading" className={libUi.sectionTitle}>
          Quick tools
        </h2>
        <p className={cn(libUi.sectionHint, "mt-0.5")}>
          Practice, reference, and analytics.
        </p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {tools.map((tool) => (
          <Link
            key={tool.label}
            href={tool.href}
            className={cn(
              libUi.surface,
              "group flex items-center justify-between gap-2 px-3.5 py-3 transition",
              "hover:border-[var(--color-accent)]/20 hover:bg-[var(--color-surface)]/40"
            )}
          >
            <span className="inline-flex items-center gap-2.5 text-[13px] font-medium text-[var(--color-ink)]">
              <tool.icon className="h-4 w-4 text-[var(--color-accent)]" aria-hidden />
              {tool.label}
            </span>
            <ChevronRight
              className="h-3.5 w-3.5 text-[var(--color-ink-muted)]/40 transition group-hover:text-[var(--color-accent)]"
              aria-hidden
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
