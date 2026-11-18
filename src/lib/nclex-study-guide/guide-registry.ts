/**
 * Per-exam configuration for the study guide reader.
 *
 * Everything that used to be an NCLEX literal scattered across the codebase
 * lives here instead. Before this existed, the `/nclex/study-guide` prefix
 * alone was duplicated in five files that had to stay in sync (routes,
 * premium-routes, middleware, app-shell, and the physical route folder), and
 * the guide id was repeated in the query layer, both pages, the TOC API, and
 * the ingest script.
 *
 * Adding an exam should mean adding one entry here plus a route folder.
 */

/** Exams that ship a study guide book on the public nav. A subset of `ExamSlug`. */
export type StudyGuideExam = "nclex" | "naplex" | "aanp-fnp" | "pance";

/**
 * USMLE is step-aware: one book per Step, not one book for the whole exam.
 * It stays out of `StudyGuideExam` so homepages and offer cards do not grow a
 * link until the public flag is turned on in the sidebar.
 */
export type UsmleGuideStep = "step1" | "step2" | "step3";

export type StudyGuideBookExam = StudyGuideExam | "usmle";

export type StudyGuideConfig = {
  exam: StudyGuideExam;
  /**
   * Sub-variant within the exam. NCLEX splits rn/pn; exams without tracks use
   * "std" rather than null, because Postgres treats NULLs as distinct and
   * would not group them.
   */
  track: string;
  /** Stable row id in `sg_guides`, also the ingest target. */
  guideId: string;
  /** Fallback title when the database row is unavailable. */
  title: string;
  /** Title the ingest writes to `sg_guides.title` — the book's own cover name. */
  bookTitle: string;
  /** Route base for the reader, e.g. `/nclex/study-guide`. */
  routeBase: string;
  /** Exam hub to offer as a way out when the guide cannot load. */
  hubHref: string;
  /** Markdown source directory, relative to `content/`. */
  contentDir: string;
  /**
   * Public URL prefix for figures. Baked into `sg_chapters.bodyHtml` at ingest,
   * so changing it later requires a re-ingest.
   */
  visualsPrefix: string;
  /** Trademark and scope wording for the reader's footer disclaimer. */
  legal: {
    /** Exam name as trademarked, without the ® symbol. */
    examName: string;
    /** Trademark holder, e.g. NCSBN. */
    owner: string;
    /** What the guide is not a substitute for, e.g. "nursing program". */
    programNoun: string;
  };
};

/** Same book fields, with the USMLE exam slug. Kept off `StudyGuideConfig` so existing boards stay typed. */
export type UsmleStudyGuideConfig = Omit<StudyGuideConfig, "exam"> & { exam: "usmle" };

export type AnyGuideConfig = StudyGuideConfig | UsmleStudyGuideConfig;

export const STUDY_GUIDES: Record<StudyGuideExam, StudyGuideConfig> = {
  nclex: {
    exam: "nclex",
    track: "rn",
    // Historical id — the original migration seeded this row, and chapter rows
    // plus reading progress reference it. Renaming it would orphan both.
    guideId: "sg_guide_nclex_rn_placeholder",
    title: "NCLEX-RN Study Guide",
    // Preserved verbatim: this is already the stored title for the live row.
    bookTitle: "AnyExamEasy NCLEX Reference Book",
    routeBase: "/nclex/study-guide",
    hubHref: "/nclex",
    contentDir: "nclex-study-guide",
    visualsPrefix: "/nclex-study-guide/visuals/",
    legal: {
      examName: "NCLEX",
      owner: "NCSBN",
      programNoun: "nursing program",
    },
  },
  naplex: {
    exam: "naplex",
    track: "std",
    guideId: "sg_guide_naplex_std",
    title: "NAPLEX Study Guide",
    bookTitle: "AnyExamEasy NAPLEX Reference Book",
    routeBase: "/naplex/study-guide",
    hubHref: "/naplex",
    contentDir: "naplex-study-guide",
    visualsPrefix: "/naplex-study-guide/visuals/",
    legal: {
      examName: "NAPLEX",
      owner: "NABP",
      programNoun: "pharmacy program",
    },
  },
  "aanp-fnp": {
    exam: "aanp-fnp",
    track: "std",
    guideId: "sg_guide_aanp_fnp_std",
    title: "AANP FNP Study Guide",
    bookTitle: "AnyExamEasy AANP FNP Reference Book",
    routeBase: "/aanp-fnp/study-guide",
    hubHref: "/prep/aanp-fnp",
    contentDir: "aanp-fnp-study-guide",
    visualsPrefix: "/aanp-fnp-study-guide/visuals/",
    legal: {
      examName: "AANP FNP",
      owner: "NPCB",
      programNoun: "nurse practitioner program",
    },
  },
  pance: {
    exam: "pance",
    track: "std",
    guideId: "sg_guide_pance_std",
    title: "PANCE Study Guide",
    bookTitle: "AnyExamEasy PANCE Reference Book",
    routeBase: "/pance/study-guide",
    hubHref: "/pance",
    contentDir: "pance-study-guide",
    visualsPrefix: "/pance-study-guide/visuals/",
    legal: {
      examName: "PANCE",
      owner: "NCCPA",
      programNoun: "PA program",
    },
  },
};

