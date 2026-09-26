import { CAT_MAX_QUESTIONS, CAT_MIN_QUESTIONS } from "@/lib/questions/cat-engine";

/** Inclusive practice-CAT range, same numbers on the setup screen and in the exam. */
export function nclexCatQuestionRange(): string {
  return `${CAT_MIN_QUESTIONS}–${CAT_MAX_QUESTIONS}`;
}

/** Badge under the Full preset. CAT is a range; a fixed full form is the minimum. */
export function nclexFullPracticeBadge(catEnabled: boolean): string {
  return catEnabled ? nclexCatQuestionRange() : String(CAT_MIN_QUESTIONS);
}

/** Sentence-length label for the launcher summary and the running exam. */
export function nclexFullPracticeLengthLabel(catEnabled: boolean): string {
  return catEnabled
    ? `${nclexCatQuestionRange()} questions`
    : `${CAT_MIN_QUESTIONS} questions`;
}

export function nclexFullPracticeHint(catEnabled: boolean): string {
  return catEnabled ? "Practice CAT" : "Fixed length";
}
