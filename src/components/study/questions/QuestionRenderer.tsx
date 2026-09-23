"use client";

import { memo } from "react";
import dynamic from "next/dynamic";
import type { SequentialSetContext } from "@/lib/questions/sequential-sets";
import type { StudyQuestion } from "@/lib/questions/types";
import { cleanOptionText } from "@/lib/question-format";
import { parseRationaleForDisplay, type ParsedRationaleDisplay } from "@/lib/engine/rationale/parse-rationale-display";
import {
  rationaleAfterLead,
  shouldCollapseRationale,
  uniqueRationaleParts,
} from "@/lib/study/rationale-disclosure";
import { CollapsibleRationale, rationaleLeadForQuestion } from "./CollapsibleRationale";
import { NgnCjmmNote, NgnTypeInstructions, VignetteBlock } from "./NgnChrome";
import {
  BowTieQuestion,
  HighlightQuestion,
  MatrixQuestion,
  UnfoldingCaseBanner,
  formatMatrixAnswer,
} from "./NgnFormats";
import {
  McqOptions,
  OrderedResponseOptions,
  SelectAllOptions,
} from "./NgnOptionLists";
import { MpjeQuestionDisplay } from "@/components/mpje/MpjeQuestionDisplay";
import {
  ConstructedResponseInput,
  DragDropMatch,
  NaplexCaseVignette,
  NaplexExhibitBlock,
} from "./NaplexFormats";
import {
  AbstractBlock,
  CcsPromptPanel,
  DrugAdBlock,
  SequentialItemBanner,
  UsmleCaseVignette,
  UsmleExhibitBlock,
  isUsmleField,
} from "./UsmleFormats";
import { NclexExhibitBlock } from "./NclexFormats";
import { AanpFnpExhibitBlock } from "./AanpFnpFormats";
import { QuestionRelatedLinks } from "./QuestionRelatedLinks";
import { ItemProvenanceNote } from "./ItemProvenanceNote";
import { examSlugFromFieldId } from "@/lib/edtech/exams";
import type { ExamSlug } from "@/types/edtech";
import { useUserAccess } from "@/lib/client/use-user-access";
import { analytics } from "@/lib/analytics";
import { SocialShareBar } from "@/components/social/SocialShareBar";

const ExpertRationalePanel = dynamic(
  () =>
    import("./ExpertRationalePanel").then((m) => ({
      default: m.ExpertRationalePanel,
    })),
  {
    ssr: false,
    loading: () => (
      <p className="mt-2 text-sm text-[var(--color-ink-muted)]">Loading explanation…</p>
    ),
  }
);

type Props = {
  question: StudyQuestion;
  selected: string[];
  revealed: boolean;
  onToggle: (option: string) => void;
  sequentialContext?: SequentialSetContext | null;
};

