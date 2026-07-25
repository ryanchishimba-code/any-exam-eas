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
import { MARKETING_QUESTION_COUNTS } from "@/lib/marketing/bank-stats";
import { EXAM_ACCENTS } from "@/lib/landing/tokens";
import { examMarketingPath } from "@/lib/seo/exam-config";
import { TRIAL_DAYS, TRIAL_LIFETIME_QUESTIONS } from "@/lib/billing-config";
import { formatPlanUsd } from "@/lib/billing-plans";
import { TIER_MONTHLY_USD } from "@/lib/subscription-tiers";

/** Local price formatter — avoids a circular import with site.ts. */
const monthly = () => formatPlanUsd(TIER_MONTHLY_USD.pro);

/** Primary platform positioning — reuse across compare sections and SEO. */
export const PLATFORM_TAGLINE =
  "Premium board prep for every major licensing exam — high-quality practice, smart Roadmaps, and one accessible subscription.";

export const PLATFORM_EXAM_LIST = "USMLE, NCLEX, NAPLEX, PANCE, AANP FNP, and NPTE-PT";

export const PLATFORM_EXAM_LIST_MIDDOT = "USMLE · NCLEX · NAPLEX · PANCE · AANP FNP · NPTE-PT";

/** Compact list for banners, checkout, and PWA manifest (no Oxford "and"). */
export const PLATFORM_EXAM_LIST_COMPACT =
  "USMLE, NCLEX, NAPLEX, PANCE, AANP FNP & NPTE-PT";

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
    title: "Board-style practice that mirrors test day",
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
    visualId: "screenshot-question-bank" as const,
    title: "Full-length exams that match the blueprint",
    detail:
      "Timed mocks and full simulations built from the same QA-gated bank — weak areas weighted, less question repeat.",
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
] as const;

export const LANDING_HERO_EYEBROW = "AnyExamEasy";

/** Primary signup destination — Pro annual is the default conversion path. */
export const LANDING_TRIAL_HREF = "/signup?plan=trial&interval=yearly&tier=pro";

/** Large hero exam strip — short labels with brand accent colors + signup deep links. */
export const LANDING_HERO_EXAMS = [
  { slug: "usmle" as const, label: "USMLE", color: EXAM_ACCENTS.usmle },
  { slug: "nclex" as const, label: "NCLEX", color: EXAM_ACCENTS.nclex },
  { slug: "naplex" as const, label: "NAPLEX", color: EXAM_ACCENTS.naplex },
  { slug: "pance" as const, label: "PANCE", color: EXAM_ACCENTS.pance },
  { slug: "aanp-fnp" as const, label: "AANP FNP", color: EXAM_ACCENTS.aanpFnp },
  { slug: "npte-pt" as const, label: "NPTE-PT", color: EXAM_ACCENTS.nptePt },
] as const;

/** Trial signup URL with optional preferred exam preselected. */
export function landingTrialHrefForExam(examSlug?: string): string {
  if (!examSlug) return LANDING_TRIAL_HREF;
  return `${LANDING_TRIAL_HREF}&exam=${encodeURIComponent(examSlug)}`;
}

/** Primary hero headline — benefit-led (UWorld-clarity); exams live in subline + nav. */
export const LANDING_HERO_HEADLINE = "Board exams are hard. Prep shouldn’t be.";

/** Accent line under the primary headline — empty when the full headline is in LANDING_HERO_HEADLINE. */
export const LANDING_HERO_HEADLINE_ACCENT = "";

/** Hero sub-headline body — pass live total via formatFlagshipHeroSubline(totalLabel). */
export const LANDING_HERO_SUBLINE_BODY =
  "QA-gated questions, 3D Anatomy explorer with treatment and disease explanations, Top 500 drug cards, and Blueprint Roadmaps — six boards, one plan.";

export function formatFlagshipHeroSubline(totalLabel?: string): string {
  const count = totalLabel?.trim();
  if (!count) return LANDING_HERO_SUBLINE_BODY;
  return `${count} questions. ${LANDING_HERO_SUBLINE_BODY}`;
}

const EXAM_HERO_HEADLINES: Record<string, string> = {
  nclex: "NCLEX prep that feels like the real exam.",
  usmle: "USMLE vignettes built for Step-day reasoning.",
  naplex: "NAPLEX math and cases without the fluff.",
  pance: "PANCE clinical judgment, blueprint-aligned.",
  "aanp-fnp": "AANP FNP primary-care cases that teach.",
  "npte-pt": "NPTE-PT scenarios for clinical decisions.",
};

const EXAM_HERO_SUBLINE_BODIES: Record<string, string> = {
  nclex:
    "NGN formats, teachable rationales, and a Blueprint Roadmap — try a free sample below.",
  usmle:
    "Mechanism-first stems, competitive distractors, and Roadmaps for Step 1 · 2 · 3.",
  naplex:
    "Calculations, counseling cases, and drug interactions with work-shown rationales.",
  pance:
    "Next-best-step vignettes across the NCCPA blueprint — one Pro plan.",
  "aanp-fnp":
    "Assess → Diagnose → Plan → Evaluate across the lifespan, evidence-based.",
  "npte-pt":
    "MSK, neuro, cardio-pulm, and professional practice — exam-day pacing.",
};

