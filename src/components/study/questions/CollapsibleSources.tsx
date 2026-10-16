"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/** Toggle label. The count is the number of citations already stored on the item. */
export function sourcesToggleLabel(count: number): string {
  return `Sources (${count})`;
}

/**
 * Small disclosure for citations under a rationale.
 * Starts collapsed. The expanded body is the existing source list.
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

  return (
    <div className={className}>
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={() => setExpanded((open) => !open)}
        className={cn(
          "inline-flex min-h-11 max-w-full items-center gap-1 rounded-md px-0.5 text-left text-[12px] font-medium leading-none tracking-[-0.01em] text-[var(--color-ink-muted)] transition hover:text-[var(--color-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current",
          buttonClassName
        )}
      >
        {sourcesToggleLabel(count)}
        <ChevronDown
          className={cn("h-3 w-3 shrink-0 transition-transform duration-200", expanded && "rotate-180")}
          aria-hidden
        />
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
