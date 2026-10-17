"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/** Short visible label. The citation list stays behind this control. */
export const GUIDELINE_CHECKED_LABEL = "Guideline-checked";

/** Accessible name. The count is the number of citations stored on the item. */
export function sourcesToggleLabel(count: number, expanded = false): string {
  const listed = count === 1 ? "1 source" : `${count} sources`;
  const action = expanded ? "Hide sources" : "Show sources";
  return `${GUIDELINE_CHECKED_LABEL}, ${listed}. ${action}`;
}

/**
 * Quiet check under a rationale. Starts collapsed.
 * The expanded body is the existing source list.
 */
export function CollapsibleSources({
  count,
  children,
  resetKey,
  className,
  buttonClassName,
}: {
  count: number;
  children: ReactNode;
  /** Question id, so the next item starts collapsed. */
  resetKey?: string;
  className?: string;
  buttonClassName?: string;
}) {
  const panelId = useId();
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setExpanded(false);
  }, [resetKey]);

  if (count < 1) return null;

  return (
    <div className={className}>
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={panelId}
        aria-label={sourcesToggleLabel(count, expanded)}
        onClick={() => setExpanded((open) => !open)}
        className={cn(
          "inline-flex min-h-11 max-w-full items-center gap-1.5 rounded-md px-0.5 text-left text-[12px] font-medium leading-none tracking-[-0.01em] text-[var(--color-ink-muted)] transition hover:text-[var(--color-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current",
          buttonClassName
        )}
      >
        <Check
          className="h-3.5 w-3.5 shrink-0 text-[var(--study-accent)]"
          strokeWidth={2.25}
          aria-hidden
        />
        <span>{GUIDELINE_CHECKED_LABEL}</span>
      </button>
      <div
        id={panelId}
        role="region"
        aria-label="Sources"
        hidden={!expanded}
        className={expanded ? "mt-1.5" : undefined}
      >
        {expanded ? children : null}
      </div>
    </div>
  );
}
