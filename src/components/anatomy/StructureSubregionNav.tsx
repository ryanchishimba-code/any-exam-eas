"use client";

import { Layers } from "lucide-react";
import { getSubregionsForStructure } from "@/lib/anatomy";
import { anatomyUi } from "@/lib/anatomy/anatomy-ui";
import type { AnatomyStructure } from "@/lib/anatomy/types";
import { cn } from "@/lib/utils";

type Props = {
  structure: AnatomyStructure;
  selectedSubregionId?: string | null;
  onSelectSubregion: (subregionId: string) => void;
};

/** Sub-region chips — zoom the 3D model to anatomical subdivisions of the parent organ. */
export function StructureSubregionNav({
  structure,
  selectedSubregionId,
  onSelectSubregion,
}: Props) {
  const subregions = getSubregionsForStructure(structure.id);
  if (subregions.length === 0) return null;

  return (
    <section aria-label="Anatomical sub-regions" className={anatomyUi.detailSection}>
      <div className="flex items-center gap-2">
        <Layers className="h-4 w-4 text-[var(--color-accent)]" aria-hidden />
        <h4 className="text-[14px] font-semibold text-white">Sub-regions</h4>
      </div>
      <p className="mt-1 text-[12px] text-white/70">
        Tap to highlight a subdivision on the 3D model.
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {subregions.map((sub) => {
          const active = selectedSubregionId === sub.id;
          return (
            <button
              key={sub.id}
              type="button"
              onClick={() => onSelectSubregion(sub.id)}
              className={cn(
                anatomyUi.chip,
                "px-3 py-1.5 text-[12px]",
                active ? anatomyUi.chipActive : anatomyUi.chipIdle
              )}
            >
              {sub.name}
            </button>
          );
        })}
      </div>
    </section>
  );
}
