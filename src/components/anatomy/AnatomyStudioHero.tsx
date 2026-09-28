"use client";

import { PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { AnatomyCatalogStats } from "@/lib/anatomy/catalog";
import { anatomyUi } from "@/lib/anatomy/anatomy-ui";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import type { ExamSlug } from "@/types/edtech";

type Props = {
  examSlug: ExamSlug;
  stats: AnatomyCatalogStats;
  onStartTour: () => void;
  catalogOnly?: boolean;
};

/** Compact page header aligned with dashboard / reference surfaces. */
export function AnatomyStudioHero({ examSlug, stats, onStartTour, catalogOnly = false }: Props) {
  const exam = EXAM_CATALOG[examSlug];

  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0 space-y-2">
        <p className={anatomyUi.eyebrow}>{exam.shortName} · Anatomy Explorer</p>
        <h2 className={anatomyUi.heroTitle}>
          {catalogOnly ? "Structure catalog" : "Anatomy"}
        </h2>
        <div className="flex flex-wrap gap-2 pt-0.5">
          <StatPill label={`${stats.structureCount} structures`} />
          <StatPill label={`${stats.procedureCount} procedures`} />
          <StatPill label={`${stats.highYieldCount} high-yield`} />
          {!catalogOnly ? <StatPill label={`${stats.tourCount} tours`} /> : null}
        </div>
      </div>

      <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
        <Button
          variant="primary"
          className="h-11 justify-center rounded-full px-5 text-[15px] font-semibold shadow-[var(--shadow-apple-btn)]"
          onClick={onStartTour}
        >
          <PlayCircle className="mr-2 h-4 w-4" aria-hidden />
          Start guided tour
        </Button>
      </div>
    </header>
  );
}

function StatPill({ label }: { label: string }) {
  return <span className={anatomyUi.statPill}>{label}</span>;
}
