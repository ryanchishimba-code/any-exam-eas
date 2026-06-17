/**
 * Unified practice modes — reflects 2015–2026 exam prep best practices.
 * Quick practice, full simulator, adaptive, topic review, test day.
 */
import type { ExamFieldId } from "./types";
import { examSlugFromFieldId } from "@/lib/edtech/exams";
import { fullExamLaunchHref } from "@/lib/full-exam/config";
import { ROUTES } from "@/lib/routes";

const bankUrl = (fieldId: string, extra?: Record<string, string>) => {
  const qs = new URLSearchParams({ field: fieldId, ...extra });
  return `${ROUTES.questionBank}?${qs.toString()}`;
};

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
  href: (fieldId: ExamFieldId) => string;
  timing: string;
  bestFor: string;
};

export const PRACTICE_MODES: PracticeModeDefinition[] = [
  {
    id: "quick",
    label: "Quick Practice",
    description: "10–25 questions on a focused topic. Ideal for daily warm-up and weak-area drills.",
    icon: "zap",
    href: (fieldId) => bankUrl(fieldId, { count: "15", style: "standard" }),
    timing: "15–20 min",
    bestFor: "Busy days, targeted review",
  },
  {
    id: "simulator",
    label: "Full Simulator",
    description:
      "Board-length timed exam with mixed topics — mirrors real USMLE, NAPLEX, NCLEX, or PANCE format.",
    icon: "clock",
    href: (fieldId) =>
      examSlugFromFieldId(fieldId)
        ? fullExamLaunchHref(examSlugFromFieldId(fieldId)!, { mode: "full", autostart: true })
        : ROUTES.fullExam,
    timing: "2–3 hours",
    bestFor: "Endurance and exam-day readiness",
  },
  {
    id: "adaptive",
    label: "Adaptive practice",
    description: "Prioritizes weak topics from your attempt history with spaced review.",
    icon: "brain",
    href: (fieldId) => bankUrl(fieldId, { style: "adaptive", count: "25" }),
    timing: "20–40 min",
    bestFor: "Targeted review of missed topics",
  },
  {
    id: "topic",
    label: "Topic Review",
    description: "Pick a blueprint domain or subject — med-surg, pharmacotherapy, primary care, etc.",
    icon: "book",
    href: (fieldId) => bankUrl(fieldId),
    timing: "Flexible",
    bestFor: "First-pass learning and remediation",
  },
  {
    id: "test_day",
    label: "Test Day",
    description: "Strict timing, no explanations until end, distraction-free UI — closest to real exam conditions.",
    icon: "flag",
    href: (fieldId) =>
      examSlugFromFieldId(fieldId)
        ? fullExamLaunchHref(examSlugFromFieldId(fieldId)!, { mode: "full", autostart: true })
        : ROUTES.fullExam,
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
    id: "usmle-step-2",
    label: "USMLE",
    fieldParam: "usmle-step-2",
    description: "Clinical vignettes — sequential item sets, next-best-step management, and biostats.",
    timing: "280 questions · ~9 hours",
    format: "Vignettes · sequential sets",
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
    id: "pance",
    label: "PANCE",
    fieldParam: "pance",
    description:
      "NCCPA blueprint — 15 content categories with clinical vignettes and systems-based reasoning.",
    timing: "300 questions · 5 hours",
    format: "Clinical MCQ vignettes",
  },
  {
    id: "aanp-fnp",
    label: "AANP FNP",
    fieldParam: "aanp-fnp",
    description:
      "AANPCB blueprint primary care — Assess, Diagnose, Plan, Evaluate across the lifespan.",
    timing: "135 questions · 3.5 hours",
    format: "Clinical vignette MCQs",
  },
  {
    id: "npte-pt",
    label: "NPTE-PT",
    fieldParam: "npte-pt",
    description:
      "FSBPT blueprint — MSK, neuromuscular, cardiopulmonary, modalities, and safety.",
    timing: "250 questions · 5 hours",
    format: "Clinical scenario MCQs",
  },
];

export function getPracticeMode(id: PracticeModeId): PracticeModeDefinition | undefined {
  return PRACTICE_MODES.find((m) => m.id === id);
}

/** Map URL params from a practice launch link back to a hub mode. */
export function resolvePracticeModeFromParams(params: {
  practiceMode?: string | null;
  mode?: string | null;
  style?: string | null;
  count?: string | null;
}): PracticeModeId {
  const explicit = params.practiceMode;
  if (explicit && PRACTICE_MODES.some((m) => m.id === explicit)) {
    return explicit as PracticeModeId;
  }
  if (params.mode === "timed") return "simulator";
  if (params.style === "adaptive" || params.style === "weak_areas") return "adaptive";
  if (params.count === "15") return "quick";
  return "topic";
}

/** Build a launch URL on the given base path with autostart. */
export function practiceModeLaunchHref(
  fieldId: ExamFieldId,
  modeId: PracticeModeId,
  basePath: string
): string {
  const mode = getPracticeMode(modeId);
  if (!mode) return basePath;

  if (modeId === "simulator" || modeId === "test_day") {
    const slug = examSlugFromFieldId(fieldId);
    if (slug) return fullExamLaunchHref(slug, { mode: "full", autostart: true });
  }

  const raw = mode.href(fieldId);
  const qs = raw.includes("?") ? raw.slice(raw.indexOf("?") + 1) : "";
  const params = new URLSearchParams(qs);
  params.set("autostart", "1");
  params.set("practiceMode", modeId);
  return `${basePath}?${params.toString()}`;
}
