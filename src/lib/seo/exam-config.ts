import { formatPlanUsd } from "@/lib/billing-plans";
import { EXAM_ACCENTS } from "@/lib/landing/tokens";
import { TIER_MONTHLY_USD } from "@/lib/subscription-tiers";
import type { ExamRouteSlug } from "@/lib/routes";
import {
  SEO_TRIAL_META_SUFFIX,
  SEO_TRIAL_META_WITH_BOARDS,
  seoTrialIncludedFaq,
  seoTrialLengthFaq,
  seoTrialNaplexStudyTip,
  seoTrialTryBeforePayFaq,
} from "@/lib/seo/trial-copy";
import { SEO_LIVE_STATS, seoPlatformPitch } from "@/lib/seo/seo-copy";

export type ExamSeoKey = ExamRouteSlug;

/** URL slug → canonical exam key (e.g. /npte → npte-pt). */
export const EXAM_SEO_SLUG_ALIASES: Record<string, ExamSeoKey> = {
  npte: "npte-pt",
};

export const EXAM_SEO_KEYS: ExamSeoKey[] = [
  "nclex",
  "usmle",
  "naplex",
  "pance",
  "aanp-fnp",
  "npte-pt",
];

export function resolveExamSeoKey(slug: string): ExamSeoKey | undefined {
  const normalized = slug.toLowerCase();
  if (EXAM_SEO_KEYS.includes(normalized as ExamSeoKey)) {
    return normalized as ExamSeoKey;
  }
  return EXAM_SEO_SLUG_ALIASES[normalized];
}

/** Public marketing URL for an exam (keyword-rich short path). */
export function examMarketingPath(key: ExamSeoKey): string {
  return `/${key}`;
}

export type ExamSeoConfig = {
  key: ExamSeoKey;
  displayName: string;
  shortName: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  h1: string;
  heroSubline: string;
  accentColor: string;
  blueprintLabel: string;
  features: { title: string; detail: string }[];
  studyTips: { heading: string; body: string }[];
  faqs: { question: string; answer: string }[];
  relatedResourceSlugs: string[];
};

