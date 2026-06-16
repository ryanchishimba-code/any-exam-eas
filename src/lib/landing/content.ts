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
  "Pass your boards faster and cheaper — high-quality practice, smart tools, and one low price for every major exam.";

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
    label: "USMLE Step 2 CK",
    blurb: "Vignette MCQs · timed blocks",
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
  "Reference Hub, Memory Cards & timed full exams",
  `${TOP_500_DRUGS_COUNT} Top Drugs pharmacology deck`,
] as const;

export const LANDING_HERO_EYEBROW = PLATFORM_EXAM_LIST_MIDDOT;

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
export const LANDING_HERO_HEADLINE = "Six Boards. One Plan. Pass With Confidence.";

/** Hero sub-headline — exams, tools, and price in one line. */
export const LANDING_HERO_SUBLINE =
  "USMLE · NCLEX · NAPLEX · PANCE · AANP FNP · NPTE-PT — Roadmaps, Deep Dives, full-length mocks, and board-style banks. Basic from $34.99/mo, Pro from $49.99/mo. Less than one premium QBank elsewhere.";

/** Three-column offering band below the hero. */
export const LANDING_OFFERING_PILLARS = [
  {
    icon: Layers,
    title: "6 licensing exams included",
    detail:
      "Stop buying separate $200–400+ subscriptions. Every major board track lives in one account — switch exams anytime.",
  },
  {
    icon: Map,
    title: "Roadmaps + Deep Dives built in",
    detail:
      "Blueprint-aligned study plans show what to practice next. Pro unlocks Deep Dive modules, advanced analytics, and unlimited mock exams.",
  },
  {
    icon: Sparkles,
    title: "Basic or Pro — your call",
    detail:
      "Basic covers all six banks, Roadmaps, labs, calculators, and Top 503 Drugs. Pro adds SRS, exportable notes, and enhanced explanations.",
  },
] as const;

/** Subtle trust signals below hero CTAs. */
export const LANDING_HERO_TRUST_SIGNALS = [
  "Updated 2026",
  "Blueprint aligned",
  "14-day free trial",
] as const;

/** Unique differentiators — icon cards on the landing page. */
export const LANDING_UNIQUE_FEATURES = [
  {
    icon: Map,
    title: "Proprietary Roadmap Tools",
    detail: "Blueprint-based readiness plans show what to tackle next — linked to practice blocks and weak-area drills.",
  },
  {
    icon: BookOpen,
    title: "Deep Dive Modules",
    detail: "Eight-section lessons open right after every question when you need textbook depth on a missed topic.",
  },
  {
    icon: ShieldCheck,
    title: "Superior Question Quality",
    detail: "Varied, rigorous vignettes with teachable rationales — not template-swapped distractors or repetitive stems.",
  },
  {
    icon: Calculator,
    title: "Clinical Calculators + Lab Values",
    detail: "Normal lab references and board-relevant calculators built into your study flow — no tab-hopping.",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    detail: "Weak-area targeting and session trends so you know exactly where to focus before test day.",
  },
] as const;

/** @deprecated Use LANDING_HERO_HEADLINE for the primary headline string. */
export const LANDING_HERO_HEADLINE_QUOTED = LANDING_HERO_HEADLINE;

/** Scannable hero benefits — shown under the subline. */
export const LANDING_HERO_BENEFITS = [
  "Blueprint-aligned Roadmaps for every exam — not just a question bank",
  "Six board exams in one plan — no stacking separate prep bills",
  "Board-style vignettes with teachable, OER-backed rationales",
  "Deep Dive lessons linked to the questions you miss",
] as const;

/** @deprecated Legacy split headline — no longer used on the landing page. */
export const LANDING_HERO_HEADLINE_LEGACY = "Your best companion";

/** @deprecated Legacy split headline accent — no longer used on the landing page. */
export const LANDING_HERO_HEADLINE_ACCENT = "for boards and clinical practice.";

/** Three punchy hero benefits — scannable in under 3 seconds. */
export const LANDING_HERO_PITCHES = [
  "6 board exams · 1 plan",
  "Roadmaps + Deep Dives",
  "Calculators & lab values",
] as const;

/** Hero price anchor — what's included at the monthly rate. */
export const LANDING_HERO_PRICE_TAGLINE = "Every board. Every tool. One price.";

export const LANDING_HERO_PRICE_INCLUDES = [
  `${MARKETING_QUESTION_COUNTS.total} board-style questions`,
  "Exam Roadmaps, Deep Dive modules & Reference Hub",
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
    value: "$34.99",
    label: "Basic from",
    detail: "Pro from $49.99/mo — all 6 exams vs. $200–400+ each elsewhere",
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
      "Use the Reference Hub for quick recall, then open linked Review Modules for eight-section deep dives on weak topics.",
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
];

/** Hero + preview section — flagship exams. */
export const SAMPLE_QUESTIONS_FEATURED = SAMPLE_QUESTION_PREVIEWS.filter((q) =>
  ["NCLEX-RN", "USMLE Step 2 CK", "AANP FNP"].includes(q.exam)
);

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
  { value: "$34.99", label: "Basic from", detail: "Pro from $49.99/mo — all 6 exams vs. $200–400+ each elsewhere" },
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
