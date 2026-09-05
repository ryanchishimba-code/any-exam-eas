/** Rule-based NCLEX-style CAT simulation (practice only — not Pearson VUE). */

export type CatDifficulty = "easy" | "medium" | "hard";

export type CatSessionState = {
  questionNumber: number;
  ability: number;
  difficulty: CatDifficulty;
  correctCount: number;
  incorrectCount: number;
  isComplete: boolean;
  stopReason?: "minimum" | "maximum" | "confidence";
};

export const CAT_MIN_QUESTIONS = 85;
export const CAT_MAX_QUESTIONS = 150;
export const CAT_CONFIDENCE_THRESHOLD = 0.72;

/** Official NCLEX-RN wall clock (Candidate Bulletin) — fixed regardless of item count. */
export const NCLEX_CAT_TIME_LIMIT_SEC = 5 * 60 * 60;

const DIFFICULTY_WEIGHT: Record<CatDifficulty, number> = {
  easy: -0.35,
  medium: 0,
  hard: 0.35,
};

export function initCatSession(): CatSessionState {
  return {
    questionNumber: 0,
    ability: 0,
    difficulty: "medium",
    correctCount: 0,
    incorrectCount: 0,
    isComplete: false,
  };
}

export function difficultyForQuestion(index: number): CatDifficulty {
  const band = index % 3;
  if (band === 0) return "easy";
  if (band === 1) return "medium";
  return "hard";
}

export function targetDifficulty(state: CatSessionState): CatDifficulty {
  if (state.ability >= 0.45) return "hard";
  if (state.ability <= -0.35) return "easy";
  return "medium";
}

function confidenceScore(state: CatSessionState): number {
  const total = state.correctCount + state.incorrectCount;
  if (total < CAT_MIN_QUESTIONS) return 0;
  const accuracy = state.correctCount / total;
  const volumeFactor = Math.min(1, total / 95);
  return Math.abs(accuracy - 0.5) * 2 * volumeFactor;
}

export function updateCatSession(
  state: CatSessionState,
  correct: boolean,
  questionDifficulty: CatDifficulty
): CatSessionState {
  const questionNumber = state.questionNumber + 1;
  const expected = DIFFICULTY_WEIGHT[questionDifficulty];
  const delta = correct ? 0.12 : -0.14;
  const ability = clamp(state.ability + delta + expected * 0.05, -1, 1);

  const correctCount = state.correctCount + (correct ? 1 : 0);
  const incorrectCount = state.incorrectCount + (correct ? 0 : 1);
  const difficulty = targetDifficulty({ ...state, ability });

  let isComplete = false;
  let stopReason: CatSessionState["stopReason"];

  if (questionNumber >= CAT_MAX_QUESTIONS) {
    isComplete = true;
    stopReason = "maximum";
  } else if (
    questionNumber >= CAT_MIN_QUESTIONS &&
    confidenceScore({ ...state, questionNumber, correctCount, incorrectCount }) >=
      CAT_CONFIDENCE_THRESHOLD
  ) {
    isComplete = true;
    stopReason = "confidence";
  } else if (questionNumber >= CAT_MIN_QUESTIONS && questionNumber >= CAT_MIN_QUESTIONS + 20) {
    const recentAccuracy = correctCount / questionNumber;
    if (recentAccuracy >= 0.88 || recentAccuracy <= 0.42) {
      isComplete = true;
      stopReason = "confidence";
    }
  }

  return {
    questionNumber,
    ability,
    difficulty,
    correctCount,
    incorrectCount,
    isComplete,
    stopReason,
  };
}

/** Practice band label — not a pass/fail prediction. */
export function catPracticeBand(state: CatSessionState): {
  label: string;
  hint: string;
} {
  const total = state.correctCount + state.incorrectCount;
  const accuracy = total > 0 ? state.correctCount / total : 0;

  if (accuracy >= 0.78 && state.ability >= 0.35) {
    return {
      label: "Strong practice band",
      hint: "You answered most items correctly at mixed difficulty. Keep drilling weak topics.",
    };
  }
  if (accuracy >= 0.62) {
    return {
      label: "Developing practice band",
      hint: "Solid effort — review rationales for missed items and retry weak-area mode.",
    };
  }
  return {
    label: "Building practice band",
    hint: "Focus on tutor mode and foundational topics before another adaptive block.",
  };
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}
