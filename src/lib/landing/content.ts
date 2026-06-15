import {
  Brain,
  HeartPulse,
  Layers,
  Library,
  Pill,
  Scale,
  Stethoscope,
  Timer,
  type LucideIcon,
} from "lucide-react";
import { MARKETING_QUESTION_COUNTS, TOP_500_DRUGS_COUNT } from "@/lib/marketing/bank-stats";
import { studyHubMpjeHref } from "@/lib/study-hub/config";
import { EXAM_ACCENTS } from "@/lib/landing/tokens";

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
    id: "nclex",
    label: "NCLEX",
    blurb: "Curated vignettes · NGN · SATA · bow-tie",
    href: "/question-bank?field=nursing",
    icon: HeartPulse,
    color: EXAM_ACCENTS.nclex,
  },
  {
    id: "usmle",
    label: "USMLE Step 2 CK",
    blurb: "Vignette MCQs · timed blocks",
    href: "/question-bank?field=usmle-step-2",
    icon: Stethoscope,
    color: EXAM_ACCENTS.usmle,
  },
  {
    id: "naplex",
    label: "NAPLEX",
    blurb: "Calculations · compounding · cases",
    href: "/question-bank?field=pharmacy",
    icon: Pill,
    color: EXAM_ACCENTS.naplex,
  },
  {
    id: "mpje",
    label: "MPJE",
    blurb: "Federal + state pharmacy law",
    href: studyHubMpjeHref(),
    icon: Scale,
    color: EXAM_ACCENTS.mpje,
  },
];

export const LANDING_BENEFITS = [
  {
    visualId: "screenshot-question-bank" as const,
    title: "Curated banks where stems match the answers",
    detail:
      "Clinical vignettes, lead-ins, and choices are QA-checked before they reach your session — with CJMM-style rationales, not template-swapped distractors.",
  },
  {
    visualId: "feature-adaptive-learning" as const,
    title: "Adaptive practice that targets weak topics",
    detail:
      "Miss a cardiac item? Your next session weights cardiology higher — no manual topic lists required.",
  },
  {
    visualId: "hero-app-mockup" as const,
    title: "Reference Hub with Memory Cards",
    detail:
      "Flip high-yield cards by subject, see weak-area shortcuts, and jump to drugs or anatomy from one study home base.",
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
      "Generic, brand, MOA, and adverse effects — shared across NCLEX, USMLE, and NAPLEX prep.",
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
  "NCLEX · USMLE · NAPLEX · MPJE question banks",
  "Curated vignettes with aligned answer choices",
  "Adaptive practice + timed full exams",
  "Reference Hub & Memory Cards",
  "High-yield Review Modules",
  "Anatomy Studio (3D + CT Atlas)",
  `${TOP_500_DRUGS_COUNT} Top Drugs pharmacology deck`,
  "Progress analytics & weak-area drills",
] as const;

export const LANDING_HERO_EYEBROW = "NCLEX · USMLE · NAPLEX · MPJE";

/** Primary signup destination — single conversion path across the landing page. */
export const LANDING_TRIAL_HREF = "/signup?plan=trial&interval=yearly";

/** Large hero exam strip — short labels with brand accent colors. */
export const LANDING_HERO_EXAMS = [
  { label: "NCLEX", color: EXAM_ACCENTS.nclex },
  { label: "USMLE", color: EXAM_ACCENTS.usmle },
  { label: "NAPLEX", color: EXAM_ACCENTS.naplex },
  { label: "MPJE", color: EXAM_ACCENTS.mpje },
] as const;

/** Centered hero tagline — one line, shown in quotation marks on the landing page. */
export const LANDING_HERO_TAGLINE = "Your best companion for boards and clinical practice.";
export const LANDING_HERO_HEADLINE_QUOTED = `"${LANDING_HERO_TAGLINE}"`;

/** @deprecated Use LANDING_HERO_HEADLINE_QUOTED */
export const LANDING_HERO_HEADLINE = "Your best companion";

/** @deprecated Use LANDING_HERO_HEADLINE_QUOTED */
export const LANDING_HERO_HEADLINE_ACCENT = "for boards and clinical practice.";

/** Three punchy hero benefits — scannable in under 3 seconds. */
export const LANDING_HERO_PITCHES = [
  "4 exams · 1 price",
  "Board-style questions",
  "Adaptive + timed exams",
] as const;

/** Hero price anchor — what's included at the monthly rate. */
export const LANDING_HERO_PRICE_TAGLINE = "A price you can't beat.";

export const LANDING_HERO_PRICE_INCLUDES = [
  `${MARKETING_QUESTION_COUNTS.total} exam-level question bank`,
  `${TOP_500_DRUGS_COUNT} Top Drugs pharmacology`,
  "Clinical information & review modules",
  "Detailed Anatomy Explorer",
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
    title: "Run adaptive question blocks",
    detail: `${MARKETING_QUESTION_COUNTS.total} stratified items with formats that mirror real exams — curated for stem/answer alignment.`,
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
    exam: "NAPLEX",
    examColor: EXAM_ACCENTS.naplex,
    stem:
      "How many mL of a 20% w/v stock solution are needed to prepare 450 mL of a 4% w/v dilution?",
    options: ["45 mL", "90 mL", "180 mL", "225 mL"],
    correct: "90 mL",
    rationale: "C₁V₁ = C₂V₂ → (20%)(V₁) = (4%)(450 mL) → V₁ = 90 mL of stock.",
  },
];

/** Hero + preview section — three flagship exams (USMLE, NCLEX, NAPLEX). */
export const SAMPLE_QUESTIONS_FEATURED = SAMPLE_QUESTION_PREVIEWS.filter((q) =>
  ["NCLEX-RN", "USMLE Step 2 CK", "NAPLEX"].includes(q.exam)
);

export const LANDING_METRICS = [
  { value: MARKETING_QUESTION_COUNTS.total, label: "Board-style items" },
  { value: "4", label: "Major licensing exams" },
  { value: String(TOP_500_DRUGS_COUNT), label: "Pharmacology flashcards" },
  { value: "Anatomy", label: "Interactive explorer" },
  { value: "7+", label: "Review Modules" },
  { value: "Ref", label: "Hub + Memory Cards" },
];

export const LANDING_TESTIMONIALS = [
  {
    quote:
      "I was paying for two separate banks before this. Having NCLEX and pharmacology flashcards in one place actually matches how I study.",
    name: "Maria L.",
    exam: "NCLEX-RN",
    initials: "ML",
  },
  {
    quote:
      "The vignette rationales feel closer to UWorld than the free apps I tried — but I'm not buying Step 2 and MPJE as separate subscriptions anymore.",
    name: "Ben K.",
    exam: "USMLE Step 2 CK",
    initials: "BK",
  },
  {
    quote:
      "Calculation cases plus law drills in one account is what sold me. State MPJE selection was the feature I couldn't find bundled elsewhere.",
    name: "Priya S.",
    exam: "NAPLEX · MPJE",
    initials: "PS",
  },
];
