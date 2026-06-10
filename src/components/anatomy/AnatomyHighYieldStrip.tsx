"use client";

import { Sparkles, Zap } from "lucide-react";
import { getFeaturedStructuresForExam } from "@/lib/anatomy/recommendations";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

type Props = {
  examSlug: ExamSlug;
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function AnatomyHighYieldStrip({ examSlug, selectedId, onSelect }: Props) {
  const featured = getFeaturedStructuresForExam(examSlug);

  return (
    <section aria-label="Featured structures" className="space-y-2">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-amber-500" aria-hidden />
        <h3 className="text-sm font-bold text-[var(--color-ink)]">
          Start here for {examSlug.toUpperCase()}
        </h3>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {featured.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onSelect(s.id)}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition",
              selectedId === s.id
                ? "border-violet-400 bg-violet-600 text-white shadow-sm"
                : "border-black/[0.08] bg-white text-[var(--color-ink)] hover:border-violet-200 hover:bg-violet-50"
            )}
          >
            {s.highYield ? <Zap className="h-3 w-3 text-amber-500" aria-hidden /> : null}
            {s.name}
          </button>
        ))}
      </div>
    </section>
  );
}
