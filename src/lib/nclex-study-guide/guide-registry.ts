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
export type StudyGuideExam = "nclex" | "naplex" | "aanp-fnp";

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
      owner: "AANPCB",
      programNoun: "nurse practitioner program",
    },
  },
};

export const STUDY_GUIDE_EXAMS = Object.keys(STUDY_GUIDES) as StudyGuideExam[];

export function isStudyGuideExam(value: unknown): value is StudyGuideExam {
  return typeof value === "string" && value in STUDY_GUIDES;
}

/** Config for an exam, or undefined when that exam has no book. */
export function getStudyGuideConfig(exam: string): StudyGuideConfig | undefined {
  return isStudyGuideExam(exam) ? STUDY_GUIDES[exam] : undefined;
}

/** Route bases for every guide, for premium gating and middleware matchers. */
export function studyGuideRouteBases(): string[] {
  return STUDY_GUIDE_EXAMS.map((e) => STUDY_GUIDES[e].routeBase);
}

/**
 * The guide whose reader owns this pathname, if any. Used by the app shell to
 * decide whether to collapse into immersive mode.
 */
export function studyGuideForPathname(pathname: string): StudyGuideConfig | undefined {
  return STUDY_GUIDE_EXAMS.map((e) => STUDY_GUIDES[e]).find(
    (g) => pathname === g.routeBase || pathname.startsWith(`${g.routeBase}/`)
  );
}
