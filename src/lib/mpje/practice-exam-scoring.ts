import { gradeMpjeAnswer } from "@/lib/mpje/grade-answer";
import {
  MPJE_PRACTICE_EXAM_PASSING_PERCENT,
  MPJE_PRACTICE_EXAM_QUESTION_COUNT,
  type MpjePracticeExamQuestion,
} from "./practice-exam-config";

export type MpjeExamAnswer = {
  questionId: string;
  selected: string | null;
};

export type MpjeTopicBreakdown = {
  subjectId: string;
  subjectLabel: string;
  total: number;
  correct: number;
  percent: number;
};

export type MpjePracticeExamResult = {
  totalQuestions: number;
  answered: number;
  correct: number;
  incorrect: number;
  unanswered: number;
  scorePercent: number;
  passed: boolean;
  passingPercent: number;
  topicBreakdown: MpjeTopicBreakdown[];
  missed: Array<{
    questionId: string;
    index: number;
    subjectLabel: string;
    question: string;
    selected: string | null;
    correctAnswer: string;
    explanation: string;
  }>;
};

export function gradeMpjePracticeExam(
  questions: MpjePracticeExamQuestion[],
  answers: MpjeExamAnswer[]
): MpjePracticeExamResult {
  const answerMap = new Map(answers.map((a) => [a.questionId, a.selected]));

  let correct = 0;
  let answered = 0;
  const topicStats = new Map<
    string,
    { label: string; total: number; correct: number }
  >();
  const missed: MpjePracticeExamResult["missed"] = [];

  questions.forEach((q, index) => {
    const selected = answerMap.get(q.id) ?? null;
    const isSelectAll = q.itemType === "select_all";
    const selectedParts = isSelectAll && selected ? selected.split("|||").filter(Boolean) : null;
    const isAnswered = isSelectAll
      ? Boolean(selectedParts?.length)
      : Boolean(selected?.trim());
    const isCorrect =
      isAnswered &&
      gradeMpjeAnswer(
        q.itemType,
        isSelectAll ? selectedParts! : selected,
        q.correctAnswer
      );

    if (isAnswered) answered++;
    if (isCorrect) correct++;

    const stat = topicStats.get(q.subjectId) ?? {
      label: q.subjectLabel,
      total: 0,
      correct: 0,
    };
    stat.total++;
    if (isCorrect) stat.correct++;
    topicStats.set(q.subjectId, stat);

    if (!isCorrect) {
      missed.push({
        questionId: q.id,
        index,
        subjectLabel: q.subjectLabel,
        question: q.question,
        selected,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
      });
    }
  });

  const totalQuestions = questions.length || MPJE_PRACTICE_EXAM_QUESTION_COUNT;
  const scorePercent = Math.round((correct / totalQuestions) * 100);

  return {
    totalQuestions,
    answered,
    correct,
    incorrect: answered - correct,
    unanswered: totalQuestions - answered,
    scorePercent,
    passed: scorePercent >= MPJE_PRACTICE_EXAM_PASSING_PERCENT,
    passingPercent: MPJE_PRACTICE_EXAM_PASSING_PERCENT,
    topicBreakdown: [...topicStats.entries()]
      .map(([subjectId, s]) => ({
        subjectId,
        subjectLabel: s.label,
        total: s.total,
        correct: s.correct,
        percent: s.total ? Math.round((s.correct / s.total) * 100) : 0,
      }))
      .sort((a, b) => a.percent - b.percent),
    missed,
  };
}
