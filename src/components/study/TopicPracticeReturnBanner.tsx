"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  SessionCompletionCard,
  type SessionSummaryStats,
} from "./SessionCompletionCard";

export type TopicPracticeReturn = {
  href: string;
  label: string;
};

export function TopicPracticeReturnBanner({ returnTo }: { returnTo: TopicPracticeReturn }) {
  return (
    <Link
      href={returnTo.href}
      className="inline-flex items-center gap-2 rounded-xl border border-teal-200/80 bg-teal-50/60 px-3 py-2 text-sm font-medium text-teal-900 transition hover:bg-teal-50"
    >
      <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
      Back to {returnTo.label}
    </Link>
  );
}

export function TopicPracticeReturnCompletion({
  returnTo,
  summary,
  compact = false,
  onReview,
}: {
  returnTo: TopicPracticeReturn;
  summary: SessionSummaryStats;
  compact?: boolean;
  onReview?: () => void;
}) {
  return (
    <SessionCompletionCard
      summary={summary}
      compact={compact}
      onReview={onReview}
      returnHref={returnTo.href}
      returnLabel={returnTo.label}
      className={compact ? undefined : "mt-8"}
    />
  );
}
