/** Canonical marketing stats for SEO copy — keep in sync with bank-stats floors. */
import {
  FALLBACK_QUESTION_COUNTS,
  PUBLISHED_QUESTION_BANK_TOTAL,
} from "@/lib/marketing/bank-stats";

export const SEO_LIVE_STATS = {
  questionCount: FALLBACK_QUESTION_COUNTS.total,
  questionCountRaw: PUBLISHED_QUESTION_BANK_TOTAL,
  topDrugsCount: 509,
  topDrugsLabel: "Top 500 Drugs",
  clinicianYears: "12+",
  trialDays: 5,
  moneyBackDays: 30,
} as const;

export const SEO_VALUE_PROPS = {
  deepDives: "Deep Dive review modules opened from missed questions",
  fullExam: "Timed Full Exam simulations with weak-area focus",
  adaptiveRoadmap: "Adaptive Blueprint Roadmaps tied to each licensing exam",
  qaGated: "QA-gated, clinician-built question bank",
  multiExam: "NCLEX, USMLE, NAPLEX, PANCE, AANP FNP & NPTE-PT in one subscription",
  /** Honest content claim — formats + rationales, not UWorld parity or pass rates. */
  ngnAndRationales:
    "NGN formats on NCLEX and teachable rationales across NCLEX/NAPLEX — not a UWorld clone claim",
} as const;

/** High-intent keywords clustered for metadata helpers. */
export const SEO_KEYWORD_CLUSTERS = {
  nclex: [
    "NCLEX question bank",
    "NCLEX practice questions",
    "NCLEX prep 2026",
    "NGN NCLEX questions",
    "UWorld NCLEX alternative",
    "best NCLEX Qbank",
  ],
  naplex: [
    "NAPLEX Qbank",
    "NAPLEX practice questions 2026",
    "NAPLEX calculations prep",
    "best NAPLEX review",
  ],
  usmle: [
    "USMLE question bank",
    "USMLE practice questions",
    "USMLE Step 2 CK Qbank",
    "UWorld USMLE alternative",
    "Step 1 practice questions 2026",
  ],
  multiExam: [
    "one subscription six exams",
    "best value multi-exam prep",
    "UWorld alternative",
    "blueprint roadmap board prep",
    "multi-exam board prep 2026",
  ],
} as const;

export function seoQuestionBankPhrase(totalLabel?: string): string {
  const count = totalLabel?.trim() || SEO_LIVE_STATS.questionCount;
  return `${count} QA-gated practice questions`;
}

export function seoPlatformPitch(totalLabel?: string): string {
  return `${seoQuestionBankPhrase(totalLabel)}, adaptive Blueprint Roadmaps, Deep Dive modules, and Full Exam simulations — built by licensed clinicians (${SEO_LIVE_STATS.clinicianYears} years combined).`;
}

/** Homepage H1 — six-board system promise (not a single-exam pitch). */
export const SEO_HOME_H1 = "One study system. Six boards.";
export const SEO_HOME_H1_ACCENT = "";

/** Homepage subline template; inject live question total when available. */
export function seoHomeHeroSubline(totalLabel?: string): string {
  const count = totalLabel?.trim() || SEO_LIVE_STATS.questionCount;
  return `${count} QA-gated questions, Blueprint Roadmaps, and full-length mocks for USMLE, NCLEX, NAPLEX, PANCE, AANP FNP, and NPTE-PT — clinician-built, not bulk filler.`;
}
