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
  isMixedSubjectId,
  questionBankCountChoices,
  questionBankCountOptionsForAvailable,
  questionBankWheelPresetsForField,
  validateQuestionBankSession,
} from "@/lib/study/question-bank-setup";
import {
  practiceFormatCountOptions,
  practiceFormatPoolCount,
  validatePracticeFormatSession,
  type PracticeFormatMode,
} from "@/lib/study/practice-format";
import { REMEDIATION_MASTERY_RULE } from "@/lib/learning/item-mastery";
import { qbUi } from "@/lib/study/question-bank-ui";
import { cn } from "@/lib/utils";
import { QuestionBankCountWheel } from "./question-bank/QuestionBankCountWheel";
import { QuestionBankFormatMode } from "./question-bank/QuestionBankFormatMode";
import { QuestionBankSection, QuestionBankSegment } from "./question-bank/QuestionBankSection";
import { CoverageChips } from "./question-bank/CoverageChips";
import {
  QuestionBankTopicPicker,
  type CoverageSubjectMark,
} from "./question-bank/QuestionBankTopicPicker";
import type { CoverageChip, CoverageHeatmap } from "@/lib/learning/coverage-heatmap";
import {
  blueprintAreaSelectsSingleTopic,
  topicRowCountQualifier,
} from "@/lib/inventory/blueprint-domain-pool";

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
  totalActive?: number | null;
  ngnLabel?: string;
};

