/**
 * Standardize Deep Dive / miss rationale into five beats.
 * Keeps existing ExplanationPanel content; provides a consistent outline.
 */

import type { StudyQuestion } from "@/lib/questions/types";

export type DeepDiveBeat = {
  id: "answer" | "why_correct" | "why_distractors" | "trap" | "siblings";
  title: string;
  body: string;
};

export function buildFiveDeepDiveBeats(
  question: StudyQuestion,
  opts?: { siblingStems?: string[] }
): DeepDiveBeat[] {
  const whyIncorrect = question.explanationDetail?.whyIncorrect ?? question.distractorRationale ?? {};
  const distractorLines = Object.entries(whyIncorrect)
    .map(([opt, why]) => `• ${opt}: ${why}`)
    .join("\n");

  const trap =
    question.explanationDetail?.pearls?.[0] ||
    question.explanationDetail?.keyTakeaways?.[0] ||
    "Watch for absolute words, incomplete assessments, and priority-setting traps.";

  const siblings =
    opts?.siblingStems?.filter(Boolean).slice(0, 3).join("\n• ") ||
    "Practice 3 more items in this Skill Cell after you finish the rationale.";

  return [
    {
      id: "answer",
      title: "1. One-line answer",
      body:
        question.correctAnswers?.join(", ") ||
        question.explanationDetail?.summary ||
        "See correct option above.",
    },
    {
      id: "why_correct",
      title: "2. Why correct",
      body:
        question.explanationDetail?.whyCorrect ||
        question.explanation ||
        "Review the teaching point for this stem.",
    },
    {
      id: "why_distractors",
      title: "3. Why each distractor fails",
      body: distractorLines || "Compare each wrong option to the priority action in the vignette.",
    },
    {
      id: "trap",
      title: "4. The trap",
      body: trap,
    },
    {
      id: "siblings",
      title: "5. Three sibling items in this cell",
      body: siblings.startsWith("•") ? siblings : `• ${siblings}`,
    },
  ];
}
