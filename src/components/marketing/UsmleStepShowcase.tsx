"use client";

/**
 * UsmleStepShowcase — iOS-style wheel + segmented-control hybrid for choosing a
 * USMLE step on the marketing page. Mirrors the landing "Pick your board" wheel
 * for visual consistency.
 *
 * Renders instantly from static step metadata, then overlays LIVE per-step
 * question counts fetched from /api/exams/usmle. Selecting a step (via the wheel
 * or the segmented control) updates the summary card and step-tailored focus list.
 */

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight, Check, Clock, Layers, Target } from "lucide-react";
import { BoardScrollPicker, type BoardPickerItem } from "@/components/marketing/BoardScrollPicker";
import { USMLE_STEPS } from "@/lib/exam-prep/usmle/steps";
import {
  USMLE_EXAM_TYPE_LABEL,
  USMLE_EXAM_TYPE_TAGLINE,
  type ExamDifficulty,
} from "@/lib/exam-prep/usmle/exam-options";
import { EXAM_ACCENTS } from "@/lib/landing/tokens";
import { formatMarketingQuestionCount } from "@/lib/marketing/bank-stats";
import { LANDING_TRIAL_HREF } from "@/lib/landing/content";
import type { UsmleStepLevel } from "@/lib/exam-prep/usmle/types";

const ACCENT = EXAM_ACCENTS.usmle;

const STEP_DIFFICULTY: Record<UsmleStepLevel, ExamDifficulty> = {
  step1: "Foundational",
  step2: "Clinical",
  step3: "Advanced",
};

const STEP_FOCUS: Record<UsmleStepLevel, string[]> = {
  step1: [
    "Mechanisms, pathology & pharmacology",
    "Biochemistry and immunology high-yield",
    "First-order reasoning vignettes",
  ],
  step2: [
    "Next-best-step clinical management",
    "Diagnosis & workup across specialties",
    "Screening, ethics & patient safety",
  ],
  step3: [
    "Biostatistics & abstract interpretation",
    "CCS-style case management",
    "Day 1 foundations + Day 2 advanced MCQs",
  ],
};

type ShowcaseStep = {
  level: UsmleStepLevel;
  fieldId: string;
  name: string;
  shortName: string;
  examTypeLabel: string;
  tagline: string;
  description: string;
  simulatedQuestionCount: number;
  difficulty: ExamDifficulty;
  questionCount: number;
};

const SCAFFOLD: ShowcaseStep[] = USMLE_STEPS.map((step) => ({
  level: step.level,
  fieldId: step.fieldId,
  name: step.name,
  shortName: step.shortName,
  examTypeLabel: USMLE_EXAM_TYPE_LABEL[step.level],
  tagline: USMLE_EXAM_TYPE_TAGLINE[step.level],
  description: step.description,
  simulatedQuestionCount: step.simulatedQuestionCount,
  difficulty: STEP_DIFFICULTY[step.level],
  questionCount: 0,
}));

type ApiOption = { fieldId?: string; level?: string; questionCount?: number };
type ApiResponse = { options?: ApiOption[] };

export function UsmleStepShowcase() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loaded, setLoaded] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<UsmleStepLevel>("step2");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/exams/usmle")
      .then((r) => r.json())
      .then((data: ApiResponse) => {
        if (cancelled) return;
        const map: Record<string, number> = {};
        for (const opt of data.options ?? []) {
          if (opt.level && typeof opt.questionCount === "number") {
            map[opt.level] = opt.questionCount;
          }
        }
        setCounts(map);
        setLoaded(true);
      })
      .catch(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const steps = useMemo(
    () => SCAFFOLD.map((s) => ({ ...s, questionCount: counts[s.level] ?? 0 })),
    [counts]
  );

  const countLabel = (count: number) =>
    loaded && count > 0 ? formatMarketingQuestionCount(count) : "—";

  const pickerItems: BoardPickerItem[] = steps.map((step) => ({
    id: step.level,
    name: step.examTypeLabel,
    description: step.tagline,
    count: countLabel(step.questionCount),
    accent: ACCENT,
  }));

  const selected = steps.find((s) => s.level === selectedLevel) ?? steps[1];
  const focus = STEP_FOCUS[selected.level] ?? [];

  return (
    <section
      id="choose-step"
      className="aee-pick-board scroll-mt-24"
      aria-labelledby="choose-step-heading"
      style={{ background: "transparent", paddingBlock: "0" }}
    >
      <header className="mx-auto max-w-2xl">
        <p className="text-[10px] font-extrabold uppercase tracking-widest" style={{ color: ACCENT }}>
          Choose your step
        </p>
        <h2
          id="choose-step-heading"
          className="mt-1 text-xl font-bold text-[var(--color-ink)] sm:text-2xl"
        >
          Step 1, Step 2 CK &amp; Step 3 — all on one plan
        </h2>
        <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
          Spin to a step for its live question count and what you&rsquo;ll focus on.
        </p>
      </header>

      {/* Segmented control mirrors the wheel for fast, obvious switching. */}
      <div
        className="aee-step-segments mt-6"
        role="tablist"
        aria-label="USMLE step quick select"
        style={{ ["--summary-accent" as string]: ACCENT } as CSSProperties}
      >
        {steps.map((step) => (
          <button
            key={step.level}
            type="button"
            role="tab"
            aria-selected={step.level === selectedLevel}
            data-active={step.level === selectedLevel}
            className="aee-step-segments__btn"
            onClick={() => setSelectedLevel(step.level)}
          >
            {step.examTypeLabel}
          </button>
        ))}
      </div>

      <div className="aee-pick-board__layout">
        <BoardScrollPicker
          items={pickerItems}
          selectedId={selectedLevel}
          onSelect={(id) => setSelectedLevel(id as UsmleStepLevel)}
          ariaLabel="Choose a USMLE step"
        />

        <div
          className="aee-pick-board__summary"
          style={{ ["--summary-accent" as string]: ACCENT } as CSSProperties}
        >
          <span className="aee-pick-board__summary-bar" aria-hidden />
          <span className="aee-pick-board__summary-icon">
            <Target className="h-6 w-6" strokeWidth={1.75} aria-hidden />
          </span>

          <h3 className="aee-pick-board__summary-title">{selected.name}</h3>
          <p className="aee-pick-board__summary-desc">{selected.description}</p>

          <div className="aee-pick-board__summary-stats">
            <span className="aee-pick-board__stat">
              <span className="aee-pick-board__stat-value">{countLabel(selected.questionCount)}</span>
              <span className="aee-pick-board__stat-label">live questions</span>
            </span>
            <span className="aee-pick-board__stat">
              <Clock className="h-3.5 w-3.5 opacity-60" aria-hidden />
              <span className="aee-pick-board__stat-value">{selected.simulatedQuestionCount}Q</span>
              <span className="aee-pick-board__stat-label">full sim</span>
            </span>
            <span className="aee-pick-board__stat">
              <Layers className="h-3.5 w-3.5 opacity-60" aria-hidden />
              <span className="aee-pick-board__stat-value">{selected.difficulty}</span>
            </span>
          </div>

          <ul className="aee-step-focus" aria-label={`${selected.name} focus areas`}>
            {focus.map((item) => (
              <li key={item} className="aee-step-focus__item">
                <Check className="h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden />
                {item}
              </li>
            ))}
          </ul>

          <Link href={LANDING_TRIAL_HREF} className="aee-pick-board__summary-cta group">
            Start {selected.shortName} prep
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
