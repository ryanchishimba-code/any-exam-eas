import type { StudyFeedBoard } from "@/lib/study-feed/catalog";

/**
 * USMLE flashcard feed. Hidden until USMLE_STUDY_FEED_PUBLIC (or the
 * NEXT_PUBLIC_ twin) is 1. Admins can open the route before that.
 * One preference slug, three decks. Progress is stored per step.
 */

export const USMLE_FEED_PATH = "/study-tools/usmle/feed";

export const USMLE_FEED_STEP_EXAMS = ["usmle-step-1", "usmle-step-2", "usmle-step-3"] as const;
export type UsmleFeedStepExam = (typeof USMLE_FEED_STEP_EXAMS)[number];

export type UsmleFeedStep = {
  exam: UsmleFeedStepExam;
  /** Query value. Step 1 is the default and uses a clean URL. */
  query: string;
  label: string;
  outline: string;
};

export const USMLE_FEED_STEPS: readonly UsmleFeedStep[] = [
  {
    exam: "usmle-step-1",
    query: "1",
    label: "Step 1",
    outline: "USMLE Content Outline, foundational science",
  },
  {
    exam: "usmle-step-2",
    query: "2ck",
    label: "Step 2 CK",
    outline: "USMLE Content Outline, clinical diagnosis and management",
  },
  {
    exam: "usmle-step-3",
    query: "3",
    label: "Step 3",
    outline: "USMLE Step 3, foundations of independent practice and advanced clinical medicine",
  },
];

export const USMLE_STEP_FEEDS: Record<UsmleFeedStepExam, StudyFeedBoard> = {
  "usmle-step-1": {
    exam: "usmle-step-1",
    contentDir: "usmle-feed/step-1",
    idPrefix: "usmle1",
    label: "USMLE Step 1",
    href: USMLE_FEED_PATH,
    apiBase: "/api/study-feed/usmle-step-1",
    testId: "usmle-step-1-feed",
    description: "Flashcard feed for USMLE Step 1, organized by the content outline.",
  },
  "usmle-step-2": {
    exam: "usmle-step-2",
    contentDir: "usmle-feed/step-2",
    idPrefix: "usmle2",
    label: "USMLE Step 2 CK",
    href: `${USMLE_FEED_PATH}?step=2ck`,
    apiBase: "/api/study-feed/usmle-step-2",
    testId: "usmle-step-2-feed",
    description: "Flashcard feed for USMLE Step 2 CK, organized by the content outline.",
  },
  "usmle-step-3": {
    exam: "usmle-step-3",
    contentDir: "usmle-feed/step-3",
    idPrefix: "usmle3",
    label: "USMLE Step 3",
    href: `${USMLE_FEED_PATH}?step=3`,
    apiBase: "/api/study-feed/usmle-step-3",
    testId: "usmle-step-3-feed",
    description: "Flashcard feed for USMLE Step 3, organized by the content outline.",
  },
};

export type UsmleFeedStepChoice = {
  id: UsmleFeedStepExam;
  label: string;
  href: string;
};

export function isUsmleFeedStep(exam: string | null | undefined): exam is UsmleFeedStepExam {
  return Boolean(exam && (USMLE_FEED_STEP_EXAMS as readonly string[]).includes(exam));
}

/**
 * Student-facing links. NEXT_PUBLIC_ so the sidebar and homepages can read it.
 * Unset means no links. Turning it on needs a rebuild.
 */
export function isUsmleStudyFeedPublic(): boolean {
  const raw = process.env.NEXT_PUBLIC_USMLE_STUDY_FEED_PUBLIC ?? "";
  return raw === "1" || raw === "true";
}

export function usmleBoardFromQuery(step: string | undefined | null): StudyFeedBoard {
  const match = USMLE_FEED_STEPS.find((item) => item.query === (step ?? "").trim());
  return USMLE_STEP_FEEDS[(match ?? USMLE_FEED_STEPS[0]).exam];
}

export function usmleFeedStepChoices(): UsmleFeedStepChoice[] {
  return USMLE_FEED_STEPS.map((step) => ({
    id: step.exam,
    label: step.label,
    href: USMLE_STEP_FEEDS[step.exam].href,
  }));
}

/** Link target once the feed is public. The page opens on Step 1. */
export function usmlePublicFeedBoard(): StudyFeedBoard {
  return {
    ...USMLE_STEP_FEEDS["usmle-step-1"],
    label: "USMLE Feed",
    href: USMLE_FEED_PATH,
    description: "Full-screen USMLE flashcard feed for paid plans.",
  };
}
