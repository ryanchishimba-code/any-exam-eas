"use client";

import { Layers } from "lucide-react";
import { getSubregionsForStructure } from "@/lib/anatomy";
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
    <section aria-label="Anatomical sub-regions">
      <div className="mb-2 flex items-center gap-2">
        <Layers className="h-4 w-4 text-violet-600" aria-hidden />
        <h4 className="text-sm font-bold text-[var(--color-ink)]">Sub-regions</h4>
      </div>
      <p className="mb-2 text-[11px] text-[var(--color-ink-muted)]">
        Tap to highlight a subdivision on the 3D model.
      </p>
      <div className="flex flex-wrap gap-1.5">
        {subregions.map((sub) => {
          const active = selectedSubregionId === sub.id;
          return (
            <button
              key={sub.id}
              type="button"
              onClick={() => onSelectSubregion(sub.id)}
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-medium transition",
                active
                  ? "bg-violet-600 text-white shadow-sm"
                  : "bg-violet-50 text-violet-800 hover:bg-violet-100"
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
