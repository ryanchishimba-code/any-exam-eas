"use client";

import Link from "next/link";
import { BookOpen, Sparkles, X } from "lucide-react";
import { RelatedAnatomyLinks } from "@/components/anatomy/RelatedAnatomyLinks";
import { practiceTopicHref, referenceHref } from "@/lib/edtech/practice-links";
import { getAnatomyStructuresForTopicSlug } from "@/lib/anatomy/topic-links";
import type { ExamSlug } from "@/types/edtech";

type Props = {
  examSlug: ExamSlug;
  topicKey: string;
  cardCount: number;
  memoryCardIds?: string[];
};

export function ReferenceTopicBanner({ examSlug, topicKey, cardCount, memoryCardIds = [] }: Props) {
  const label = topicKey.replace(/-/g, " ");
  const anatomyStructures = getAnatomyStructuresForTopicSlug(topicKey, { memoryCardIds });

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[16px] border border-black/[0.06] bg-black/[0.02] px-4 py-3">
        <div className="flex items-start gap-2">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-accent)]" aria-hidden />
          <div>
            <p className="text-[14px] font-semibold capitalize text-[var(--color-ink)]">{label}</p>
            <p className="text-[12px] text-[var(--color-ink-muted)]">
              {cardCount} memory card{cardCount === 1 ? "" : "s"} for this topic
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={practiceTopicHref(examSlug, topicKey, 10)}
            className="inline-flex items-center gap-1 rounded-full bg-[var(--color-accent)] px-3.5 py-2 text-[12px] font-semibold text-white shadow-[var(--shadow-apple-btn)] hover:opacity-95"
          >
            <BookOpen className="h-3.5 w-3.5" aria-hidden />
            Practice 10
          </Link>
          <Link
            href={referenceHref(examSlug)}
            className="inline-flex items-center gap-1 rounded-full border border-black/[0.08] bg-white px-3.5 py-2 text-[12px] font-semibold text-[var(--color-ink)] hover:bg-black/[0.02]"
          >
            <X className="h-3.5 w-3.5" aria-hidden />
            All cards
          </Link>
        </div>
      </div>
      {anatomyStructures.length > 0 ? (
        <div className="rounded-[16px] border border-sky-200/70 bg-sky-50/40 px-4 py-3">
          <p className="text-[12px] font-semibold text-sky-900">Related anatomy</p>
          <RelatedAnatomyLinks
            examSlug={examSlug}
            structures={anatomyStructures}
            className="mt-2"
          />
        </div>
      ) : null}
    </div>
  );
}
