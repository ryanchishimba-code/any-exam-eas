"use client";

import { useMemo } from "react";
import { Search, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { groupStructuresBySystem } from "@/lib/anatomy";
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
  /** Layer toggles show/hide clickable regions on the interactive human. */
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
    <aside className="flex h-full flex-col gap-3 overflow-hidden rounded-2xl border border-black/[0.06] bg-white p-4 shadow-[var(--shadow-apple-sm)]">
      <div>
        <h2 className="text-base font-bold text-[var(--color-ink)]">Structures</h2>
      </div>

      <label className="relative block">
        <span className="sr-only">Search structures</span>
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-ink-muted)]"
          aria-hidden
        />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search anatomy…"
          className="w-full rounded-xl border border-black/[0.08] bg-[var(--color-surface)] py-2 pl-9 pr-9 text-sm outline-none ring-[var(--color-accent)] focus:ring-2"
        />
        {search ? (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1 text-[var(--color-ink-muted)] hover:bg-white"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </label>

      <div className="flex items-center justify-between gap-2 rounded-xl bg-violet-50/80 px-3 py-2">
        <span className="text-sm font-medium text-[var(--color-ink)]">High-yield only</span>
        <Switch checked={highYieldOnly} onCheckedChange={onHighYieldOnlyChange} />
      </div>

      <label className="block space-y-1">
        <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
          Organ system
        </span>
        <select
          value={systemFilter}
          onChange={(e) => onSystemFilterChange(e.target.value as AnatomySystem | "all")}
          className="w-full rounded-xl border border-black/[0.08] bg-[var(--color-surface)] px-3 py-2 text-sm outline-none ring-[var(--color-accent)] focus:ring-2"
        >
          <option value="all">All systems</option>
          {SYSTEMS.map(([id, label]) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
      </label>

      {showLayerControls ? (
        <section aria-label="Layer visibility" className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
            Layers
          </p>
          <div className="flex flex-wrap gap-1.5">
            {LAYERS.map(([layer, label]) => {
              const on = visibleLayers.has(layer);
              return (
                <button
                  key={layer}
                  type="button"
                  onClick={() => onToggleLayer(layer)}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium transition",
                    on
                      ? "bg-violet-600 text-white shadow-sm"
                      : "bg-[var(--color-surface)] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                  )}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: on ? "rgba(255,255,255,0.9)" : LAYER_SWATCHES[layer] }}
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
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
          {filteredStructures.length} structures
          {systemFilter !== "all" ? ` · ${ANATOMY_SYSTEM_LABELS[systemFilter]}` : null}
        </p>
        {filteredStructures.length === 0 ? (
          <div className="rounded-xl border border-dashed border-black/[0.08] bg-[var(--color-surface)]/60 px-4 py-6 text-center">
            <p className="text-sm font-medium text-[var(--color-ink)]">No structures found</p>
            <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
              Try a different search term or turn off filters.
            </p>
            {onResetFilters ? (
              <button
                type="button"
                onClick={onResetFilters}
                className="mt-3 rounded-full bg-violet-100 px-3 py-1.5 text-xs font-semibold text-violet-800 transition hover:bg-violet-200"
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
                className="rounded-xl border border-black/[0.05] bg-[var(--color-surface)]/40"
              >
                <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-2 text-xs font-semibold text-[var(--color-ink)] [&::-webkit-details-marker]:hidden">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: ANATOMY_SYSTEM_COLORS[system] }}
                    aria-hidden
                  />
                  <span>{ANATOMY_SYSTEM_LABELS[system]}</span>
                  <span className="ml-auto text-[10px] font-medium text-[var(--color-ink-muted)]">
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
    <ul className="space-y-1 px-2 pb-2">
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
                "flex w-full flex-col items-start gap-0.5 rounded-xl px-3 py-2 text-left text-sm transition",
                selected
                  ? "bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                  : hovered
                    ? "bg-violet-50 text-violet-900"
                    : "text-[var(--color-ink)] hover:bg-white"
              )}
            >
              <span className="flex w-full items-start gap-2">
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: ANATOMY_SYSTEM_COLORS[s.system] }}
                  aria-hidden
                />
                <span className="font-medium">{s.name}</span>
                {s.highYield ? (
                  <span className="ml-auto shrink-0 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800">
                    HY
                  </span>
                ) : null}
              </span>
              <span className="pl-3.5 text-[10px] text-[var(--color-ink-muted)]">
                {ANATOMY_SYSTEM_LABELS[s.system]}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
