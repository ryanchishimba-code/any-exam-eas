"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BarChart3,
  Bone,
  BookOpen,
  Calculator,
  Clock,
  Layers,
  Sparkles,
  Target,
} from "lucide-react";
import {
  analyticsHref,
  anatomyHref,
  highYieldTopicsHref,
  practiceTopicHref,
  questionBankHref,
  top500Href,
} from "@/lib/edtech/practice-links";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

type Tool = {
  label: string;
  description: string;
  href: string;
  icon: typeof BookOpen;
  gradient: string;
};

export function ReferenceQuickTools({ examSlug }: { examSlug: ExamSlug }) {
  const fieldId = EXAM_CATALOG[examSlug].fieldId;
  const tools: Tool[] = [
    {
      label: "Top 500 Drugs",
      description: "MOA, brands, pearls",
      href: top500Href(examSlug),
      icon: Layers,
      gradient: "from-violet-500/20 to-purple-600/10",
    },
    {
      label: "Anatomy",
      description: "3D + clinical links",
      href: anatomyHref(examSlug),
      icon: Bone,
      gradient: "from-rose-500/15 to-orange-500/10",
    },
    {
      label: "High-Yield",
      description: "Review modules",
      href: highYieldTopicsHref(examSlug),
      icon: Sparkles,
      gradient: "from-amber-500/15 to-yellow-500/10",
    },
    {
      label: "Question Bank",
      description: "Adaptive practice",
      href: questionBankHref(examSlug),
      icon: BookOpen,
      gradient: "from-sky-500/15 to-blue-600/10",
    },
    {
      label: "Weak Areas",
      description: "Targeted drill",
      href: `/study/practice?field=${fieldId}&mode=bank&style=weak_areas`,
      icon: Target,
      gradient: "from-emerald-500/15 to-teal-600/10",
    },
    {
      label: "Analytics",
      description: "Track progress",
      href: analyticsHref(),
      icon: BarChart3,
      gradient: "from-indigo-500/15 to-violet-600/10",
    },
  ];

  if (examSlug === "naplex") {
    tools.push({
      label: "Calculations",
      description: "Equations & conversions",
      href: `${questionBankHref(examSlug)}&subjectId=compounding-calculations`,
      icon: Calculator,
      gradient: "from-cyan-500/15 to-teal-500/10",
    });
  } else {
    tools.push({
      label: "Timed Exam",
      description: "Full simulation",
      href: practiceTopicHref(examSlug, "mixed", 20),
      icon: Clock,
      gradient: "from-fuchsia-500/15 to-pink-600/10",
    });
  }

  return (
    <section id="hub-tools" aria-labelledby="quick-tools-heading" className="space-y-3">
      <h3 id="quick-tools-heading" className="text-sm font-bold text-[var(--color-ink)]">
        Quick tools
      </h3>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
        {tools.slice(0, 8).map((tool, i) => (
          <motion.div
            key={tool.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.3 }}
          >
            <Link
              href={tool.href}
              className={cn(
                "group flex h-full flex-col rounded-2xl border border-black/[0.06] bg-gradient-to-br p-3.5 shadow-sm transition",
                "hover:-translate-y-0.5 hover:border-[var(--color-accent)]/25 hover:shadow-md",
                tool.gradient
              )}
            >
              <tool.icon
                className="h-5 w-5 text-[var(--color-accent)] transition group-hover:scale-110"
                aria-hidden
              />
              <span className="mt-2 text-sm font-bold text-[var(--color-ink)]">{tool.label}</span>
              <span className="mt-0.5 text-[11px] text-[var(--color-ink-muted)]">
                {tool.description}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
