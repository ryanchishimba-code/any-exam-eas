"use client";

import type { SequentialSetContext } from "@/lib/questions/sequential-sets";
import type { StudyQuestion } from "@/lib/questions/types";
import { cleanOptionText } from "@/lib/question-format";
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
  ExhibitTable,
  NaplexCaseVignette,
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
import { QuestionRelatedLinks } from "./QuestionRelatedLinks";
import { examSlugFromFieldId } from "@/lib/edtech/exams";

type Props = {
  question: StudyQuestion;
  selected: string[];
  revealed: boolean;
  onToggle: (option: string) => void;
  sequentialContext?: SequentialSetContext | null;
};

export function QuestionRenderer({
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
      ) : (
        (question.ngnFormat === "exhibit" || question.ngnPayload?.kind === "exhibit") && (
          <ExhibitTable question={question} />
        )
      )}

      <NgnTypeInstructions question={question} />

      <p className="text-lg font-medium leading-snug sm:text-xl">{question.stem}</p>

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
}

export function ExplanationPanel({
  question,
  field,
}: {
  question: StudyQuestion;
  field?: string;
}) {
  const examSlug = (field ? examSlugFromFieldId(field) : null) ?? "nclex";

  return (
    <div className="mt-6 space-y-4">
      <div className="rounded-xl bg-[var(--color-surface)] p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
          Rationale
        </p>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink)]">
          {question.explanation}
        </p>
      </div>

      {question.clinicalReasoning && (
        <div className="rounded-xl border border-[var(--color-accent)]/15 bg-[var(--color-accent)]/5 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-accent)]">
            Clinical reasoning
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink)]">
            {question.clinicalReasoning}
          </p>
        </div>
      )}

      {question.distractorRationale &&
        Object.keys(question.distractorRationale).length > 0 && (
          <div className="rounded-xl border border-black/[0.06] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
              Why each distractor fails
            </p>
            <ul className="mt-3 space-y-2">
              {Object.entries(question.distractorRationale).map(([opt, why]) => (
                <li key={opt} className="text-sm">
                  <span className="font-medium text-[var(--color-ink)]">
                    {cleanOptionText(opt)}:
                  </span>{" "}
                  <span className="text-[var(--color-ink-muted)]">{why}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

      {question.solutionSteps && question.solutionSteps.length > 0 && (
        <div className="rounded-xl border border-emerald-200/60 bg-emerald-50/40 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
            Key takeaway
          </p>
          <ul className="mt-2 space-y-1">
            {question.solutionSteps.map((step) => (
              <li key={step} className="text-sm leading-relaxed text-[var(--color-ink)]">
                {step}
              </li>
            ))}
          </ul>
        </div>
      )}

      <QuestionRelatedLinks question={question} examSlug={examSlug} />

      {question.references && question.references.length > 0 && (
        <div className="text-xs text-[var(--color-ink-muted)]">
          <span className="font-semibold uppercase tracking-wide">Sources</span>
          <ul className="mt-1 list-inside list-disc">
            {question.references.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}

      {question.type === "matrix" && question.correctAnswers.length > 0 && (
        <div className="text-xs text-[var(--color-ink-muted)]">
          <span className="font-semibold uppercase tracking-wide">Correct cells</span>
          <ul className="mt-1 list-inside list-disc">
            {question.correctAnswers.map((k) => (
              <li key={k}>{formatMatrixAnswer(k)}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
