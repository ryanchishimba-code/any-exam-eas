import {
  BarChart3,
  BookOpen,
  Brain,
  Calculator,
  HeartPulse,
  Layers,
  Library,
  Map,
  Pill,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Timer,
  type LucideIcon,
} from "lucide-react";
import { MARKETING_QUESTION_COUNTS, TOP_500_DRUGS_COUNT } from "@/lib/marketing/bank-stats";
import { EXAM_ACCENTS } from "@/lib/landing/tokens";
import { examMarketingPath } from "@/lib/seo/exam-config";

/** Primary platform positioning — reuse across compare sections and SEO. */
export const PLATFORM_TAGLINE =
  "Premium board prep for every major licensing exam — high-quality practice, smart Roadmaps, and one accessible subscription.";

export const PLATFORM_EXAM_LIST = "USMLE, NCLEX, NAPLEX, PANCE, AANP FNP, and NPTE-PT";

export const PLATFORM_EXAM_LIST_MIDDOT = "USMLE · NCLEX · NAPLEX · PANCE · AANP FNP · NPTE-PT";

export type LandingExam = {
  id: string;
  label: string;
  blurb: string;
  href: string;
  icon: LucideIcon;
  color: string;
};

export const LANDING_EXAMS: LandingExam[] = [
  {
    id: "usmle",
    label: "USMLE Step 1 · Step 2 CK · Step 3",
    blurb: "Full USMLE — basic sciences, clinical vignettes, biostats & CCS",
    href: examMarketingPath("usmle"),
    icon: Stethoscope,
    color: EXAM_ACCENTS.usmle,
  },
  {
    id: "nclex",
    label: "NCLEX",
    blurb: "Curated vignettes · NGN · SATA · bow-tie",
    href: examMarketingPath("nclex"),
    icon: HeartPulse,
    color: EXAM_ACCENTS.nclex,
  },
  {
    id: "naplex",
    label: "NAPLEX",
    blurb: "Calculations · compounding · cases",
    href: examMarketingPath("naplex"),
    icon: Pill,
    color: EXAM_ACCENTS.naplex,
  },
  {
    id: "pance",
    label: "PANCE",
    blurb: "Physician assistant · NCCPA blueprint vignettes",
    href: examMarketingPath("pance"),
    icon: Stethoscope,
    color: EXAM_ACCENTS.pance,
  },
  {
    id: "aanp-fnp",
    label: "AANP FNP",
    blurb: "AANPCB FNP blueprint · primary care vignettes",
    href: examMarketingPath("aanp-fnp"),
    icon: HeartPulse,
    color: EXAM_ACCENTS.aanpFnp,
  },
  {
    id: "npte-pt",
    label: "NPTE-PT",
    blurb: "FSBPT blueprint · physical therapy clinical scenarios",
    href: examMarketingPath("npte-pt"),
    icon: HeartPulse,
    color: EXAM_ACCENTS.nptePt,
  },
];

export const LANDING_BENEFITS = [
  {
    visualId: "screenshot-question-bank" as const,
    title: "Proven board-style practice that mirrors test day",
    detail:
      "Clinical vignettes, lead-ins, and choices are QA-checked before they reach your session — with teachable rationales, not template-swapped distractors.",
  },
  {
    visualId: "feature-adaptive-learning" as const,
    title: "Integrated Roadmap — not just another QBank",
    detail:
      "Blueprint-aligned study plans for each exam show what to tackle next, linked to practice blocks and Deep Dive lessons when you miss a topic.",
  },
  {
    visualId: "hero-app-mockup" as const,
    title: "Six exams in one affordable subscription",
    detail:
      "Stop stacking $200–400+ per-exam subscriptions. USMLE, NCLEX, NAPLEX, PANCE, AANP FNP, and NPTE-PT prep live under one plan.",
  },
  {
    visualId: "screenshot-analytics" as const,
    title: "Review Modules linked to practice",
    detail:
      "Eight-section deep dives on sepsis, heart failure, delegation, and more — opened from questions or Memory Cards when you need textbook depth.",
  },
  {
    visualId: "feature-pharmacology" as const,
    title: `${TOP_500_DRUGS_COUNT} high-yield pharmacology flashcards`,
    detail:
      "Generic, brand, MOA, and adverse effects — shared across nursing, medical, pharmacy, and NP prep.",
  },
  {
    visualId: "feature-adaptive-learning" as const,
    title: "Anatomy Studio — 3D, video & CT Atlas",
    detail:
      "Explore structures with clinical pearls, guided tours, scrollable CT slices, and one-click jumps back to related practice.",
  },
];

