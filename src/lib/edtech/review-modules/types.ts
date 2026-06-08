/** Structured 8-section textbook-style review module content. */
export type ReviewModuleTable = {
  caption?: string;
  headers: string[];
  rows: string[][];
};

export type ReviewModuleSection = {
  id: ReviewModuleSectionId;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  tables?: ReviewModuleTable[];
};

export type ReviewModuleSectionId =
  | "why-it-matters"
  | "core-concepts"
  | "clinical-applications"
  | "comparisons"
  | "visual-aids"
  | "misconceptions"
  | "pearls"
  | "quick-summary";

export type ReviewModuleContent = {
  sections: ReviewModuleSection[];
};

export const REVIEW_MODULE_SECTION_ORDER: ReviewModuleSectionId[] = [
  "why-it-matters",
  "core-concepts",
  "clinical-applications",
  "comparisons",
  "visual-aids",
  "misconceptions",
  "pearls",
  "quick-summary",
];

export const REVIEW_MODULE_DEFAULT_TITLES: Record<ReviewModuleSectionId, string> = {
  "why-it-matters": "Why This Topic Matters",
  "core-concepts": "Core Concepts & Mechanisms",
  "clinical-applications": "High-Yield Clinical Applications",
  comparisons: "Key Comparisons & Decision Frameworks",
  "visual-aids": "Visual Learning Aids",
  misconceptions: "Common Misconceptions & Exam Traps",
  pearls: "Clinical Pearls & Mnemonics",
  "quick-summary": "Quick Summary",
};
