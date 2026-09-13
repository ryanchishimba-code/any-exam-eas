/** Canonical marketing stats for SEO copy — keep in sync with bank-stats floors. */
import {
  FALLBACK_QUESTION_COUNTS,
  PUBLISHED_QUESTION_BANK_TOTAL,
  TOP_500_DRUGS_COUNT,
  DRUGS_DECK_MARKETING_TITLE,
} from "@/lib/marketing/bank-stats";

export const SEO_LIVE_STATS = {
  questionCount: FALLBACK_QUESTION_COUNTS.total,
  questionCountRaw: PUBLISHED_QUESTION_BANK_TOTAL,
  topDrugsCount: TOP_500_DRUGS_COUNT,
  topDrugsLabel: DRUGS_DECK_MARKETING_TITLE,
  clinicianYears: "12+",
  trialDays: 5,
  /** Support window for quality issues — not a money-back refund. */
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

/** Homepage H1 — default NCLEX job; six-board system lives in the subhead. */
export const SEO_HOME_H1 = "NCLEX prep that feels like the real exam.";
export const SEO_HOME_H1_ACCENT = "";

/** Homepage subline template; inject live question total when available. */
export function seoHomeHeroSubline(totalLabel?: string): string {
  const count = totalLabel?.trim() || SEO_LIVE_STATS.questionCount;
  return `${count} questions across six boards — NCLEX, USMLE, NAPLEX, PANCE, AANP FNP, and NPTE-PT — with Blueprint Roadmaps and full-length mocks.`;
}
