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
    .filter(([, why]) => why.trim() && !isGenericBeat(why))
    .map(([opt, why]) => `• ${opt}: ${why}`)
    .join("\n");

  const trap =
    question.explanationDetail?.pearls?.[0] ||
    question.explanationDetail?.keyTakeaways?.[0] ||
    "";

  const siblings =
    opts?.siblingStems?.filter(Boolean).slice(0, 3).join("\n• ") ||
    "Practice 3 more items in this Skill Cell after you finish the rationale.";

  const beats: DeepDiveBeat[] = [
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
  ];
  if (distractorLines) {
    beats.push({
      id: "why_distractors",
      title: "3. Why each distractor fails",
      body: distractorLines,
    });
  }
  if (trap && !isGenericBeat(trap)) {
    beats.push({
      id: "trap",
      title: "4. The trap",
      body: trap,
    });
  }
  beats.push({
    id: "siblings",
    title: "5. Three sibling items in this cell",
    body: siblings.startsWith("•") ? siblings : `• ${siblings}`,
  });
  return beats;
}

function isGenericBeat(text: string): boolean {
  return /compare each wrong option to the priority action|watch for absolute words, incomplete assessments/i.test(
    text
  );
}
