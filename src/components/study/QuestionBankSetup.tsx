"use client";

import { useEffect, useMemo } from "react";
import {
  type QuestionBankPace,
  type QuestionBankStyle,
} from "@/lib/exam/modes";
import type { FormatCounts } from "@/lib/inventory/active-questions";
import {
  MIXED_SUBJECT_ID,
  MIXED_SUBJECT_LABEL,
  availableQuestionCount,
  effectiveQuestionBankStyle,
  isMixedSubjectId,
  questionBankBoardCount,
  questionBankCountChoices,
  questionBankCountOptionsForAvailable,
  questionBankPageCount,
  questionBankStyleAllowed,
  questionBankWheelPresetsForField,
  validateQuestionBankSession,
} from "@/lib/study/question-bank-setup";
import {
  practiceFormatCountOptions,
  practiceFormatPoolCount,
  validatePracticeFormatSession,
  type PracticeFormatMode,
} from "@/lib/study/practice-format";
import { qbUi } from "@/lib/study/question-bank-ui";
import { cn } from "@/lib/utils";
import { QuestionBankCountWheel } from "./question-bank/QuestionBankCountWheel";
import { QuestionBankFormatMode } from "./question-bank/QuestionBankFormatMode";
import { QuestionBankSection, QuestionBankSegment } from "./question-bank/QuestionBankSection";
import {
  QuestionBankTopicPicker,
  type CoverageSubjectMark,
} from "./question-bank/QuestionBankTopicPicker";
import type { CoverageChip, CoverageHeatmap } from "@/lib/learning/coverage-heatmap";
import { topicRowCountQualifier } from "@/lib/inventory/blueprint-domain-pool";

type SubjectOption = { id: string; label: string };

type QuestionBankSetupProps = {
  subjects: SubjectOption[];
  subjectId: string;
  subjectCounts?: Record<string, number> | null;
  onSubjectChange: (subjectId: string) => void;
  questionCount: number;
  onQuestionCountChange: (count: number) => void;
  pace: QuestionBankPace;
  onPaceChange: (pace: QuestionBankPace) => void;
  bankStyle: QuestionBankStyle;
  onBankStyleChange: (style: QuestionBankStyle) => void;
  examLabel?: string;
  /** Bank field — USMLE uses 40/50/80 wheel presets. */
  fieldId?: string;
  weakSubjectIds?: string[];
  coverageChips?: CoverageChip[];
  coverageLabel?: CoverageHeatmap["domainsLabel"];
  coverageLoaded?: boolean;
  /** Blueprint area the student is practicing. Distinct from a single topic. */
  blueprintAreaId?: string | null;
  onBlueprintAreaSelect?: (areaId: string) => void;
  compact?: boolean;
  countsLoading?: boolean;
  practiceFormat?: PracticeFormatMode;
  onPracticeFormatChange?: (format: PracticeFormatMode) => void;
  formats?: FormatCounts | null;
  /** Scored-item total for the All card. */
  scoredTotal?: number | null;
  /** Bank-item topic counts for the standard session wheel. */
  sessionCounts?: Record<string, number> | null;
  caseItemCount?: number | null;
  ngnLabel?: string;
};

const STYLE_OPTIONS: { id: QuestionBankStyle; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "standard", label: "Standard" },
  { id: "adaptive", label: "Adaptive" },
  { id: "weak_areas", label: "Weak areas" },
  { id: "review_incorrect", label: "Review incorrect" },
];

