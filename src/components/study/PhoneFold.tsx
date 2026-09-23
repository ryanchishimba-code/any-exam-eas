"use client";

import { useId, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Phone: one disclosure, closed until tapped.
 * sm and up: the same children stay in normal flow, with no toggle.
 * One copy of the children so ids and tests stay single.
 *
 * Closed is React state, not a checkbox. A client navigation can restore a
 * checked input and paint `peer-checked:` content open; a reload starts
 * unchecked. The receipt must stay collapsed on that first phone paint.
 */
export function PhoneFold({
  summary,
  children,
  className,
}: {
  summary: string;
  children: ReactNode;
  className?: string;
}) {
  const panelId = `${useId().replace(/:/g, "")}-panel`;
  const [open, setOpen] = useState(false);

  return (
    <div className={className}>
      <button
        type="button"
        className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-[var(--color-border)]/60 bg-[var(--color-surface)]/60 px-3.5 py-2.5 text-left text-[13px] font-semibold tracking-[-0.02em] text-[var(--color-ink)] sm:hidden"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        {summary}
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-[var(--color-ink-muted)] transition-transform duration-200",
            open && "rotate-180"
          )}
          aria-hidden
        />
      </button>
      <div
        id={panelId}
        data-phone-fold={open ? "open" : "closed"}
        className={cn("mt-3 sm:mt-0", open ? "block" : "hidden sm:block")}
      >
        {children}
      </div>
    </div>
  );
}