/** Bullet list for pricing panels and signup CTAs. */
export const LANDING_PRICING_FEATURES = [
  `${PLATFORM_EXAM_LIST_MIDDOT} question banks`,
  "Proprietary Exam Roadmaps aligned to each blueprint",
  "Deep Dive Review Modules linked from practice",
  "Curated vignettes with excellent explanations",
  "Performance analytics & weak-area targeting",
  "Normal lab values & clinical calculators",
  "Library, Memory Cards & timed full exams",
  `${TOP_500_DRUGS_COUNT} Top Drugs pharmacology deck`,
] as const;

export const LANDING_HERO_EYEBROW =
  "6 board exams · QA-gated question bank · Updated 2026";

/** Primary signup destination — Pro annual is the default conversion path. */
export const LANDING_TRIAL_HREF = "/signup?plan=trial&interval=yearly&tier=pro";

/** Large hero exam strip — short labels with brand accent colors. */
export const LANDING_HERO_EXAMS = [
  { label: "USMLE", color: EXAM_ACCENTS.usmle },
  { label: "NCLEX", color: EXAM_ACCENTS.nclex },
  { label: "NAPLEX", color: EXAM_ACCENTS.naplex },
  { label: "PANCE", color: EXAM_ACCENTS.pance },
  { label: "AANP FNP", color: EXAM_ACCENTS.aanpFnp },
  { label: "NPTE-PT", color: EXAM_ACCENTS.nptePt },
] as const;

/** Primary hero headline — benefit-driven, scannable above the fold. */
export const LANDING_HERO_HEADLINE = "One subscription. Six boards.";

/** Accent line under the primary headline. */
export const LANDING_HERO_HEADLINE_ACCENT = "Board-caliber prep without the stacked bills.";

/** Hero sub-headline body — pass live total via formatFlagshipHeroSubline(totalLabel). */
export const LANDING_HERO_SUBLINE_BODY =
  "QA-gated vignettes, blueprint Roadmaps, and Deep Dives for USMLE, NCLEX, NAPLEX, PANCE, AANP FNP & NPTE — curated for serve-ready quality, not bulk filler.";

export function formatFlagshipHeroSubline(totalLabel?: string): string {
  const count = totalLabel?.trim();
  if (!count) return LANDING_HERO_SUBLINE_BODY;
  return `${count} serve-ready questions · ${LANDING_HERO_SUBLINE_BODY}`;
}

/** Short reassurance directly under the primary hero CTA. */
export const LANDING_HERO_CTA_DISCLOSURE =
  "No credit card required to start • Cancel anytime";

/** Three-column offering band below the hero. */
export const LANDING_OFFERING_PILLARS = [
  {
    icon: Layers,
    title: "6 licensing exams included",
    detail:
      "Premium prep for every major board — USMLE, NCLEX, NAPLEX, PANCE, AANP FNP & NPTE — in one accessible subscription.",
  },
  {
    icon: Map,
    title: "Roadmaps + Deep Dives built in",
    detail:
      "Blueprint-aligned study plans show what to practice next. Pro unlocks full Deep Dive modules, advanced analytics, and unlimited mock exams.",
  },
  {
    icon: Sparkles,
    title: "Basic or Pro — your call",
    detail:
      "Start with Basic — all six banks, Roadmaps, labs, calculators, and Top 503 Drugs. Pro adds SRS, exportable notes, and enhanced explanations.",
  },
] as const;

/** Subtle trust signals below hero subheadline. */
export const LANDING_HERO_TRUST_SIGNALS = [
  "QA-gated before serve",
  "2026 blueprints",
  "6 exams · 1 plan",
] as const;

