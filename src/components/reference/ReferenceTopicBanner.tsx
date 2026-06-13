"use client";

import Link from "next/link";
import { BookOpen, Sparkles, X } from "lucide-react";
import { practiceTopicHref, referenceHref } from "@/lib/edtech/practice-links";
import type { ExamSlug } from "@/types/edtech";

type Props = {
  examSlug: ExamSlug;
  topicKey: string;
  cardCount: number;
};

export function ReferenceTopicBanner({ examSlug, topicKey, cardCount }: Props) {
  const label = topicKey.replace(/-/g, " ");

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-violet-200/80 bg-violet-50/70 px-4 py-3">
      <div className="flex items-start gap-2">
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" aria-hidden />
        <div>
          <p className="text-sm font-bold capitalize text-violet-950">{label}</p>
          <p className="text-xs text-violet-800/80">
            {cardCount} memory card{cardCount === 1 ? "" : "s"} for this topic
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href={practiceTopicHref(examSlug, topicKey, 10)}
          className="inline-flex items-center gap-1 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-violet-700"
        >
          <BookOpen className="h-3.5 w-3.5" aria-hidden />
          Practice 10
        </Link>
        <Link
          href={referenceHref(examSlug)}
          className="inline-flex items-center gap-1 rounded-lg border border-violet-300 bg-white px-3 py-1.5 text-xs font-bold text-violet-900 hover:bg-violet-100"
        >
          <X className="h-3.5 w-3.5" aria-hidden />
          All cards
        </Link>
      </div>
    </div>
  );
}
