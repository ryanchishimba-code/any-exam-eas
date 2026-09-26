/** Board-generic clinical-case / NGN content. Not a QuestionBankItem. */

export const RESPONSE_FORMATS = [
  "mc_single",
  "mr_sata",
  "mr_select_n",
  "matrix_mc",
  "matrix_mr",
  "dropdown_cloze",
  "dropdown_rationale",
  "highlight_text",
  "bowtie",
] as const;

export type ResponseFormat = (typeof RESPONSE_FORMATS)[number];

export const SCORING_RULES = ["zero_one", "plus_minus", "rationale"] as const;
export type ScoringRule = (typeof SCORING_RULES)[number];

export const ITEM_TYPES = ["case_item", "bowtie", "trend"] as const;
export type ItemType = (typeof ITEM_TYPES)[number];

export const NGN_STATUSES = [
  "draft",
  "in_review",
  "approved",
  "pilot",
  "published",
  "retired",
] as const;
export type NgnStatus = (typeof NGN_STATUSES)[number];

export type NgnOption = { id: string; text: string };

export type NgnRationale = {
  short: string;
  expanded: {
    perOption: Record<string, { verdict: string | string[]; text: string }>;
    cjmmCoaching: string;
    pointsLost: string;
    takeaway: string;
  };
};

export type NgnReference = { src: string; locator?: string };

export type SourceRef = {
  id: string;
  title: string;
  url: string;
  tier?: string;
  verification?: string;
};

export type NgnPatient = {
  displayName: string;
  age: number;
  sex: string;
  weightKg: number;
  allergies: string;
  history?: string;
};

export type NgnTimepoint = { id: string; label: string };

export type ChartEntry = { time: string; text: string };

export type ChartTab = {
  id: string;
  label: string;
  entries?: ChartEntry[];
  columns?: string[];
  rows?: string[][];
  rowTimepoints?: string[];
  columnTimepoints?: string[];
};

export type NgnChart = { tabs: ChartTab[] };

export type NgnItem = {
  id: string;
  version: number;
  itemType: ItemType;
  caseId: string | null;
  caseStep: number | null;
  caseVersion?: number | null;
  cjmmFunction: string | string[];
  timepoint: string | null;
  responseFormat: ResponseFormat;
  scoringRule: ScoringRule;
  maxPoints: number;
  stem: string;
  payload: Record<string, unknown>;
  exhibit?: Record<string, unknown> | null;
  rationale: NgnRationale;
  clientNeeds: { category?: string; subcategory?: string } & Record<string, unknown>;
  references: NgnReference[];
  rnFlags: string[];
  status?: string;
};

export type NgnCase = {
  id: string;
  version: number;
  title: string;
  boardProfile: string;
  status?: string;
  primaryClientNeed: string;
  setting: string;
  patient: NgnPatient;
  timepoints: NgnTimepoint[];
  chart: NgnChart;
  revealRule: string;
  references: NgnReference[];
  itemIds?: string[];
  items: NgnItem[];
};

export type PilotDocument = {
  schemaVersion: string;
  batchId: string;
  boardProfile: string;
  generatedAt?: string;
  status?: string;
  servingPolicy?: string;
  displayRules?: unknown;
  generationMeta?: unknown;
  sources: SourceRef[];
  cases: NgnCase[];
  standalone: NgnItem[];
};

export type ScorableItem = {
  responseFormat: string;
  payload: unknown;
  scoringRule?: string;
};

export type ValidationIssue = {
  level: "error" | "warning";
  path: string;
  message: string;
};