const USMLE_LEGAL = {
  examName: "USMLE",
  owner: "NBME and FSMB",
  programNoun: "medical school",
} as const;

/** One book per Step. Tracks are step1, step2, and step3 in `sg_guides`. */
export const USMLE_STUDY_GUIDES: Record<UsmleGuideStep, UsmleStudyGuideConfig> = {
  step1: {
    exam: "usmle",
    track: "step1",
    guideId: "sg_guide_usmle_step1",
    title: "USMLE Step 1 Study Guide",
    bookTitle: "AnyExamEasy USMLE Step 1 Reference Book",
    routeBase: "/usmle/study-guide/step-1",
    hubHref: "/usmle",
    contentDir: "usmle-study-guide/step-1",
    visualsPrefix: "/usmle-study-guide/step-1/visuals/",
    legal: USMLE_LEGAL,
  },
  step2: {
    exam: "usmle",
    track: "step2",
    guideId: "sg_guide_usmle_step2",
    title: "USMLE Step 2 CK Study Guide",
    bookTitle: "AnyExamEasy USMLE Step 2 CK Reference Book",
    routeBase: "/usmle/study-guide/step-2-ck",
    hubHref: "/usmle",
    contentDir: "usmle-study-guide/step-2-ck",
    visualsPrefix: "/usmle-study-guide/step-2-ck/visuals/",
    legal: USMLE_LEGAL,
  },
  step3: {
    exam: "usmle",
    track: "step3",
    guideId: "sg_guide_usmle_step3",
    title: "USMLE Step 3 Study Guide",
    bookTitle: "AnyExamEasy USMLE Step 3 Reference Book",
    routeBase: "/usmle/study-guide/step-3",
    hubHref: "/usmle",
    contentDir: "usmle-study-guide/step-3",
    visualsPrefix: "/usmle-study-guide/step-3/visuals/",
    legal: USMLE_LEGAL,
  },
};

export const USMLE_GUIDE_STEPS = Object.keys(USMLE_STUDY_GUIDES) as UsmleGuideStep[];

const USMLE_ROUTE_STEP: Record<UsmleGuideStep, string> = {
  step1: "step-1",
  step2: "step-2-ck",
  step3: "step-3",
};

export const USMLE_GUIDE_STEP_LABEL: Record<UsmleGuideStep, string> = {
  step1: "Step 1",
  step2: "Step 2 CK",
  step3: "Step 3",
};

/** Index opens on Step 1. The reader switcher moves between books. */
export const USMLE_GUIDE_INDEX_PATH = "/usmle/study-guide";

export function usmleGuideStepFromRoute(routeStep: string | null | undefined): UsmleGuideStep | undefined {
  const match = USMLE_GUIDE_STEPS.find((step) => USMLE_ROUTE_STEP[step] === (routeStep ?? "").trim());
  return match;
}

export function usmleGuideStepFromTrack(track: string | null | undefined): UsmleGuideStep | undefined {
  if (track === "step1" || track === "step2" || track === "step3") return track;
  return undefined;
}

export function allStudyGuideBooks(): AnyGuideConfig[] {
  return [...Object.values(STUDY_GUIDES), ...Object.values(USMLE_STUDY_GUIDES)];
}

export const STUDY_GUIDE_EXAMS = Object.keys(STUDY_GUIDES) as StudyGuideExam[];

export function isStudyGuideExam(value: unknown): value is StudyGuideExam {
  return typeof value === "string" && value in STUDY_GUIDES;
}

/** Config for an exam, or undefined when that exam has no book. */
export function getStudyGuideConfig(exam: string): StudyGuideConfig | undefined {
  return isStudyGuideExam(exam) ? STUDY_GUIDES[exam] : undefined;
}

/** Route bases for every guide, including the hidden USMLE books. */
export function studyGuideRouteBases(): string[] {
  return allStudyGuideBooks().map((book) => book.routeBase);
}

/**
 * The guide whose reader owns this pathname, if any. Used by the app shell to
 * decide whether to collapse into immersive mode.
 */
export function studyGuideForPathname(pathname: string): AnyGuideConfig | undefined {
  return allStudyGuideBooks().find(
    (g) => pathname === g.routeBase || pathname.startsWith(`${g.routeBase}/`)
  );
}
