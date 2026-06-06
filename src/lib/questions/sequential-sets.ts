import type { SessionAnswer, StudyQuestion } from "./types";

export type SequentialPayload = {
  kind?: string;
  setId?: string;
  stepIndex?: number;
  totalSteps?: number;
};

export function getSequentialPayload(
  question: StudyQuestion
): SequentialPayload | null {
  const p = question.ngnPayload as SequentialPayload | undefined;
  if (!p?.setId || p.kind !== "sequential") return null;
  if (!p.stepIndex || !p.totalSteps || p.totalSteps < 2) return null;
  return p;
}

export function isSequentialSetItem(question: StudyQuestion): boolean {
  return getSequentialPayload(question) != null;
}

/** Group sequential items by setId; singletons become one-item blocks. */
export function buildQuestionBlocks(questions: StudyQuestion[]): StudyQuestion[][] {
  const bySet = new Map<string, StudyQuestion[]>();
  const standalone: StudyQuestion[][] = [];

  for (const q of questions) {
    const p = getSequentialPayload(q);
    if (p?.setId) {
      const list = bySet.get(p.setId) ?? [];
      list.push(q);
      bySet.set(p.setId, list);
    } else {
      standalone.push([q]);
    }
  }

  for (const [setId, list] of bySet) {
    list.sort(
      (a, b) =>
        (getSequentialPayload(a)?.stepIndex ?? 0) -
        (getSequentialPayload(b)?.stepIndex ?? 0)
    );
    bySet.set(setId, list);
  }

  return [...bySet.values(), ...standalone];
}

/** Fisher–Yates shuffle on blocks; items inside a sequential set stay ordered. */
export function shufflePreservingSequentialSets(
  questions: StudyQuestion[]
): StudyQuestion[] {
  const blocks = buildQuestionBlocks(questions);
  const shuffled = [...blocks];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.flat();
}

export type SequentialSetContext = {
  setId: string;
  stepIndex: number;
  totalSteps: number;
  vignette?: string;
  priorStepUnanswered: boolean;
  priorStepIndex?: number;
};

export function getSequentialSetContext(
  question: StudyQuestion,
  allQuestions: StudyQuestion[],
  answers: Record<string, SessionAnswer>
): SequentialSetContext | null {
  const p = getSequentialPayload(question);
  if (!p?.setId || !p.stepIndex || !p.totalSteps) return null;

  const setMembers = allQuestions
    .filter((q) => getSequentialPayload(q)?.setId === p.setId)
    .sort(
      (a, b) =>
        (getSequentialPayload(a)?.stepIndex ?? 0) -
        (getSequentialPayload(b)?.stepIndex ?? 0)
    );

  const vignette = setMembers[0]?.vignette ?? question.vignette;
  let priorStepUnanswered = false;
  let priorStepIndex: number | undefined;

  if (p.stepIndex > 1) {
    const prior = setMembers.find(
      (q) => getSequentialPayload(q)?.stepIndex === p.stepIndex - 1
    );
    if (prior) {
      priorStepIndex = p.stepIndex - 1;
      priorStepUnanswered = !answers[prior.id]?.revealed;
    }
  }

  return {
    setId: p.setId,
    stepIndex: p.stepIndex,
    totalSteps: p.totalSteps,
    vignette,
    priorStepUnanswered,
    priorStepIndex,
  };
}
