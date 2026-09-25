"use client";

import type { CoverageChip, CoverageHeatmap } from "@/lib/learning/coverage-heatmap";
import { cn } from "@/lib/utils";

/**
 * Untouched and low-coverage chips from the shared heatmap.
 * The count is every active question in that blueprint area.
 */
export function CoverageChips({
  chips,
  domainsLabel,
  selectedChipId,
  onSelect,
}: {
  chips: CoverageChip[];
  domainsLabel: CoverageHeatmap["domainsLabel"];
  /** Highlighted when this area is the pool being practiced. */
  selectedChipId?: string;
  onSelect: (areaId: string) => void;
}) {
  if (chips.length === 0) return null;

  return (
    <div className="space-y-3">
      <p className="text-[15px] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
        {domainsLabel}
      </p>
      <div className="flex flex-wrap gap-2">
        {chips.map((chip) => {
          const selected = chip.domainId === selectedChipId;
          const kindLabel = chip.kind === "untouched" ? "Untouched" : "Low";
          const count =
            chip.available > 0
              ? ` · ${chip.available.toLocaleString()} in this area`
              : "";
          return (
            <button
              key={chip.domainId}
              type="button"
              onClick={() => onSelect(chip.domainId)}
              title={
                chip.available > 0
                  ? `${chip.available.toLocaleString()} active questions in this blueprint area`
                  : undefined
              }
              className={cn(
                "rounded-full px-3.5 py-2 text-[13px] font-semibold tracking-[-0.015em] transition",
                selected
                  ? "bg-[var(--color-accent)] text-white"
                  : "border border-[var(--color-accent)]/25 bg-[var(--color-accent)]/10 text-[var(--color-accent)] hover:border-[var(--color-accent)]/50"
              )}
            >
              {kindLabel} · {chip.label}
              {count}
            </button>
          );
        })}
      </div>
    </div>
  );
}
