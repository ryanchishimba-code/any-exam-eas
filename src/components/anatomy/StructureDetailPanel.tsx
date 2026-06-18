"use client";

import { useState, type ComponentType } from "react";
import Link from "next/link";
import { BookMarked, Brain, Stethoscope, X, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import {
  anatomyPracticeHref,
  highYieldTopicHref,
  practiceTopicHref,
  libraryCardHref,
} from "@/lib/edtech/practice-links";
import type { AnatomyStructure } from "@/lib/anatomy/types";
import { anatomyUi } from "@/lib/anatomy/anatomy-ui";
import type { MemoryCard } from "@/lib/library/types";
import type { ExamSlug } from "@/types/edtech";
import { StructureClinicalLinks, resolvePathologyDiseaseId } from "@/components/anatomy/StructureClinicalLinks";
import { StructureProcedureLinks } from "@/components/anatomy/StructureProcedureLinks";
import { StructureSubregionNav } from "@/components/anatomy/StructureSubregionNav";
import { getAnatomyStructure, getSubregionsForStructure } from "@/lib/anatomy";
import { cn } from "@/lib/utils";

type Props = {
  structure: AnatomyStructure;
  memoryCards: MemoryCard[];
  examSlug: ExamSlug;
  showStudioCta?: boolean;
  onOpenStudio?: () => void;
  onSelectSubregion?: (subregionId: string) => void;
  initialFocusedProcedureId?: string | null;
};

export function StructureDetailPanel({
  structure,
  memoryCards,
  examSlug,
  showStudioCta,
  onOpenStudio,
  onSelectSubregion,
  initialFocusedProcedureId,
}: Props) {
  const [focusedDiseaseId, setFocusedDiseaseId] = useState<string | null>(null);
  const parentStructure = structure.parentId ? getAnatomyStructure(structure.parentId) : structure;
  const anchorStructure = parentStructure ?? structure;
  const subregions = getSubregionsForStructure(anchorStructure.id);
  const selectedSubregionId = structure.parentId ? structure.id : null;

  return (
    <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
      <p className="text-[15px] leading-relaxed text-[var(--color-ink-muted)]">
        {structure.description}
      </p>

      {subregions.length > 0 && onSelectSubregion ? (
        <StructureSubregionNav
          structure={anchorStructure}
          selectedSubregionId={selectedSubregionId}
          onSelectSubregion={onSelectSubregion}
        />
      ) : null}

      {structure.clinicalFacts[0] ? (
        <blockquote className="rounded-[18px] border-l-[3px] border-[var(--color-accent)] bg-[var(--color-accent)]/[0.06] px-4 py-3.5 text-[15px] font-medium leading-relaxed text-[var(--color-ink)]">
          {structure.clinicalFacts[0]}
        </blockquote>
      ) : null}

      {structure.clinicalFacts.length > 1 ? (
        <section className={anatomyUi.detailSection}>
          <SectionHeading icon={Stethoscope} title="Clinical pearls" />
          <ul className="mt-3 space-y-2">
            {structure.clinicalFacts.slice(1).map((fact) => (
              <li
                key={fact}
                className="rounded-[12px] bg-white/80 px-3 py-2.5 text-[14px] leading-relaxed text-[var(--color-ink)]"
              >
                {fact}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {structure.pathologies && structure.pathologies.length > 0 ? (
        <section className={anatomyUi.detailSection}>
          <SectionHeading icon={Brain} title="Related conditions" />
          <p className="mt-1 text-[12px] text-[var(--color-ink-muted)]">
            Tap a condition to jump to drugs and endpoints below.
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {structure.pathologies.map((p) => {
              const diseaseId = resolvePathologyDiseaseId(structure.id, p);
              const active = diseaseId && focusedDiseaseId === diseaseId;
              if (!diseaseId) {
                return (
                  <Badge key={p} className="rounded-full bg-black/[0.05] text-[var(--color-ink)]">
                    {p}
                  </Badge>
                );
              }
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setFocusedDiseaseId(diseaseId)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-[12px] font-medium transition",
                    active
                      ? "bg-[var(--color-accent)] text-white shadow-sm"
                      : "bg-white text-[var(--color-ink)] ring-1 ring-black/[0.06] hover:bg-black/[0.02]"
                  )}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </section>
      ) : null}

      <StructureClinicalLinks
        structure={anchorStructure}
        focusedDiseaseId={focusedDiseaseId}
        onFocusDisease={setFocusedDiseaseId}
      />

      <StructureProcedureLinks
        structure={anchorStructure}
        initialFocusedProcedureId={initialFocusedProcedureId}
      />

      {memoryCards.length > 0 ? (
        <section className={anatomyUi.detailSection}>
          <SectionHeading icon={BookMarked} title="Memory cards" />
          <ul className="mt-3 space-y-2">
            {memoryCards.map((card) => (
              <li key={card.id}>
                <Link
                  href={libraryCardHref(examSlug, card.id)}
                  className="block rounded-[14px] bg-white px-3.5 py-3 text-[14px] transition hover:shadow-[var(--shadow-apple-sm)]"
                >
                  <p className="font-semibold text-[var(--color-ink)]">{card.title}</p>
                  <p className="mt-0.5 text-[12px] text-[var(--color-ink-muted)]">{card.teaser}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="flex flex-col gap-2 pt-1 pb-safe">
        {showStudioCta && onOpenStudio ? (
          <Button
            variant="secondary"
            className="h-11 w-full justify-center rounded-full text-[14px]"
            onClick={onOpenStudio}
          >
            Back to anatomy studio
          </Button>
        ) : null}
        <Button
          href={practiceTopicHref(examSlug, structure.practiceTopicSlug, 10)}
          variant="primary"
          className="h-11 w-full justify-center rounded-full text-[14px] font-semibold shadow-[var(--shadow-apple-btn)]"
        >
          Practice questions
        </Button>
        <Button
          href={anatomyPracticeHref(examSlug, 10)}
          variant="secondary"
          className="h-11 w-full justify-center rounded-full text-[14px]"
        >
          Anatomy practice
        </Button>
        {structure.highYieldTopicSlug ? (
          <Button
            href={highYieldTopicHref(examSlug, structure.highYieldTopicSlug)}
            variant="secondary"
            className="h-11 w-full justify-center rounded-full text-[14px]"
          >
            High-yield topic review
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function SectionHeading({
  icon: Icon,
  title,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-[var(--color-accent)]" aria-hidden />
      <h4 className="text-[14px] font-semibold text-[var(--color-ink)]">{title}</h4>
    </div>
  );
}

export function StructureDetailHeader({
  structure,
  onClose,
}: {
  structure: AnatomyStructure;
  onClose?: () => void;
}) {
  const parent = structure.parentId ? getAnatomyStructure(structure.parentId) : null;

  return (
    <div className="border-b border-black/[0.05] px-4 py-4 sm:px-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            {structure.highYield ? (
              <Badge className="rounded-full bg-amber-100 text-amber-900">
                <Zap className="mr-1 h-3 w-3" aria-hidden />
                High-yield
              </Badge>
            ) : null}
            <Badge className="rounded-full bg-black/[0.05] capitalize text-[var(--color-ink-muted)]">
              {structure.system}
            </Badge>
            {parent ? (
              <Badge className="rounded-full bg-black/[0.05] text-[var(--color-ink-muted)]">
                {parent.name}
              </Badge>
            ) : null}
          </div>
          <h3 className="mt-2 text-[22px] font-semibold tracking-tight text-[var(--color-ink)]">
            {structure.name}
          </h3>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-black/[0.04] p-2 text-[var(--color-ink-muted)] transition hover:bg-black/[0.08]"
            aria-label="Close structure details"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        ) : null}
      </div>
    </div>
  );
}
