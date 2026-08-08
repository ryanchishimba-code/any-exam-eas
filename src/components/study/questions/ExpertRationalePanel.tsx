"use client";

import { useMemo, useState } from "react";
import {
  parseExpertRationaleForDisplay,
  parseRationaleForDisplay,
  type ParsedRationaleDisplay,
} from "@/lib/engine/rationale/parse-rationale-display";
import type { ExpertStructuredRationale } from "@/lib/engine/rationale/expert-rationale-types";
import { cleanOptionText } from "@/lib/question-format";
import type { StudyQuestion } from "@/lib/questions/types";
import { RationaleVisualPanel } from "./RationaleVisualPanel";
import { cn } from "@/lib/utils";
import {
  Beaker,
  BookOpen,
  ChevronDown,
  Lightbulb,
  ListOrdered,
  ShieldAlert,
  Stethoscope,
  Target,
} from "lucide-react";

function renderInlineBold(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-[var(--color-ink)]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function ExpertSection({
  title,
  icon: Icon,
  children,
  defaultOpen = true,
  accent = "default",
}: {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  defaultOpen?: boolean;
  accent?: "default" | "pearl" | "pharm" | "tip" | "pitfall";
}) {
  const [open, setOpen] = useState(defaultOpen);
  const accentClass =
    accent === "pearl"
      ? "border-amber-200/60 bg-amber-50/40 dark:border-amber-900/30 dark:bg-amber-950/20"
      : accent === "pharm"
        ? "border-violet-200/60 bg-violet-50/40 dark:border-violet-900/30 dark:bg-violet-950/20"
        : accent === "tip"
          ? "border-sky-200/60 bg-sky-50/40 dark:border-sky-900/30 dark:bg-sky-950/20"
          : accent === "pitfall"
            ? "border-rose-200/60 bg-rose-50/40 dark:border-rose-900/30 dark:bg-rose-950/20"
            : "border-[var(--color-border)]/60 bg-[var(--color-surface)]/60";

  return (
    <div className={cn("rounded-xl border p-3 sm:p-4", accentClass)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 text-left"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
          {Icon ? <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden /> : null}
          {title}
        </span>
        <ChevronDown
          className={cn("h-4 w-4 shrink-0 text-[var(--color-ink-muted)] transition", open && "rotate-180")}
          aria-hidden
        />
      </button>
      {open ? <div className="mt-2.5">{children}</div> : null}
    </div>
  );
}

function CoreRationaleBody({ parsed }: { parsed: ParsedRationaleDisplay }) {
  const conceptBullets = parsed.conceptBullets ?? [];
  const wrongOptions = parsed.wrongOptions ?? [];
  return (
    <>
      {parsed.whyCorrectHeadline && (
        <p className="text-sm leading-relaxed text-[var(--color-ink)]">
          {renderInlineBold(parsed.whyCorrectHeadline)}
        </p>
      )}
      {conceptBullets.length > 0 && (
        <ul className="mt-2 list-inside list-disc space-y-1.5 text-sm text-[var(--color-ink-muted)]">
          {conceptBullets.map((bullet) => (
            <li key={bullet}>{renderInlineBold(bullet)}</li>
          ))}
        </ul>
      )}
      {parsed.clinicalContext && (
        <p className="mt-3 rounded-lg border border-[var(--color-accent)]/15 bg-[var(--color-accent)]/5 px-3 py-2 text-sm text-[var(--color-ink)]">
          <span className="font-semibold text-[var(--color-accent)]">In practice: </span>
          {parsed.clinicalContext}
        </p>
      )}
      {wrongOptions.length > 0 && (
        <div className="mt-4 space-y-3 border-t border-black/[0.06] pt-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
            Why the other options are wrong
          </p>
          {wrongOptions.map(({ option, body }) => (
            <div
              key={option}
              className="rounded-lg border border-black/[0.06] bg-[var(--color-surface)]/60 px-3 py-2.5"
            >
              <p className="text-sm font-semibold text-[var(--color-ink)]">{cleanOptionText(option)}</p>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-[var(--color-ink-muted)]">
                {renderInlineBold(body)}
              </p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export type ExpertRationalePanelProps = {
  question: StudyQuestion;
  expertRationale?: ExpertStructuredRationale;
  /** Prefer Expert depth after a miss so learners see CJMM / pearls immediately. */
  defaultDepth?: "concise" | "expert";
};

/** UWorld-beating rationale UI — Concise vs Expert depth toggle. */
export function ExpertRationalePanel({
  question,
  expertRationale,
  defaultDepth = "concise",
}: ExpertRationalePanelProps) {
  const [depth, setDepth] = useState<"concise" | "expert">(defaultDepth);

  const parsed = useMemo(() => {
    const raw = expertRationale
      ? parseExpertRationaleForDisplay(expertRationale)
      : parseRationaleForDisplay(question.explanation);
    // Defensive: older/partial parse shapes must never crash UI `.length` checks.
    return {
      ...raw,
      conceptBullets: raw.conceptBullets ?? [],
      wrongOptions: raw.wrongOptions ?? [],
      stepByStepReasoning: raw.stepByStepReasoning ?? [],
      highYieldFacts: raw.highYieldFacts ?? [],
      commonPitfalls: raw.commonPitfalls ?? [],
      visualCues: raw.visualCues ?? [],
      visualBlocks: raw.visualBlocks ?? [],
      crossReferences: raw.crossReferences ?? [],
    };
  }, [expertRationale, question.explanation]);

  const showExpertToggle = parsed.isExpert || Boolean(expertRationale);

  if (!parsed.isStructured && !expertRationale) {
    return (
      <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink)] whitespace-pre-wrap">
        {question.explanation}
      </p>
    );
  }

  return (
    <div className="mt-3 space-y-3">
      {showExpertToggle ? (
        <div
          className="inline-flex rounded-full border border-[var(--color-border)]/60 bg-[var(--color-surface-elevated)] p-0.5"
          role="tablist"
          aria-label="Explanation depth"
        >
          {(["concise", "expert"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              role="tab"
              aria-selected={depth === mode}
              onClick={() => setDepth(mode)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold capitalize transition",
                depth === mode
                  ? "bg-[var(--color-accent)] text-white shadow-sm"
                  : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
              )}
            >
              {mode}
            </button>
          ))}
        </div>
      ) : null}

      {parsed.visualBlocks.length > 0 ? (
        <RationaleVisualPanel blocks={parsed.visualBlocks} />
      ) : null}

      <CoreRationaleBody parsed={parsed} />

      {depth === "expert" && parsed.isExpert ? (
        <div className="space-y-3 border-t border-[var(--color-border)]/40 pt-3">
          {parsed.stepByStepReasoning.length > 0 ? (
            <ExpertSection title="Step-by-step reasoning" icon={ListOrdered} defaultOpen>
              <ol className="list-decimal space-y-2 pl-4 text-sm leading-relaxed text-[var(--color-ink-muted)]">
                {parsed.stepByStepReasoning.map((step) => (
                  <li key={step}>{renderInlineBold(step)}</li>
                ))}
              </ol>
            </ExpertSection>
          ) : null}

          {parsed.clinicalPearl ? (
            <ExpertSection title="Clinical pearl" icon={Stethoscope} accent="pearl">
              <p className="text-sm leading-relaxed text-[var(--color-ink)]">{parsed.clinicalPearl}</p>
            </ExpertSection>
          ) : null}

          {parsed.pharmacologyTieIn ? (
            <ExpertSection title="Pharmacology tie-in" icon={Beaker} accent="pharm">
              <p className="text-sm leading-relaxed text-[var(--color-ink)]">{parsed.pharmacologyTieIn}</p>
            </ExpertSection>
          ) : null}

          {parsed.highYieldFacts.length > 0 ? (
            <ExpertSection title="High-yield facts" icon={Target}>
              <ul className="list-inside list-disc space-y-1 text-sm text-[var(--color-ink-muted)]">
                {parsed.highYieldFacts.map((f) => (
                  <li key={f}>{renderInlineBold(f)}</li>
                ))}
              </ul>
            </ExpertSection>
          ) : null}

          {parsed.commonPitfalls.length > 0 ? (
            <ExpertSection title="Common pitfalls" icon={ShieldAlert} accent="pitfall" defaultOpen={false}>
              <ul className="list-inside list-disc space-y-1 text-sm text-[var(--color-ink-muted)]">
                {parsed.commonPitfalls.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </ExpertSection>
          ) : null}

          {parsed.nextStepInCare ? (
            <ExpertSection title="Next step in care" icon={BookOpen} defaultOpen={false}>
              <p className="text-sm leading-relaxed text-[var(--color-ink)]">{parsed.nextStepInCare}</p>
            </ExpertSection>
          ) : null}

          {parsed.testTakingTip ? (
            <ExpertSection title="Test-taking tip" icon={Lightbulb} accent="tip">
              <p className="text-sm leading-relaxed text-[var(--color-ink)]">{parsed.testTakingTip}</p>
            </ExpertSection>
          ) : null}

          {parsed.realWorldApplication ? (
            <ExpertSection title="Real-world nursing application" icon={Stethoscope} defaultOpen={false}>
              <p className="text-sm leading-relaxed text-[var(--color-ink)]">{parsed.realWorldApplication}</p>
            </ExpertSection>
          ) : null}

          {parsed.layeredDepth ? (
            <ExpertSection title="Layered depth" defaultOpen={false}>
              <div className="space-y-2 text-sm leading-relaxed">
                <p>
                  <span className="font-semibold text-[var(--color-ink)]">Basic: </span>
                  <span className="text-[var(--color-ink-muted)]">{parsed.layeredDepth.basic}</span>
                </p>
                <p>
                  <span className="font-semibold text-[var(--color-ink)]">Intermediate: </span>
                  <span className="text-[var(--color-ink-muted)]">{parsed.layeredDepth.intermediate}</span>
                </p>
                <p>
                  <span className="font-semibold text-[var(--color-ink)]">Advanced: </span>
                  <span className="text-[var(--color-ink-muted)]">{parsed.layeredDepth.advanced}</span>
                </p>
              </div>
            </ExpertSection>
          ) : null}

          {parsed.visualCues.length > 0 ? (
            <ExpertSection title="Visual cues" defaultOpen={false}>
              <ul className="space-y-2 text-sm">
                {parsed.visualCues.map((v) => (
                  <li key={v.label}>
                    <span className="font-semibold text-[var(--color-ink)]">{v.label}: </span>
                    <span className="text-[var(--color-ink-muted)]">{v.description}</span>
                  </li>
                ))}
              </ul>
            </ExpertSection>
          ) : null}

          {parsed.crossReferences.length > 0 ? (
            <ExpertSection title="Related topics" defaultOpen={false}>
              <ul className="space-y-2 text-sm">
                {parsed.crossReferences.map((c) => (
                  <li key={`${c.exam}-${c.topic}`}>
                    <span className="font-semibold text-[var(--color-ink)]">
                      {c.exam} — {c.topic}:
                    </span>{" "}
                    <span className="text-[var(--color-ink-muted)]">{c.note}</span>
                  </li>
                ))}
              </ul>
            </ExpertSection>
          ) : null}
        </div>
      ) : null}

      {parsed.keyTakeaway && (
        <div className="rounded-xl border border-emerald-200/60 bg-emerald-50/50 px-4 py-3 dark:border-emerald-900/40 dark:bg-emerald-950/30">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
            Key takeaway
          </p>
          <p className="mt-1.5 text-sm font-medium leading-relaxed text-[var(--color-ink)]">
            {parsed.keyTakeaway}
          </p>
        </div>
      )}

      {parsed.memoryHook && (
        <p className="rounded-lg bg-sky-50 px-3 py-2 text-sm text-sky-900 dark:bg-sky-950/40 dark:text-sky-100">
          <span className="font-semibold">Memory hook: </span>
          {parsed.memoryHook}
        </p>
      )}
    </div>
  );
}

/** @deprecated Use ExpertRationalePanel — kept for backward imports. */
export function StructuredRationalePanel(props: ExpertRationalePanelProps) {
  return <ExpertRationalePanel {...props} />;
}
