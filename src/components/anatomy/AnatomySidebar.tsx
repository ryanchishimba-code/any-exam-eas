"use client";

import { Search, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
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
  onSelectStructure: (id: string) => void;
  collapsed?: boolean;
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
  onSelectStructure,
  collapsed = false,
}: Props) {
  if (collapsed) return null;

  return (
    <aside className="flex h-full flex-col gap-4 overflow-hidden rounded-2xl border border-black/[0.06] bg-white p-4 shadow-[var(--shadow-apple-sm)]">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-violet-600">Explorer</p>
        <h2 className="mt-1 text-lg font-bold text-[var(--color-ink)]">Structures</h2>
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

      <section aria-label="System filters" className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
          Systems
        </p>
        <div className="flex flex-wrap gap-1.5">
          <FilterChip
            active={systemFilter === "all"}
            onClick={() => onSystemFilterChange("all")}
            label="All"
          />
          {SYSTEMS.map(([id, label]) => (
            <FilterChip
              key={id}
              active={systemFilter === id}
              onClick={() => onSystemFilterChange(id)}
              label={label}
            />
          ))}
        </div>
      </section>

      <section aria-label="Layer visibility" className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
          Layers
        </p>
        <div className="space-y-1.5">
          {LAYERS.map(([layer, label]) => (
            <label
              key={layer}
              className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 text-sm hover:bg-[var(--color-surface)]"
            >
              <span className="text-[var(--color-ink)]">{label}</span>
              <Switch
                checked={visibleLayers.has(layer)}
                onCheckedChange={() => onToggleLayer(layer)}
              />
            </label>
          ))}
        </div>
      </section>

      <section className="min-h-0 flex-1 space-y-2 overflow-y-auto">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
          {filteredStructures.length} structures
        </p>
        <ul className="space-y-1">
          {filteredStructures.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => onSelectStructure(s.id)}
                className={cn(
                  "flex w-full items-start gap-2 rounded-xl px-3 py-2 text-left text-sm transition",
                  selectedId === s.id
                    ? "bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                    : "text-[var(--color-ink)] hover:bg-[var(--color-surface)]"
                )}
              >
                <span className="font-medium">{s.name}</span>
                {s.highYield ? (
                  <span className="ml-auto shrink-0 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800">
                    HY
                  </span>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-2.5 py-1 text-xs font-medium transition",
        active
          ? "bg-[var(--color-accent)] text-white shadow-sm"
          : "bg-[var(--color-surface)] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
      )}
    >
      {label}
    </button>
  );
}
