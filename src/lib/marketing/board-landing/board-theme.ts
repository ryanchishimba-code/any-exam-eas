import type { ExamSeoKey } from "@/lib/seo/exam-config";
import { TRIAL_DAYS } from "@/lib/billing-config";
import { formatExactQuestionCount, scoredQuestionCount, type BoardQuestionUnits } from "@/lib/counts";
import { formatTypicalPrepRangeLabel, naplexTypicalPrepRangeLabel } from "@/lib/marketing/board-landing/typical-prep-range";
import { formatMonthlyPrice } from "@/lib/site";
import type { BoardLandingModel } from "@/lib/marketing/board-landing/model";

export type BoardSlug = "nclex" | "naplex" | "usmle" | "aanp-fnp" | "pance" | "npte-pt";

export type BoardPainPoint = {
  id: string;
  worry: string;
  fix: string;
};

export type BoardQuestionTypeIcon = {
  id: string;
  label: string;
  live: boolean;
};

export type BoardLandingVisuals = {
  proPrice: string;
  typicalRange: string;
  typicalPeriod: string;
  liveCount: string | null;
  steps: { id: string; label: string; detail: string }[];
  questionTypes: BoardQuestionTypeIcon[];
  showPracticeDevice: boolean;
};

const STEPS = [
  { id: "practice", label: "Practice", detail: "Timed sets and full exams from the live bank." },
  { id: "review", label: "Review", detail: "Keyed answers, distractor reasons, and sources." },
  { id: "pass", label: "Pass", detail: "Track readiness and weak areas before test day." },
] as const;

export function boardThemeClass(slug: BoardSlug): string {
  return `board-landing--${slug.replace(/[^a-z0-9]/g, "-")}`;
}

export function heroWhyUs(slug: BoardSlug): string {
  switch (slug) {
    case "nclex":
      return "NGN formats, CAT-style exams, and teachable rationales—on one Pro plan.";
    case "naplex":
      return "Calculations, top-drug vignettes, and pharmacy law—without stacking subscriptions.";
    case "usmle":
      return "Step 1, Step 2 CK, and Step 3 banks with Anatomy Explorer on one monthly plan.";
    case "aanp-fnp":
      return "Primary-care breadth, study guide chapters, and FNP vignettes in one qbank.";
    case "pance":
      return "Organ-system PANCE vignettes, timed blocks, and readiness tracking together.";
    case "npte-pt":
      return "MSK and neuro-heavy NPTE items with 3D anatomy review built in.";
    default:
      return "Live board questions with teachable rationales on one Pro plan.";
  }
}

export function boardPainPoints(slug: BoardSlug): BoardPainPoint[] {
  switch (slug) {
    case "nclex":
      return [
        {
          id: "ngn",
          worry: "NGN item types feel unfamiliar",
          fix: "Practice matrix, bow-tie, highlight, and drag-drop items that are live in your bank.",
        },
        {
          id: "cat",
          worry: "Unsure when the CAT will shut off",
          fix: "Run CAT-style adaptive full exams so length and difficulty feel closer to test day.",
        },
        {
          id: "cost",
          worry: "30-day prep subscriptions add up",
          fix: `Pro is ${formatMonthlyPrice("pro")}/mo for NCLEX plus five other boards after a ${TRIAL_DAYS}-day trial.`,
        },
      ];
    case "naplex":
      return [
        {
          id: "calc",
          worry: "NAPLEX calculations steal time",
          fix: "Work calculation and alligation items with step-by-step rationales in the bank.",
        },
        {
          id: "volume",
          worry: "Too many drugs to recall cold",
          fix: "Drill pharmacotherapy vignettes mapped to the live NABP outline areas.",
        },
        {
          id: "cost",
          worry: "Short-access QBanks are pricey",
          fix: `One ${formatMonthlyPrice("pro")}/mo plan covers NAPLEX and five other boards.`,
        },
      ];
    case "usmle":
      return [
        {
          id: "volume",
          worry: "Step 1, 2, and 3 each need volume",
          fix: "Switch step banks without buying separate 30-day passes per exam.",
        },
        {
          id: "cost",
          worry: "Per-step prep stacks fast",
          fix: `All three steps stay on Pro at ${formatMonthlyPrice("pro")}/mo with a ${TRIAL_DAYS}-day trial.`,
        },
        {
          id: "anatomy",
          worry: "Anatomy fades between steps",
          fix: "Orbit structures in Anatomy Explorer, then jump back to step-style questions.",
        },
      ];
    case "aanp-fnp":
      return [
        {
          id: "scope",
          worry: "Primary-care scope is wide",
          fix: "Blueprint topic drills plus an included FNP study guide for weak areas.",
        },
        {
          id: "vignettes",
          worry: "Long vignettes drain stamina",
          fix: "Timed FNP blocks mirror certification pacing with explained answers.",
        },
        {
          id: "cost",
          worry: "Another single-exam subscription",
          fix: `FNP prep shares Pro with five other boards at ${formatMonthlyPrice("pro")}/mo.`,
        },
      ];
    case "pance":
      return [
        {
          id: "breadth",
          worry: "Every organ system is fair game",
          fix: "Rotate PANCE vignettes by blueprint area and review misses by topic.",
        },
        {
          id: "pace",
          worry: "Five hours of stems is brutal",
          fix: "Full-length timed mocks build endurance before the real PANCE.",
        },
        {
          id: "cost",
          worry: "Dedicated PA QBanks cost extra",
          fix: `PANCE stays on the same ${formatMonthlyPrice("pro")}/mo plan as your other boards.`,
        },
      ];
    case "npte-pt":
      return [
        {
          id: "msk",
          worry: "MSK and neuro sections feel dense",
          fix: "Target musculoskeletal and neuromuscular items with anatomy visuals nearby.",
        },
        {
          id: "systems",
          worry: "Non-MSK systems still show up",
          fix: "Mixed NPTE sets keep cardio, pulmonary, and integument fresh in rotation.",
        },
        {
          id: "cost",
          worry: "PT prep priced per access window",
          fix: `NPTE-PT is included on Pro at ${formatMonthlyPrice("pro")}/mo—no separate PT pass.`,
        },
      ];
    default:
      return [];
  }
}

