"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Layers } from "lucide-react";
import { ModuleSection, getOrderedSections } from "@/components/edtech/ReviewModuleRenderer";
import { REVIEW_MODULE_SECTION_ORDER } from "@/lib/edtech/review-modules/types";
import type { ReviewModuleContent } from "@/lib/edtech/review-modules/types";
import type { MemoryCard } from "@/lib/reference/types";
import { MEMORY_CARD_KIND_LABELS } from "@/lib/reference/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Phase = "memory-cards" | "sections";

type Props = {
  content: ReviewModuleContent;
  memoryCards: MemoryCard[];
  practiceHref: string;
  onPracticeClick?: () => void;
};

export function DeepDiveReviewPlayer({
  content,
  memoryCards,
  practiceHref,
  onPracticeClick,
}: Props) {
  const sections = useMemo(() => getOrderedSections(content), [content]);
  const [phase, setPhase] = useState<Phase>(memoryCards.length > 0 ? "memory-cards" : "sections");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setPhase(memoryCards.length > 0 ? "memory-cards" : "sections");
    setIndex(0);
  }, [content, memoryCards.length]);

  const totalSteps =
    phase === "memory-cards" ? memoryCards.length : sections.length;
  const atEnd =
    phase === "memory-cards"
      ? index + 1 >= memoryCards.length
      : index + 1 >= sections.length;

  function goNext() {
    if (phase === "memory-cards") {
      if (index + 1 >= memoryCards.length) {
        setPhase("sections");
        setIndex(0);
        return;
      }
      setIndex((i) => i + 1);
      return;
    }
    if (index + 1 < sections.length) {
      setIndex((i) => i + 1);
    }
  }

  function goPrev() {
    if (phase === "sections" && index === 0 && memoryCards.length > 0) {
      setPhase("memory-cards");
      setIndex(memoryCards.length - 1);
      return;
    }
    setIndex((i) => Math.max(0, i - 1));
  }

  const sectionMeta =
    phase === "sections" ? REVIEW_MODULE_SECTION_ORDER[index] : null;

  return (
    <div className="flex min-h-[50vh] flex-col">
      <div className="mb-4 flex items-center justify-between gap-2 text-xs font-medium text-slate-500">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-2.5 py-1 text-violet-800">
          <Layers className="h-3.5 w-3.5" aria-hidden />
          Deep dive review
        </span>
        <span className="tabular-nums">
          {phase === "memory-cards" ? "Memory cards" : "Module"} · {index + 1}/{totalSteps}
        </span>
      </div>

      {phase === "memory-cards" && memoryCards[index] ? (
        <div className="flex-1">
          <p className="mb-3 text-sm text-slate-600">
            Quick memory card before the full module — lock in the high-yield fact first.
          </p>
          <div className="rounded-2xl border border-teal-200/60 bg-gradient-to-br from-teal-50/80 to-white p-5">
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-teal-100 text-teal-800">
                {MEMORY_CARD_KIND_LABELS[memoryCards[index].kind]}
              </Badge>
              <Badge className="bg-slate-100 text-slate-600">{memoryCards[index].subject}</Badge>
            </div>
            <p className="mt-3 text-lg font-semibold text-slate-900">{memoryCards[index].title}</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">{memoryCards[index].body}</p>
            {memoryCards[index].bullets?.length ? (
              <ul className="mt-3 space-y-1.5 text-sm text-slate-700">
                {memoryCards[index].bullets!.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className="text-teal-600">•</span>
                    {b}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      ) : null}

      {phase === "sections" && sections[index] ? (
        <div className="flex-1">
          <ModuleSection section={sections[index]} index={index} />
        </div>
      ) : null}

      <footer className="mt-6 space-y-3 border-t border-slate-100 pt-4">
        {phase === "sections" && sections.length > 1 ? (
          <div className="flex flex-wrap gap-1">
            {sections.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setIndex(i)}
                className={cn(
                  "h-2 w-2 rounded-full transition",
                  i === index ? "bg-teal-600 w-6" : "bg-slate-200 hover:bg-slate-300"
                )}
                aria-label={`Section ${i + 1}: ${s.title}`}
              />
            ))}
          </div>
        ) : null}

        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            disabled={phase === "memory-cards" && index === 0}
            onClick={goPrev}
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </button>

          {atEnd && phase === "sections" ? (
            <Link
              href={practiceHref}
              onClick={onPracticeClick}
              className="inline-flex items-center gap-1 rounded-xl bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
            >
              Practice questions
            </Link>
          ) : (
            <button
              type="button"
              onClick={goNext}
              className="inline-flex items-center gap-1 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              {phase === "memory-cards" && index + 1 >= memoryCards.length
                ? "Start module"
                : "Next"}
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>

        {sectionMeta ? (
          <p className="text-center text-[10px] uppercase tracking-wide text-slate-400">
            Section {index + 1} of {sections.length}
          </p>
        ) : null}
      </footer>
    </div>
  );
}
