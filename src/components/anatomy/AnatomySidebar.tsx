"use client";

import { useMemo } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { groupStructuresBySystem } from "@/lib/anatomy";
import { anatomyUi } from "@/lib/anatomy/anatomy-ui";
import { ANATOMY_SYSTEM_COLORS } from "@/lib/anatomy/system-colors";
import { LAYER_SWATCHES } from "@/lib/anatomy/cartoon/layer-styles";
import {
  ANATOMY_LAYER_LABELS,
  ANATOMY_SYSTEM_LABELS,
  type AnatomyLayer,
  type AnatomyStructure,
  type AnatomySystem,
} from "@/lib/anatomy/types";
import { cn } from "@/lib/utils";

type Props = {
  structures: AnatomyStructure[];
  filteredStructures: AnatomyStructure[];
  search: string;
  onSearchChange: (v: string) => void;
  systemFilter: AnatomySystem | "all";
  onSystemFilterChange: (v: AnatomySystem | "all") => void;
  highYieldOnly: boolean;
  onHighYieldOnlyChange: (v: boolean) => void;
  visibleLayers: Set<AnatomyLayer>;
  onToggleLayer: (layer: AnatomyLayer) => void;
  selectedId: string | null;
  hoveredId?: string | null;
  onSelectStructure: (id: string) => void;
  onHoverStructure?: (id: string | null) => void;
  onResetFilters?: () => void;
  collapsed?: boolean;
  showLayerControls?: boolean;
};

const SYSTEMS = Object.entries(ANATOMY_SYSTEM_LABELS) as [AnatomySystem, string][];
const LAYERS = Object.entries(ANATOMY_LAYER_LABELS) as [AnatomyLayer, string][];

export function AnatomySidebar({
  filteredStructures,
  search,
  onSearchChange,
  systemFilter,
  onSystemFilterChange,
  highYieldOnly,
  onHighYieldOnlyChange,
  visibleLayers,
  onToggleLayer,
  selectedId,
  hoveredId = null,
  onSelectStructure,
  onHoverStructure,
  onResetFilters,
  collapsed = false,
  showLayerControls = true,
}: Props) {
  const groupBySystem = !search.trim() && systemFilter === "all";
  const groupedStructures = useMemo(
    () => (groupBySystem ? groupStructuresBySystem(filteredStructures) : null),
    [filteredStructures, groupBySystem]
  );

  if (collapsed) return null;

  return (
    <aside className={cn(anatomyUi.panel, "flex h-full max-h-[min(72vh,640px)] flex-col gap-4 p-4")}>
      <div>
        <h2 className={anatomyUi.sectionLabel}>Browse structures</h2>
        <p className={anatomyUi.sectionHint}>Search or filter by organ system</p>
      </div>

      <label className="relative block">
        <span className="sr-only">Search structures</span>
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-ink-muted)]"
          aria-hidden
        />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search anatomy"
          className={anatomyUi.searchInput}
        />
        {search ? (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-[var(--color-ink-muted)] hover:bg-black/[0.05]"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </label>

      <div className="flex items-center justify-between gap-3 rounded-[14px] bg-black/[0.03] px-3.5 py-2.5">
        <span className="text-[14px] font-medium text-[var(--color-ink)]">High-yield only</span>
        <Switch checked={highYieldOnly} onCheckedChange={onHighYieldOnlyChange} />
      </div>

      <div className="space-y-2">
        <p className="flex items-center gap-1.5 text-[12px] font-medium text-[var(--color-ink-muted)]">
          <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden />
          Organ system
        </p>
        <div className="flex flex-wrap gap-1.5">
          <SystemChip
            label="All"
            active={systemFilter === "all"}
            onClick={() => onSystemFilterChange("all")}
          />
          {SYSTEMS.map(([id, label]) => (
            <SystemChip
              key={id}
              label={label}
              color={ANATOMY_SYSTEM_COLORS[id]}
              active={systemFilter === id}
              onClick={() => onSystemFilterChange(id)}
            />
          ))}
        </div>
      </div>

      {showLayerControls ? (
        <section aria-label="Layer visibility" className="space-y-2">
          <p className="text-[12px] font-medium text-[var(--color-ink-muted)]">Visible layers</p>
          <div className="flex flex-wrap gap-1.5">
            {LAYERS.map(([layer, label]) => {
              const on = visibleLayers.has(layer);
              return (
                <button
                  key={layer}
                  type="button"
                  onClick={() => onToggleLayer(layer)}
                  className={cn(
                    anatomyUi.chip,
                    "px-2.5 py-1.5 text-[12px]",
                    on ? anatomyUi.chipActive : anatomyUi.chipIdle
                  )}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: on ? "rgba(255,255,255,0.95)" : LAYER_SWATCHES[layer] }}
                    aria-hidden
                  />
                  {label}
                </button>
              );
            })}
          </div>
        </section>
      ) : null}

      <section className="min-h-0 flex-1 space-y-2 overflow-y-auto">
        <p className="text-[12px] font-medium text-[var(--color-ink-muted)]">
          {filteredStructures.length} result{filteredStructures.length === 1 ? "" : "s"}
        </p>
        {filteredStructures.length === 0 ? (
          <div className={anatomyUi.emptyState}>
            <p className="text-[15px] font-semibold text-[var(--color-ink)]">No structures found</p>
            <p className="mt-1 max-w-xs text-[13px] text-[var(--color-ink-muted)]">
              Try a different search or turn off filters.
            </p>
            {onResetFilters ? (
              <button
                type="button"
                onClick={onResetFilters}
                className="mt-4 rounded-full bg-[var(--color-accent)] px-4 py-2 text-[13px] font-semibold text-white shadow-[var(--shadow-apple-btn)]"
              >
                Reset filters
              </button>
            ) : null}
          </div>
        ) : groupedStructures ? (
          <div className="space-y-2">
            {groupedStructures.map(({ system, structures: items }) => (
              <details
                key={system}
                open={items.some((s) => s.id === selectedId) || items.length <= 4}
                className={anatomyUi.insetGroup}
              >
                <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-2.5 text-[13px] font-semibold text-[var(--color-ink)] [&::-webkit-details-marker]:hidden">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: ANATOMY_SYSTEM_COLORS[system] }}
                    aria-hidden
                  />
                  <span>{ANATOMY_SYSTEM_LABELS[system]}</span>
                  <span className="ml-auto text-[11px] font-medium text-[var(--color-ink-muted)]">
                    {items.length}
                  </span>
                </summary>
                <StructureList
                  structures={items}
                  selectedId={selectedId}
                  hoveredId={hoveredId}
                  onSelectStructure={onSelectStructure}
                  onHoverStructure={onHoverStructure}
                />
              </details>
            ))}
          </div>
        ) : (
          <StructureList
            structures={filteredStructures}
            selectedId={selectedId}
            hoveredId={hoveredId}
            onSelectStructure={onSelectStructure}
            onHoverStructure={onHoverStructure}
          />
        )}
      </section>
    </aside>
  );
}

