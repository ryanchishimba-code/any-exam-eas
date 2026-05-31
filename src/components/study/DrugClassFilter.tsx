"use client";

import type { DrugClassId, DrugClassProgress } from "@/lib/drugs300";

type Props = {
  classes: DrugClassProgress[];
  activeClass: DrugClassId;
  onSelect: (id: DrugClassId) => void;
};

export function DrugClassFilter({ classes, activeClass, onSelect }: Props) {
  return (
    <nav aria-label="Filter by drug class" className="space-y-1">
      {classes.map((cls) => {
        const active = activeClass === cls.id;
        return (
          <button
            key={cls.id}
            type="button"
            onClick={() => onSelect(cls.id)}
            className={`group w-full rounded-xl px-3 py-2.5 text-left transition ${
              active
                ? "bg-white shadow-sm ring-1 ring-teal-200"
                : "hover:bg-white/70"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className="a11y-class-dot"
                  style={{ backgroundColor: cls.color }}
                  aria-hidden
                />
                <span
                  className={`truncate text-sm font-medium ${
                    active ? "text-slate-900" : "text-slate-700"
                  }`}
                >
                  {cls.shortLabel}
                </span>
              </div>
              <span className="shrink-0 text-xs tabular-nums text-slate-500">
                {cls.mastered}/{cls.total}
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200/80">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${cls.progressPct}%`, backgroundColor: cls.color }}
              />
            </div>
            {cls.due > 0 && (
              <p className="mt-1 text-[0.6875rem] font-medium text-teal-700">
                {cls.due} due now
              </p>
            )}
          </button>
        );
      })}
    </nav>
  );
}

/** Horizontal pill strip for narrow viewports. */
export function DrugClassFilterPills({ classes, activeClass, onSelect }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {classes.map((cls) => {
        const active = activeClass === cls.id;
        return (
          <button
            key={cls.id}
            type="button"
            onClick={() => onSelect(cls.id)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              active
                ? "bg-teal-600 text-white shadow-md"
                : "bg-white text-slate-700 ring-1 ring-slate-200"
            }`}
          >
            <span
              className="a11y-class-dot"
              style={{ backgroundColor: active ? "white" : cls.color }}
              aria-hidden
            />
            {cls.shortLabel}
            <span className={active ? "text-teal-100" : "text-slate-400"}>
              {cls.progressPct}%
            </span>
          </button>
        );
      })}
    </div>
  );
}