export function QuestionBankSetup({
  subjects,
  subjectId,
  subjectCounts,
  onSubjectChange,
  questionCount,
  onQuestionCountChange,
  pace,
  onPaceChange,
  bankStyle,
  onBankStyleChange,
  fieldId,
  weakSubjectIds = [],
  coverageChips = [],
  coverageLoaded = false,
  blueprintAreaId = null,
  compact = false,
  countsLoading = false,
  practiceFormat = "all",
  onPracticeFormatChange,
  formats = null,
  scoredTotal = null,
  sessionCounts = null,
  caseItemCount = null,
  ngnLabel = "NGN",
}: QuestionBankSetupProps) {
  const formatMode = practiceFormat === "ngn" || practiceFormat === "case";
  const styleScope = {
    subjectId: blueprintAreaId ? "" : subjectId,
    blueprintArea: Boolean(blueprintAreaId),
    practiceFormat: formatMode ? practiceFormat : ("all" as const),
  };
  const selectedStyle = effectiveQuestionBankStyle(bankStyle, styleScope);
  useEffect(() => {
    if (selectedStyle !== bankStyle) onBankStyleChange(selectedStyle);
  }, [bankStyle, onBankStyleChange, selectedStyle]);
  const formatPool = practiceFormatPoolCount(practiceFormat, formats);
  const activeArea = blueprintAreaId
    ? coverageChips.find((chip) => chip.domainId === blueprintAreaId)
    : undefined;
  // sessionCounts sizes a standard draw (bank rows only). Every number on
  // the page uses the scored map, the same total public pages publish.
  const wheelCounts = sessionCounts ?? subjectCounts;
  const boardCount = questionBankBoardCount({
    scoredTotal,
    scoredTopicCounts: subjectCounts,
  });
  const topicCount = questionBankPageCount(subjectId, subjectCounts);
  const maxAvailable = formatMode
    ? formatPool
    : activeArea
      ? activeArea.available
      : availableQuestionCount(subjectId, wheelCounts);
  const countOptions = formatMode
    ? practiceFormatCountOptions(formatPool)
    : questionBankCountOptionsForAvailable(maxAvailable, fieldId);
  const countChoices = questionBankCountChoices({
    questionCount,
    options: countOptions,
  });
  const wheelValue = countChoices.count;
  useEffect(() => {
    if (wheelValue !== questionCount) onQuestionCountChange(wheelValue);
  }, [onQuestionCountChange, questionCount, wheelValue]);
  const validation = formatMode
    ? validatePracticeFormatSession({
        format: practiceFormat,
        questionCount: wheelValue,
        formats,
        bankStyle: selectedStyle,
        ngnLabel,
        subjectId,
      })
    : validateQuestionBankSession({
        subjectId: activeArea?.domainId || subjectId,
        questionCount: wheelValue,
        subjectCounts: activeArea
          ? { [activeArea.domainId]: activeArea.available }
          : wheelCounts,
        bankStyle: selectedStyle,
      });

  const coverageMarks: CoverageSubjectMark[] = coverageChips.map((chip) => ({
    subjectId: chip.subjectId,
    kind: chip.kind,
  }));
  const areaCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const chip of coverageChips) counts[chip.domainId] = chip.available;
    return counts;
  }, [coverageChips]);
  const countQualifierBySubject = useMemo(() => {
    if (!fieldId || !subjectCounts) return {};
    const qualifiers: Record<string, string> = {};
    for (const subject of subjects) {
      const topicCount = subjectCounts[subject.id];
      if (typeof topicCount !== "number") continue;
      const qualifier = topicRowCountQualifier({
        fieldId,
        subjectId: subject.id,
        topicCount,
        areaCounts,
      });
      if (qualifier) qualifiers[subject.id] = qualifier;
    }
    return qualifiers;
  }, [areaCounts, fieldId, subjectCounts, subjects]);
  const visibleStyles = STYLE_OPTIONS.filter((option) =>
    questionBankStyleAllowed(option.id, styleScope)
  );

  return (
    <div className="space-y-8">
      {onPracticeFormatChange ? (
        <QuestionBankFormatMode
          value={practiceFormat}
          onChange={onPracticeFormatChange}
          formats={formats}
          scoredTotal={
            subjectId && !isMixedSubjectId(subjectId) ? (topicCount ?? boardCount) : boardCount
          }
          caseItemCount={
            !subjectId || isMixedSubjectId(subjectId) ? caseItemCount : null
          }
          countsLoading={countsLoading}
          ngnLabel={ngnLabel}
          subjectId={activeArea ? null : subjectId}
          lockToAll={Boolean(activeArea)}
        />
      ) : null}

      <QuestionBankSection title="Topic">
        <QuestionBankTopicPicker
          subjects={subjects}
          subjectId={activeArea ? "" : subjectId}
          subjectCounts={subjectCounts}
          boardCount={boardCount}
          onSubjectChange={onSubjectChange}
          weakSubjectIds={weakSubjectIds}
          coverageMarks={coverageMarks}
          coverageLoaded={coverageLoaded}
          countsLoading={countsLoading}
          countQualifierBySubject={countQualifierBySubject}
        />
      </QuestionBankSection>

      <QuestionBankSection title="Session">
        <div className="space-y-5">
          <div>
            <p className={cn(qbUi.sectionHint, "mb-3 px-0.5")}>Questions</p>
            {countOptions.length === 0 ? (
              countsLoading ? (
                <p className="px-0.5 text-[15px] leading-relaxed text-[var(--color-ink-muted)]" role="status">
                  Checking the bank…
                </p>
              ) : (
              <div className="space-y-2 text-center" role="status">
                <p className="text-[12px] text-amber-800">
                  {validation.message ??
                    (maxAvailable != null &&
                    maxAvailable > 0 &&
                    maxAvailable < (questionBankWheelPresetsForField(fieldId ?? "")[0] ?? 25)
                      ? `This topic has ${maxAvailable.toLocaleString()} serve-ready question${maxAvailable === 1 ? "" : "s"} — need ${questionBankWheelPresetsForField(fieldId ?? "")[0] ?? 25} to start.`
                      : "Not enough serve-ready questions for this topic yet.")}
                </p>
                {"suggestMixed" in validation && validation.suggestMixed ? (
                  <button
                    type="button"
                    onClick={() => onSubjectChange(MIXED_SUBJECT_ID)}
                    className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-3.5 py-1.5 text-[12px] font-semibold text-white transition hover:opacity-90"
                  >
                    Try {MIXED_SUBJECT_LABEL}
                  </button>
                ) : null}
              </div>
              )
            ) : (
              <QuestionBankCountWheel
                options={countChoices.options}
                value={wheelValue}
                onChange={onQuestionCountChange}
              />
            )}
            {!validation.ok && validation.message && countOptions.length > 0 ? (
              <div className="mt-2 space-y-2 text-center" role="status">
                <p className="text-[12px] text-amber-800">{validation.message}</p>
                {"suggestMixed" in validation && validation.suggestMixed ? (
                  <button
                    type="button"
                    onClick={() => onSubjectChange(MIXED_SUBJECT_ID)}
                    className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-3.5 py-1.5 text-[12px] font-semibold text-white transition hover:opacity-90"
                  >
                    Try {MIXED_SUBJECT_LABEL}
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>

          {!compact ? (
            <div>
              <p className={cn(qbUi.sectionHint, "mb-2 px-0.5")}>Style</p>
              <div className="grid gap-2 sm:grid-cols-3">
                {visibleStyles.map((option) => {
                  const active = selectedStyle === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      aria-pressed={active}
                      data-bank-style={option.id}
                      onClick={() => onBankStyleChange(option.id)}
                      className={cn(
                        "flex min-h-11 items-center justify-center rounded-2xl border px-3.5 py-3 text-center transition active:scale-[0.99]",
                        active
                          ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white shadow-[0_1px_2px_rgba(15,23,42,0.12)]"
                          : "border-[var(--qb-line,var(--color-border))]/80 bg-[var(--qb-card,var(--color-surface-elevated))] text-[var(--qb-ink,var(--color-ink))] hover:border-[var(--color-accent)]/35"
                      )}
                    >
                      <p className="text-[13px] font-semibold">{option.label}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          <div>
            <p className={cn(qbUi.sectionHint, "mb-2 px-0.5")}>Pace</p>
            <QuestionBankSegment
              ariaLabel="Session pace"
              value={pace}
              onChange={onPaceChange}
              options={[
                { id: "untimed", label: "Untimed" },
                { id: "timed", label: "Timed" },
              ]}
            />
          </div>
        </div>
      </QuestionBankSection>
    </div>
  );
}
