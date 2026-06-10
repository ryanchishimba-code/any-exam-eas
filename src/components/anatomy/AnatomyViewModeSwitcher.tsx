"use client";

import { Box, Columns2, Film } from "lucide-react";
import {
  ANATOMY_VIEW_MODES,
  type AnatomyViewMode,
} from "@/lib/anatomy/view-mode";
import { cn } from "@/lib/utils";

const ICONS = {
  reference: Film,
  interactive: Box,
  split: Columns2,
} as const;

type Props = {
  value: AnatomyViewMode;
  onChange: (mode: AnatomyViewMode) => void;
  className?: string;
};

export function AnatomyViewModeSwitcher({ value, onChange, className }: Props) {
  const active = ANATOMY_VIEW_MODES.find((m) => m.id === value);

  return (
    <div className={cn("space-y-2", className)}>
      <div
        className="inline-flex w-full max-w-xl rounded-2xl border border-black/[0.06] bg-white p-1 shadow-[var(--shadow-apple-sm)] sm:w-auto"
        role="tablist"
        aria-label="Anatomy view mode"
      >
        {ANATOMY_VIEW_MODES.map((mode) => {
          const Icon = ICONS[mode.id];
          const isActive = value === mode.id;
          return (
            <button
              key={mode.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(mode.id)}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition sm:flex-initial sm:px-4",
                isActive
                  ? "bg-violet-600 text-white shadow-sm"
                  : "text-[var(--color-ink-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-ink)]"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden />
              <span className="hidden sm:inline">{mode.label}</span>
              <span className="sm:hidden">{mode.shortLabel}</span>
            </button>
          );
        })}
      </div>
      {active ? (
        <p className="text-sm text-[var(--color-ink-muted)]">{active.description}</p>
      ) : null}
    </div>
  );
}
