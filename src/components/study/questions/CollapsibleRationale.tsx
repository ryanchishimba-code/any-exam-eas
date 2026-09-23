"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  rationaleAfterLead,
  selectRationaleLead,
  shortRationaleLead,
  shouldCollapseRationale,
} from "@/lib/study/rationale-disclosure";

type Tone = "study" | "onDark";

const leadClass: Record<Tone, string> = {
  study:
    "text-[16px] font-medium leading-snug tracking-[-0.02em] text-[var(--color-ink)] sm:text-[17px] sm:leading-relaxed",
  onDark: "text-[16px] font-medium leading-snug tracking-[-0.02em] text-slate-100 sm:text-[17px] sm:leading-relaxed",
};

const bodyClass: Record<Tone, string> = {
  study:
    "whitespace-pre-wrap text-[15px] leading-[1.55] tracking-[-0.015em] text-[var(--color-ink)]",
  onDark: "whitespace-pre-wrap text-[15px] leading-[1.55] tracking-[-0.015em] text-slate-300",
};

const pillClass: Record<Tone, string> = {
  study:
    "border-[var(--study-accent)]/25 bg-[var(--study-accent)]/10 text-[var(--study-accent)] hover:border-[var(--study-accent)]/45 hover:bg-[var(--study-accent)]/[0.16] focus-visible:outline-[var(--study-accent)]",
  onDark:
    "border-teal-300/35 bg-teal-400/10 text-teal-100 hover:border-teal-200/50 hover:bg-teal-400/15 focus-visible:outline-teal-200",
};

/**
 * Short lead stays visible. Show more reveals the rest for this item only.
 * Pass `resetKey` (question id) so the next item starts collapsed.
 */
export function CollapsibleRationale({
  lead,
  children,
  resetKey,
  onExpandedChange,
  tone = "study",
  className,
}: {
  lead: ReactNode;
  children: ReactNode;
  resetKey?: string;
  onExpandedChange?: (expanded: boolean) => void;
  tone?: Tone;
  className?: string;
}) {
  const panelId = useId();
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setExpanded(false);
  }, [resetKey]);

  function toggle() {
    setExpanded((open) => {
      const next = !open;
      onExpandedChange?.(next);
      return next;
    });
  }

  return (
    <div className={className}>
      <div className={leadClass[tone]}>{lead}</div>
      <div id={panelId} role="region" aria-label="Full rationale" hidden={!expanded} className={expanded ? "mt-4 space-y-4" : undefined}>
        {expanded ? children : null}
      </div>
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={toggle}
        className={cn(
          "mt-4 inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-[13px] font-semibold tracking-[-0.015em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
          pillClass[tone]
        )}
      >
        {expanded ? "Show less" : "Show more"}
        <ChevronDown
          className={cn("h-3.5 w-3.5 shrink-0 transition-transform duration-200", expanded && "rotate-180")}
          aria-hidden
        />
      </button>
    </div>
  );
}

/** Plain-text rationales (exam review, missed lists) share the same disclosure. */
export function RationaleDisclosureText({
  text,
  resetKey,
  tone = "study",
  emptyLabel = "No rationale saved for this question.",
  className,
}: {
  text?: string | null;
  resetKey?: string;
  tone?: Tone;
  emptyLabel?: string;
  className?: string;
}) {
  const explanation = text?.trim() ?? "";
  if (!explanation) {
    return <p className={cn(leadClass[tone], className)}>{emptyLabel}</p>;
  }

  const lead = shortRationaleLead(explanation) || explanation;
  if (!shouldCollapseRationale([explanation])) {
    return <p className={cn(leadClass[tone], "whitespace-pre-wrap", className)}>{explanation}</p>;
  }

  const rest = rationaleAfterLead(explanation, lead);
  return (
    <CollapsibleRationale resetKey={resetKey} tone={tone} lead={lead} className={className}>
      {rest ? <p className={bodyClass[tone]}>{rest}</p> : <p className={bodyClass[tone]}>{explanation}</p>}
    </CollapsibleRationale>
  );
}

export function rationaleLeadForQuestion(input: {
  principle?: string | null;
  headline?: string | null;
  explanation?: string | null;
}): string {
  return (
    selectRationaleLead(input) ||
    "Open the explanation when you want the full breakdown."
  );
}
