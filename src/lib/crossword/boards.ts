import { freePracticeHref } from "@/lib/marketing/free-practice/paths";
import type { ExamSlug } from "@/types/edtech";

export const CROSSWORD_BOARDS = [
  "nclex",
  "usmle",
  "naplex",
  "pance",
  "aanp-fnp",
  "npte-pt",
] as const satisfies readonly ExamSlug[];

export type CrosswordBoard = (typeof CROSSWORD_BOARDS)[number];

export const CROSSWORD_PRACTICE_NOTE = "Practice, not a promise you'll pass.";

type BoardProfile = {
  slug: CrosswordBoard;
  shortName: string;
  examName: string;
  focus: string;
  lede: string;
  study: { href: string; label: string }[];
};

const PROFILES: Record<CrosswordBoard, BoardProfile> = {
  nclex: {
    slug: "nclex",
    shortName: "NCLEX",
    examName: "NCLEX-RN",
    focus: "High-yield clues on drugs, labs, isolation, and nursing priorities.",
    lede: "Drugs, labs, isolation, and the priorities nurses are tested on.",
    study: [
      { href: "/resources/best-nclex-practice-questions-2026", label: "NCLEX practice questions" },
      { href: "/resources/nclex-study-guide-roadmap", label: "NCLEX study roadmap" },
      { href: "/daily/nclex", label: "NCLEX question of the day" },
    ],
  },
  usmle: {
    slug: "usmle",
    shortName: "USMLE",
    examName: "USMLE",
    focus: "High-yield clues on mechanisms, classic findings, and pathophysiology.",
    lede: "Mechanisms, microbes, and the classic findings Step exams repeat.",
    study: [
      { href: "/resources/best-usmle-step-2-practice-questions-2026", label: "USMLE Step 2 practice questions" },
      { href: "/resources/usmle-step-1-practice-questions-2026", label: "USMLE Step 1 practice questions" },
      { href: "/daily/usmle", label: "USMLE question of the day" },
    ],
  },
  naplex: {
    slug: "naplex",
    shortName: "NAPLEX",
    examName: "NAPLEX",
    focus: "High-yield clues on drugs, interactions, monitoring, and counseling.",
    lede: "Drug therapy, interactions, monitoring, and the counseling points pharmacists use.",
    study: [
      { href: "/resources/best-naplex-practice-questions-2026", label: "NAPLEX practice questions" },
      { href: "/resources/naplex-calculations-study-guide-2026", label: "NAPLEX calculations guide" },
      { href: "/daily/naplex", label: "NAPLEX question of the day" },
    ],
  },
  pance: {
    slug: "pance",
    shortName: "PANCE",
    examName: "PANCE",
    focus: "High-yield clues on classic findings, diagnoses, and first-line care.",
    lede: "Classic presentations and first-line choices across the PANCE blueprint.",
    study: [
      { href: "/resources/best-pance-practice-questions-2026", label: "PANCE practice questions" },
      { href: "/pance-study-guide", label: "PANCE study guide" },
      { href: "/daily/pance", label: "PANCE question of the day" },
    ],
  },
  "aanp-fnp": {
    slug: "aanp-fnp",
    shortName: "AANP FNP",
    examName: "AANP FNP",
    focus: "High-yield primary care clues on common conditions and prevention.",
    lede: "Primary care across the lifespan: common diagnoses, prevention, and first-line plans.",
    study: [
      { href: "/resources/best-aanp-fnp-practice-questions-2026", label: "AANP FNP practice questions" },
      { href: "/resources/aanp-fnp-study-guide-blueprint", label: "AANP FNP study guide" },
      { href: "/daily/aanp-fnp", label: "AANP FNP question of the day" },
    ],
  },
  "npte-pt": {
    slug: "npte-pt",
    shortName: "NPTE-PT",
    examName: "NPTE-PT",
    focus: "High-yield clues on anatomy, special tests, gait, and rehab.",
    lede: "Anatomy, special tests, gait, and the rehab decisions the NPTE-PT emphasizes.",
    study: [
      { href: "/resources/best-npte-practice-questions-2026", label: "NPTE-PT practice questions" },
      { href: "/resources/npte-pt-study-guide-fsbpt-blueprint", label: "NPTE-PT study guide" },
      { href: "/daily/npte-pt", label: "NPTE-PT question of the day" },
    ],
  },
};

export function isCrosswordBoard(value: string): value is CrosswordBoard {
  return (CROSSWORD_BOARDS as readonly string[]).includes(value);
}

export function boardProfile(board: CrosswordBoard): BoardProfile {
  return PROFILES[board];
}

export function quizHref(board: CrosswordBoard): string {
  return freePracticeHref(board);
}

export function signupHref(board: CrosswordBoard): string {
  const slug = encodeURIComponent(board);
  return `/signup?exam=${slug}&board=${slug}`;
}

export function boardHomeHref(board: CrosswordBoard): string {
  return `/${board}`;
}
