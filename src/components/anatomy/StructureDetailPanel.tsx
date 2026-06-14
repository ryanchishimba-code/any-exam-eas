"use client";

import { useState } from "react";
import Link from "next/link";
import { BookMarked, Brain, Stethoscope, Zap, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import {
  anatomyPracticeHref,
  highYieldTopicHref,
  practiceTopicHref,
  referenceCardHref,
} from "@/lib/edtech/practice-links";
import type { AnatomyStructure } from "@/lib/anatomy/types";
import type { MemoryCard } from "@/lib/reference/types";
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
    <div className="flex-1 space-y-5 overflow-y-auto p-4">
      <p className="text-sm leading-relaxed text-[var(--color-ink-muted)]">
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
        <blockquote className="rounded-2xl border-l-4 border-teal-500 bg-teal-50/60 px-4 py-3 text-sm font-medium leading-relaxed text-[var(--color-ink)]">
          {structure.clinicalFacts[0]}
        </blockquote>
      ) : null}

      {structure.clinicalFacts.length > 1 ? (
        <section>
          <div className="mb-2 flex items-center gap-2">
            <Stethoscope className="h-4 w-4 text-teal-600" aria-hidden />
            <h4 className="text-sm font-bold text-[var(--color-ink)]">More clinical pearls</h4>
          </div>
          <ul className="space-y-2">
            {structure.clinicalFacts.slice(1).map((fact) => (
              <li
                key={fact}
                className="rounded-xl bg-teal-50/70 px-3 py-2 text-sm text-[var(--color-ink)]"
              >
                {fact}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {structure.pathologies && structure.pathologies.length > 0 ? (
        <section>
          <div className="mb-2 flex items-center gap-2">
            <Brain className="h-4 w-4 text-rose-600" aria-hidden />
            <h4 className="text-sm font-bold text-[var(--color-ink)]">Related conditions</h4>
          </div>
          <p className="mb-2 text-[11px] text-[var(--color-ink-muted)]">
            Tap a condition to jump to drugs and endpoints below.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {structure.pathologies.map((p) => {
              const diseaseId = resolvePathologyDiseaseId(structure.id, p);
              const active = diseaseId && focusedDiseaseId === diseaseId;
              if (!diseaseId) {
                return (
                  <Badge key={p} className="bg-rose-50 text-rose-800">
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
                    "rounded-full px-2.5 py-1 text-xs font-medium transition",
                    active
                      ? "bg-rose-600 text-white shadow-sm"
                      : "bg-rose-50 text-rose-800 hover:bg-rose-100"
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
        <section>
          <div className="mb-2 flex items-center gap-2">
            <BookMarked className="h-4 w-4 text-violet-600" aria-hidden />
            <h4 className="text-sm font-bold text-[var(--color-ink)]">Memory cards</h4>
          </div>
          <ul className="space-y-2">
            {memoryCards.map((card) => (
              <li key={card.id}>
                <Link
                  href={referenceCardHref(examSlug, card.id)}
                  className="block rounded-xl border border-black/[0.06] bg-[var(--color-surface)] px-3 py-2 text-sm transition hover:border-violet-200 hover:bg-violet-50/50"
                >
                  <p className="font-medium text-[var(--color-ink)]">{card.title}</p>
                  <p className="mt-0.5 text-xs text-[var(--color-ink-muted)]">{card.teaser}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="flex flex-col gap-2 pt-2 pb-safe">
        {showStudioCta && onOpenStudio ? (
          <Button
            variant="secondary"
            className="w-full justify-center px-4 py-2.5 text-sm"
            onClick={onOpenStudio}
          >
            Back to anatomy studio
          </Button>
        ) : null}
        <Button
          href={practiceTopicHref(examSlug, structure.practiceTopicSlug, 10)}
          variant="primary"
          className="w-full justify-center px-4 py-2.5 text-sm"
        >
          Practice questions
        </Button>
        <Button
          href={anatomyPracticeHref(examSlug, 10)}
          variant="secondary"
          className="w-full justify-center px-4 py-2.5 text-sm"
        >
          Anatomy practice
        </Button>
        {structure.highYieldTopicSlug ? (
          <Button
            href={highYieldTopicHref(examSlug, structure.highYieldTopicSlug)}
            variant="secondary"
            className="w-full justify-center px-4 py-2.5 text-sm"
          >
            High-yield topic review
          </Button>
        ) : null}
      </div>
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
    <div className="flex items-start justify-between gap-3 border-b border-black/[0.06] p-4">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          {structure.highYield ? (
            <Badge className="bg-amber-100 text-amber-900">
              <Zap className="mr-1 h-3 w-3" aria-hidden />
              High-yield
            </Badge>
          ) : null}
          <Badge className="bg-violet-50 text-violet-800 capitalize">{structure.system}</Badge>
          {parent ? (
            <Badge className="bg-slate-100 text-slate-700">{parent.name}</Badge>
          ) : null}
        </div>
        <h3 className="mt-2 text-xl font-bold text-[var(--color-ink)]">{structure.name}</h3>
      </div>
      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-2 text-[var(--color-ink-muted)] hover:bg-[var(--color-surface)]"
          aria-label="Close structure details"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      ) : null}
    </div>
  );
}
