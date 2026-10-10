/**
 * Answer text restored after the student submits. Letter labels follow the
 * option order the browser already has.
 */
import { cleanOptionText } from "@/lib/question-format";
import { joinStoredCorrectAnswer } from "@/lib/questions/multi-answer";
import { isAnswerCorrect } from "@/lib/questions/prepare";
import { rewriteChoiceLetters } from "@/lib/questions/shuffle-delivery";
import type { StudyQuestion } from "@/lib/questions/types";

export type RevealedAnswerFields = {
  correctAnswer: string;
  explanation: string;
  solutionSteps?: string[];
  clinicalReasoning?: string;
  distractorRationale?: Record<string, string>;
  expertRationale?: StudyQuestion["expertRationale"];
  ngnPayload?: Record<string, unknown>;
  chartData?: Record<string, unknown>;
};

function letterFor(index: number): string {
  return String.fromCharCode(65 + index);
}

/** Map canonical option letters onto the order delivered to the browser. */
export function deliveryLetterMap(canonical: string[], delivered: string[]): Map<string, string> {
  const map = new Map<string, string>();
  const used = new Set<number>();
  canonical.forEach((option, index) => {
    const want = cleanOptionText(option).toLowerCase();
    const deliveredIndex = delivered.findIndex((choice, choiceIndex) => {
      if (used.has(choiceIndex)) return false;
      return cleanOptionText(choice).toLowerCase() === want;
    });
    if (deliveredIndex < 0) return;
    used.add(deliveredIndex);
    const from = letterFor(index);
    const to = letterFor(deliveredIndex);
    if (from !== to) map.set(from, to);
  });
  return map;
}

function answerLayout(payload: Record<string, unknown> | undefined): Record<string, unknown> | undefined {
  if (!payload) return undefined;
  const next = { ...payload };
  delete next.setId;
  delete next.caseTitle;
  delete next.cjmmFunction;
  delete next.batchId;
  delete next.stepName;
  delete next.slotId;
  return next;
}

export function revealStudyAnswer(
  study: StudyQuestion,
  input?: { selected?: string[]; options?: string[] }
): RevealedAnswerFields & { correct: boolean } {
  const delivered = input?.options?.length ? input.options : study.options;
  const letterMap = deliveryLetterMap(study.options, delivered);
  const distractor = study.distractorRationale
    ? Object.fromEntries(
        Object.entries(study.distractorRationale).map(([key, value]) => [
          /^[A-E]$/i.test(key) ? (letterMap.get(key.toUpperCase()) ?? key) : key,
          rewriteChoiceLetters(value, letterMap),
        ])
      )
    : undefined;
  return {
    correct: input?.selected ? isAnswerCorrect(study, input.selected) : false,
    correctAnswer: joinStoredCorrectAnswer(study.type, study.correctAnswers),
    explanation: rewriteChoiceLetters(study.explanation, letterMap),
    solutionSteps: study.solutionSteps?.map((step) => rewriteChoiceLetters(step, letterMap)),
    clinicalReasoning: study.clinicalReasoning
      ? rewriteChoiceLetters(study.clinicalReasoning, letterMap)
      : undefined,
    distractorRationale: distractor,
    expertRationale: study.expertRationale,
    ngnPayload: answerLayout(study.ngnPayload),
    chartData: answerLayout(study.chartData),
  };
}
