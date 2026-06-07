"use client";

import { BookMarked } from "lucide-react";
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
  const reviewed = (progress?.reviewCount ?? 0) > 0;

  return (
    <Card
      className={cn(
        "group flex h-full flex-col border-slate-200/80 transition hover:border-[var(--color-accent)]/25 hover:shadow-md",
        reviewed && "border-teal-200/60"
      )}
    >
      <CardHeader className="flex-1 pb-2">
        <div className="flex items-center justify-between gap-2">
          <Badge className="bg-slate-100 text-slate-600">{topic.category}</Badge>
          {reviewed ? (
            <span className="text-[10px] font-semibold uppercase tracking-wide text-teal-600">
              Reviewed
            </span>
          ) : null}
        </div>
        <CardTitle className="mt-3 text-lg leading-snug">{topic.title}</CardTitle>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">{topic.overview}</p>
      </CardHeader>
      <CardContent className="pt-2">
        <button
          type="button"
          onClick={onViewSummary}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition group-hover:border-[var(--color-accent)]/30 group-hover:bg-[var(--color-accent)]/5 group-hover:text-[var(--color-accent)]"
        >
          <BookMarked className="h-4 w-4" aria-hidden />
          View Summary
        </button>
      </CardContent>
    </Card>
  );
}