export const QuestionRenderer = memo(function QuestionRenderer({
  question,
  selected,
  revealed,
  onToggle,
  sequentialContext,
}: Props) {
  const handleToggle = (opt: string) => {
    if (opt === "__clear__") {
      onToggle("__clear__");
      return;
    }
    onToggle(opt);
  };

  return (
    <>
      {(question.highYield || question.qualityScore != null) && (
        <div className="flex flex-wrap items-center gap-2">
          {question.highYield && (
            <span className="text-[10px] font-medium uppercase tracking-wide text-amber-600">
              High yield
            </span>
          )}
          {question.qualityScore != null && (
            <span className="text-[10px] tabular-nums text-[var(--color-ink-muted)]">
              QC {(question.qualityScore * 100).toFixed(0)}%
            </span>
          )}
        </div>
      )}

      <UnfoldingCaseBanner question={question} />

      <SequentialItemBanner question={question} context={sequentialContext} />

      <NgnCjmmNote question={question} />

      {question.ngnFormat === "abstract" || question.ngnPayload?.kind === "abstract" ? (
        <AbstractBlock question={question} />
      ) : null}

      {question.ngnFormat === "drug_ad" || question.ngnPayload?.kind === "drug_ad" ? (
        <DrugAdBlock question={question} />
      ) : null}

      {question.ngnFormat === "ccs_prompt" || question.ngnPayload?.kind === "ccs_prompt" ? (
        <CcsPromptPanel question={question} />
      ) : null}

      {question.vignette &&
        question.type !== "highlight" &&
        question.ngnFormat !== "abstract" &&
        question.ngnFormat !== "drug_ad" &&
        question.ngnPayload?.kind !== "abstract" &&
        question.ngnPayload?.kind !== "drug_ad" &&
        question.ngnPayload?.kind !== "ccs_prompt" && (
          isUsmleField(question.field) ? (
            <UsmleCaseVignette text={question.vignette} />
          ) : question.field === "pharmacy" ||
            question.ngnFormat === "case_based" ||
            question.ngnFormat === "vignette" ? (
            <NaplexCaseVignette text={question.vignette} />
          ) : (
            <VignetteBlock text={question.vignette} stem={question.stem} />
          )
        )}

      {isUsmleField(question.field) ? (
        <UsmleExhibitBlock question={question} />
      ) : question.field === "nursing" ||
        question.field === "nclex-rn" ||
        question.field === "nclex-pn" ? (
        <NclexExhibitBlock question={question} />
      ) : question.field === "pharmacy" ? (
        <NaplexExhibitBlock question={question} />
      ) : question.field === "aanp-fnp" ? (
        <AanpFnpExhibitBlock question={question} />
      ) : (
        (question.ngnFormat === "exhibit" || question.ngnPayload?.kind === "exhibit") && (
          <NaplexExhibitBlock question={question} />
        )
      )}

      <NgnTypeInstructions question={question} />

      <p className="text-lg font-medium leading-snug sm:text-xl">{question.stem}</p>
      <ItemProvenanceNote
        sourceLabel={question.sourceLabel}
        sourceUrl={question.sourceUrl}
        reviewedAt={question.reviewedAt}
      />

      {question.type === "bow_tie" && (
        <BowTieQuestion
          question={question}
          selected={selected}
          revealed={revealed}
          onToggle={handleToggle}
        />
      )}

      {question.type === "matrix" && (
        <MatrixQuestion
          question={question}
          selected={selected}
          revealed={revealed}
          onToggle={handleToggle}
        />
      )}

      {question.type === "highlight" && (
        <HighlightQuestion
          question={question}
          selected={selected}
          revealed={revealed}
          onToggle={handleToggle}
        />
      )}

      {question.type === "k_type" && (
        <MpjeQuestionDisplay
          variant="study"
          question={{
            question: question.stem,
            options: question.options,
            itemType: "k_type",
            scenario: question.vignette,
            statements: (question.ngnPayload as { statements?: string[] } | undefined)
              ?.statements,
          }}
          selected={selected[0] ?? ""}
          onSelect={(opt) => onToggle(opt)}
        />
      )}

      {question.type === "select_all" && (
        <SelectAllOptions
          question={question}
          selected={selected}
          revealed={revealed}
          onToggle={handleToggle}
        />
      )}

      {question.type === "ordered_response" && (
        <OrderedResponseOptions
          question={question}
          selected={selected}
          revealed={revealed}
          onToggle={handleToggle}
        />
      )}

      {question.type === "drag_drop" && (
        <DragDropMatch
          question={question}
          selected={selected}
          revealed={revealed}
          onToggle={handleToggle}
        />
      )}

      {question.type === "short_answer" && (
        <ConstructedResponseInput
          question={question}
          selected={selected}
          revealed={revealed}
          onToggle={handleToggle}
        />
      )}

      {(question.type === "multiple_choice" ||
        question.type === "clinical_reasoning" ||
        question.type === "unfolding_case" ||
        question.type === "true_false") && (
        <McqOptions
          question={question}
          selected={selected}
          revealed={revealed}
          onToggle={handleToggle}
        />
      )}
    </>
  );
});

function visibleRationaleParts(question: StudyQuestion, parsed: ParsedRationaleDisplay): string[] {
  const distractors = question.distractorRationale
    ? Object.values(question.distractorRationale)
    : [];
  const wrong = (parsed.wrongOptions ?? []).map((entry) => `${entry.option} ${entry.body}`);
  return uniqueRationaleParts(question.explanation, [
    question.clinicalReasoning,
    ...distractors,
    ...(question.solutionSteps ?? []),
    ...(question.references ?? []),
    ...(parsed.conceptBullets ?? []),
    ...wrong,
    parsed.clinicalContext,
    ...(parsed.stepByStepReasoning ?? []),
    parsed.clinicalPearl,
    ...(parsed.highYieldFacts ?? []),
    parsed.keyTakeaway,
  ]);
}

