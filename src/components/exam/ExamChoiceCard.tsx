"use client";

import { cn } from "@/lib/utils";

export function ExamChoiceCard({
  label,
  letter,
  selected,
  eliminated,
  onSelect,
  onEliminate,
  disabled,
}: {
  label: string;
  letter: string;
  selected: boolean;
  eliminated: boolean;
  onSelect: () => void;
  onEliminate: () => void;
  disabled?: boolean;
}) {
  return (
    <div
      className={cn(
        "group relative flex items-start gap-3 rounded-2xl border p-4 transition-all",
        eliminated && "opacity-45",
        selected
          ? "border-teal-400 bg-teal-50/80 shadow-sm shadow-teal-100"
          : "border-slate-200/90 bg-white hover:border-teal-300/60 hover:shadow-md hover:shadow-teal-50"
      )}
    >
      <button
        type="button"
        disabled={disabled || eliminated}
        onClick={onSelect}
        className={cn(
          "flex min-w-0 flex-1 items-start gap-3 text-left",
          eliminated && "line-through decoration-slate-400"
        )}
      >
        <span
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold",
            selected ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-600 group-hover:bg-teal-100 group-hover:text-teal-800"
          )}
        >
          {letter}
        </span>
        <span className="pt-0.5 text-[0.9375rem] leading-relaxed text-slate-800">{label}</span>
      </button>
      {!disabled ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEliminate();
          }}
          className="shrink-0 rounded-lg px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          aria-label={eliminated ? "Restore choice" : "Eliminate choice"}
        >
          {eliminated ? "Undo" : "Elim"}
        </button>
      ) : null}
    </div>
  );
}
