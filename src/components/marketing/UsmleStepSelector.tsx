"use client";

/**
 * UsmleStepSelector — Apple-style segmented control for Step 1 / Step 2 CK / Step 3.
 *
 * Fetches live per-step question counts from /api/exams/usmle on mount.
 * Animated content panel below updates as the user switches steps.
 */

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { USMLE_STEPS } from "@/lib/exam-prep/usmle/steps";
import { EXAM_ACCENTS } from "@/lib/landing/tokens";
import { landingTrialHrefForExam } from "@/lib/landing/content";
import { formatTrialCtaLabel } from "@/lib/site";
import { cn } from "@/lib/utils";

type StepOption = {
  fieldId: string;
  questionCount: number;
};

type ApiResponse = {
  options?: StepOption[];
};

const ACCENT = EXAM_ACCENTS.usmle; // #3B9EFF

const STEP_CONTENT: Record<
  string,
  { features: string[]; studyContext: string; practiceTypes: string }
> = {
  "usmle-step-1": {
    features: [
      "Anatomy, physiology & biochemistry",
      "Pathology and microbiology vignettes",
      "Integrated basic science question blocks",
      "Step 1 blueprint-aligned Roadmap",
    ],
    studyContext: "Pre-clinical years · systems-based review",
    practiceTypes: "Organ system vignettes · mechanism-of-action questions",
  },
  "usmle-step-2": {
    features: [
      "Clinical diagnosis & next-best-step management",
      "Internal medicine, surgery, OB/GYN, psychiatry",
      "Sequential item sets and biostats review",
      "Step 2 CK blueprint-aligned Roadmap",
    ],
    studyContext: "Clerkship years · residency applications",
    practiceTypes: "Clinical vignettes · diagnostic reasoning · prioritization",
  },
  "usmle-step-3": {
    features: [
      "Biostatistics, ethics & abstract interpretation",
      "Drug advertisement & pharmaceutical ad analysis",
      "CCS-style management case prompts",
      "Step 3 blueprint-aligned Roadmap",
    ],
    studyContext: "Post-residency match · GME transition",
    practiceTypes: "Day 1 MCQs · CCS management scenarios",
  },
};

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K+`;
  return `${n}+`;
}

export function UsmleStepSelector() {
  const [activeStep, setActiveStep] = useState("usmle-step-2");
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/exams/usmle")
      .then((r) => r.json())
      .then((data: ApiResponse) => {
        const map: Record<string, number> = {};
        for (const opt of data.options ?? []) {
          if (opt.questionCount > 0) map[opt.fieldId] = opt.questionCount;
        }
        setCounts(map);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const step = USMLE_STEPS.find((s) => s.fieldId === activeStep) ?? USMLE_STEPS[1]!;
  const count = counts[activeStep] ?? 0;
  const countLabel = loaded && count > 0 ? `${formatCount(count)} questions` : null;
  const content =
    STEP_CONTENT[activeStep] ?? STEP_CONTENT["usmle-step-2"]!;

  return (
    <div className="w-full">
      {/* ── Segmented control ────────────────────────────────────────── */}
      <div
        className="inline-flex rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] p-1"
        role="tablist"
        aria-label="Select USMLE step"
      >
        {USMLE_STEPS.map((s) => {
          const isActive = s.fieldId === activeStep;
          return (
            <button
              key={s.fieldId}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveStep(s.fieldId)}
              className={cn(
                "relative z-10 rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]",
                isActive
                  ? "text-white"
                  : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]",
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="usmle-step-pill"
                  className="absolute inset-0 rounded-full"
                  style={{ background: ACCENT }}
                  transition={{ type: "spring", bounce: 0.15, duration: 0.35 }}
                />
              )}
              <span className="relative">{s.shortName}</span>
            </button>
          );
        })}
      </div>

      {/* ── Content panel ─────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)]"
          style={{ boxShadow: "0 2px 14px rgba(0,0,0,0.06)" }}
        >
          {/* Accent bar */}
          <div
            className="h-[3px] w-full"
            style={{
              background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT}45)`,
            }}
            aria-hidden
          />

          <div className="p-5 sm:p-6">
            {/* Header row */}
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3
                  className="text-base font-bold sm:text-lg"
                  style={{ color: ACCENT }}
                >
                  {step.name}
                </h3>
                <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
                  {step.description}
                </p>
                <p className="mt-0.5 text-xs text-[var(--color-ink-muted)] opacity-70">
                  {content.studyContext}
                </p>
              </div>
              {countLabel ? (
                <span
                  className="shrink-0 self-start rounded-full px-3 py-1 text-xs font-bold"
                  style={{ background: `${ACCENT}18`, color: ACCENT }}
                >
                  {countLabel}
                </span>
              ) : null}
            </div>

            {/* Feature bullets */}
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {content.features.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2 text-sm text-[var(--color-ink-muted)]"
                >
                  <Check
                    className="mt-0.5 h-3.5 w-3.5 shrink-0"
                    style={{ color: ACCENT }}
                    strokeWidth={2.5}
                    aria-hidden
                  />
                  {f}
                </li>
              ))}
            </ul>

            <p className="mt-3 text-xs text-[var(--color-ink-muted)] opacity-60 italic">
              {content.practiceTypes}
            </p>

            {/* CTAs */}
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href={`/question-bank?field=${step.fieldId}`}
                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 active:scale-95"
                style={{ background: ACCENT }}
              >
                Study {step.shortName}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href={landingTrialHrefForExam("usmle")}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-ink-muted)] transition-colors hover:text-[var(--color-ink)]"
              >
                {formatTrialCtaLabel()}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
