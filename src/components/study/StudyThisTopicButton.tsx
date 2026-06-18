"use client";

import Link from "next/link";
import { GraduationCap, Flag } from "lucide-react";
import type { ResolvedQuestionStudyLinks } from "@/lib/library/question-study-links";
import { cn } from "@/lib/utils";

type Props = {
  links: ResolvedQuestionStudyLinks;
  /** Show when the student missed the question. */
  missed?: boolean;
  /** Show when the student flagged for review. */
  flagged?: boolean;
  className?: string;
};

/** Prominent CTA — deep dive entry after a miss or flag. */
export function StudyThisTopicButton({ links, missed, flagged, className }: Props) {
  const deepDive = links.primaryDeepDive;
  if (!deepDive) return null;
  if (!missed && !flagged) return null;

  const reason =
    missed && flagged
      ? "You missed this and flagged it — lock in the concept with a deep dive."
      : flagged
        ? "You flagged this for review — open the matching deep dive."
        : "You missed this — study the topic before moving on.";

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-violet-300/80 bg-gradient-to-br from-violet-600 to-indigo-700 p-[1px] shadow-lg shadow-violet-500/20",
        className
      )}
    >
      <div className="rounded-[15px] bg-gradient-to-br from-violet-600 to-indigo-700 px-5 py-4 sm:px-6 sm:py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 text-white">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-violet-100/90">
              {flagged ? (
                <Flag className="h-3.5 w-3.5" aria-hidden />
              ) : null}
              Recommended next step
            </p>
            <p className="mt-1 text-base font-semibold leading-snug sm:text-lg">
              Study: {deepDive.title}
            </p>
            <p className="mt-1 text-sm text-violet-100/85">{reason}</p>
          </div>
          <Link
            href={deepDive.href}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-violet-800 shadow-md transition hover:bg-violet-50 sm:min-w-[200px]"
          >
            <GraduationCap className="h-5 w-5" aria-hidden />
            Study This Topic
          </Link>
        </div>
      </div>
    </div>
  );
}
