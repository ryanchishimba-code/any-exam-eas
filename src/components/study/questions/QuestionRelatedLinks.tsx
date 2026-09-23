"use client";

import Link from "next/link";
import { BookMarked, Bone, BookOpen, GraduationCap, Pill } from "lucide-react";
import { libraryCardHref } from "@/lib/edtech/practice-links";
import { RelatedAnatomyLinks } from "@/components/anatomy/RelatedAnatomyLinks";
import { hasClinicalStudyTools } from "@/lib/edtech/exam-content-scope";
import { matchCatalogDrug } from "@/lib/learning/remediation-loop";
import { drugs300DrugHref } from "@/lib/edtech/practice-links-core";
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

const chipClass =
  "inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-border)]/80 bg-[var(--color-surface-elevated)] px-3 py-1.5 text-xs font-semibold text-[var(--color-ink)] transition hover:border-[var(--study-accent)]/40 hover:text-[var(--study-accent)]";

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
  const listedDrugs = clinical
    ? (top500Drugs ?? []).map((label) => {
        const hit = matchCatalogDrug(label);
        return hit
          ? { key: hit.id, label: hit.label, href: drugs300DrugHref(hit.id) }
          : { key: label, label, href: null as string | null };
      })
    : [];
  const drugLinks =
    clinical && links.relatedDrug && !listedDrugs.some((drug) => drug.key === links.relatedDrug?.id)
      ? [
          {
            key: links.relatedDrug.id,
            label: links.relatedDrug.label,
            href: links.relatedDrug.href,
          },
          ...listedDrugs,
        ]
      : listedDrugs;
  const uniqueDrugLinks = drugLinks.filter(
    (drug, index, all) => all.findIndex((row) => row.key === drug.key) === index
  );

  const hasDeepDives = links.relatedDeepDives.length > 0;
  const hasCards = links.memoryCardIds.length > 0;
  const hasAnatomy = clinical && links.anatomyStructures.length > 0;
  const hasGuide = Boolean(links.studyGuide);
  const hasDrugs = uniqueDrugLinks.length > 0;
  const hasTakeaway = Boolean(links.keyTakeaway);

  const showAnatomy = sections === "all" || sections === "anatomy";
  const showNonAnatomy = sections === "all" || sections === "non-anatomy";

  if (
    showAnatomy &&
    showNonAnatomy &&
    !hasDeepDives &&
    !hasCards &&
    !hasAnatomy &&
    !hasGuide &&
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
    !hasGuide &&
    !hasDrugs &&
    !hasTakeaway
  ) {
    return null;
  }

  return (
    <div className="rounded-xl border border-[var(--color-border)]/80 bg-[var(--color-surface)]/60 p-4">
      {showNonAnatomy ? (
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--study-accent)]">
          Related study content
        </p>
      ) : null}

      {showNonAnatomy && links.keyTakeaway ? (
        <p className="mt-2 text-sm font-medium leading-relaxed text-[var(--color-ink)]">
          <span className="text-[var(--study-accent)]">High-yield takeaway: </span>
          {links.keyTakeaway}
        </p>
      ) : null}

      {showNonAnatomy && hasGuide && links.studyGuide ? (
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href={links.studyGuide.href} className={chipClass}>
            <BookOpen className="h-3.5 w-3.5 text-[var(--study-accent)]" aria-hidden />
            Guide · {links.studyGuide.title}
          </Link>
        </div>
      ) : null}

      {showNonAnatomy && hasDeepDives ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {links.relatedDeepDives.map((mod) => (
            <Link key={mod.slug} href={mod.href} className={chipClass}>
              <GraduationCap className="h-3.5 w-3.5 text-[var(--study-accent)]" aria-hidden />
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
              className={chipClass}
            >
              <BookMarked className="h-3.5 w-3.5 text-[var(--study-accent)]" aria-hidden />
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

      {showNonAnatomy && hasDrugs ? (
        <div className="mt-3">
          <p className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-[var(--color-ink-muted)]">
            <Pill className="h-3 w-3" aria-hidden />
            Related drugs
          </p>
          <ul className="mt-1.5 flex flex-wrap gap-1.5">
            {uniqueDrugLinks.map((drug) => (
              <li key={drug.key}>
                {drug.href ? (
                  <Link href={drug.href} className={chipClass}>
                    {drug.label}
                  </Link>
                ) : (
                  <span className="rounded-md bg-[var(--color-surface-elevated)] px-2 py-1 text-xs text-[var(--color-ink)] ring-1 ring-[var(--color-border)]">
                    {drug.label}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
