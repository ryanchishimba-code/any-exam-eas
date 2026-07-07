"use client";

import { ArrowRight, BookOpen, CheckCircle2, Map } from "lucide-react";
import type { HighYieldTopic } from "@/types/edtech";
import type { TopicGroup } from "@/lib/edtech/topic-navigation";
import { studyUi } from "@/lib/study/study-ui";
import { cn } from "@/lib/utils";

type Props = {
  nextTopic: HighYieldTopic | null;
  groups: TopicGroup[];
  focusedDomainId: string | null;
  onContinue: () => void;
  onSelectDomain: (domainId: string | null) => void;
};

function ProgressRing({ pct, size = 40 }: { pct: number; size?: number }) {
  const stroke = 3;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;
  return (
    <svg width={size} height={size} className="-rotate-90" aria-hidden>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={stroke}
        className="text-[var(--color-border)]/80"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="text-[var(--color-accent)] transition-[stroke-dashoffset] duration-500"
      />
    </svg>
  );
}

export function HighYieldTopicsGuide({
  nextTopic,
  groups,
  focusedDomainId,
  onContinue,
  onSelectDomain,
}: Props) {
  const totalReviewed = groups.reduce((s, g) => s + g.reviewed, 0);
  const totalTopics = groups.reduce((s, g) => s + g.total, 0);
  const overallPct = totalTopics ? Math.round((totalReviewed / totalTopics) * 100) : 0;

  return (
    <div className="space-y-4 px-0.5">
      {nextTopic ? (
        <button
          type="button"
          onClick={onContinue}
          className={cn(
            studyUi.surface,
            "group flex w-full items-center gap-4 p-4 text-left transition hover:border-[var(--color-accent)]/30 hover:shadow-sm sm:p-5"
          )}
        >
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
            <BookOpen className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className={studyUi.eyebrow}>Continue learning</p>
            <p className="mt-0.5 text-[16px] font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-accent)]">
              {nextTopic.title}
            </p>
            <p className="mt-0.5 line-clamp-1 text-[12px] text-[var(--color-ink-muted)]">
              {nextTopic.overview}
            </p>
          </div>
          <ArrowRight
            className="h-5 w-5 shrink-0 text-[var(--color-accent)] transition group-hover:translate-x-0.5"
            aria-hidden
          />
        </button>
      ) : (
        <div
          className={cn(
            studyUi.surface,
            "flex items-center gap-3 border-emerald-200/60 bg-emerald-50/40 p-4 sm:p-5"
          )}
        >
          <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-600" aria-hidden />
          <div>
            <p className="font-semibold text-emerald-950">All topics explored</p>
            <p className="text-[12px] text-emerald-900/80">
              Revisit modules or jump to practice — {overallPct}% reviewed at least once.
            </p>
          </div>
        </div>
      )}

      <div>
        <div className="mb-2 flex items-center justify-between px-1">
          <p className="flex items-center gap-1.5 text-[12px] font-semibold text-[var(--color-ink)]">
            <Map className="h-3.5 w-3.5 text-[var(--color-accent)]" aria-hidden />
            Study map
          </p>
          {focusedDomainId ? (
            <button
              type="button"
              onClick={() => onSelectDomain(null)}
              className="text-[11px] font-semibold text-[var(--color-accent)] hover:underline"
            >
              Show all sections
            </button>
          ) : (
            <span className={studyUi.statPill}>
              {totalReviewed}/{totalTopics} reviewed
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {groups.map((group) => {
            const active = focusedDomainId === group.id;
            const complete = group.pct === 100 && group.total > 0;
            return (
              <button
                key={group.id}
                type="button"
                onClick={() => onSelectDomain(active ? null : group.id)}
                className={cn(
                  studyUi.surface,
                  "flex flex-col items-center gap-2 p-3 text-center transition active:scale-[0.98]",
                  active && "border-[var(--color-accent)]/40 ring-2 ring-[var(--color-accent)]/15",
                  complete && !active && "border-emerald-200/50 bg-emerald-50/30"
                )}
              >
                <div className="relative flex items-center justify-center">
                  <ProgressRing pct={group.pct} />
                  <span className="absolute text-[10px] font-bold tabular-nums text-[var(--color-ink)]">
                    {group.pct}%
                  </span>
                </div>
                <div className="min-w-0 w-full">
                  <p className="line-clamp-2 text-[11px] font-semibold leading-snug text-[var(--color-ink)]">
                    {group.shortLabel}
                  </p>
                  <p className="mt-0.5 text-[10px] tabular-nums text-[var(--color-ink-muted)]">
                    {group.reviewed}/{group.total}
                    {group.weightPct > 0 ? ` · ${group.weightPct}% exam` : ""}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
