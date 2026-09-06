/** Mastery Engine — Skill Cell state machine types. */

export type CellState =
  | "unseen"
  | "primed"
  | "learning"
  | "shaky"
  | "stable"
  | "exam_ready";

export type CjmmFunction =
  | "recognize_cues"
  | "analyze_cues"
  | "prioritize_hypotheses"
  | "generate_solutions"
  | "take_action"
  | "evaluate_outcomes";

export type StudyItemMode = "tutor" | "timed";

export type RecentItemOutcome = {
  correct: boolean;
  mode: StudyItemMode;
  at: number; // epoch ms
};

export type SkillCellDef = {
  /** exam:system:topic */
  cellKey: string;
  examSlug: string;
  /** Client Needs / system id */
  systemKey: string;
  systemLabel: string;
  topicKey: string;
  topicLabel: string;
  blueprintWeight: number;
};

export type UserCellStateSnapshot = {
  cellKey: string;
  state: CellState;
  itemsAnswered: number;
  recentTutor: RecentItemOutcome[];
  recentTimed: RecentItemOutcome[];
  lastSessionAt: number | null;
};

export type MasteryItemTags = {
  clientNeeds?: string | null;
  cjmmFunction?: CjmmFunction | null;
  drugIds?: string[];
  anatomyId?: string | null;
  labFlags?: string[];
  /** NAPLEX Content Outline domain 1–5. */
  naplexDomain?: 1 | 2 | 3 | 4 | 5 | null;
  /** Optional NAPLEX subtopic slug. */
  naplexSubtopic?: string | null;
  /** Calculation pattern flags (Domain 1). */
  calcFlags?: string[];
  /** High-yield primer card id (optional). */
  primerCardId?: string | null;
};

export type SessionCandidate = {
  questionId: string;
  bankItemId?: string;
  cellKey: string;
  systemKey: string;
  weight: number;
  /** Distance below competence bar (0–1). Higher = weaker. */
  distanceBelowBar: number;
  cellState: CellState;
  highYield: boolean;
  dueForSpacing: boolean;
  tags?: MasteryItemTags;
};

export type BuiltTodaySession = {
  questionIds: string[];
  /** Optional primer card shown once before a cell's first item. */
  primers: Array<{ beforeQuestionId: string; cardId: string; cellKey: string }>;
  cellKeys: string[];
  size: number;
};

export type MasteryRollup = {
  coveragePct: number | null;
  competencePct: number | null;
  topLeaks: Array<{
    cellKey: string;
    systemLabel: string;
    topicLabel: string;
    state: CellState;
    weight: number;
  }>;
};

export const CELL_STATE_ORDER: CellState[] = [
  "unseen",
  "primed",
  "learning",
  "shaky",
  "stable",
  "exam_ready",
];
