import {
  Brain,
  HeartPulse,
  Layers,
  LineChart,
  Pill,
  Scale,
  Stethoscope,
  Timer,
  type LucideIcon,
} from "lucide-react";
import { MARKETING_QUESTION_COUNTS, TOP_500_DRUGS_COUNT } from "@/lib/marketing/bank-stats";
import { studyHubMpjeHref } from "@/lib/study-hub/config";

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
    blurb: "Next-Gen clinical judgment · SATA · bow-tie",
    href: "/study/practice?field=nursing&mode=bank",
    icon: HeartPulse,
    color: "#0d9488",
  },
  {
    id: "usmle",
    label: "USMLE Step 2 CK",
    blurb: "Vignette MCQs · timed blocks",
    href: "/study/practice?field=usmle-step-2&mode=bank",
    icon: Stethoscope,
    color: "#2563eb",
  },
  {
    id: "naplex",
    label: "NAPLEX",
    blurb: "Calculations · compounding · cases",
    href: "/study/practice?field=pharmacy&mode=bank",
    icon: Pill,
    color: "#7c3aed",
  },
  {
    id: "mpje",
    label: "MPJE",
    blurb: "Federal + state pharmacy law",
    href: studyHubMpjeHref(),
    icon: Scale,
    color: "#d97706",
  },
];

export const LANDING_BENEFITS = [
  {
    visualId: "feature-adaptive-learning" as const,
    title: "Adaptive practice that targets weak topics",
    detail:
      "Miss a cardiac item? Your next session weights cardiology higher — no manual topic lists required.",
  },
  {
    visualId: "screenshot-question-bank" as const,
    title: "Board-style vignettes with OER-backed rationales",
    detail:
      "Every explanation ties to open educational sources so you learn the clinical reasoning, not just the key.",
  },
  {
    visualId: "feature-pharmacology" as const,
    title: `${TOP_500_DRUGS_COUNT} high-yield pharmacology flashcards`,
    detail:
      "Generic, brand, MOA, and adverse effects — shared across NCLEX, USMLE, and NAPLEX prep.",
  },
  {
    visualId: "screenshot-analytics" as const,
    title: "Progress analytics that show where to drill",
    detail:
      "Accuracy trends and topic gaps in one dashboard — metrics reflect platform activity only.",
  },
];

export const LANDING_STEPS = [
  {
    step: "01",
    icon: Layers,
    title: "Pick your primary board",
    detail: "NCLEX, USMLE Step 2 CK, NAPLEX, or MPJE — switch anytime on one subscription.",
  },
  {
    step: "02",
    icon: Brain,
    title: "Run adaptive question blocks",
    detail: `${MARKETING_QUESTION_COUNTS.total} stratified items with formats that mirror real exams.`,
  },
  {
    step: "03",
    icon: LineChart,
    title: "Review rationales & weak areas",
    detail: "Missed-question explanations plus analytics highlight topics to revisit.",
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
    examColor: "#0d9488",
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
    examColor: "#2563eb",
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
    examColor: "#7c3aed",
    stem:
      "How many mL of a 20% w/v stock solution are needed to prepare 450 mL of a 4% w/v dilution?",
    options: ["45 mL", "90 mL", "180 mL", "225 mL"],
    correct: "90 mL",
    rationale: "C₁V₁ = C₂V₂ → (20%)(V₁) = (4%)(450 mL) → V₁ = 90 mL of stock.",
  },
  {
    exam: "MPJE",
    examColor: "#d97706",
    stem:
      "A pharmacist receives a Schedule II prescription written for a quantity that exceeds the usual medical need. Best course of action?",
    options: [
      "Contact the prescriber to verify; do not dispense until clarified",
      "Dispense with partial fill notation",
      "Transfer to another pharmacy",
      "Accept with patient ID copy only",
    ],
    correct: "Contact the prescriber to verify; do not dispense until clarified",
    rationale:
      "Suspicious Schedule II orders require prescriber verification before dispensing under federal and state law.",
  },
];

export const LANDING_METRICS = [
  { value: MARKETING_QUESTION_COUNTS.total, label: "Board-style items" },
  { value: "4", label: "Major licensing exams" },
  { value: String(TOP_500_DRUGS_COUNT), label: "Pharmacology flashcards" },
  { value: "NGN", label: "Next-Gen NCLEX formats" },
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
