import type { ExamSlug } from "@/types/edtech";
import { EXAM_ACCENTS } from "@/lib/landing/tokens";
import { SAMPLE_QUESTION_PREVIEWS } from "@/lib/landing/content";

export type LandingMcqSample = {
  examSlug: ExamSlug;
  examLabel: string;
  examColor: string;
  stem: string;
  options: string[];
  correct: string;
  rationale: string;
};

const BY_LABEL: Record<string, ExamSlug> = {
  "NCLEX-RN": "nclex",
  "USMLE Step 2 CK": "usmle",
  "AANP FNP": "aanp-fnp",
  NAPLEX: "naplex",
  PANCE: "pance",
  "NPTE-PT": "npte-pt",
};

/** Interactive MCQ pack for non-NGN boards (from curated landing previews). */
export const LANDING_MCQ_SAMPLES: LandingMcqSample[] = SAMPLE_QUESTION_PREVIEWS.map(
  (q) => {
    const examSlug = BY_LABEL[q.exam] ?? "nclex";
    return {
      examSlug,
      examLabel: q.exam,
      examColor: q.examColor,
      stem: q.stem,
      options: q.options,
      correct: q.correct,
      rationale: q.rationale,
    };
  }
);

export function getLandingMcqSample(examSlug: ExamSlug): LandingMcqSample {
  return (
    LANDING_MCQ_SAMPLES.find((s) => s.examSlug === examSlug) ??
    LANDING_MCQ_SAMPLES[0]!
  );
}

export function examAccent(examSlug: ExamSlug): string {
  const map: Record<string, string> = {
    nclex: EXAM_ACCENTS.nclex,
    usmle: EXAM_ACCENTS.usmle,
    naplex: EXAM_ACCENTS.naplex,
    pance: EXAM_ACCENTS.pance,
    "aanp-fnp": EXAM_ACCENTS.aanpFnp,
    "npte-pt": EXAM_ACCENTS.nptePt,
  };
  return map[examSlug] ?? EXAM_ACCENTS.nclex;
}
