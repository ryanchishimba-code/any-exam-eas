"use client";

import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { AnatomyCatalogStats } from "@/lib/anatomy/catalog";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import type { ExamSlug } from "@/types/edtech";

type Props = {
  examSlug: ExamSlug;
  stats: AnatomyCatalogStats;
  onStartTour: () => void;
  catalogOnly?: boolean;
};

/** Compact page header — stats and one primary study action. */
export function AnatomyStudioHero({ examSlug, stats, onStartTour, catalogOnly = false }: Props) {
  const exam = EXAM_CATALOG[examSlug];

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-black/[0.06] bg-white px-4 py-3 shadow-[var(--shadow-apple-sm)]">
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-violet-600">
          {exam.shortName} anatomy
        </p>
        <h2 className="text-lg font-bold text-[var(--color-ink)]">
          {catalogOnly ? "Structure catalog" : "Interactive 3D explorer"}
        </h2>
        <p className="text-xs text-[var(--color-ink-muted)]">
          {stats.structureCount} structures · {stats.highYieldCount} high-yield
          {!catalogOnly ? " · click the model or pick from the list" : ""}
        </p>
      </div>
      <Button
        variant="secondary"
        className="shrink-0 border-violet-200 text-violet-800 hover:bg-violet-50"
        onClick={onStartTour}
      >
        <GraduationCap className="mr-2 h-4 w-4" aria-hidden />
        Guided tour
      </Button>
    </div>
  );
}
