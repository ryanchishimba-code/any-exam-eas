"use client";

import { BookMarked, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { HighYieldTopic, TopicProgressMap } from "@/types/edtech";
import { cn } from "@/lib/utils";

export function HighYieldTopicPreviewCard({
  topic,
  progress,
  onViewSummary,
}: {
  topic: HighYieldTopic;
  progress?: TopicProgressMap[string];
  onViewSummary: () => void;
}) {
  const reviewCount = progress?.reviewCount ?? 0;
  const reviewed = reviewCount > 0;

  return (
    <Card
      className={cn(
        "group flex h-full flex-col overflow-hidden border-slate-200/80 transition duration-200",
        "hover:-translate-y-0.5 hover:border-teal-300/50 hover:shadow-lg hover:shadow-teal-50/50",
        reviewed && "border-teal-200/70 bg-gradient-to-b from-teal-50/30 to-white"
      )}
    >
      <CardHeader className="flex-1 pb-2">
        <div className="flex items-center justify-between gap-2">
          <Badge className="bg-slate-100 text-slate-600">{topic.category}</Badge>
          <div className="flex items-center gap-2">
            {topic.reviewModule ? (
              <Badge className="bg-violet-50 text-violet-800">Textbook</Badge>
            ) : null}
            {reviewed ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-teal-600">
                <CheckCircle2 className="h-3 w-3" aria-hidden />
                {reviewCount}× reviewed
              </span>
            ) : null}
          </div>
        </div>
        <CardTitle className="mt-3 text-lg leading-snug text-slate-900 group-hover:text-[var(--color-accent)]">
          {topic.title}
        </CardTitle>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">{topic.overview}</p>
      </CardHeader>
      <CardContent className="pt-2">
        <button
          type="button"
          onClick={onViewSummary}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition group-hover:border-[var(--color-accent)]/40 group-hover:bg-[var(--color-accent)] group-hover:text-white"
        >
          <BookMarked className="h-4 w-4" aria-hidden />
          {topic.reviewModule ? "Open module" : "View Summary"}
        </button>
      </CardContent>
    </Card>
  );
}
