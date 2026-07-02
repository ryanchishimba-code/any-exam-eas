"use client";

import {
  Brain,
  ClipboardList,
  FlaskConical,
  HeartPulse,
  Pill,
  Shield,
  Sparkles,
  Stethoscope,
  Target,
} from "lucide-react";
import {
  PANCE_TASK_AREAS,
  type PanceTaskAreaId,
} from "@/lib/exam-prep/pance/content-outline";
import {
  PANCE_FEATURED_DRILLS,
  getPanceTaskShortLabel,
} from "@/lib/exam-prep/pance/practice-focus";
import { qbUi } from "@/lib/study/question-bank-ui";
import { cn } from "@/lib/utils";

const TASK_ICONS: Record<PanceTaskAreaId, typeof Target> = {
  "history-physical": Stethoscope,
  diagnosis: Target,
  labs: FlaskConical,
  prevention: HeartPulse,
  intervention: ClipboardList,
  pharmacotherapy: Pill,
  foundational: Brain,
  professional: Shield,
};

type PanceTaskFocusProps = {
  taskCategory: PanceTaskAreaId | null;
  onTaskCategoryChange: (taskCategory: PanceTaskAreaId | null) => void;
  disabled?: boolean;
  onFeaturedSelect?: (taskCategory: PanceTaskAreaId, count: number) => void;
};

export function PanceTaskFocus({
  taskCategory,
  onTaskCategoryChange,
  disabled = false,
  onFeaturedSelect,
}: PanceTaskFocusProps) {
  const featured = PANCE_FEATURED_DRILLS[0];

  return (
    <div className="space-y-4">
      {featured ? (
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            onTaskCategoryChange(featured.taskCategory);
            onFeaturedSelect?.(featured.taskCategory, featured.count);
          }}
          className={cn(
            "group relative w-full overflow-hidden rounded-2xl border text-left transition active:scale-[0.995]",
            disabled && "cursor-not-allowed opacity-50",
            taskCategory === featured.taskCategory
              ? "border-[var(--color-accent)]/35 bg-[var(--color-accent)]/[0.08] ring-1 ring-[var(--color-accent)]/20"
              : "border-[var(--color-border)]/60 bg-gradient-to-br from-[var(--color-surface-elevated)] to-[var(--color-surface)]/80 hover:border-[var(--color-accent)]/25"
          )}
        >
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[var(--color-accent)]/[0.06] blur-2xl" />
          <div className="relative flex items-start gap-3.5 p-4 sm:p-5">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
              <Sparkles className="h-5 w-5" strokeWidth={1.75} aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className={qbUi.eyebrow}>Recommended</p>
              <p className="mt-1 text-[16px] font-semibold tracking-tight text-[var(--color-ink)]">
                {featured.title}
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-[var(--color-ink-muted)]">
                {featured.subtitle}
              </p>
              <p className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[var(--color-accent)]">
                {featured.count} vignettes
                <span aria-hidden className="transition group-hover:translate-x-0.5">
                  →
                </span>
              </p>
            </div>
          </div>
        </button>
      ) : null}

      <div>
        <div className="mb-2.5 flex items-center justify-between gap-2 px-0.5">
          <p className={qbUi.sectionTitle}>Task focus</p>
          {taskCategory ? (
            <button
              type="button"
              disabled={disabled}
              onClick={() => onTaskCategoryChange(null)}
              className="text-[12px] font-semibold text-[var(--color-accent)] transition hover:opacity-80"
            >
              Clear
            </button>
          ) : null}
        </div>
        <p className={cn(qbUi.sectionHint, "mb-3 px-0.5")}>
          Optional — practice a specific NCCPA task area alongside your organ-system topic.
        </p>

        <div className={qbUi.chipRow}>
          <button
            type="button"
            disabled={disabled}
            onClick={() => onTaskCategoryChange(null)}
            className={cn(
              qbUi.chip,
              !taskCategory ? qbUi.chipActive : qbUi.chipIdle
            )}
          >
            All tasks
          </button>
          {PANCE_TASK_AREAS.map((task) => {
            const Icon = TASK_ICONS[task.id];
            const active = taskCategory === task.id;
            return (
              <button
                key={task.id}
                type="button"
                disabled={disabled}
                onClick={() => onTaskCategoryChange(task.id)}
                className={cn(qbUi.chip, active ? qbUi.chipActive : qbUi.chipIdle)}
              >
                <Icon className="h-3.5 w-3.5 opacity-80" strokeWidth={2} aria-hidden />
                <span>{getPanceTaskShortLabel(task.id)}</span>
                <span
                  className={cn(
                    "tabular-nums text-[10px]",
                    active ? "text-white/80" : "text-[var(--color-ink-muted)]"
                  )}
                >
                  {task.weightLabel}
                </span>
              </button>
            );
          })}
        </div>

        {taskCategory ? (
          <p className={cn(qbUi.sectionHint, "mt-3 px-0.5")}>
            {PANCE_TASK_AREAS.find((t) => t.id === taskCategory)?.summary}
          </p>
        ) : null}
      </div>
    </div>
  );
}
