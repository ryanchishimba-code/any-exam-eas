"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  Layers,
  Pill,
  RotateCcw,
  ShieldCheck,
  X,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import {
  anatomyHref,
  practiceTopicHref,
  deepDiveTopicHref,
  top500Href,
} from "@/lib/edtech/practice-links";
import { getAnatomyStructuresForMemoryCard } from "@/lib/anatomy";
import { hasClinicalStudyTools } from "@/lib/edtech/exam-content-scope";
import { getCardMastery, setCardMastery } from "@/lib/reference/card-mastery";
import { relatedDrugsForMemoryCard } from "@/lib/reference/hub-search";
import { getRelatedMemoryCards } from "@/lib/reference/related-cards";
import {
  MEMORY_CARD_KIND_LABELS,
  type MemoryCard,
} from "@/lib/reference/types";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

type Props = {
  card: MemoryCard | null;
  allCards: MemoryCard[];
  examSlug: ExamSlug;
  open: boolean;
  onClose: () => void;
  onOpenRelated?: (card: MemoryCard) => void;
};

export function MemoryCardSheet({
  card,
  allCards,
  examSlug,
  open,
  onClose,
  onOpenRelated,
}: Props) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [mastery, setMastery] = useState<ReturnType<typeof getCardMastery>>(null);

  const linkedStructures = useMemo(
    () =>
      card && hasClinicalStudyTools(examSlug) ? getAnatomyStructuresForMemoryCard(card.id) : [],
    [card, examSlug]
  );
  const relatedDrugs = useMemo(
    () => (card ? relatedDrugsForMemoryCard(card, 4, examSlug) : []),
    [card, examSlug]
  );
  const relatedCards = useMemo(
    () => (card ? getRelatedMemoryCards(card, allCards, 3) : []),
    [card, allCards]
  );

  useEffect(() => {
    if (!open || !card) return;
    setShowAnswer(false);
    setMastery(getCardMastery(card.id, examSlug));
  }, [open, card, examSlug]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === " " && e.target === document.body) {
        e.preventDefault();
        setShowAnswer((v) => !v);
      }
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

  const reviewedLabel = card.lastReviewedAt
    ? new Date(card.lastReviewedAt).toLocaleDateString(undefined, {
        month: "short",
        year: "numeric",
      })
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
              {mastery === "got-it" ? (
                <Badge className="bg-emerald-50 text-emerald-700">Got it</Badge>
              ) : null}
              {mastery === "need-review" ? (
                <Badge className="bg-amber-50 text-amber-800">Need review</Badge>
              ) : null}
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
          {card.sourceLabel ? (
            <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-800">
              <div className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
                <div className="min-w-0">
                  <p className="font-semibold">Verified source</p>
                  {card.sourceUrl ? (
                    <Link
                      href={card.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-0.5 inline-flex items-center gap-1 text-[var(--color-accent)] hover:underline"
                    >
                      {card.sourceLabel}
                      <ExternalLink className="h-3 w-3" aria-hidden />
                    </Link>
                  ) : (
                    <p className="mt-0.5">{card.sourceLabel}</p>
                  )}
                  {reviewedLabel ? (
                    <p className="mt-1 text-slate-500">Reviewed {reviewedLabel}</p>
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}

          <div
            className={cn(
              "rounded-2xl border px-4 py-4 transition",
              showAnswer
                ? "border-[var(--color-accent)]/20 bg-[var(--color-surface)]"
                : "border-dashed border-slate-300 bg-white"
            )}
          >
            <p className="text-sm font-medium leading-relaxed text-[var(--color-ink)]">{card.teaser}</p>

            {!showAnswer ? (
              <button
                type="button"
                onClick={() => setShowAnswer(true)}
                className="mt-4 w-full rounded-xl bg-[var(--color-accent)] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:opacity-90"
              >
                Reveal answer
              </button>
            ) : (
              <div className="mt-4 space-y-4">
                {card.body ? (
                  <p className="rounded-xl bg-white px-3 py-3 text-sm font-medium leading-relaxed text-[var(--color-ink)] ring-1 ring-black/[0.06]">
                    {card.body}
                  </p>
                ) : null}

                {card.bullets?.length ? (
                  <ul className="space-y-2">
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
                  <div className="overflow-x-auto rounded-xl border border-black/[0.06]">
                    <table className="w-full min-w-[280px] text-left text-sm">
                      <thead className="bg-white">
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

                <button
                  type="button"
                  onClick={() => setShowAnswer(false)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden />
                  Hide answer
                </button>
              </div>
            )}
          </div>

          {card.tags.length ? (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {card.tags.map((tag) => (
                <Badge key={tag} className="border-border text-[10px]">
                  {tag}
                </Badge>
              ))}
            </div>
          ) : null}

          {relatedCards.length > 0 ? (
            <div className="mt-5">
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-ink-muted)]">
                Related cards
              </p>
              <ul className="mt-2 space-y-2">
                {relatedCards.map((related) => (
                  <li key={related.id}>
                    <button
                      type="button"
                      onClick={() => onOpenRelated?.(related)}
                      className="w-full rounded-xl border border-black/[0.06] bg-[var(--color-surface)] px-3 py-2.5 text-left text-sm font-semibold text-[var(--color-ink)] transition hover:border-[var(--color-accent)]/30"
                    >
                      {related.title}
                      <span className="mt-0.5 block text-xs font-normal text-[var(--color-ink-muted)]">
                        {related.subject} · {related.topic}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="space-y-3 border-t border-black/[0.06] bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setCardMastery(card.id, examSlug, "got-it");
                setMastery("got-it");
              }}
              className={cn(
                "inline-flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-xs font-bold transition",
                mastery === "got-it"
                  ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-emerald-50"
              )}
            >
              <CheckCircle2 className="h-4 w-4" aria-hidden />
              Got it
            </button>
            <button
              type="button"
              onClick={() => {
                setCardMastery(card.id, examSlug, "need-review");
                setMastery("need-review");
              }}
              className={cn(
                "inline-flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-xs font-bold transition",
                mastery === "need-review"
                  ? "border-amber-300 bg-amber-50 text-amber-900"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-amber-50"
              )}
            >
              Need review
            </button>
          </div>

          <div className="rounded-2xl bg-[var(--color-surface)] px-3 py-2.5">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
              Study path
            </p>
            <ol className="mt-2 flex flex-wrap items-center gap-1 text-[11px] font-semibold text-[var(--color-ink-muted)]">
              <li className="rounded-full bg-white px-2 py-0.5 text-[var(--color-accent)] ring-1 ring-[var(--color-accent)]/20">
                Card
              </li>
              {linkedStructures.length > 0 ? (
                <>
                  <ChevronRight className="h-3 w-3 shrink-0" aria-hidden />
                  <li>Anatomy</li>
                </>
              ) : null}
              {relatedDrugs.length > 0 ? (
                <>
                  <ChevronRight className="h-3 w-3 shrink-0" aria-hidden />
                  <li>Drugs</li>
                </>
              ) : null}
              <ChevronRight className="h-3 w-3 shrink-0" aria-hidden />
              <li>Practice</li>
              {deepDiveHref ? (
                <>
                  <ChevronRight className="h-3 w-3 shrink-0" aria-hidden />
                  <li>Deep dive</li>
                </>
              ) : null}
            </ol>
          </div>

          {relatedDrugs.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {relatedDrugs.map((drug) => (
                <Button
                  key={drug.id}
                  href={`${top500Href(examSlug)}&drug=${encodeURIComponent(drug.id)}`}
                  variant="secondary"
                  className="h-10 rounded-xl px-3 text-sm"
                >
                  <Pill className="mr-2 h-4 w-4" aria-hidden />
                  {drug.generic}
                </Button>
              ))}
            </div>
          ) : null}
          {linkedStructures.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {linkedStructures.map((structure) => (
                <Button
                  key={structure.id}
                  href={anatomyHref(examSlug, structure.id)}
                  variant="secondary"
                  className="h-10 rounded-xl px-3 text-sm"
                >
                  <Layers className="mr-2 h-4 w-4" aria-hidden />
                  {structure.name}
                </Button>
              ))}
            </div>
          ) : null}
          <Button href={practiceHref} className="h-11 w-full rounded-xl">
            <BookOpen className="mr-2 h-4 w-4" aria-hidden />
            Practice Questions
          </Button>
          {deepDiveHref ? (
            <Button href={deepDiveHref} variant="secondary" className="h-11 w-full rounded-xl">
              <GraduationCap className="mr-2 h-4 w-4" aria-hidden />
              Deep Dive — Review Module
            </Button>
          ) : null}
        </div>
      </div>
    </div>,
    document.body
  );
}
