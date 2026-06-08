"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { BookOpen, GraduationCap, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import {
  practiceTopicHref,
  deepDiveTopicHref,
} from "@/lib/edtech/practice-links";
import {
  MEMORY_CARD_KIND_LABELS,
  type MemoryCard,
} from "@/lib/reference/types";
import type { ExamSlug } from "@/types/edtech";

type Props = {
  card: MemoryCard | null;
  examSlug: ExamSlug;
  open: boolean;
  onClose: () => void;
};

export function MemoryCardSheet({ card, examSlug, open, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open || !card) return null;

  const practiceHref = practiceTopicHref(examSlug, card.practiceTopicSlug, 10);
  const deepDiveHref = card.reviewModuleSlug
    ? deepDiveTopicHref(examSlug, card.reviewModuleSlug)
    : null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        aria-label="Close memory card"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="memory-card-title"
        className="relative z-10 flex max-h-[min(92vh,720px)] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-black/[0.08] bg-white shadow-2xl sm:rounded-3xl"
      >
        <div className="flex items-start justify-between gap-3 border-b border-black/[0.06] px-5 py-4">
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                {MEMORY_CARD_KIND_LABELS[card.kind]}
              </Badge>
              <Badge className="bg-slate-100 text-slate-600">{card.subject}</Badge>
            </div>
            <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
              {card.topic}
            </p>
            <h2 id="memory-card-title" className="mt-1 text-xl font-bold text-[var(--color-ink)]">
              {card.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-[var(--color-ink-muted)] transition hover:bg-[var(--color-surface)]"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <p className="text-sm leading-relaxed text-[var(--color-ink-muted)]">{card.teaser}</p>

          {card.body ? (
            <p className="mt-4 rounded-2xl bg-[var(--color-surface)] px-4 py-3 text-sm font-medium leading-relaxed text-[var(--color-ink)]">
              {card.body}
            </p>
          ) : null}

          {card.bullets?.length ? (
            <ul className="mt-4 space-y-2">
              {card.bullets.map((item) => (
                <li
                  key={item}
                  className="flex gap-2 text-sm leading-relaxed text-[var(--color-ink)]"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                  {item}
                </li>
              ))}
            </ul>
          ) : null}

          {card.table ? (
            <div className="mt-4 overflow-x-auto rounded-2xl border border-black/[0.06]">
              <table className="w-full min-w-[280px] text-left text-sm">
                <thead className="bg-[var(--color-surface)]">
                  <tr>
                    {card.table.headers.map((h) => (
                      <th
                        key={h}
                        className="px-3 py-2 text-xs font-bold uppercase tracking-wide text-[var(--color-ink-muted)]"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {card.table.rows.map((row, i) => (
                    <tr key={i} className="border-t border-black/[0.04]">
                      {row.map((cell, j) => (
                        <td key={j} className="px-3 py-2.5 text-[var(--color-ink)]">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          {card.tags.length ? (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {card.tags.map((tag) => (
                <Badge key={tag} className="border-border text-[10px]">
                  {tag}
                </Badge>
              ))}
            </div>
          ) : null}
        </div>

        <div className="space-y-2 border-t border-black/[0.06] bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <Button href={practiceHref} className="h-11 w-full rounded-xl">
            <BookOpen className="mr-2 h-4 w-4" aria-hidden />
            Practice Questions
          </Button>
          {deepDiveHref ? (
            <Button href={deepDiveHref} variant="secondary" className="h-11 w-full rounded-xl">
              <GraduationCap className="mr-2 h-4 w-4" aria-hidden />
              Deep Dive — Review Module
            </Button>
          ) : (
            <p className="text-center text-xs text-[var(--color-ink-muted)]">
              Review Module coming soon for this topic.
            </p>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