function nclexQuestionTypes(bankTypes: Record<string, number>): BoardQuestionTypeIcon[] {
  const has = (types: string[]) =>
    types.some((type) => (bankTypes[type.toLowerCase()] ?? 0) > 0);
  return [
    { id: "matrix", label: "Matrix", live: has(["ngn_matrix", "matrix"]) },
    { id: "bowtie", label: "Bow-tie", live: has(["ngn_bowtie", "bow_tie", "bowtie"]) },
    { id: "highlight", label: "Highlight", live: has(["ngn_highlight", "highlight"]) },
    { id: "drag", label: "Drag-drop", live: has(["drag_drop"]) },
    { id: "sata", label: "SATA", live: has(["select_all", "sata"]) },
  ].filter((row) => row.live);
}

function pharmacyQuestionTypes(bankTypes: Record<string, number>): BoardQuestionTypeIcon[] {
  const count = (types: string[]) =>
    types.reduce((sum, type) => sum + (bankTypes[type.toLowerCase()] ?? 0), 0);
  return [
    { id: "vignette", label: "Vignettes", live: count(["vignette"]) > 0 },
    { id: "calc", label: "Calculations", live: count(["constructed_response"]) > 0 },
    { id: "sata", label: "SATA", live: count(["select_all", "sata"]) > 0 },
    { id: "exhibit", label: "Exhibits", live: count(["exhibit"]) > 0 },
  ].filter((row) => row.live);
}

function genericQuestionTypes(): BoardQuestionTypeIcon[] {
  return [
    { id: "mcq", label: "MCQ vignettes", live: true },
    { id: "timed", label: "Timed blocks", live: true },
    { id: "full", label: "Full exams", live: true },
  ];
}

export function buildBoardVisuals(input: {
  slug: BoardSlug;
  examKey: ExamSeoKey;
  units: BoardQuestionUnits | null;
  offer: NonNullable<BoardLandingModel["heroOffer"]>;
  bankTypes?: Record<string, number>;
}): BoardLandingVisuals {
  const typicalRange =
    input.slug === "naplex" ? naplexTypicalPrepRangeLabel() : formatTypicalPrepRangeLabel(input.examKey);
  let questionTypes: BoardQuestionTypeIcon[] = [];
  if (input.slug === "nclex") {
    questionTypes = nclexQuestionTypes(input.bankTypes ?? {});
  } else if (input.slug === "naplex") {
    questionTypes = pharmacyQuestionTypes(input.bankTypes ?? {});
  } else {
    questionTypes = genericQuestionTypes();
  }
  return {
    proPrice: input.offer.proPrice,
    typicalRange,
    typicalPeriod: input.offer.typicalPeriod ?? "30-day prep",
    liveCount: input.units ? formatExactQuestionCount(scoredQuestionCount(input.units)) : input.offer.liveQuestions,
    steps: [...STEPS],
    questionTypes,
    showPracticeDevice: input.slug === "nclex" || input.slug === "naplex",
  };
}

export function formatHeroCtaMicrocopy(liveCount: string | null): string {
  const countPart = liveCount ? `${liveCount} live questions` : "Live question bank";
  return `${countPart} · ${TRIAL_DAYS}-day trial · no payment method`;
}