const STYLE_OPTIONS: { id: QuestionBankStyle; label: string; hint: string }[] = [
  { id: "today", label: "Today", hint: "Mastery Engine — Skill Cell set for today" },
  { id: "standard", label: "Standard", hint: "Topic pool in bank order" },
  { id: "adaptive", label: "Adaptive", hint: "Weak areas & spaced review" },
  { id: "weak_areas", label: "Weak areas", hint: "Focus on missed topics" },
  {
    id: "review_incorrect",
    label: "Review incorrect",
    hint: "Misses stay open until a spaced re-proof",
  },
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
  examLabel,
  fieldId,
  weakSubjectIds = [],
  coverageChips = [],
  coverageLabel = "Blueprint topics",
  coverageLoaded = false,
  blueprintAreaId = null,
  onBlueprintAreaSelect,
  compact = false,
  countsLoading = false,
  practiceFormat = "all",
  onPracticeFormatChange,
  formats = null,
  totalActive = null,
  ngnLabel = "NGN",
}: QuestionBankSetupProps) {
  const formatMode = practiceFormat === "ngn" || practiceFormat === "case";
  const formatPool = practiceFormatPoolCount(practiceFormat, formats);
  const activeArea = blueprintAreaId
    ? coverageChips.find((chip) => chip.domainId === blueprintAreaId)
    : undefined;
  const maxAvailable = formatMode
    ? formatPool
    : activeArea
      ? activeArea.available
      : availableQuestionCount(subjectId, subjectCounts);
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
        bankStyle,
        ngnLabel,
        subjectId,
      })
    : validateQuestionBankSession({
        subjectId: activeArea?.domainId || subjectId,
        questionCount: wheelValue,
        subjectCounts: activeArea
          ? { [activeArea.domainId]: activeArea.available }
          : subjectCounts,
        bankStyle,
      });

  const selectedSubject = activeArea
    ? { id: activeArea.domainId, label: activeArea.label }
    : isMixedSubjectId(subjectId)
      ? { id: MIXED_SUBJECT_ID, label: MIXED_SUBJECT_LABEL }
      : subjects.find((s) => s.id === subjectId);
  const selectedCount = maxAvailable;
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
  const areasBroaderThanTopics = coverageChips.some((chip) => {
    if (!fieldId) {
      const topicCount = subjectCounts?.[chip.subjectId];
      return typeof topicCount === "number" && topicCount !== chip.available;
    }
    return (
      blueprintAreaSelectsSingleTopic({
        fieldId,
        areaId: chip.domainId,
        topicCounts: subjectCounts,
        areaCount: chip.available,
      }) == null && chip.available > 0
    );
  });
  const selectedChipId = activeArea
    ? activeArea.domainId
    : coverageChips.find((chip) => {
        if (!fieldId) return chip.subjectId === subjectId && chip.available === subjectCounts?.[chip.subjectId];
        return (
          blueprintAreaSelectsSingleTopic({
            fieldId,
            areaId: chip.domainId,
            topicCounts: subjectCounts,
            areaCount: chip.available,
          }) === subjectId
        );
      })?.domainId;
  const selectedTopicQualifier =
    !activeArea && subjectId ? countQualifierBySubject[subjectId] : undefined;

  function selectChip(areaId: string) {
    const chip = coverageChips.find((row) => row.domainId === areaId);
    if (!chip) return;
    const singleTopic = fieldId
      ? blueprintAreaSelectsSingleTopic({
          fieldId,
          areaId,
          topicCounts: subjectCounts,
          areaCount: chip.available,
        })
      : chip.available === subjectCounts?.[chip.subjectId]
        ? chip.subjectId
        : null;
    if (singleTopic) {
      onSubjectChange(singleTopic);
      return;
    }
    if (onBlueprintAreaSelect) {
      onBlueprintAreaSelect(areaId);
      return;
    }
    onSubjectChange(chip.subjectId);
  }

  return (
    <div className="space-y-8">
      {onPracticeFormatChange ? (
        <QuestionBankFormatMode
          value={practiceFormat}
          onChange={onPracticeFormatChange}
          formats={formats}
          totalActive={totalActive}
          countsLoading={countsLoading}
          ngnLabel={ngnLabel}
          lockToAll={Boolean(activeArea)}
        />
      ) : null}

      <QuestionBankSection
        title="Choose a topic"
        hint={
          areasBroaderThanTopics
            ? "Blueprint chips count every active question in that area. Each row below counts one topic."
            : coverageLoaded
              ? "Search or scroll. Untouched and low-coverage topics use the same heatmap as Today."
              : "Search or scroll — weak topics from your dashboard are marked."
        }
      >
        <CoverageChips
          chips={coverageChips}
          domainsLabel={coverageLabel}
          selectedChipId={selectedChipId}
          onSelect={selectChip}
        />
        {!coverageLoaded && weakSubjectIds.length > 0 ? (
          <p className={cn(qbUi.surface, "px-3.5 py-2.5 text-[12px] text-[var(--color-ink-muted)]")}>
            {weakSubjectIds.length} weak topic{weakSubjectIds.length === 1 ? "" : "s"} flagged —
            start there for the biggest gains.
          </p>
        ) : null}
        {selectedSubject ? (
          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 px-0.5 text-[12px] text-[var(--color-ink-muted)]">
            <span aria-hidden>Practicing</span>
            {examLabel ? (
              <>
                <span className="font-medium text-[var(--color-ink)]">{examLabel}</span>
                <span aria-hidden>›</span>
              </>
            ) : null}
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-accent)]/10 px-2 py-0.5 font-semibold text-[var(--color-accent)]">
              {selectedSubject.label}
            </span>
            {typeof selectedCount === "number" && !formatMode ? (
              <span className="tabular-nums">
                · {selectedCount.toLocaleString()}{" "}
                {activeArea
                  ? "in this area"
                  : `${selectedCount === 1 ? "question" : "questions"}${
                      selectedTopicQualifier ? " in this topic" : ""
                    }`}
              </span>
            ) : null}
          </div>
        ) : null}

        <QuestionBankTopicPicker
          subjects={subjects}
          subjectId={activeArea ? "" : subjectId}
          subjectCounts={subjectCounts}
          onSubjectChange={onSubjectChange}
          weakSubjectIds={weakSubjectIds}
          coverageMarks={coverageMarks}
          coverageLoaded={coverageLoaded}
          countsLoading={countsLoading}
          countQualifierBySubject={countQualifierBySubject}
        />
      </QuestionBankSection>

      <QuestionBankSection
        title="Session settings"
        hint="Pick length, then tune how questions are chosen."
      >
        <div className="space-y-5">
          <div>
            <p className={cn(qbUi.sectionHint, "mb-3 px-0.5")}>Number of Questions</p>
            {countOptions.length === 0 ? (
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
              <p className={cn(qbUi.sectionHint, "mb-2 px-0.5")}>Selection style</p>
              <div className="grid gap-2 sm:grid-cols-3">
                {STYLE_OPTIONS.map((option) => {
                  const disabledMixed =
                    isMixedSubjectId(subjectId) && option.id !== "standard";
                  const disabledArea = Boolean(activeArea) && option.id !== "standard";
                  const disabledFormat = formatMode && option.id !== "standard";
                  const disabled = disabledMixed || disabledArea || disabledFormat;
                  const active = bankStyle === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      disabled={disabled}
                      onClick={() => onBankStyleChange(option.id)}
                      className={cn(
                        qbUi.optionCard,
                        active && qbUi.optionCardActive,
                        disabled && "cursor-not-allowed opacity-45"
                      )}
                    >
                      <p className="text-[13px] font-semibold text-[var(--color-ink)]">
                        {option.label}
                      </p>
                      <p className={cn(qbUi.sectionHint, "mt-0.5")}>
                        {disabledFormat
                          ? "Available on All questions"
                          : disabledArea
                            ? "Pick one topic for this mode"
                            : disabledMixed
                              ? "Pick a single topic for this mode"
                              : option.hint}
                      </p>
                    </button>
                  );
                })}
              </div>
              {bankStyle === "review_incorrect" ? (
                <p className="mt-3 max-w-2xl px-0.5 text-[14px] leading-relaxed text-[var(--color-ink-muted)]">
                  {REMEDIATION_MASTERY_RULE}
                </p>
              ) : null}
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
            <p className={cn(qbUi.sectionHint, "mt-2 px-0.5")}>
              {pace === "timed"
                ? "Per-question timer to simulate exam pressure."
                : "No clock — review rationales at your own speed."}
            </p>
          </div>
        </div>
      </QuestionBankSection>
    </div>
  );
}