/** Exam-led ATF headline when a board chip is selected. */
export function formatExamHeroHeadline(examSlug?: string): string {
  if (!examSlug) return LANDING_HERO_HEADLINE;
  return EXAM_HERO_HEADLINES[examSlug] ?? LANDING_HERO_HEADLINE;
}

/** Exam-led ATF subline with optional live bank count for that board. */
export function formatExamHeroSubline(
  examSlug?: string,
  countLabel?: string
): string {
  const body =
    (examSlug && EXAM_HERO_SUBLINE_BODIES[examSlug]) || LANDING_HERO_SUBLINE_BODY;
  const count = countLabel?.trim();
  if (!count) return body;
  return `${count} serve-ready questions. ${body}`;
}

/** Short reassurance directly under the primary hero CTA. */
export const LANDING_HERO_CTA_DISCLOSURE =
  `${TRIAL_DAYS}-day free trial · No card required`;
/** Longer trial detail for pricing / final CTA (not the hero ATF). */
export const LANDING_TRIAL_DETAIL =
  `${TRIAL_DAYS}-day free trial · ${TRIAL_LIFETIME_QUESTIONS} practice questions · No payment required · Upgrade anytime`;

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
    title: "One Pro plan — everything included",
    detail:
      "All six banks, Roadmaps, analytics, unlimited mocks, and Deep Dives — one simple subscription.",
  },
] as const;

/** Subtle trust signals below hero subheadline — no pass-rate or UWorld-parity claims. */
export const LANDING_HERO_TRUST_SIGNALS = [
  "QA-gated · clinician-built",
  "NGN formats on NCLEX",
  "Teachable rationales",
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
    icon: Timer,
    title: "Full Exams & weak-area focus",
    detail:
      "Timed full simulations and weak-area launches from your Roadmap — same smart selection as the Full Exam tab.",
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
    title: "Advanced Analytics",
    detail:
      "Weak-area targeting and performance trends so you focus where points are actually lost.",
    proOnly: true,
  },
  {
    icon: ShieldCheck,
    title: "Board-Style Question Quality",
    detail:
      "Clinical vignettes with teachable rationales, plus NGN formats (bow-tie, matrix, SATA) on NCLEX — not template-swapped distractors. We do not claim UWorld parity or verified pass rates.",
    proOnly: false,
  },
] as const;

/** @deprecated Use LANDING_HERO_HEADLINE for the primary headline string. */
export const LANDING_HERO_HEADLINE_QUOTED = LANDING_HERO_HEADLINE;

/** Scannable hero benefits — shown under the subline. */
export const LANDING_HERO_BENEFITS = [
  "Only serve-ready items reach your sessions — weak bulk is filtered out",
  "Six licensing exams under one plan — no $200–400/exam stacking",
  "NGN-ready NCLEX formats + teachable rationales (not template distractors)",
  "Deep Dive lessons open from the questions you miss (Pro)",
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
    value: "Pro",
    label: "One plan",
    detail: `Everything for all 6 boards at ${monthly()}/mo`,
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
    title: "Create your account",
    detail: `Sign up with email or social login — no payment required. Your ${TRIAL_DAYS}-day trial includes ${TRIAL_LIFETIME_QUESTIONS} practice questions instantly.`,
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
  { value: "Full Exam", label: "Timed simulations" },
  { value: "Calc", label: "Clinical calculators" },
];

export type LandingSuccessStory = {
  quote: string;
  /** Longer version shown in featured cards (optional). */
  longQuote?: string;
  name: string;
  exam: string;
  initials: string;
  outcome: string;
  /** Specific outcome detail — e.g. "Saved $600+ vs separate QBanks". */
  detail?: string;
  /** Show as a wider, featured card with longQuote. */
  featured?: boolean;
  /** CSS gradient for photo-style avatar */
  avatarGradient: string;
  /** Optional admin-uploaded photo (data URL or remote URL). */
  photoUrl?: string;
};

/** Platform stats for the social proof band — factual, no pass-rate claims. */
export const LANDING_PASS_STATS = [
  { value: "6", label: "Board exams", detail: "One subscription — no per-exam stacking" },
  {
    value: `${TRIAL_DAYS} days`,
    label: "Free trial",
    detail: `${TRIAL_LIFETIME_QUESTIONS} practice questions across every exam — no card required`,
  },
  { value: "Roadmap", label: "Per-exam study plan", detail: "Blueprint-aligned — integrated, not QBank-only" },
] as const;