/** Unique differentiators — icon cards on the landing page. */
export const LANDING_UNIQUE_FEATURES = [
  {
    icon: Map,
    title: "Proprietary Exam Roadmaps",
    detail:
      "Blueprint-aligned study plans for every exam show what to practice next — linked to weak-area drills and timed blocks.",
    proOnly: false,
  },
  {
    icon: BookOpen,
    title: "Full Deep Dive Modules",
    detail:
      "Eight-section lessons open from missed questions — textbook depth without leaving your session.",
    proOnly: true,
  },
  {
    icon: Pill,
    title: "Top 503 Drugs Deck",
    detail:
      "High-yield pharmacology flashcards with MOA, brand names, and adverse effects — shared across nursing, medical, and pharmacy prep.",
    proOnly: false,
  },
  {
    icon: Calculator,
    title: "Normal Lab Values + Calculators",
    detail:
      "Board-relevant reference ranges and clinical calculators built into your study flow — no tab-hopping.",
    proOnly: false,
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics & Spaced Repetition",
    detail:
      "Weak-area targeting, performance trends, and SRS scheduling so you focus where points are actually lost.",
    proOnly: true,
  },
  {
    icon: ShieldCheck,
    title: "Board-Style Question Quality",
    detail:
      "Varied clinical vignettes with teachable rationales — not template-swapped distractors or repetitive stems.",
    proOnly: false,
  },
] as const;

/** @deprecated Use LANDING_HERO_HEADLINE for the primary headline string. */
export const LANDING_HERO_HEADLINE_QUOTED = LANDING_HERO_HEADLINE;

/** Scannable hero benefits — shown under the subline. */
export const LANDING_HERO_BENEFITS = [
  "Only serve-ready items reach your sessions — weak bulk is filtered out",
  "Six licensing exams under one plan — no $200–400/exam stacking",
  "Clinical vignettes with teachable rationales, not template distractors",
  "Deep Dive lessons open from the questions you miss",
] as const;

/** @deprecated Legacy split headline — no longer used on the landing page. */
export const LANDING_HERO_HEADLINE_LEGACY = "Your best companion";

/** @deprecated Legacy split headline accent — no longer used on the landing page. */
export const LANDING_HERO_HEADLINE_ACCENT_LEGACY = "for boards and clinical practice.";

/** Three punchy hero benefits — scannable in under 3 seconds. */
export const LANDING_HERO_PITCHES = [
  "6 board exams · 1 plan",
  "Roadmaps + Deep Dives",
  "Calculators & lab values",
] as const;

/** Hero price anchor — what's included at the monthly rate. */
export const LANDING_HERO_PRICE_TAGLINE = "Premium prep. Accessible price.";

export const LANDING_HERO_PRICE_INCLUDES = [
  `${MARKETING_QUESTION_COUNTS.total} board-style questions`,
  "Exam Roadmaps, Deep Dive modules & Library",
  "Analytics, lab values & clinical calculators",
] as const;

/** Trust stats for the social proof band — illustrative aggregates, not pass-rate claims. */
export const LANDING_SOCIAL_PROOF = [
  {
    value: MARKETING_QUESTION_COUNTS.total,
    label: "Board-style questions",
    detail: "Curated vignettes across six licensing exams",
  },
  {
    value: "6",
    label: "Board exams",
    detail: "One subscription — no per-exam stacking",
  },
  {
    value: "Basic",
    label: "Starting plan",
    detail: "Pro adds Deep Dives, analytics & unlimited mocks",
  },
  {
    value: "Roadmap",
    label: "Per-exam study plan",
    detail: "Blueprint-aligned — integrated, not QBank-only",
  },
] as const;

export const LANDING_STEPS = [
  {
    step: "01",
    icon: Layers,
    title: "Create your account & add payment",
    detail:
      "Choose your board and billing plan — payment method required at checkout, nothing charged today. Cancel before your trial ends and you won't be billed.",
  },
  {
    step: "02",
    icon: Brain,
    title: "Follow your Exam Roadmap",
    detail: `${MARKETING_QUESTION_COUNTS.total} stratified items with formats that mirror real exams — Roadmap shows what to practice next.`,
  },
  {
    step: "03",
    icon: Library,
    title: "Review with Memory Cards & modules",
    detail:
      "Use the Library for quick recall, then open linked Review Modules for eight-section deep dives on weak topics.",
  },
  {
    step: "04",
    icon: Timer,
    title: "Simulate timed full exams",
    detail: "Build stamina with board-length blocks before test day.",
  },
];

export type SampleQuestionPreview = {
  exam: string;
  examColor: string;
  stem: string;
  options: string[];
  correct: string;
  rationale: string;
};

