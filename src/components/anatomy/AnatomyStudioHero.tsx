"use client";

import { Compass, PlayCircle } from "lucide-react";
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

/** Welcome header — calm Apple-style intro with one clear action. */
export function AnatomyStudioHero({ examSlug, stats, onStartTour, catalogOnly = false }: Props) {
  const exam = EXAM_CATALOG[examSlug];

  return (
    <header className={cnHeroPanel()}>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0 space-y-2">
          <p className={anatomyUi.eyebrow}>{exam.shortName} · Anatomy Explorer</p>
          <h2 className={anatomyUi.heroTitle}>
            {catalogOnly ? "Structure catalog" : "Explore the body in 3D"}
          </h2>
          <p className={anatomyUi.heroSubtitle}>
            {catalogOnly
              ? `${stats.structureCount} structures with clinical pearls, procedures, and board-style practice links.`
              : `Orbit an interactive model, tap any organ, and follow guided tours through ${stats.procedureCount} high-yield procedures.`}
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
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
          {!catalogOnly ? (
            <p className="flex items-center gap-1.5 text-[12px] text-[var(--color-ink-muted)] sm:px-1">
              <Compass className="h-3.5 w-3.5 shrink-0" aria-hidden />
              Drag to rotate · scroll to zoom · tap to learn
            </p>
          ) : null}
        </div>
      </div>
    </header>
  );
}

function StatPill({ label }: { label: string }) {
  return (
    <span className="inline-flex rounded-full bg-black/[0.04] px-3 py-1 text-[12px] font-medium text-[var(--color-ink-muted)]">
      {label}
    </span>
  );
}

function cnHeroPanel() {
  return `${anatomyUi.panelElevated} px-5 py-6 sm:px-7 sm:py-7`;
}
