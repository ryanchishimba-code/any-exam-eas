"use client";

import {
  ANATOMY_SYSTEM_LABELS,
  type AnatomySystem,
} from "@/lib/anatomy/types";
import type { AnatomyCatalogStats } from "@/lib/anatomy/catalog";
import { cn } from "@/lib/utils";

const SYSTEM_ACCENTS: Record<AnatomySystem, string> = {
  cardiovascular: "from-rose-500/10 to-red-500/5 border-rose-200/60",
  respiratory: "from-sky-500/10 to-blue-500/5 border-sky-200/60",
  nervous: "from-violet-500/10 to-purple-500/5 border-violet-200/60",
  digestive: "from-amber-500/10 to-orange-500/5 border-amber-200/60",
  urinary: "from-yellow-500/10 to-amber-500/5 border-yellow-200/60",
  skeletal: "from-slate-500/10 to-zinc-500/5 border-slate-200/60",
  muscular: "from-stone-500/10 to-neutral-500/5 border-stone-200/60",
  lymphatic: "from-emerald-500/10 to-teal-500/5 border-emerald-200/60",
  endocrine: "from-fuchsia-500/10 to-pink-500/5 border-fuchsia-200/60",
};

type Props = {
  stats: AnatomyCatalogStats;
  activeSystem: AnatomySystem | "all";
  onSelectSystem: (system: AnatomySystem | "all") => void;
};

export function AnatomySystemGrid({ stats, activeSystem, onSelectSystem }: Props) {
  const systems = Object.entries(ANATOMY_SYSTEM_LABELS) as [AnatomySystem, string][];

  return (
    <section aria-label="Browse by system" className="space-y-2">
      <h3 className="text-sm font-bold text-[var(--color-ink)]">Browse by organ system</h3>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        <button
          type="button"
          onClick={() => onSelectSystem("all")}
          className={cn(
            "rounded-xl border bg-gradient-to-br p-3 text-left transition hover:shadow-sm",
            activeSystem === "all"
              ? "border-violet-400 bg-violet-50 ring-2 ring-violet-200"
              : "border-black/[0.06] from-white to-slate-50/80"
          )}
        >
          <p className="text-xs font-semibold text-[var(--color-ink)]">All organ systems</p>
          <p className="mt-1 text-lg font-bold text-violet-700">{stats.structureCount}</p>
        </button>
        {systems.map(([id, label]) => {
          const count = stats.systemCounts[id];
          if (count === 0) return null;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelectSystem(id)}
              className={cn(
                "rounded-xl border bg-gradient-to-br p-3 text-left transition hover:shadow-sm",
                SYSTEM_ACCENTS[id],
                activeSystem === id && "ring-2 ring-violet-300"
              )}
            >
              <p className="text-xs font-semibold capitalize text-[var(--color-ink)]">{label}</p>
              <p className="mt-1 text-lg font-bold text-[var(--color-ink)]">{count}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
