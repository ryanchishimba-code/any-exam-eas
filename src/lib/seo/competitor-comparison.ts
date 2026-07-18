import { SEO_LIVE_STATS } from "@/lib/seo/seo-copy";
import { TIER_ANNUAL_USD, TIER_MONTHLY_USD } from "@/lib/subscription-tiers";
import { TRIAL_DAYS, TRIAL_LIFETIME_QUESTIONS } from "@/lib/billing-config";
import { formatMonthlyPrice } from "@/lib/site";

/** Public competitor pricing — verify against vendor sites periodically. Jul 2026 */
export const COMPETITOR_PRICING = {
  uworldNclex30d: 139,
  uworldStep2_30d: 349,
  uworldNaplexQbank60d: 299,
  archerNclexFrom: 79,
  kaplanNclexSelfPaced180d: 349,
  ambossMonthly: 37,
  rxprepNaplexQbank60d: 299,
  rxprepNaplexCourse180d: 999,
} as const;

export const UWORLD_THREE_EXAM_MIN =
  COMPETITOR_PRICING.uworldNclex30d +
  COMPETITOR_PRICING.uworldStep2_30d +
  COMPETITOR_PRICING.uworldNaplexQbank60d;

export const AEE_MONTHLY = TIER_MONTHLY_USD.pro;
export const AEE_YEARLY = TIER_ANNUAL_USD.pro;

export type ComparisonRow = {
  feature: string;
  anyExamEasy: string;
  competitor: string;
};

export type CompetitorProfile = {
  id: string;
  name: string;
  tagline: string;
  pricingNote: string;
  strengths: string[];
  weaknesses: string[];
  bestFor: string;
};

export const COMPETITOR_PROFILES: CompetitorProfile[] = [
  {
    id: "uworld",
    name: "UWorld",
    tagline: "Gold-standard per-exam QBank",
    pricingNote: "NCLEX from $139/30d · Step 2 CK from $349/30d · NAPLEX QBank from $299/60d — separate subscriptions",
    strengths: [
      "Industry-leading rationales and NGN/CAT fidelity",
      "Self-assessments with pass probability",
      "Strong institutional adoption and pass-rate marketing",
    ],
    weaknesses: [
      "One exam per subscription — multi-board prep gets expensive fast",
      "Limited adaptive study path beyond performance stats",
      "No shared Blueprint Roadmap / Deep Dive system across exams",
    ],
    bestFor: "Single-exam students who prioritize explanation depth and brand trust above all else",
  },
  {
    id: "archer",
    name: "Archer Review",
    tagline: "Budget NCLEX-focused prep",
    pricingNote: "NCLEX QBank + CAT from $79/mo · Sure PASS combo from $159/mo",
    strengths: [
      "Low entry price for NCLEX-only students",
      "Unlimited CAT practice tests",
      "Strong mobile app ratings and social proof",
    ],
    weaknesses: [
      "NCLEX-only — USMLE and NAPLEX require separate vendors",
      "Less depth than UWorld on complex rationales",
      "No multi-exam bundle or shared Roadmap/Deep Dive workflow",
    ],
    bestFor: "NCLEX-only students on a tight budget who need unlimited CAT",
  },
  {
    id: "kaplan",
    name: "Kaplan",
    tagline: "Live review + pass guarantee",
    pricingNote: "Self-paced NCLEX from $349/6 mo · Live online from $549 · QBank-only from $99",
    strengths: [
      "Live online classes and structured curriculum",
      "Pass guarantee on full prep courses",
      "Decision Tree method aligned to clinical judgment",
    ],
    weaknesses: [
      "Higher cost for full courses vs QBank-only options",
      "Per-exam pricing for USMLE and NAPLEX stacks",
      "Less flexible for self-directed adaptive workflows",
    ],
    bestFor: "Students who learn best with live instruction and want a pass guarantee",
  },
  {
    id: "rxprep",
    name: "RxPrep (UWorld Pharmacy)",
    tagline: "NAPLEX category leader",
    pricingNote: "NAPLEX QBank from $299/60d · Full online course from $999/180d",
    strengths: [
      "Pharmacy-specific brand authority and calc-heavy QBank",
      "Video lectures and comprehensive course book",
      "3,400+ NAPLEX practice questions",
    ],
    weaknesses: [
      "Pharmacy-only — nursing and medical boards need separate subscriptions",
      "Premium course pricing ($999+) vs QBank-only tiers",
      "No cross-specialty Roadmaps, Deep Dives, or Full Exam bundle",
    ],
    bestFor: "PharmD students who want the established NAPLEX brand and video course",
  },
];

export const MASTER_FEATURE_ROWS: ComparisonRow[] = [
  {
    feature: "Exams on one plan",
    anyExamEasy: "NCLEX, USMLE (Steps 1–3), NAPLEX, PANCE, FNP, NPTE",
    competitor: "One exam per subscription (typical)",
  },
  {
    feature: "Monthly price (Pro)",
    anyExamEasy: `${formatMonthlyPrice("pro")}/mo — all 6 exams`,
    competitor: "$79–$349+ per exam",
  },
  {
    feature: "Question volume",
    anyExamEasy: `${SEO_LIVE_STATS.questionCount}+ QA-gated questions (live bank)`,
    competitor: "Often 2,000–4,500 per exam",
  },
  {
    feature: "Adaptive Blueprint Roadmap",
    anyExamEasy: "Per-exam weak-area queue",
    competitor: "Performance stats; limited roadmap",
  },
  {
    feature: "Deep Dive modules",
    anyExamEasy: "Opened from missed questions",
    competitor: "Self-directed add-ons or video bundles",
  },
  {
    feature: "Full Exam simulation",
    anyExamEasy: "Timed mocks with weak-area weighting",
    competitor: "Self-assembly or separate mock products",
  },
  {
    feature: "NGN + teachable rationales",
    anyExamEasy: "NGN formats on NCLEX; structured/expert rationales (growing coverage)",
    competitor: "Strong rationales; NGN varies by product",
  },
  {
    feature: "Free trial",
    anyExamEasy: `${TRIAL_DAYS}-day · ${TRIAL_LIFETIME_QUESTIONS} questions · no payment`,
    competitor: "Limited demo or paid upfront",
  },
  {
    feature: "Money-back guarantee",
    anyExamEasy: `${SEO_LIVE_STATS.moneyBackDays}-day guarantee`,
    competitor: "Rare on QBank-only plans",
  },
];

export const EXAM_ONE_PAGER_LINKS = [
  {
    slug: "nclex-vs-uworld-comparison-2026",
    title: "NCLEX vs UWorld",
    exam: "NCLEX",
  },
  {
    slug: "nclex-vs-archer-comparison-2026",
    title: "NCLEX vs Archer",
    exam: "NCLEX",
  },
  {
    slug: "naplex-vs-rxprep-comparison-2026",
    title: "NAPLEX vs RxPrep",
    exam: "NAPLEX",
  },
  {
    slug: "uworld-alternative-multi-exam-prep-2026",
    title: "UWorld alternative (multi-exam)",
    exam: "All",
  },
] as const;

export function formatUsd(amount: number): string {
  return `$${amount.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export function threeExamSavingsPercent(): number {
  const aeeThreeMonths = AEE_MONTHLY * 3;
  return Math.round((1 - aeeThreeMonths / UWORLD_THREE_EXAM_MIN) * 100);
}
