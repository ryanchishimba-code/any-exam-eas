/**
 * Unified practice modes — reflects 2015–2026 exam prep best practices.
 * Quick practice, full simulator, adaptive, topic review, test day.
 */
import type { ExamFieldId } from "./types";
import { mpjePracticeExamHref } from "@/lib/study-hub/config";

export type PracticeModeId =
  | "quick"
  | "simulator"
  | "adaptive"
  | "topic"
  | "test_day";

export type PracticeModeDefinition = {
  id: PracticeModeId;
  label: string;
  description: string;
  icon: string;
  /** Study practice URL param or special route */
  href: (fieldId: ExamFieldId, opts?: { stateCode?: string }) => string;
  timing: string;
  bestFor: string;
};

const BASE = (fieldId: string, mode: string, extra?: Record<string, string>) => {
  const qs = new URLSearchParams({ field: fieldId, mode, ...extra });
  return `/study/practice?${qs.toString()}`;
};

export const PRACTICE_MODES: PracticeModeDefinition[] = [
  {
    id: "quick",
    label: "Quick Practice",
    description: "10–25 questions on a focused topic. Ideal for daily warm-up and weak-area drills.",
    icon: "zap",
    href: (fieldId) => BASE(fieldId, "bank", { count: "15", style: "adaptive" }),
    timing: "15–20 min",
    bestFor: "Busy days, targeted review",
  },
  {
    id: "simulator",
    label: "Full Simulator",
    description: "Board-length timed exam with mixed topics — mirrors real USMLE, NAPLEX, NCLEX, or MPJE format.",
    icon: "clock",
    href: (fieldId, opts) =>
      fieldId === "mpje" && opts?.stateCode
        ? mpjePracticeExamHref(opts.stateCode)
        : BASE(fieldId, "timed"),
    timing: "2–2.5 hours",
    bestFor: "Endurance and exam-day readiness",
  },
  {
    id: "adaptive",
    label: "Adaptive AI",
    description: "Engine targets your weak areas with clinical-judgment items and spaced repetition.",
    icon: "brain",
    href: (fieldId) => BASE(fieldId, "bank", { style: "adaptive", count: "25" }),
    timing: "20–40 min",
    bestFor: "Improving pass probability efficiently",
  },
  {
    id: "topic",
    label: "Topic Review",
    description: "Pick a blueprint domain or subject — controlled-substances, med-surg, pharmacotherapy, etc.",
    icon: "book",
    href: (fieldId) => BASE(fieldId, "bank"),
    timing: "Flexible",
    bestFor: "First-pass learning and remediation",
  },
  {
    id: "test_day",
    label: "Test Day",
    description: "Strict timing, no explanations until end, distraction-free UI — closest to real exam conditions.",
    icon: "flag",
    href: (fieldId, opts) =>
      fieldId === "mpje" && opts?.stateCode
        ? mpjePracticeExamHref(opts.stateCode)
        : BASE(fieldId, "timed"),
    timing: "Full exam block",
    bestFor: "Final-week confidence check",
  },
];

export const EXAM_FIELD_OPTIONS: {
  id: ExamFieldId;
  label: string;
  fieldParam: string;
  description: string;
  timing: string;
  format: string;
}[] = [
  {
    id: "nursing",
    label: "NCLEX",
    fieldParam: "nursing",
    description: "NCLEX-NGN clinical judgment — bow-tie, matrix, case studies, prioritization.",
    timing: "85–150 questions · adaptive",
    format: "NGN + traditional items",
  },
  {
    id: "usmle-step-1",
    label: "USMLE",
    fieldParam: "usmle-step-1",
    description: "Vignette-heavy Step 1/2 reasoning — mechanisms, ethics, integrated sciences.",
    timing: "2026 shorter blocks · ~40 Q/block",
    format: "Clinical vignettes",
  },
  {
    id: "pharmacy",
    label: "NAPLEX",
    fieldParam: "pharmacy",
    description: "NAPLEX 2025 blueprint — 5 domains, calculations, treatment planning, safety.",
    timing: "225 questions · 6 hours",
    format: "Clinical scenarios + calculations",
  },
  {
    id: "mpje",
    label: "MPJE",
    fieldParam: "mpje",
    description: "State-specific + federal/UMPJE — controlled substances, dispensing, licensure, operations.",
    timing: "120 questions · 2.5 hours",
    format: "MCQ jurisprudence",
  },
];

export function getPracticeMode(id: PracticeModeId): PracticeModeDefinition | undefined {
  return PRACTICE_MODES.find((m) => m.id === id);
}
