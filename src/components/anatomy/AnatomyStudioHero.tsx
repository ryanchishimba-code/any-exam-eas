"use client";

import { GraduationCap, MousePointerClick, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import type { AnatomyCatalogStats } from "@/lib/anatomy/catalog";
import { anatomyPracticeHref } from "@/lib/edtech/practice-links";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import type { ExamSlug } from "@/types/edtech";

type Props = {
  examSlug: ExamSlug;
  stats: AnatomyCatalogStats;
  onStartTour: () => void;
};

export function AnatomyStudioHero({ examSlug, stats, onStartTour }: Props) {
  const exam = EXAM_CATALOG[examSlug];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-violet-200/50 bg-gradient-to-br from-violet-600 via-violet-700 to-indigo-800 p-6 text-white shadow-[var(--shadow-apple-md)] sm:p-8">
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-teal-400/20 blur-2xl"
        aria-hidden
      />

      <div className="relative flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-xl">
          <Badge className="mb-3 bg-white/15 text-white backdrop-blur-sm">
            {exam.shortName} · Study support
          </Badge>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            3D anatomy study model
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-violet-100 sm:text-base">
            Orbit a stylized body with {stats.structureCount} clickable structures — peel the skin to
            reveal organs, bones, muscles, and vessels, then jump into pearls and practice.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <StatPill label="Body parts" value={String(stats.structureCount)} />
          <StatPill label="Tours" value={String(stats.tourCount)} />
          <StatPill label="Quiz" value={String(stats.quizCount)} />
          <StatPill label="High-yield" value={String(stats.highYieldCount)} />
        </div>
      </div>

      <div className="relative mt-6 flex flex-wrap gap-2">
        <Button
          variant="secondary"
          className="border-0 bg-white text-violet-800 hover:bg-violet-50"
          onClick={onStartTour}
        >
          <GraduationCap className="mr-2 h-4 w-4" aria-hidden />
          Start guided tour
        </Button>
        <span className="inline-flex items-center gap-1.5 self-center rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-medium text-violet-100">
          <MousePointerClick className="h-3.5 w-3.5" aria-hidden />
          Click body · spin · pearls
        </span>
        <Button
          href={anatomyPracticeHref(examSlug, 15)}
          variant="secondary"
          className="border border-white/25 bg-white/10 text-white hover:bg-white/20"
        >
          <Sparkles className="mr-2 h-4 w-4" aria-hidden />
          Anatomy question bank
        </Button>
      </div>
    </div>
  );
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 backdrop-blur-sm">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-violet-200">{label}</p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );
}