export const LANDING_SUCCESS_STORIES: LandingSuccessStory[] = [
  {
    quote:
      "I passed NCLEX on my first try. The Roadmap told me exactly which med-surg topics I was weak on — I wasn't guessing what to study next.",
    longQuote:
      "I went into NCLEX-RN with a real plan for the first time. The Roadmap showed me exactly which med-surg and prioritization topics I was weak on, and every missed question opened a Deep Dive. I didn't guess what to study next — the platform told me. Passed first attempt.",
    name: "Prisca M.",
    exam: "NCLEX-RN",
    initials: "PM",
    outcome: "Passed NCLEX — first attempt",
    detail: "Blueprint-guided prep · 8 weeks",
    avatarGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  {
    quote:
      "Detailed rationales without buying Step 2 and PANCE as separate subscriptions. One plan covered both boards and saved me hundreds.",
    name: "Gerard N.",
    exam: "USMLE Step 2 CK · PANCE",
    initials: "GN",
    outcome: "Studied Step 2 CK & PANCE",
    detail: "Two boards, one subscription",
    avatarGradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  },
  {
    quote:
      "NAPLEX calculations plus AANP FNP primary-care vignettes in one account. The integrated Roadmap was the feature I couldn't find bundled anywhere else.",
    name: "Nathan C.",
    exam: "NAPLEX · AANP FNP",
    initials: "NC",
    outcome: "Passed NAPLEX & AANP FNP",
    detail: "Pharmacy + NP prep, no double billing",
    avatarGradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  },
  {
    quote:
      "I switched after the trial. Better price, and I could prep NCLEX with a real Roadmap without a second bill.",
    name: "Brittany V.",
    exam: "NCLEX-RN",
    initials: "BV",
    outcome: "NCLEX prep — switched plans",
    detail: "Saved vs previous QBank",
    avatarGradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  },
  {
    quote:
      "In intern year I was juggling Step 2 prep on top of rotations. Paying $300+ per exam for two banks wasn't sustainable — here I got both Step 1 and Step 2 CK tracks under one plan.",
    longQuote:
      "During third-year rotations, I couldn't justify paying $300+ for separate Step 1 and Step 2 CK banks on top of everything else. Switching to AnyExamEasy gave me both USMLE tracks — plus linked Deep Dives — in one place for a fraction of the cost. The savings alone covered months of subscriptions elsewhere.",
    name: "Marcus W.",
    exam: "USMLE Step 1 · Step 2 CK",
    initials: "MW",
    outcome: "Both USMLE steps, one subscription",
    detail: "Saved $600+ vs separate QBanks",
    featured: true,
    avatarGradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  },
  {
    quote:
      "The FSBPT Roadmap stopped me from spinning my wheels. Every session tied directly back to blueprint percentages — I finally knew where to spend my 45 minutes.",
    longQuote:
      "I'd been using a different bank that gave me hundreds of random questions but no structure. The NPTE-PT Roadmap showed me which content categories I was weakest in and exactly what percentage of the exam they covered. Knowing I had musculoskeletal and neuromuscular under control going into test day made all the difference. Passed on my first attempt.",
    name: "Keona T.",
    exam: "NPTE-PT",
    initials: "KT",
    outcome: "Passed NPTE-PT — first attempt",
    detail: "Blueprint-aligned · Musculoskeletal focus",
    featured: true,
    avatarGradient: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
  },
  {
    quote:
      "NCCPA blueprint percentages mapped to every session. I finally had structure during PA rotations — 45 minutes a day, no wasted effort.",
    name: "James O.",
    exam: "PANCE",
    initials: "JO",
    outcome: "Passed PANCE",
    detail: "Structured prep during clinical year",
    avatarGradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
  },
  {
    quote:
      "Primary-care vignettes paired with Blueprint Roadmaps and Deep Dives in one place. That combination didn't exist anywhere else at this price.",
    name: "Sofia R.",
    exam: "AANP FNP-C",
    initials: "SR",
    outcome: "Passed AANP FNP-C",
    detail: "Primary care + Roadmap bundled",
    avatarGradient: "linear-gradient(135deg, #96fbc4 0%, #f9f586 100%)",
  },
  {
    quote:
      "Bow-tie and matrix questions on the demo page convinced me the NGN formats were real. I went in fully prepared for Next-Gen NCLEX.",
    name: "Deja H.",
    exam: "NCLEX-RN (NGN)",
    initials: "DH",
    outcome: "Passed NCLEX — NGN ready",
    detail: "Next-Gen NCLEX prepared · first attempt",
    avatarGradient: "linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)",
  },
  {
    quote:
      "Calculations, pharmacotherapy vignettes, and timed full exams in one subscription. I stopped patching together three separate prep resources.",
    name: "Rachel B.",
    exam: "NAPLEX",
    initials: "RB",
    outcome: "Passed NAPLEX",
    detail: "NAPLEX calc + full exams in one plan",
    avatarGradient: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
  },
];

/** @deprecated Use LANDING_SUCCESS_STORIES */
export const LANDING_TESTIMONIALS = LANDING_SUCCESS_STORIES;

/** UWorld comparison rows — price, multi-exam, integrated Roadmap. */
export const UWORLD_COMPARE_ROWS = [
  {
    label: "Monthly price",
    us: `Pro at ${monthly()}/mo — all 6 exams included`,
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
    us: `${TRIAL_DAYS}-day free trial · ${TRIAL_LIFETIME_QUESTIONS} questions · No payment required`,
    them: "Limited demo or paid upfront bundles",
  },
  {
    label: "Full Exam simulation",
    us: "Timed full-length mocks with weak-area weighting",
    them: "Self-assembly or separate mock products",
  },
] as const;
