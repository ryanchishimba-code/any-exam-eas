"use client";

import { useMemo } from "react";
import type { AnatomyStructure } from "@/lib/anatomy/types";
import { getFeaturedStructuresForExam } from "@/lib/anatomy/recommendations";
import { anatomyUi } from "@/lib/anatomy/anatomy-ui";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

type Props = {
  examSlug: ExamSlug;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onPreview?: (id: string | null) => void;
  /** Optional filter — e.g. CT atlas browse list. */
  structureFilter?: (structure: AnatomyStructure) => boolean;
};

/** Exam-scoped high-yield structure shortcuts below the page hero. */
export function AnatomyFeaturedPicks({ examSlug, selectedId, onSelect, onPreview, structureFilter }: Props) {
  const featured = useMemo(() => {
    const items = getFeaturedStructuresForExam(examSlug);
    return structureFilter ? items.filter(structureFilter) : items;
  }, [examSlug, structureFilter]);
  const exam = EXAM_CATALOG[examSlug];

  if (featured.length === 0) return null;

  return (
    <section aria-label={`High-yield structures for ${exam.shortName}`}>
      <p className={anatomyUi.sectionLabel}>High-yield for {exam.shortName}</p>
      <p className={anatomyUi.sectionHint}>Exam-focused structures — click to explore in 3D</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {featured.map((structure) => (
          <button
            key={structure.id}
            type="button"
            onClick={() => onSelect(structure.id)}
            onMouseEnter={() => onPreview?.(structure.id)}
            onMouseLeave={() => onPreview?.(null)}
            onFocus={() => onPreview?.(structure.id)}
            onBlur={() => onPreview?.(null)}
            className={cn(
              anatomyUi.chip,
              selectedId === structure.id ? anatomyUi.chipActive : anatomyUi.chipIdle
            )}
          >
            {structure.name}
            {structure.highYield ? " ★" : null}
          </button>
        ))}
      </div>
    </section>
  );
}
