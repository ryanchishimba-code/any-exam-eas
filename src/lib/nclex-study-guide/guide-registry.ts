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

/** Exams that ship a study guide book. A subset of `ExamSlug`. */
export type StudyGuideExam = "nclex" | "naplex" | "aanp-fnp" | "pance";

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

export const STUDY_GUIDE_EXAMS = Object.keys(STUDY_GUIDES) as StudyGuideExam[];

export function isStudyGuideExam(value: unknown): value is StudyGuideExam {
  return typeof value === "string" && value in STUDY_GUIDES;
}

/**
 * Config for an exam, or undefined when that exam has no book.
 *
 * USMLE is intentionally absent. Homepages, the board hub, and the offer
 * cards read this helper. The USMLE books stay hidden until their own flags
 * are on, and even then the sidebar uses `isUsmleStudyGuidePublic` rather than
 * this map, so an unset flag cannot change `/usmle` or any homepage.
 */
export function getStudyGuideConfig(exam: string): StudyGuideConfig | undefined {
  return isStudyGuideExam(exam) ? STUDY_GUIDES[exam] : undefined;
}

/** One USMLE entry, three books. Step 2 is Clinical Knowledge, not CS. */
export type UsmleStudyStepId = "step-1" | "step-2-ck" | "step-3";

export type UsmleStudyBook = {
  exam: "usmle";
  step: UsmleStudyStepId;
  /** Client cache key. Chapter slugs collide across the three books. */
  readerKey: `usmle-${UsmleStudyStepId}`;
  shortLabel: string;
  track: UsmleStudyStepId;
  guideId: string;
  title: string;
  bookTitle: string;
  routeBase: string;
  hubHref: string;
  contentDir: string;
  visualsPrefix: string;
  legal: StudyGuideConfig["legal"];
};

const USMLE_LEGAL: StudyGuideConfig["legal"] = {
  examName: "USMLE",
  owner: "the Federation of State Medical Boards and the National Board of Medical Examiners",
  programNoun: "medical school or residency program",
};

export const USMLE_STUDY_GUIDE = {
  exam: "usmle" as const,
  /** Hub that picks a book. Not itself a chapter reader. */
  hubHref: "/usmle/study-guide",
  legal: USMLE_LEGAL,
  steps: {
    "step-1": {
      exam: "usmle",
      step: "step-1",
      readerKey: "usmle-step-1",
      shortLabel: "Step 1",
      track: "step-1",
      guideId: "sg_guide_usmle_step_1",
      title: "USMLE Step 1 Study Guide",
      bookTitle: "AnyExamEasy USMLE Step 1 Reference Book",
      routeBase: "/usmle/study-guide/step-1",
      hubHref: "/usmle",
      contentDir: "usmle-study-guide/step-1",
      visualsPrefix: "/usmle-study-guide/step-1/visuals/",
      legal: USMLE_LEGAL,
    },
    "step-2-ck": {
      exam: "usmle",
      step: "step-2-ck",
      readerKey: "usmle-step-2-ck",
      shortLabel: "Step 2 CK",
      track: "step-2-ck",
      guideId: "sg_guide_usmle_step_2_ck",
      title: "USMLE Step 2 CK Study Guide",
      bookTitle: "AnyExamEasy USMLE Step 2 CK Reference Book",
      routeBase: "/usmle/study-guide/step-2-ck",
      hubHref: "/usmle",
      contentDir: "usmle-study-guide/step-2-ck",
      visualsPrefix: "/usmle-study-guide/step-2-ck/visuals/",
      legal: USMLE_LEGAL,
    },
    "step-3": {
      exam: "usmle",
      step: "step-3",
      readerKey: "usmle-step-3",
      shortLabel: "Step 3",
      track: "step-3",
      guideId: "sg_guide_usmle_step_3",
      title: "USMLE Step 3 Study Guide",
      bookTitle: "AnyExamEasy USMLE Step 3 Reference Book",
      routeBase: "/usmle/study-guide/step-3",
      hubHref: "/usmle",
      contentDir: "usmle-study-guide/step-3",
      visualsPrefix: "/usmle-study-guide/step-3/visuals/",
      legal: USMLE_LEGAL,
    },
  },
} as const satisfies {
  exam: "usmle";
  hubHref: string;
  legal: StudyGuideConfig["legal"];
  steps: Record<UsmleStudyStepId, UsmleStudyBook>;
};

export const USMLE_STUDY_STEPS = Object.keys(USMLE_STUDY_GUIDE.steps) as UsmleStudyStepId[];

export function isUsmleStudyStep(value: unknown): value is UsmleStudyStepId {
  return typeof value === "string" && value in USMLE_STUDY_GUIDE.steps;
}

export function usmleStudyBook(step: UsmleStudyStepId): UsmleStudyBook {
  return USMLE_STUDY_GUIDE.steps[step];
}

/** Saved bank field (`usmle-step-2`) → the matching book. Unknown values fall back to Step 1. */
export function usmleStudyBookForField(fieldId: string | null | undefined): UsmleStudyBook {
  if (fieldId === "usmle-step-2") return usmleStudyBook("step-2-ck");
  if (fieldId === "usmle-step-3") return usmleStudyBook("step-3");
  return usmleStudyBook("step-1");
}

export function usmleStudyGuideRouteBases(): string[] {
  return USMLE_STUDY_STEPS.map((step) => USMLE_STUDY_GUIDE.steps[step].routeBase);
}

/** Route bases for every guide, for premium gating and middleware matchers. */
export function studyGuideRouteBases(): string[] {
  return [
    ...STUDY_GUIDE_EXAMS.map((e) => STUDY_GUIDES[e].routeBase),
    ...usmleStudyGuideRouteBases(),
  ];
}

/**
 * The guide whose reader owns this pathname, if any. Used by the app shell to
 * decide whether to collapse into immersive mode.
 */
export function studyGuideForPathname(
  pathname: string
): StudyGuideConfig | UsmleStudyBook | undefined {
  const published = STUDY_GUIDE_EXAMS.map((e) => STUDY_GUIDES[e]).find(
    (g) => pathname === g.routeBase || pathname.startsWith(`${g.routeBase}/`)
  );
  if (published) return published;
  return USMLE_STUDY_STEPS.map((step) => USMLE_STUDY_GUIDE.steps[step]).find(
    (g) => pathname === g.routeBase || pathname.startsWith(`${g.routeBase}/`)
  );
}
