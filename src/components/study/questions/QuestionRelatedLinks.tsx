"use client";

import Link from "next/link";
import { BookMarked, Bone, GraduationCap, Pill } from "lucide-react";
import { libraryCardHref } from "@/lib/edtech/practice-links";
import { RelatedAnatomyLinks } from "@/components/anatomy/RelatedAnatomyLinks";
import { hasClinicalStudyTools } from "@/lib/edtech/exam-content-scope";
import {
  resolveStudyLinksFromQuestion,
  type ResolvedQuestionStudyLinks,
} from "@/lib/library/question-study-links";
import type { StudyQuestion } from "@/lib/questions/types";
import type { ExamSlug } from "@/types/edtech";

function readTop500Drugs(question: StudyQuestion): string[] | undefined {
  const payload = question.ngnPayload;
  if (!payload || !Array.isArray(payload.top500Drugs)) return undefined;
  return payload.top500Drugs.map(String);
}

export function QuestionRelatedLinks({
  question,
  examSlug = "nclex",
  links: linksOverride,
  sections = "all",
}: {
  question: StudyQuestion;
  examSlug?: ExamSlug;
  /** Pre-resolved links (e.g. full-exam review with topicCategory only). */
  links?: ResolvedQuestionStudyLinks;
  /** Which link groups to render. */
  sections?: "all" | "anatomy" | "non-anatomy";
}) {
  const links = linksOverride ?? resolveStudyLinksFromQuestion(examSlug, question);
  const top500Drugs = readTop500Drugs(question);
  const clinical = hasClinicalStudyTools(examSlug);

  const hasDeepDives = links.relatedDeepDives.length > 0;
  const hasCards = links.memoryCardIds.length > 0;
  const hasAnatomy = clinical && links.anatomyStructures.length > 0;
  const hasDrugs = clinical && (top500Drugs?.length ?? 0) > 0;
  const hasTakeaway = Boolean(links.keyTakeaway);

  const showAnatomy = sections === "all" || sections === "anatomy";
  const showNonAnatomy = sections === "all" || sections === "non-anatomy";

  if (
    showAnatomy &&
    showNonAnatomy &&
    !hasDeepDives &&
    !hasCards &&
    !hasAnatomy &&
    !hasDrugs &&
    !hasTakeaway
  ) {
    return null;
  }
  if (sections === "anatomy" && !hasAnatomy) return null;
  if (
    sections === "non-anatomy" &&
    !hasDeepDives &&
    !hasCards &&
    !hasDrugs &&
    !hasTakeaway
  ) {
    return null;
  }

  return (
    <div className="rounded-xl border border-violet-200/60 bg-violet-50/40 p-4">
      {showNonAnatomy ? (
        <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">
          Related study content
        </p>
      ) : null}

      {showNonAnatomy && links.keyTakeaway ? (
        <p className="mt-2 text-sm font-medium leading-relaxed text-[var(--color-ink)]">
          <span className="text-violet-700">High-yield takeaway: </span>
          {links.keyTakeaway}
        </p>
      ) : null}

      {showNonAnatomy && hasDeepDives ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {links.relatedDeepDives.map((mod) => (
            <Link
              key={mod.slug}
              href={mod.href}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-violet-800 ring-1 ring-violet-200 transition hover:bg-violet-100"
            >
              <GraduationCap className="h-3.5 w-3.5" aria-hidden />
              {mod.title}
            </Link>
          ))}
        </div>
      ) : null}

      {showNonAnatomy && hasCards ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {links.memoryCardIds.map((cardId) => (
            <Link
              key={cardId}
              href={libraryCardHref(examSlug, cardId)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-teal-800 ring-1 ring-teal-200 transition hover:bg-teal-50"
            >
              <BookMarked className="h-3.5 w-3.5" aria-hidden />
              Memory card
            </Link>
          ))}
        </div>
      ) : null}

      {showAnatomy && hasAnatomy ? (
        <div className={showNonAnatomy && (hasTakeaway || hasDeepDives || hasCards) ? "mt-3" : ""}>
          <p className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-[var(--color-ink-muted)]">
            <Bone className="h-3 w-3" aria-hidden />
            Explore in Anatomy
          </p>
          <div className="mt-1.5">
            <RelatedAnatomyLinks examSlug={examSlug} structures={links.anatomyStructures} />
          </div>
        </div>
      ) : null}

      {showNonAnatomy && hasDrugs && top500Drugs ? (
        <div className="mt-3">
          <p className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-[var(--color-ink-muted)]">
            <Pill className="h-3 w-3" aria-hidden />
            Related Top 500 drugs
          </p>
          <ul className="mt-1.5 flex flex-wrap gap-1.5">
            {top500Drugs.map((drug) => (
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
