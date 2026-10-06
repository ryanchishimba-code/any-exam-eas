"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  adaptBoardPracticeWording,
  clipRationaleSection,
  parseRationaleForDisplay,
  practiceBoardFromExam,
} from "@/lib/engine/rationale/parse-rationale-display";
import {
  selectRationaleLead,
  shortRationaleLead,
  shouldCollapseRationale,
  stripRationaleMarkup,
} from "@/lib/study/rationale-disclosure";

/** Wrong-option labels already end with a period. Do not add a second one before "Trap:". */
function optionLead(option: string): string {
  const text = stripRationaleMarkup(option).trim();
  if (!text) return "";
  return /[.?!]$/.test(text) ? text : `${text}.`;
}

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

function sectionCopy(text: string | undefined, board: ReturnType<typeof practiceBoardFromExam>): string {
  const clipped = clipRationaleSection(adaptBoardPracticeWording(text ?? "", board)).trim();
  return clipped;
}

/** Structured rationale without raw ## or ** markers. Empty sections are omitted. */
function StructuredRationaleText({
  text,
  tone,
  examSlug,
}: {
  text: string;
  tone: Tone;
  examSlug?: string | null;
}) {
  const board = practiceBoardFromExam(examSlug);
  const prepared = adaptBoardPracticeWording(text, board);
  const parsed = parseRationaleForDisplay(prepared);
  if (!parsed.isStructured) {
    return <p className={cn(bodyClass[tone])}>{stripRationaleMarkup(prepared)}</p>;
  }
  const why = sectionCopy(parsed.whyCorrectHeadline, board);
  const practice = sectionCopy(parsed.clinicalContext, board);
  const pearl = sectionCopy(parsed.clinicalPearl, board);
  const takeaway = sectionCopy(parsed.keyTakeaway, board);
  const nextStep = sectionCopy(parsed.nextStepInCare, board);
  const application = sectionCopy(parsed.realWorldApplication, board);
  const pitfalls = (parsed.commonPitfalls ?? []).map((row) => sectionCopy(row, board)).filter(Boolean);
  const cues = (parsed.visualCues ?? []).filter((cue) => sectionCopy(cue.description, board));
  const related = (parsed.crossReferences ?? []).filter((row) => sectionCopy(row.note, board));
  const depth = parsed.layeredDepth;
  const depthVisible = Boolean(
    depth &&
      sectionCopy(depth.basic, board) &&
      sectionCopy(depth.intermediate, board) &&
      sectionCopy(depth.advanced, board)
  );
  return (
    <div className="space-y-4">
      {why ? <p className={bodyClass[tone]}>{why}</p> : null}
      {parsed.conceptBullets.length > 0 ? (
        <ul className="list-disc space-y-1 pl-5">
          {parsed.conceptBullets.map((bullet) => (
            <li key={bullet} className={bodyClass[tone]}>
              {stripRationaleMarkup(bullet)}
            </li>
          ))}
        </ul>
      ) : null}
      {practice ? <p className={bodyClass[tone]}>{practice}</p> : null}
      {parsed.wrongOptions.length > 0 ? (
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
            Why the other options are wrong
          </p>
          {parsed.wrongOptions.map((row) => (
            <p key={row.option} className={bodyClass[tone]}>
              <span className="font-semibold">{optionLead(row.option)} </span>
              {stripRationaleMarkup(row.body)}
            </p>
          ))}
        </div>
      ) : null}
      {pearl ? (
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
            Clinical pearl
          </p>
          <p className={cn(bodyClass[tone], "mt-1")}>{pearl}</p>
        </div>
      ) : null}
      {takeaway ? (
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
            Key takeaway
          </p>
          <p className={cn(bodyClass[tone], "mt-1")}>{takeaway}</p>
        </div>
      ) : null}
      {pitfalls.length > 0 ? (
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
            Common pitfalls
          </p>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            {pitfalls.map((row) => (
              <li key={row} className={bodyClass[tone]}>
                {row}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {nextStep ? (
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
            Next step in care
          </p>
          <p className={cn(bodyClass[tone], "mt-1")}>{nextStep}</p>
        </div>
      ) : null}
      {application ? (
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
            {board === "nursing" ? "Real-world nursing application" : "Real-world application"}
          </p>
          <p className={cn(bodyClass[tone], "mt-1")}>{application}</p>
        </div>
      ) : null}
      {depthVisible && depth ? (
        <div className="space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
            Layered depth
          </p>
          <p className={bodyClass[tone]}>Basic: {sectionCopy(depth.basic, board)}</p>
          <p className={bodyClass[tone]}>Intermediate: {sectionCopy(depth.intermediate, board)}</p>
          <p className={bodyClass[tone]}>Advanced: {sectionCopy(depth.advanced, board)}</p>
        </div>
      ) : null}
      {cues.length > 0 ? (
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
            Visual cues
          </p>
          {cues.map((cue) => (
            <p key={cue.label} className={bodyClass[tone]}>
              {stripRationaleMarkup(cue.label)}: {sectionCopy(cue.description, board)}
            </p>
          ))}
        </div>
      ) : null}
      {related.length > 0 ? (
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
            Related topics
          </p>
          {related.map((row) => (
            <p key={`${row.exam}-${row.topic}`} className={bodyClass[tone]}>
              {row.topic}: {sectionCopy(row.note, board)}
            </p>
          ))}
        </div>
      ) : null}
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
  examSlug,
}: {
  text?: string | null;
  resetKey?: string;
  tone?: Tone;
  emptyLabel?: string;
  className?: string;
  examSlug?: string | null;
}) {
  const explanation = text?.trim() ?? "";
  if (!explanation) {
    return <p className={cn(leadClass[tone], className)}>{emptyLabel}</p>;
  }

  const board = practiceBoardFromExam(examSlug);
  const prepared = adaptBoardPracticeWording(explanation, board);
  const leadSource = stripRationaleMarkup(prepared);
  const lead = shortRationaleLead(leadSource) || leadSource;
  const body = <StructuredRationaleText text={prepared} tone={tone} examSlug={examSlug} />;
  if (!shouldCollapseRationale([prepared])) {
    return <div className={className}>{body}</div>;
  }

  return (
    <CollapsibleRationale resetKey={resetKey} tone={tone} lead={lead} className={className}>
      {body}
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