export const EXAM_SEO_CONFIG: Record<ExamSeoKey, ExamSeoConfig> = {
  nclex: {
    key: "nclex",
    displayName: "NCLEX-RN",
    shortName: "NCLEX",
    metaTitle: "NCLEX Prep 2026 — Qbank, NGN Questions & Adaptive Roadmap",
    metaDescription:
      `${SEO_LIVE_STATS.questionCount} NCLEX-RN practice questions with NGN formats (SATA, bow-tie, matrix), AI Tutor, adaptive Blueprint Roadmap, and Spaced Repetition. Clinician-built, QA-gated. ${SEO_LIVE_STATS.trialDays}-day free trial · UWorld alternative on one multi-exam plan. ${SEO_TRIAL_META_WITH_BOARDS}.`,
    keywords: [
      "NCLEX prep 2026",
      "NCLEX practice questions",
      "NCLEX Qbank",
      "NCLEX study guide",
      "NCLEX-RN review",
      "free NCLEX practice questions",
      "how to pass NCLEX first try",
      "NGN NCLEX questions",
      "NCLEX question bank",
      "UWorld NCLEX alternative",
      "best NCLEX Qbank 2026",
      "AI tutor NCLEX prep",
      "AnyExamEasy NCLEX",
    ],
    h1: "NCLEX Board Prep 2026 — Practice Questions & Clinical Judgment",
    heroSubline:
      "High-yield NCLEX-RN vignettes, Next Generation NCLEX (NGN) item types, and a blueprint-aligned Roadmap — included in one affordable subscription with five other board exams.",
    accentColor: EXAM_ACCENTS.nclex,
    blueprintLabel: "NCSBN Clinical Judgment Measurement Model",
    features: [
      {
        title: "NGN-ready question formats",
        detail: "SATA, bow-tie, matrix, and unfolding case items that mirror current NCLEX delivery.",
      },
      {
        title: "NCLEX Exam Roadmap",
        detail: "Track readiness across Client Needs categories and focus weak areas before test day.",
      },
      {
        title: "Deep Dive review modules",
        detail: "Open eight-section lessons from missed questions — sepsis, heart failure, delegation, and more.",
      },
    ],
    studyTips: [
      {
        heading: "How to pass NCLEX on your first attempt",
        body: "Use daily timed sets, review rationales for every miss, and follow your Roadmap weak-area queue instead of random churning through questions.",
      },
      {
        heading: "Best NCLEX practice questions in 2026",
        body: "Look for clinical judgment stems, plausible distractors, and explanations that teach prioritization — not template-swapped answer choices.",
      },
    ],
    faqs: [
      {
        question: "Does AnyExamEasy include NCLEX NGN question types?",
        answer:
          "Yes. Our NCLEX bank includes select-all-that-apply, bow-tie, matrix, and other NGN-style formats alongside classic single-best-answer vignettes.",
      },
      {
        question: "Can I try NCLEX prep before paying?",
        answer: seoTrialTryBeforePayFaq(),
      },
      {
        question: "Is NCLEX prep included with other board exams?",
        answer:
          "Yes. One subscription covers NCLEX, USMLE, NAPLEX, PANCE, AANP FNP, and NPTE-PT — no separate per-exam checkout.",
      },
    ],
    relatedResourceSlugs: [
      "best-nclex-practice-questions-2026",
      "how-to-pass-nclex-first-try",
      "nclex-study-guide-roadmap",
      "nclex-vs-uworld-comparison-2026",
      "uworld-alternative-multi-exam-prep-2026",
    ],
  },
  usmle: {
    key: "usmle",
    displayName: "USMLE Step 1 · Step 2 CK · Step 3",
    shortName: "USMLE",
    metaTitle: "USMLE Practice Questions 2026 — Step 1, Step 2 CK & Step 3 Qbank",
    metaDescription:
      `USMLE Qbank with Step 1, Step 2 CK & Step 3 vignettes, adaptive Blueprint Roadmaps, AI Tutor, and ${SEO_LIVE_STATS.topDrugsLabel}. ${seoPlatformPitch()} ${SEO_LIVE_STATS.trialDays}-day trial · UWorld alternative. ${SEO_TRIAL_META_SUFFIX}.`,
    keywords: [
      "USMLE practice questions",
      "USMLE Step 1 practice questions",
      "USMLE Step 2 CK practice questions",
      "USMLE Step 3 practice questions",
      "USMLE prep 2026",
      "USMLE question bank",
      "Step 2 CK study guide",
      "how to pass USMLE Step 2",
      "USMLE clinical vignettes",
      "UWorld USMLE alternative",
      "best USMLE Qbank 2026",
      "AI tutor USMLE prep",
      "AnyExamEasy USMLE",
    ],
    h1: "USMLE Step 1, Step 2 CK & Step 3 — all on one plan",
    heroSubline:
      "Dedicated banks for every step — basic sciences, clinical vignettes, biostatistics, and CCS-style cases — with blueprint Roadmaps and Deep Dives on a single subscription.",
    accentColor: EXAM_ACCENTS.usmle,
    blueprintLabel: "USMLE content outline (Step 1 · Step 2 CK · Step 3)",
    features: [
      {
        title: "All three USMLE steps",
        detail:
          "Dedicated banks for Step 1 basic sciences, Step 2 CK clinical management, and Step 3 biostatistics, ethics, abstracts, and CCS-style cases.",
      },
      {
        title: "Step-specific timed blocks",
        detail: "Build stamina with board-length sessions for Step 1, Step 2 CK, or Step 3 Day 1 MCQs.",
      },
      {
        title: "Blueprint Roadmaps per step",
        detail: "Track readiness by official content category — switch between Step 1, 2, and 3 anytime.",
      },
    ],
    studyTips: [
      {
        heading: "Best USMLE practice questions",
        body: "Use step-specific banks — mechanisms and pathology for Step 1, next-best-step vignettes for Step 2 CK, and biostatistics/CCS cases for Step 3.",
      },
      {
        heading: "USMLE study roadmap",
        body: "Follow blueprint-weighted Roadmaps for each step instead of mixing Step 1 biochemistry with Step 3 ethics in one session.",
      },
    ],
    faqs: [
      {
        question: "Does AnyExamEasy cover all USMLE steps?",
        answer:
          "Yes. One subscription includes dedicated Step 1, Step 2 CK, and Step 3 question banks with step-specific Roadmaps and timed practice.",
      },
      {
        question: "How does pricing compare to UWorld?",
        answer:
          `AnyExamEasy Pro is ${formatPlanUsd(TIER_MONTHLY_USD.pro)}/mo and includes all three USMLE steps plus five other board exams — UWorld typically charges $200–400+ per exam separately.`,
      },
      {
        question: "Are USMLE explanations detailed?",
        answer:
          "Every item includes a teachable rationale. Pro includes enhanced goat-mode explanations and Deep Dive modules on missed topics.",
      },
    ],
    relatedResourceSlugs: [
      "best-usmle-step-2-practice-questions-2026",
      "usmle-step-2-study-guide-roadmap",
      "how-to-pass-usmle-step-2-first-try",
      "usmle-step-1-practice-questions-2026",
      "uworld-alternative-multi-exam-prep-2026",
    ],
  },
  naplex: {
    key: "naplex",
    displayName: "NAPLEX",
    shortName: "NAPLEX",
    metaTitle: "NAPLEX Qbank 2026 — Practice Questions, Calculations & Blueprint",
    metaDescription:
      `NAPLEX prep with calculations, patient cases, and pharmacotherapy vignettes. ${SEO_LIVE_STATS.topDrugsLabel}, adaptive Blueprint Roadmap, AI Tutor, and Spaced Repetition. ${SEO_LIVE_STATS.trialDays}-day free trial. ${SEO_TRIAL_META_SUFFIX}.`,
    keywords: [
      "NAPLEX Qbank",
      "NAPLEX review 2026",
      "NAPLEX practice questions",
      "NAPLEX study guide",
      "NAPLEX calculations",
      "how to pass NAPLEX first try",
      "free NAPLEX practice questions",
      "NAPLEX question bank",
      "best NAPLEX review 2026",
      "AnyExamEasy NAPLEX",
    ],
    h1: "NAPLEX Review 2026 — Calculations, Cases & Pharmacotherapy",
    heroSubline:
      "Board-style NAPLEX items with math walkthroughs, patient counseling scenarios, and a pharmacy blueprint Roadmap — bundled with nursing, medical, PA, FNP, and PT prep.",
    accentColor: EXAM_ACCENTS.naplex,
    blueprintLabel: "NABP NAPLEX Content Outline (five domains)",
    features: [
      {
        title: "Calculation & compounding items",
        detail: "Show-your-work style math with dosing, concentrations, and IV flow problems.",
      },
      {
        title: "Patient case vignettes",
        detail: "Drug interactions, monitoring, and therapeutic substitution scenarios.",
      },
      {
        title: "Top 509 Drugs deck",
        detail: "High-yield pharmacology flashcards shared across pharmacy and clinical tracks.",
      },
    ],
    studyTips: [
      {
        heading: "How to pass NAPLEX on the first try",
        body: "Split study time between calculations, brand/generic mastery, and case-based management — use timed mixed sets in the final month.",
      },
      {
        heading: "Free NAPLEX practice questions",
        body: seoTrialNaplexStudyTip(),
      },
    ],
    faqs: [
      {
        question: "Does AnyExamEasy include NAPLEX calculations?",
        answer: "Yes. Our NAPLEX bank emphasizes calculations, compounding, and case-based pharmacotherapy with detailed rationales.",
      },
      {
        question: "Is the Top 503 Drugs deck included?",
        answer: "Yes — high-yield drug flashcards are included on every plan alongside all six board question banks.",
      },
      {
        question: "Can pharmacy students use the Roadmap?",
        answer: "Yes. Each exam has a blueprint-aligned Roadmap showing what to study next based on your practice performance.",
      },
    ],
    relatedResourceSlugs: [
      "best-naplex-practice-questions-2026",
      "how-to-pass-naplex-first-try",
      "naplex-study-guide-blueprint",
      "naplex-calculations-study-guide-2026",
      "uworld-alternative-multi-exam-prep-2026",
    ],
  },
  pance: {
    key: "pance",
    displayName: "PANCE",
    shortName: "PANCE",
    metaTitle: "PANCE Exam Prep 2026 — NCCPA Blueprint Practice Questions",
    metaDescription:
      `PANCE practice questions aligned to the NCCPA blueprint — cardiovascular, pulmonary, GI, MSK, and more. Roadmap, timed exams, Deep Dives. ${SEO_TRIAL_META_SUFFIX}.`,
    keywords: [
      "PANCE exam prep 2026",
      "PANCE practice questions",
      "PANCE study guide",
      "NCCPA blueprint PANCE",
      "how to pass PANCE first try",
      "free PANCE practice questions",
      "PANCE question bank",
      "AnyExamEasy PANCE",
    ],
    h1: "PANCE Exam Prep 2026 — NCCPA Blueprint Vignettes",
    heroSubline:
      "Physician assistant board prep with clinical vignettes, 14 NCCPA knowledge-area Roadmap tracking, task-area practice, and full-length 300-question simulations — one subscription covers six licensing exams.",
    accentColor: EXAM_ACCENTS.pance,
    blueprintLabel: "NCCPA PANCE Content Blueprint (2026)",
    features: [
      {
        title: "14 knowledge-area Roadmap",
        detail: "Track readiness across NCCPA organ-system weights — cardiovascular (13%), pulmonary (10%), and more.",
      },
      {
        title: "Task-area vignette bank",
        detail: "Diagnosis, pharmacotherapy, labs, and health maintenance stems with integrated pharmacology.",
      },
      {
        title: "Timed PANCE simulations",
        detail: "300-question, 5-hour board blocks with pediatrics and women's health mixed in (Pro for unlimited mocks).",
      },
    ],
    studyTips: [
      {
        heading: "PANCE study guide & roadmap",
        body: "Map weekly study to NCCPA knowledge areas — cardiovascular and pulmonary are highest weight; include pediatrics and emergency stabilization.",
      },
      {
        heading: "Best PANCE practice questions 2026",
        body: "Choose clinical vignettes with differential diagnosis distractors, guideline-based management, and pharmacology integrated across systems.",
      },
    ],
    faqs: [
      {
        question: "Is AnyExamEasy aligned to the NCCPA PANCE blueprint?",
        answer: "Yes. Our PANCE Roadmap follows NCCPA task areas and organ-system weights for 2026 — 300 questions over 5 hours.",
      },
      {
        question: "Can I prep for PANCE and USMLE on one plan?",
        answer: "Yes — all six board tracks are included in one Pro subscription.",
      },
      {
        question: "How long is the free trial?",
        answer: seoTrialLengthFaq(),
      },
    ],
    relatedResourceSlugs: [
      "best-pance-practice-questions-2026",
      "pance-study-guide-nccpa-blueprint",
      "how-to-pass-pance-first-try",
    ],
  },
  "aanp-fnp": {
    key: "aanp-fnp",
    displayName: "AANP FNP",
    shortName: "AANP FNP",
    metaTitle: "AANP FNP Certification Prep 2026 — AANPCB Practice Questions",
    metaDescription:
      `AANP FNP board prep with primary-care vignettes across Assess, Diagnose, Plan, and Evaluate domains. Roadmap, Deep Dives, and analytics. ${SEO_TRIAL_META_SUFFIX}.`,
    keywords: [
      "AANP FNP prep 2026",
      "AANP FNP practice questions",
      "AANPCB FNP certification",
      "FNP board review",
      "how to pass AANP FNP first try",
      "free AANP FNP practice questions",
      "AANP FNP study guide",
      "AnyExamEasy AANP FNP",
    ],
    h1: "AANP FNP Certification Prep — Primary Care Practice Questions",
    heroSubline:
      "AANPCB-aligned FNP vignettes spanning the lifespan, plus integrated Roadmap, Deep Dive modules, and six-exam subscription value for NP students.",
    accentColor: EXAM_ACCENTS.aanpFnp,
    blueprintLabel: "AANPCB FNP certification blueprint",
    features: [
      {
        title: "Assess · Diagnose · Plan · Evaluate",
        detail: "Items mapped to AANPCB domains with primary-care management focus.",
      },
      {
        title: "Lifespan primary care",
        detail: "Pediatric, adult, and geriatric scenarios with preventive care emphasis.",
      },
      {
        title: "Deep Dive modules",
        detail: "Pro subscribers unlock textbook-depth lessons linked from missed questions.",
      },
    ],
    studyTips: [
      {
        heading: "AANP FNP study guide",
        body: "Rotate domain practice weekly — many candidates under-practice Evaluate and professional role questions.",
      },
      {
        heading: "How to pass AANP FNP on the first try",
        body: "Combine Roadmap weak-area drills with full-length timed sets in the final three weeks.",
      },
    ],
    faqs: [
      {
        question: "Is this for AANPCB FNP certification?",
        answer: "Yes. Our AANP FNP track targets AANPCB-style primary care vignettes and domain coverage.",
      },
      {
        question: "Do I get NCLEX and FNP prep together?",
        answer: "Yes — one subscription includes both tracks plus USMLE, NAPLEX, PANCE, and NPTE-PT.",
      },
      {
        question: "What's included in the free trial?",
        answer: seoTrialIncludedFaq(),
      },
    ],
    relatedResourceSlugs: [
      "best-aanp-fnp-practice-questions-2026",
      "aanp-fnp-study-guide-blueprint",
      "how-to-pass-aanp-fnp-first-try",
    ],
  },
  "npte-pt": {
    key: "npte-pt",
    displayName: "NPTE-PT",
    shortName: "NPTE",
    metaTitle: "NPTE-PT Prep 2026 — Physical Therapy Board Practice Questions",
    metaDescription:
      `NPTE-PT exam prep with FSBPT blueprint scenarios — MSK, neuromuscular, cardiopulmonary, modalities, and safety. Roadmap + timed full exams. ${SEO_TRIAL_META_SUFFIX}.`,
    keywords: [
      "NPTE prep 2026",
      "NPTE-PT practice questions",
      "NPTE study guide",
      "FSBPT blueprint NPTE",
      "how to pass NPTE first try",
      "free NPTE practice questions",
      "physical therapy board exam",
      "AnyExamEasy NPTE",
    ],
    h1: "NPTE-PT Board Prep 2026 — FSBPT Blueprint Practice Questions",
    heroSubline:
      "Physical therapy licensure prep with clinical scenarios across musculoskeletal, neuromuscular, and cardiopulmonary systems — plus five other board exams on one plan.",
    accentColor: EXAM_ACCENTS.nptePt,
    blueprintLabel: "FSBPT NPTE-PT content outline",
    features: [
      {
        title: "FSBPT-aligned scenarios",
        detail: "Examination, intervention selection, outcome measures, and clinical reasoning items.",
      },
      {
        title: "MSK & neuro focus",
        detail: "High-yield musculoskeletal and neuromuscular vignettes with modality safety review.",
      },
      {
        title: "Full-length NPTE simulations",
        detail: "Timed board-style exams to build stamina before test day.",
      },
    ],
    studyTips: [
      {
        heading: "NPTE study guide & roadmap",
        body: "Use category-based Roadmap tracking to overweight weak systems — especially modalities and professional responsibilities.",
      },
      {
        heading: "Best NPTE practice questions 2026",
        body: "Practice with scenario-based items that test intervention selection, not recall-only flashcards.",
      },
    ],
    faqs: [
      {
        question: "Does AnyExamEasy cover NPTE-PT (physical therapy)?",
        answer: "Yes. Our NPTE-PT track follows FSBPT blueprint areas with clinical scenario practice questions.",
      },
      {
        question: "Is NPTE prep included with other exams?",
        answer: "Yes — PT, nursing, medical, pharmacy, PA, and FNP prep are all on one subscription.",
      },
      {
        question: "Can I access NPTE prep at /npte?",
        answer: "Yes. Both /npte and /npte-pt route to our NPTE-PT marketing and prep hub.",
      },
    ],
    relatedResourceSlugs: [
      "best-npte-practice-questions-2026",
      "npte-pt-study-guide-fsbpt-blueprint",
      "how-to-pass-npte-first-try",
    ],
  },
};

export function getExamSeoConfig(key: ExamSeoKey): ExamSeoConfig {
  return EXAM_SEO_CONFIG[key];
}