function SystemChip({
  label,
  active,
  onClick,
  color,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  color?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium transition",
        active
          ? "bg-[var(--color-accent)] text-white shadow-sm"
          : "bg-white text-[var(--color-ink-muted)] ring-1 ring-black/[0.06] hover:text-[var(--color-ink)]"
      )}
    >
      {color ? (
        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} aria-hidden />
      ) : null}
      {label}
    </button>
  );
}

function StructureList({
  structures,
  selectedId,
  hoveredId = null,
  onSelectStructure,
  onHoverStructure,
}: {
  structures: AnatomyStructure[];
  selectedId: string | null;
  hoveredId?: string | null;
  onSelectStructure: (id: string) => void;
  onHoverStructure?: (id: string | null) => void;
}) {
  return (
    <ul className="space-y-0.5 px-1.5 pb-2">
      {structures.map((s) => {
        const selected = selectedId === s.id;
        const hovered = hoveredId === s.id;
        return (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => onSelectStructure(s.id)}
              onMouseEnter={() => onHoverStructure?.(s.id)}
              onMouseLeave={() => onHoverStructure?.(null)}
              onFocus={() => onHoverStructure?.(s.id)}
              onBlur={() => onHoverStructure?.(null)}
              className={cn(
                anatomyUi.listItem,
                selected
                  ? anatomyUi.listItemSelected
                  : hovered
                    ? "bg-white text-[var(--color-ink)] shadow-sm"
                    : cn(anatomyUi.listItemHover, "text-[var(--color-ink)]")
              )}
            >
              <span className="flex w-full items-center gap-2">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{
                    backgroundColor: selected
                      ? "rgba(255,255,255,0.9)"
                      : ANATOMY_SYSTEM_COLORS[s.system],
                  }}
                  aria-hidden
                />
                <span className="font-medium">{s.name}</span>
                {s.highYield ? (
                  <span
                    className={cn(
                      "ml-auto shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                      selected ? "bg-white/20 text-white" : "bg-amber-100 text-amber-800"
                    )}
                  >
                    HY
                  </span>
                ) : null}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
