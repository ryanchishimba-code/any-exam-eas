import type { ExamSlug } from "@/types/edtech";
import {
  isUsmleFeedStep,
  isUsmleStudyFeedPublic,
  USMLE_FEED_PATH,
  USMLE_STEP_FEEDS,
  usmlePublicFeedBoard,
  type UsmleFeedStepExam,
} from "@/lib/study-feed/usmle-feed";

/** Boards with a public paid flashcard feed. NPTE does not have one. USMLE stays hidden until its flag is on. */
export const STUDY_FEED_EXAMS = ["pance", "nclex", "naplex", "aanp-fnp"] as const;
export type StudyFeedExam = (typeof STUDY_FEED_EXAMS)[number];
export type FeedCatalogExam = StudyFeedExam | UsmleFeedStepExam;

export type StudyFeedBoard = {
  exam: FeedCatalogExam;
  /** Directory under content/. */
  contentDir: string;
  /** Card id prefix. FNP cards are `fnp-*` even though the exam slug is `aanp-fnp`. */
  idPrefix: string;
  label: string;
  href: string;
  /** PANCE keeps its original API. The other boards share /api/study-feed. */
  apiBase: string;
  testId: string;
  description: string;
};

export const STUDY_FEEDS: Record<StudyFeedExam, StudyFeedBoard> = {
  pance: {
    exam: "pance",
    contentDir: "pance-feed",
    idPrefix: "pance",
    label: "PANCE Feed",
    href: "/study-tools/pance/feed",
    apiBase: "/api/pance-feed",
    testId: "pance-feed",
    description: "Full-screen PANCE flashcard feed for paid plans.",
  },
  nclex: {
    exam: "nclex",
    contentDir: "nclex-feed",
    idPrefix: "nclex",
    label: "NCLEX Feed",
    href: "/study-tools/nclex/feed",
    apiBase: "/api/study-feed/nclex",
    testId: "nclex-feed",
    description: "Full-screen NCLEX flashcard feed for paid plans.",
  },
  naplex: {
    exam: "naplex",
    contentDir: "naplex-feed",
    idPrefix: "naplex",
    label: "NAPLEX Feed",
    href: "/study-tools/naplex/feed",
    apiBase: "/api/study-feed/naplex",
    testId: "naplex-feed",
    description: "Full-screen NAPLEX flashcard feed for paid plans.",
  },
  "aanp-fnp": {
    exam: "aanp-fnp",
    contentDir: "fnp-feed",
    idPrefix: "fnp",
    label: "FNP Feed",
    href: "/study-tools/aanp-fnp/feed",
    apiBase: "/api/study-feed/aanp-fnp",
    testId: "fnp-feed",
    description: "Full-screen FNP flashcard feed for paid plans.",
  },
};

export function isStudyFeedExam(exam: string | null | undefined): exam is StudyFeedExam {
  return Boolean(exam && Object.prototype.hasOwnProperty.call(STUDY_FEEDS, exam));
}

export function resolveFeedBoard(exam: string | null | undefined): StudyFeedBoard | null {
  if (!exam) return null;
  if (isStudyFeedExam(exam)) return STUDY_FEEDS[exam];
  if (isUsmleFeedStep(exam)) return USMLE_STEP_FEEDS[exam];
  return null;
}

/**
 * Student-facing link for a preference slug. USMLE returns a board only after
 * the public flag is on, so homepages and the board page stay unchanged until then.
 */
export function studyFeedForExam(exam: ExamSlug | string | null | undefined): StudyFeedBoard | null {
  if (exam === "usmle") {
    return isUsmleStudyFeedPublic() ? usmlePublicFeedBoard() : null;
  }
  if (!isStudyFeedExam(exam)) return null;
  return STUDY_FEEDS[exam];
}

/** Boards whose card JSON is served by /api/study-feed. PANCE stays on /api/pance-feed. */
export function studyFeedApiBoard(exam: string | null | undefined): StudyFeedBoard | null {
  const board = resolveFeedBoard(exam);
  if (!board || board.exam === "pance") return null;
  return board;
}

export function isStudyFeedPath(pathname: string): boolean {
  const path = pathname.split("?")[0] ?? pathname;
  if (Object.values(STUDY_FEEDS).some((board) => path === board.href)) return true;
  return isUsmleStudyFeedPublic() && path === USMLE_FEED_PATH;
}

export function isStudyFeedCardId(prefix: string, id: string): boolean {
  return new RegExp(`^${prefix}-\\d+$`).test(id);
}
