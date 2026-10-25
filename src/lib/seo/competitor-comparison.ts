import { SEO_LIVE_STATS } from "@/lib/seo/seo-copy";
import { TIER_ANNUAL_USD, TIER_MONTHLY_USD } from "@/lib/subscription-tiers";
import { TRIAL_DAYS, TRIAL_LIFETIME_QUESTIONS } from "@/lib/billing-config";
import { formatMonthlyPrice } from "@/lib/site";

export const AEE_MONTHLY = TIER_MONTHLY_USD.pro;
export const AEE_YEARLY = TIER_ANNUAL_USD.pro;

export type ComparisonRow = {
  feature: string;
  anyExamEasy: string;
  /** Neutral label for typical per-exam or single-board prep products. */
  competitor: string;
};

export type PrepApproachProfile = {
  id: string;
  title: string;
  tagline: string;
  strengths: string[];
  bestFor: string;
};

/**
 * Honest stance for compare surfaces — no fabricated pass rates or third-party brand claims.
 */
export const COMPARE_HONESTY_DISCLAIMER =
  "We do not publish unverified pass rates or guarantee board outcomes. AnyExamEasy is independent and not affiliated with licensing boards or other prep providers.";

/** When a dedicated single-exam product may be the better fit — shown on landing + /compare. */
export const COMPETITOR_MAY_WIN: string[] = [
  "You are preparing for only one board and want a product built exclusively around that exam.",
  "You prefer a live review course with scheduled instruction over self-directed QBank study.",
  "You already use and trust a single-exam provider and do not need a multi-board plan.",
  "You want the deepest possible item bank for one exam and will not sit other boards on the same timeline.",
];

export const PREP_APPROACH_PROFILES: PrepApproachProfile[] = [
  {
    id: "single-board-qbank",
    title: "Premium single-board QBank",
    tagline: "Deep item bank for one licensing exam",
    strengths: [
      "Focused content for a single exam track",
      "Performance analytics and explanations vary by provider",
      "Often sold per exam with its own renewal cycle",
    ],
    bestFor: "Candidates sitting one board who want a specialist QBank for that exam only",
  },
  {
    id: "live-review",
    title: "Live review course",
    tagline: "Scheduled classes and structured curriculum",
    strengths: [
      "Instructor-led sessions and cohort pacing",
      "Course bundles may include guarantees on their own terms",
      "Less flexible if you juggle multiple exams or clinical schedules",
    ],
    bestFor: "Students who learn best with live instruction and a fixed class schedule",
  },
  {
    id: "self-assembled",
    title: "Self-assembled prep stack",
    tagline: "Mix of QBanks, videos, and third-party mocks",
    strengths: [
      "Pick best-in-class tools per exam",
      "Can tailor spend to one high-stakes board",
      "Multiple renewals and logins to manage",
    ],
    bestFor: "Experienced self-starters optimizing for one exam at a time",
  },
];

/** @deprecated Use PREP_APPROACH_PROFILES — compare UI only. */
export const COMPETITOR_PROFILES = PREP_APPROACH_PROFILES;

export const MASTER_FEATURE_ROWS: ComparisonRow[] = [
  {
    feature: "Exams on one plan",
    anyExamEasy: "NCLEX, USMLE (Steps 1–3), NAPLEX, PANCE, FNP, NPTE",
    competitor: "Typically one exam per subscription",
  },
  {
    feature: "Monthly price (Pro)",
    anyExamEasy: `${formatMonthlyPrice("pro")}/mo — all 6 exams`,
    competitor: "Often billed per exam; plan length varies",
  },
  {
    feature: "Question access",
    anyExamEasy: "Live banks across six boards on Pro (trial is capped)",
    competitor: "Scope varies by provider and tier",
  },
  {
    feature: "Roadmap",
    anyExamEasy: "Per-exam weak-area queue",
    competitor: "Often performance stats only; limited roadmap",
  },
  {
    feature: "Deep Dive modules",
    anyExamEasy: "Opened from missed questions",
    competitor: "Self-directed add-ons or separate review bundles",
  },
  {
    feature: "Full Exam simulation",
    anyExamEasy: "Timed mocks with weak-area weighting",
    competitor: "Self-assembly or separate mock products",
  },
  {
    feature: "NGN + teachable rationales",
    anyExamEasy: "NGN formats on NCLEX; structured rationales (growing coverage)",
    competitor: "Format depth varies by exam and provider",
  },
  {
    feature: "Free trial",
    anyExamEasy: `${TRIAL_DAYS}-day · ${TRIAL_LIFETIME_QUESTIONS} questions · no payment`,
    competitor: "Trial terms vary by provider",
  },
  {
    feature: "Quality commitment",
    anyExamEasy: `${SEO_LIVE_STATS.moneyBackDays}-day support window (not a refund)`,
    competitor: "Policies vary by provider",
  },
];

export const EXAM_ONE_PAGER_LINKS = [
  {
    slug: "nclex-vs-uworld-comparison-2026",
    title: "NCLEX prep comparison guide",
    exam: "NCLEX",
  },
  {
    slug: "nclex-vs-archer-comparison-2026",
    title: "NCLEX value comparison guide",
    exam: "NCLEX",
  },
  {
    slug: "naplex-vs-rxprep-comparison-2026",
    title: "NAPLEX prep comparison guide",
    exam: "NAPLEX",
  },
  {
    slug: "multi-exam-board-prep-2026",
    title: "Multi-exam board prep (one subscription)",
    exam: "All",
  },
] as const;

export function formatUsd(amount: number): string {
  return `$${amount.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}
