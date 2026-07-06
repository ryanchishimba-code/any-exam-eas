/** Canonical marketing stats for SEO copy — update when live counts change. */
export const SEO_LIVE_STATS = {
  questionCount: "37,558",
  questionCountRaw: 37558,
  topDrugsCount: 509,
  topDrugsLabel: "Top 509 Drugs",
  clinicianYears: "12+",
  trialDays: 3,
  moneyBackDays: 30,
} as const;

export const SEO_VALUE_PROPS = {
  aiTutor: "AI Tutor with rationale coaching on missed items",
  spacedRepetition: "Spaced Repetition for weak topics and memory cards",
  adaptiveRoadmap: "Adaptive Blueprint Roadmaps tied to each licensing exam",
  qaGated: "QA-gated, clinician-built question bank",
  multiExam: "NCLEX, USMLE, NAPLEX, PANCE, AANP FNP & NPTE-PT in one subscription",
} as const;

/** High-intent keywords clustered for metadata helpers. */
export const SEO_KEYWORD_CLUSTERS = {
  nclex: [
    "NCLEX prep 2026",
    "NCLEX practice questions",
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
    "USMLE practice questions",
    "USMLE Step 2 CK Qbank",
    "UWorld USMLE alternative",
    "Step 1 practice questions 2026",
  ],
  multiExam: [
    "best value multi-exam prep",
    "UWorld alternative",
    "adaptive roadmap board prep",
    "AI tutor board prep 2026",
  ],
} as const;

export function seoQuestionBankPhrase(totalLabel?: string): string {
  const count = totalLabel?.trim() || SEO_LIVE_STATS.questionCount;
  return `${count} QA-gated practice questions`;
}

export function seoPlatformPitch(totalLabel?: string): string {
  return `${seoQuestionBankPhrase(totalLabel)}, ${SEO_LIVE_STATS.topDrugsLabel}, AI Tutor, adaptive Blueprint Roadmaps, and Spaced Repetition — built by licensed clinicians (${SEO_LIVE_STATS.clinicianYears} years combined).`;
}

/** Homepage H1 — keyword-led, visible content for Google and users. */
export const SEO_HOME_H1 = "NCLEX, USMLE & NAPLEX Prep";
export const SEO_HOME_H1_ACCENT = "One Plan. Best Value.";

/** Homepage subline template; inject live question total when available. */
export function seoHomeHeroSubline(totalLabel?: string): string {
  const count = totalLabel?.trim() || SEO_LIVE_STATS.questionCount;
  return `${count} QA-gated questions, ${SEO_LIVE_STATS.topDrugsLabel}, AI Tutor, adaptive Blueprint Roadmaps, and Spaced Repetition — clinician-built (${SEO_LIVE_STATS.clinicianYears} years). A UWorld alternative for multi-exam prep.`;
}
