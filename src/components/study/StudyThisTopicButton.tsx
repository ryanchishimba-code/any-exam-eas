"use client";

import Link from "next/link";
import { Bone, GraduationCap, Flag } from "lucide-react";
import { anatomyHref } from "@/lib/edtech/practice-links";
import type { ResolvedQuestionStudyLinks } from "@/lib/library/question-study-links";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

type Props = {
  links: ResolvedQuestionStudyLinks;
  examSlug: ExamSlug;
  /** Show when the student missed the question. */
  missed?: boolean;
  /** Show when the student flagged for review. */
  flagged?: boolean;
  className?: string;
};

/** Compact deep-dive / anatomy CTAs after a miss or flag — stays out of the way of Next. */
export function StudyThisTopicButton({ links, examSlug, missed, flagged, className }: Props) {
  const deepDive = links.primaryDeepDive;
  const primaryStructure = links.anatomyStructures[0];
  const showDeepDive = Boolean(deepDive && (missed || flagged));
  const showAnatomy = Boolean(missed && primaryStructure);

  if (!showDeepDive && !showAnatomy) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {showDeepDive && deepDive ? (
        <Link
          href={deepDive.href}
          className="inline-flex items-center gap-2 rounded-lg border border-violet-200 bg-violet-50 px-3 py-2 text-sm font-semibold text-violet-900 transition hover:border-violet-300 hover:bg-violet-100"
        >
          {flagged ? <Flag className="h-4 w-4 shrink-0" aria-hidden /> : null}
          <GraduationCap className="h-4 w-4 shrink-0" aria-hidden />
          <span className="min-w-0 truncate">Study: {deepDive.title}</span>
        </Link>
      ) : null}

      {showAnatomy && primaryStructure ? (
        <Link
          href={anatomyHref(examSlug, primaryStructure.id)}
          className="inline-flex items-center gap-2 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-sm font-semibold text-sky-900 transition hover:border-sky-300 hover:bg-sky-100"
        >
          <Bone className="h-4 w-4 shrink-0" aria-hidden />
          <span className="min-w-0 truncate">{primaryStructure.name} in 3D</span>
        </Link>
      ) : null}
    </div>
  );
}
