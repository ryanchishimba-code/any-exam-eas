/**
 * Generic anti-clustering sequencer types.
 *
 * Exam-agnostic: any board (NAPLEX, NCLEX, USMLE, MPJE…) can map its selected
 * question pool to `SequenceItem`s and get a board-realistic delivery order that
 * spreads similar content and removes answer-pattern predictability.
 */

export type SequenceItem = {
  /** Stable question id. */
  id: string;
  /** Major blueprint domain / organ system used for coarse spreading. */
  domain: string;
  /** Specific concept keys (drug class, mechanism, calc subtype, teaching point…). */
  concepts: string[];
  /** 1 (easiest) – 5 (hardest). */
  difficulty: number;
  /** Item format (mcq, select_all, constructed_response, vignette…). */
  format: string;
  /** Normalized correct-answer key (letter or value) for streak balancing. */
  answer: string;
};

export type SequencingConfig = {
  /** Minimum index separation between two items of the same domain. */
  domainMinGap: number;
  /** Minimum index separation between two items sharing any concept. */
  conceptMinGap: number;
  /** Maximum allowed run of identical correct answers (3+ is forbidden ⇒ 2). */
  maxAnswerStreak: number;
  /** Disallow two consecutive items at/above the hard threshold. */
  forbidAdjacentHard: boolean;
  /** Difficulty ≥ this counts as "hard". */
  hardDifficultyThreshold: number;
};

export const DEFAULT_SEQUENCING_CONFIG: SequencingConfig = {
  domainMinGap: 4,
  conceptMinGap: 5,
  maxAnswerStreak: 2,
  forbidAdjacentHard: true,
  hardDifficultyThreshold: 4,
};

export type SequencingReport = {
  total: number;
  /** Smallest gap observed between any two same-domain items (Infinity if domain unique). */
  domainMinSeparation: number;
  /** Smallest gap observed between any two concept-sharing items. */
  conceptMinSeparation: number;
  /** Count of correct answers by key. */
  answerDistribution: Record<string, number>;
  /** Longest run of identical correct answers in the final order. */
  longestAnswerStreak: number;
  /** Number of adjacent hard–hard pairs remaining. */
  adjacentHardPairs: number;
  /** Domain-gap constraint violations remaining (gap < domainMinGap). */
  domainGapViolations: number;
  /** Concept-gap constraint violations remaining. */
  conceptGapViolations: number;
  /** All hard constraints satisfied within tolerance. */
  passed: boolean;
  notes: string[];
};

export type SequencingResult<T> = {
  /** Items in final delivery order. */
  ordered: T[];
  report: SequencingReport;
};