function ExplanationDetail({
  question,
  parsed,
  examSlug,
  incorrect,
  hasExpert,
  leadToOmit,
  compact = false,
}: {
  question: StudyQuestion;
  parsed: ParsedRationaleDisplay;
  examSlug: ExamSlug;
  incorrect: boolean;
  hasExpert: boolean;
  /** When the lead already shows the opening sentence, the body continues after it. */
  leadToOmit?: string;
  /** Short rationales skip share and related-link chrome. */
  compact?: boolean;
}) {
  const plain = !parsed.isStructured && !question.expertRationale;
  const plainBody = plain
    ? leadToOmit
      ? rationaleAfterLead(question.explanation ?? "", leadToOmit)
      : (question.explanation ?? "")
    : "";
  return (
    <div className="space-y-4">
      {plain && plainBody ? (
        <p
          className={
            leadToOmit
              ? "whitespace-pre-wrap text-[15px] leading-[1.55] tracking-[-0.015em] text-[var(--color-ink)]"
              : "whitespace-pre-wrap text-[16px] font-medium leading-snug tracking-[-0.02em] text-[var(--color-ink)] sm:text-[17px] sm:leading-relaxed"
          }
        >
          {plainBody}
        </p>
      ) : plain ? null : (
        <ExpertRationalePanel
          question={question}
          expertRationale={question.expertRationale}
          defaultDepth={incorrect && hasExpert ? "expert" : "concise"}
        />
      )}

      {question.clinicalReasoning && !parsed.isStructured ? (
        <div className="rounded-xl border border-[var(--study-accent)]/15 bg-[var(--study-accent)]/5 px-4 py-3.5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--study-accent)]">
            Clinical reasoning
          </p>
          <p className="mt-2 text-[15px] leading-[1.55] tracking-[-0.015em] text-[var(--color-ink)]">
            {question.clinicalReasoning}
          </p>
        </div>
      ) : null}

      {question.distractorRationale &&
      !parsed.isStructured &&
      Object.keys(question.distractorRationale).length > 0 ? (
        <div className="rounded-xl border border-black/[0.06] px-4 py-3.5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
            Why each distractor fails
          </p>
          <ul className="mt-3 space-y-2.5">
            {Object.entries(question.distractorRationale).map(([opt, why]) => (
              <li key={opt} className="text-[15px] leading-[1.5] tracking-[-0.015em]">
                <span className="font-semibold text-[var(--color-ink)]">{cleanOptionText(opt)}:</span>{" "}
                <span className="text-[var(--color-ink-muted)]">{why}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {question.solutionSteps && question.solutionSteps.length > 0 && !parsed.keyTakeaway ? (
        <div className="rounded-xl border border-emerald-200/60 bg-emerald-50/40 px-4 py-3.5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-700">
            Key takeaway
          </p>
          <ul className="mt-2 space-y-1.5">
            {question.solutionSteps.map((step) => (
              <li key={step} className="text-[15px] leading-[1.5] tracking-[-0.015em] text-[var(--color-ink)]">
                {step}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {compact ? null : (
        <>
          <QuestionRelatedLinks question={question} examSlug={examSlug} sections="anatomy" />
          <QuestionRelatedLinks question={question} examSlug={examSlug} sections="non-anatomy" />
        </>
      )}

      {question.references && question.references.length > 0 ? (
        <div className="text-[13px] leading-relaxed tracking-[-0.01em] text-[var(--color-ink-muted)]">
          <span className="font-semibold uppercase tracking-[0.12em]">Sources</span>
          <ul className="mt-1.5 list-inside list-disc space-y-1">
            {question.references.map((reference, i) => (
              <li key={i}>{reference}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {compact ? null : (
        <div className="flex justify-end border-t border-black/[0.06] pt-3 dark:border-white/[0.08]">
          <SocialShareBar
            entityType="question"
            entityId={question.id}
            text={`Sharpening my ${examSlug.toUpperCase()} prep with AnyExamEasy 💪`}
            url="https://www.anyexameasy.com"
            size="sm"
          />
        </div>
      )}
    </div>
  );
}

export function ExplanationPanel({
  question,
  field,
  incorrect = false,
}: {
  question: StudyQuestion;
  field?: string;
  /** Prefer expert depth when the learner opens the full rationale after a miss. */
  incorrect?: boolean;
}) {
  const { role } = useUserAccess();
  const conciseOnly = role === "free";
  const examSlug = (field ? examSlugFromFieldId(field) : null) ?? "nclex";

  const parsed = parseRationaleForDisplay(question.explanation, question.expertRationale);
  const hasExpert = Boolean(question.expertRationale || parsed.isExpert);
  const parts = visibleRationaleParts(question, parsed);
  const collapsible = shouldCollapseRationale(parts);
  const lead = rationaleLeadForQuestion({
    principle:
      question.explanationDetail?.keyTakeaways?.[0] ||
      question.expertRationale?.keyTakeaway ||
      parsed.keyTakeaway,
    headline:
      question.explanationDetail?.summary ||
      question.expertRationale?.whyCorrect?.headline ||
      parsed.whyCorrectHeadline,
    explanation: question.explanation,
  });

  const hasDistractors =
    Boolean(
      question.distractorRationale &&
        !parsed.isStructured &&
        Object.keys(question.distractorRationale).length > 0
    ) || (parsed.wrongOptions?.length ?? 0) > 0;

  const hasDeepContent =
    Boolean(question.clinicalReasoning && !parsed.isStructured) ||
    hasDistractors ||
    Boolean(question.solutionSteps?.length && !parsed.keyTakeaway) ||
    Boolean(question.references?.length) ||
    hasExpert;

  const detail = (
    <ExplanationDetail
      question={question}
      parsed={parsed}
      examSlug={examSlug}
      incorrect={incorrect}
      hasExpert={hasExpert}
      leadToOmit={collapsible ? lead : undefined}
      compact={!collapsible}
    />
  );

  return (
    <div className="mt-6 space-y-4">
      <div className="rounded-2xl border border-[var(--study-accent)]/20 bg-[var(--color-surface-elevated)] px-5 py-5 sm:px-6 sm:py-6">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
            Rationale
          </p>
          <div className="flex items-center gap-1.5">
            {hasExpert ? (
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-emerald-700 ring-1 ring-emerald-500/20 dark:text-emerald-400">
                Expert
              </span>
            ) : null}
            <span className="rounded-full bg-[var(--color-surface)] px-2 py-0.5 text-[9px] font-medium uppercase tracking-wide text-[var(--color-ink-muted)] ring-1 ring-[var(--color-border)]">
              AI-assisted
            </span>
          </div>
        </div>

        <div className="mt-3.5">
          {collapsible && !conciseOnly ? (
            <CollapsibleRationale
              resetKey={question.id}
              lead={lead}
              onExpandedChange={(open) => {
                if (open) {
                  analytics.ctaClicked(
                    hasExpert ? "rationale_open_expert" : "rationale_open",
                    "explanation_panel"
                  );
                }
              }}
            >
              {detail}
            </CollapsibleRationale>
          ) : collapsible && conciseOnly ? (
            <>
              <p className="text-[16px] font-medium leading-snug tracking-[-0.02em] text-[var(--color-ink)] sm:text-[17px] sm:leading-relaxed">
                {lead}
              </p>
              {hasDeepContent ? (
                <p className="mt-3 text-[13px] leading-relaxed tracking-[-0.01em] text-[var(--color-ink-muted)]">
                  Upgrade to Pro for rich, detailed explanations.
                </p>
              ) : null}
            </>
          ) : parts.length === 0 ? (
            <p className="text-[16px] font-medium leading-snug tracking-[-0.02em] text-[var(--color-ink)] sm:text-[17px] sm:leading-relaxed">
              {lead}
            </p>
          ) : (
            detail
          )}
        </div>
      </div>

      {question.type === "matrix" && (question.correctAnswers?.length ?? 0) > 0 ? (
        <div className="text-[13px] tracking-[-0.01em] text-[var(--color-ink-muted)]">
          <span className="font-semibold uppercase tracking-[0.12em]">Correct cells</span>
          <ul className="mt-1.5 list-inside list-disc">
            {(question.correctAnswers ?? []).map((key) => (
              <li key={key}>{formatMatrixAnswer(key)}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
