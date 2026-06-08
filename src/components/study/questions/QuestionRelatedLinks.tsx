"use client";

import Link from "next/link";
import { BookMarked, GraduationCap, Pill } from "lucide-react";
import { highYieldTopicHref, referenceCardHref } from "@/lib/edtech/practice-links";
import type { StudyQuestion } from "@/lib/questions/types";
import type { ExamSlug } from "@/types/edtech";

type RelatedMeta = {
  reviewModuleSlug?: string;
  memoryCardIds?: string[];
  top500Drugs?: string[];
  keyTakeaway?: string;
};

function readRelatedMeta(question: StudyQuestion): RelatedMeta | null {
  const payload = question.ngnPayload;
  if (!payload) return null;
  const reviewModuleSlug =
    typeof payload.reviewModuleSlug === "string" ? payload.reviewModuleSlug : undefined;
  const memoryCardIds = Array.isArray(payload.memoryCardIds)
    ? payload.memoryCardIds.map(String)
    : undefined;
  const top500Drugs = Array.isArray(payload.top500Drugs)
    ? payload.top500Drugs.map(String)
    : undefined;
  const keyTakeaway =
    typeof payload.keyTakeaway === "string" ? payload.keyTakeaway : undefined;
  if (!reviewModuleSlug && !memoryCardIds?.length && !top500Drugs?.length && !keyTakeaway) {
    return null;
  }
  return { reviewModuleSlug, memoryCardIds, top500Drugs, keyTakeaway };
}

export function QuestionRelatedLinks({
  question,
  examSlug = "nclex",
}: {
  question: StudyQuestion;
  examSlug?: ExamSlug;
}) {
  const meta = readRelatedMeta(question);
  if (!meta) return null;

  return (
    <div className="rounded-xl border border-violet-200/60 bg-violet-50/40 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">
        Study this topic further
      </p>

      {meta.keyTakeaway ? (
        <p className="mt-2 text-sm font-medium leading-relaxed text-[var(--color-ink)]">
          <span className="text-violet-700">High-yield takeaway: </span>
          {meta.keyTakeaway}
        </p>
      ) : null}

      <div className="mt-3 flex flex-wrap gap-2">
        {meta.reviewModuleSlug ? (
          <Link
            href={highYieldTopicHref(examSlug, meta.reviewModuleSlug)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-violet-800 ring-1 ring-violet-200 transition hover:bg-violet-100"
          >
            <GraduationCap className="h-3.5 w-3.5" aria-hidden />
            Deep Dive — Sepsis &amp; Shock module
          </Link>
        ) : null}
        {meta.memoryCardIds?.[0] ? (
          <Link
            href={referenceCardHref(examSlug, meta.memoryCardIds[0])}
            className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-teal-800 ring-1 ring-teal-200 transition hover:bg-teal-50"
          >
            <BookMarked className="h-3.5 w-3.5" aria-hidden />
            Memory Card
          </Link>
        ) : null}
      </div>

      {meta.top500Drugs?.length ? (
        <div className="mt-3">
          <p className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-[var(--color-ink-muted)]">
            <Pill className="h-3 w-3" aria-hidden />
            Related Top 500 drugs
          </p>
          <ul className="mt-1.5 flex flex-wrap gap-1.5">
            {meta.top500Drugs.map((drug) => (
              <li
                key={drug}
                className="rounded-md bg-white px-2 py-1 text-xs text-[var(--color-ink)] ring-1 ring-black/[0.06]"
              >
                {drug}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
