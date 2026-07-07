"use client";

import { ChevronDown } from "lucide-react";
import { HighYieldTopicPreviewCard } from "@/components/edtech/HighYieldTopicPreviewCard";
import type { ExamSlug, HighYieldTopic, TopicProgressMap } from "@/types/edtech";
import type { TopicGroup } from "@/lib/edtech/topic-navigation";
import { studyUi } from "@/lib/study/study-ui";
import { cn } from "@/lib/utils";

type Props = {
  examSlug: ExamSlug;
  groups: TopicGroup[];
  progressMap: TopicProgressMap;
  expandedDomainIds: Set<string>;
  onToggleDomain: (domainId: string) => void;
  onOpenTopic: (topic: HighYieldTopic) => void;
  showStepNumbers?: boolean;
  pathOrder?: Map<string, number>;
};

export function HighYieldDomainAccordion({
  examSlug,
  groups,
  progressMap,
  expandedDomainIds,
  onToggleDomain,
  onOpenTopic,
  showStepNumbers = false,
  pathOrder,
}: Props) {
  if (groups.length === 0) return null;

  return (
    <div className="space-y-3 px-0.5">
      {groups.map((group) => {
        const expanded = expandedDomainIds.has(group.id);
        const complete = group.pct === 100 && group.total > 0;
        return (
          <section
            key={group.id}
            id={`topic-domain-${group.id}`}
            className={cn(studyUi.surface, "overflow-hidden scroll-mt-28")}
          >
            <button
              type="button"
              onClick={() => onToggleDomain(group.id)}
              aria-expanded={expanded}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-[var(--color-surface)]/50 sm:px-5"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-[14px] font-semibold text-[var(--color-ink)]">
                    {group.label}
                  </h2>
                  {group.weightPct > 0 ? (
                    <span className="rounded-full bg-[var(--color-surface)] px-2 py-0.5 text-[10px] font-bold text-[var(--color-ink-muted)]">
                      {group.weightPct}% of exam
                    </span>
                  ) : null}
                  {complete ? (
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                      Complete
                    </span>
                  ) : null}
                </div>
                <p className="mt-0.5 text-[11px] text-[var(--color-ink-muted)]">
                  {group.reviewed} of {group.total} reviewed
                  {group.pct > 0 ? ` · ${group.pct}% explored` : ""}
                </p>
                <div className="mt-2 h-1.5 max-w-xs overflow-hidden rounded-full bg-[var(--color-surface)]">
                  <div
                    className="h-full rounded-full bg-[var(--color-accent)]/70 transition-all duration-500"
                    style={{ width: `${group.pct}%` }}
                  />
                </div>
              </div>
              <ChevronDown
                className={cn(
                  "h-5 w-5 shrink-0 text-[var(--color-ink-muted)] transition-transform",
                  expanded && "rotate-180"
                )}
                aria-hidden
              />
            </button>

            {expanded ? (
              <ul className="border-t border-[var(--color-border)]/60 divide-y divide-[var(--color-border)]/60">
                {group.topics.map((topic) => (
                  <li key={topic.id}>
                    <HighYieldTopicPreviewCard
                      topic={topic}
                      examSlug={examSlug}
                      progress={progressMap[topic.id]}
                      onViewSummary={() => onOpenTopic(topic)}
                      compact
                      stepNumber={
                        showStepNumbers && pathOrder?.has(topic.slug)
                          ? (pathOrder.get(topic.slug)! + 1)
                          : undefined
                      }
                    />
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