export const SAMPLE_QUESTION_PREVIEWS: SampleQuestionPreview[] = [
  {
    exam: "NCLEX-RN",
    examColor: EXAM_ACCENTS.nclex,
    stem:
      "A nurse assesses a client with fever 38.9°C (102°F), absolute neutrophil count 320/mm³, and a tunneled central line. Which action is the priority?",
    options: [
      "Obtain blood cultures and notify the provider for broad-spectrum antibiotics",
      "Apply a warm compress to the insertion site",
      "Encourage oral fluids and rest",
      "Document findings and reassess in 4 hours",
    ],
    correct: "Obtain blood cultures and notify the provider for broad-spectrum antibiotics",
    rationale:
      "Febrile neutropenia with a central line is an emergency — cultures and empiric antibiotics cannot wait.",
  },
  {
    exam: "USMLE Step 2 CK",
    examColor: EXAM_ACCENTS.usmle,
    stem:
      "A 58-year-old man with type 2 diabetes presents with crushing substernal chest pain for 45 minutes. ECG shows ST elevation in V2–V4. Next best step?",
    options: [
      "Activate PCI and give aspirin + P2Y12 inhibitor",
      "Order serial troponins and observe",
      "Schedule stress test in 24 hours",
      "Start IV heparin alone and discharge if pain resolves",
    ],
    correct: "Activate PCI and give aspirin + P2Y12 inhibitor",
    rationale:
      "STEMI requires immediate reperfusion — dual antiplatelet therapy and cath lab activation are time-critical.",
  },
  {
    exam: "AANP FNP",
    examColor: EXAM_ACCENTS.aanpFnp,
    stem:
      "A 52-year-old woman with type 2 diabetes and BMI 34 has an A1c of 8.4% on metformin 1000 mg BID. BP 138/86, eGFR 72. Best next step?",
    options: [
      "Add a GLP-1 receptor agonist or SGLT2 inhibitor with cardiorenal benefit",
      "Increase metformin to 1500 mg BID without additional agent",
      "Start basal insulin before optimizing oral therapy",
      "Recheck A1c in 6 months with lifestyle counseling only",
    ],
    correct: "Add a GLP-1 receptor agonist or SGLT2 inhibitor with cardiorenal benefit",
    rationale:
      "When A1c remains above goal on metformin monotherapy, guidelines support adding an agent with ASCVD, HF, or CKD benefit — not delaying intensification.",
  },
  {
    exam: "NAPLEX",
    examColor: EXAM_ACCENTS.naplex,
    stem:
      "A prescription calls for 240 mL of a 2.5% w/v solution. The pharmacy stocks a 10% w/v concentrate. How many milliliters of concentrate and diluent are needed?",
    options: [
      "60 mL concentrate + 180 mL diluent",
      "24 mL concentrate + 216 mL diluent",
      "120 mL concentrate + 120 mL diluent",
      "240 mL concentrate, no diluent",
    ],
    correct: "60 mL concentrate + 180 mL diluent",
    rationale:
      "Alligation: 240 mL × 2.5% = 6 g active drug → 6 g ÷ 10% = 60 mL concentrate; diluent fills to final 240 mL volume.",
  },
  {
    exam: "PANCE",
    examColor: EXAM_ACCENTS.pance,
    stem:
      "A 24-year-old presents after a tick bite with an expanding erythema migrans rash and mild arthralgias. No focal neuro deficits. Best initial management?",
    options: [
      "Doxycycline for early localized Lyme disease",
      "Await serology before treating",
      "Ceftriaxone IV for 14 days",
      "Prednisone for presumed reactive arthritis",
    ],
    correct: "Doxycycline for early localized Lyme disease",
    rationale:
      "Erythema migrans in an endemic area is sufficient for clinical diagnosis — treat empirically without waiting for seroconversion.",
  },
  {
    exam: "NPTE-PT",
    examColor: EXAM_ACCENTS.nptePt,
    stem:
      "A physical therapist evaluates a patient 2 days post–total knee arthroplasty. Knee flexion 65°, moderate effusion, quadriceps activation lag. Priority intervention?",
    options: [
      "Quad sets, ankle pumps, and early ROM within precautions",
      "Aggressive passive flexion to 120° today",
      "Full-weight-bearing treadmill walking without assistive device",
      "Ice only; defer mobilization until effusion resolves",
    ],
    correct: "Quad sets, ankle pumps, and early ROM within precautions",
    rationale:
      "Early post-TKA care emphasizes DVT prophylaxis, quad activation, and progressive ROM — not forcing flexion or high-load ambulation on post-op day 2.",
  },
];

