import type { LandingQuestion } from "@/lib/marketing/board-landing/model";

const STEM_MAX = 110;

export type LandingQuestionMockModel = {
  stem: string;
  options: string[];
  correctText: string;
};

/** Lightweight stem + options for a decorative practice UI (no rationales in flight). */
export function buildLandingQuestionMock(question: LandingQuestion | null): LandingQuestionMockModel | null {
  if (!question) return null;
  const stem =
    question.stem.length > STEM_MAX ? `${question.stem.slice(0, STEM_MAX - 1)}…` : question.stem;
  const correct = question.options.find((option) => option.correct);
  return {
    stem,
    options: question.options.map((option) => option.text),
    correctText: correct?.text ?? "",
  };
}
