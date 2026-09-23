"use client";

import Link from "next/link";
import { BookMarked, BookOpen, Bone, GraduationCap, Pill, RotateCcw } from "lucide-react";
import { anatomyHref, topicRetestHref } from "@/lib/edtech/practice-links";
import { REMEDIATION_MASTERY_RULE, reviewIncorrectHref } from "@/lib/learning/remediation-loop";
import { MarkItemMastered } from "./MarkItemMastered";
import type { ResolvedQuestionStudyLinks } from "@/lib/library/question-study-links";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

type Props = {
  links: ResolvedQuestionStudyLinks;
  examSlug: ExamSlug;
  /** Bank field for a subject-scoped Review incorrect retest. */
  fieldId?: string;
  subjectId?: string | null;
  /** Show when the student missed the question. */
  missed?: boolean;
  /** Show when the student flagged for review. */
  flagged?: boolean;
  /** Bank item that can be marked mastered. */
  bankItemId?: string | null;
  /** This session is the Review incorrect queue, including pending re-proof. */
  reviewQueue?: boolean;
  className?: string;
};

const ghostLink =
  "inline-flex max-w-full items-center gap-2 rounded-xl border border-[var(--color-border)]/80 bg-[var(--color-surface-elevated)] px-3 py-2 text-sm font-semibold text-[var(--color-ink)] transition hover:border-[var(--study-accent)]/40 hover:text-[var(--study-accent)]";

const primaryLink =
  "inline-flex max-w-full items-center gap-2 rounded-xl bg-[var(--study-accent)] px-3 py-2 text-sm font-semibold text-[var(--study-accent-on,#fff)] shadow-[0_1px_2px_rgba(15,23,42,0.08)] transition hover:bg-[var(--study-accent-hover)]";

/** One-click remediation from a miss: guide, drug, cards, then retest. */
export function StudyThisTopicButton({
  links,
  examSlug,
  fieldId,
  subjectId,
  missed,
  flagged,
  bankItemId,
  reviewQueue = false,
  className,
}: Props) {
  const deepDive = links.primaryDeepDive;
  const guide = links.studyGuide;
  const drug = links.relatedDrug;
  const cards = links.relatedCards;
  const primaryStructure = links.anatomyStructures[0];
  const showContent = Boolean(missed || flagged);
  const topicKey = links.topicLinks.topicKey;
  const retestHref = missed
    ? fieldId
      ? reviewIncorrectHref(fieldId, subjectId, 10)
      : topicKey
        ? topicRetestHref(examSlug, topicKey, 5)
        : null
    : null;

  const showDeepDive = Boolean(deepDive && showContent);
  const showGuide = Boolean(guide && showContent);
  const showDrug = Boolean(drug && missed);
  const showCards = Boolean(cards && showContent);
  const showAnatomy = Boolean(missed && primaryStructure);
  const masteryItemId = bankItemId?.trim() || "";
  const showMastery = Boolean(
    fieldId && masteryItemId && !/^\d+$/.test(masteryItemId) && (missed || reviewQueue)
  );

  if (
    !showDeepDive &&
    !showGuide &&
    !showDrug &&
    !showCards &&
    !showAnatomy &&
    !retestHref &&
    !showMastery &&
    !(reviewQueue && !missed)
  ) {
    return null;
  }

  return (
    <div
      className={cn(
        "space-y-3 rounded-2xl border border-[var(--color-border)]/80 bg-[var(--color-surface)]/70 p-3 sm:p-4",
        className
      )}
    >
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--study-accent)]">
          Remediation
        </p>
        {missed ? (
          <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-ink-muted)]">
            {REMEDIATION_MASTERY_RULE}
          </p>
        ) : reviewQueue ? (
          <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-ink-muted)]">
            Pending re-proof. One correct answer does not clear this item.
          </p>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {retestHref ? (
          <Link href={retestHref} className={primaryLink}>
            <RotateCcw className="h-4 w-4 shrink-0" aria-hidden />
            <span className="min-w-0 truncate">
              {fieldId ? "Retest incorrect" : "Retest 5"}
            </span>
          </Link>
        ) : null}

        {showGuide && guide ? (
          <Link href={guide.href} className={ghostLink}>
            <BookOpen className="h-4 w-4 shrink-0 text-[var(--study-accent)]" aria-hidden />
            <span className="min-w-0 truncate">Guide · {guide.title}</span>
          </Link>
        ) : null}

        {showDrug && drug ? (
          <Link href={drug.href} className={ghostLink}>
            <Pill className="h-4 w-4 shrink-0 text-[var(--study-accent)]" aria-hidden />
            <span className="min-w-0 truncate">
              {drug.kind === "class" ? "Drug class" : "Drug"} · {drug.label}
            </span>
          </Link>
        ) : null}

        {showDrug && drug?.safetyPathHref ? (
          <Link href={drug.safetyPathHref} className={ghostLink}>
            <Pill className="h-4 w-4 shrink-0 text-[var(--study-accent)]" aria-hidden />
            <span className="min-w-0 truncate">Safety path</span>
          </Link>
        ) : null}

        {showCards && cards ? (
          <Link href={cards.href} className={ghostLink}>
            <BookMarked className="h-4 w-4 shrink-0 text-[var(--study-accent)]" aria-hidden />
            <span className="min-w-0 truncate">{cards.title}</span>
          </Link>
        ) : null}

        {showDeepDive && deepDive ? (
          <Link href={deepDive.href} className={ghostLink}>
            <GraduationCap className="h-4 w-4 shrink-0 text-[var(--study-accent)]" aria-hidden />
            <span className="min-w-0 truncate">Deep dive · {deepDive.title}</span>
          </Link>
        ) : null}

        {showAnatomy && primaryStructure ? (
          <Link href={anatomyHref(examSlug, primaryStructure.id)} className={ghostLink}>
            <Bone className="h-4 w-4 shrink-0 text-[var(--study-accent)]" aria-hidden />
            <span className="min-w-0 truncate">{primaryStructure.name} in 3D</span>
          </Link>
        ) : null}
      </div>
      {showMastery && fieldId ? <MarkItemMastered field={fieldId} itemId={masteryItemId} /> : null}
    </div>
  );
}