/** Landing sample section — one preview per board exam. */
export const SAMPLE_QUESTIONS_FEATURED = SAMPLE_QUESTION_PREVIEWS;

export const LANDING_METRICS = [
  { value: MARKETING_QUESTION_COUNTS.total, label: "Board-style items" },
  { value: "6", label: "Board exam tracks" },
  { value: "Roadmap", label: "Per-exam study plan" },
  { value: "Deep Dive", label: "Linked lessons" },
  { value: String(TOP_500_DRUGS_COUNT), label: "Pharmacology cards" },
  { value: "Calc", label: "Clinical calculators" },
];

export type LandingSuccessStory = {
  quote: string;
  name: string;
  exam: string;
  initials: string;
  outcome: string;
  /** CSS gradient for photo-style avatar */
  avatarGradient: string;
};

/** Illustrative outcome stats — not pass-rate guarantees. */
export const LANDING_PASS_STATS = [
  { value: "6", label: "Board exams", detail: "One subscription — no per-exam stacking" },
  { value: "14 days", label: "Free trial", detail: "Evaluate every exam before you pay" },
  { value: "First try", label: "Passes reported", detail: "Students share first-attempt outcomes*" },
] as const;

export const LANDING_SUCCESS_STORIES: LandingSuccessStory[] = [
  {
    quote:
      "I passed NCLEX on my first try. The Roadmap told me exactly which med-surg topics I was weak on — I wasn't guessing what to study next.",
    name: "Maria L.",
    exam: "NCLEX-RN",
    initials: "ML",
    outcome: "Passed NCLEX — first attempt",
    avatarGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  {
    quote:
      "UWorld-quality rationales without buying Step 2 and PANCE as separate subscriptions. One plan covered both boards and saved me hundreds.",
    name: "Ben K.",
    exam: "USMLE Step 2 CK · PANCE",
    initials: "BK",
    outcome: "Passed Step 2 CK & PANCE",
    avatarGradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  },
  {
    quote:
      "NAPLEX calculations plus AANP FNP primary-care vignettes in one account. The integrated Roadmap was the feature I couldn't find bundled anywhere else.",
    name: "Priya S.",
    exam: "NAPLEX · AANP FNP",
    initials: "PS",
    outcome: "Passed NAPLEX & AANP FNP",
    avatarGradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  },
  {
    quote:
      "I switched from UWorld after the trial. Same vignette rigor, better price, and I could prep NCLEX and pharmacology flashcards without a second bill.",
    name: "Jordan T.",
    exam: "NCLEX-RN",
    initials: "JT",
    outcome: "Passed NCLEX — switched from UWorld",
    avatarGradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  },
];

/** @deprecated Use LANDING_SUCCESS_STORIES */
export const LANDING_TESTIMONIALS = LANDING_SUCCESS_STORIES;

/** UWorld comparison rows — price, multi-exam, integrated Roadmap. */
export const UWORLD_COMPARE_ROWS = [
  {
    label: "Monthly price",
    us: "From $34.99/mo Basic · Pro $49.99/mo — all 6 exams",
    them: "$200–400+ per exam (UWorld sells each board separately)",
  },
  {
    label: "Exam coverage",
    us: PLATFORM_EXAM_LIST_MIDDOT,
    them: "Separate subscription required per exam",
  },
  {
    label: "Integrated Roadmap",
    us: "Blueprint-aligned Roadmap per exam",
    them: "Question bank only — you plan your own schedule",
  },
  {
    label: "Deep Dives",
    us: "Review Modules linked from missed questions",
    them: "Self-directed add-ons or video bundles",
  },
  {
    label: "Trial entry",
    us: "14-day free trial · Payment required at checkout",
    them: "Limited demo or paid upfront bundles",
  },
  {
    label: "Pharmacology deck",
    us: `${TOP_500_DRUGS_COUNT} Top Drugs included`,
    them: "Often a separate purchase or scattered in banks",
  },
] as const;
