import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FullExamResults } from "@/components/exam/FullExamResults";
import { FULL_EXAM_PRACTICE_DISCLAIMER } from "@/lib/learning/full-exam-pass-path";
import type { FullExamQuestion, FullExamResultsAnalysis } from "@/types/full-exam";
import type { ExamAnswerRecord } from "@/lib/exam-sessions/service";

const analysis: FullExamResultsAnalysis = {
  sessionConfig: {
    lengthPreset: "50",
    questionCount: 2,
    timed: true,
    timeLimitSec: 3600,
    adaptive: false,
  },
  timeUsedSec: 40,
  topicBreakdown: [],
  questionIds: ["q1", "q2"],
  questionSnapshots: [],
  summary: "Session ended early. Your saved answers were scored.",
};

const questions: FullExamQuestion[] = [
  {
    id: "q1",
    question: "First stem",
    options: ["A", "B"],
    correctAnswer: "A",
    explanation: "Because A.",
  },
  {
    id: "q2",
    question: "Second stem",
    options: ["A", "B"],
    correctAnswer: "B",
    explanation: "Because B.",
  },
];

function answer(index: number, selected: string, correct: boolean): ExamAnswerRecord {
  return {
    questionIndex: index,
    questionId: questions[index]?.id,
    selected,
    correct,
    answeredAt: "2026-09-23T00:00:00.000Z",
  };
}

function renderResults(opts: {
  endedEarly?: boolean;
  answers: ExamAnswerRecord[];
  summary?: string;
}) {
  render(
    <FullExamResults
      examSlug="nclex"
      sessionId="session-early"
      score={0}
      analysis={{ ...analysis, summary: opts.summary ?? analysis.summary }}
      answers={opts.answers}
      questions={questions}
      missCount={0}
      passPathPersisted
      reviewIncorrectHref={null}
      proofHref="/dashboard"
      endedEarly={opts.endedEarly}
    />
  );
}

describe("FullExamResults early-end heading", () => {
  it("does not say Exam complete when the student ended early with unanswered items", () => {
    renderResults({
      endedEarly: true,
      answers: [answer(0, "", false), answer(1, "", false)],
    });

    expect(
      screen.getByRole("heading", { level: 1, name: "You ended the exam early" })
    ).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Exam complete" })).toBeNull();
    expect(screen.getByText("Session ended early. Your saved answers were scored.")).toBeInTheDocument();
    expect(screen.getByText("0 / 2 correct")).toBeInTheDocument();
    expect(screen.getByText(FULL_EXAM_PRACTICE_DISCLAIMER)).toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/you will pass|licensure result is|guaranteed pass/i);
  });

  it("still says Exam complete when the simulation was submitted with every item answered", () => {
    renderResults({
      endedEarly: false,
      summary: "Completed NCLEX-RN simulation.",
      answers: [answer(0, "A", true), answer(1, "B", true)],
    });

    expect(screen.getByRole("heading", { level: 1, name: "Exam complete" })).toBeInTheDocument();
    expect(screen.getByText(FULL_EXAM_PRACTICE_DISCLAIMER)).toBeInTheDocument();
  });

  it("calls a submitted simulation with blanks incomplete", () => {
    renderResults({
      endedEarly: false,
      summary: "Completed NCLEX-RN simulation.",
      answers: [answer(0, "A", true), answer(1, "", false)],
    });

    expect(
      screen.getByRole("heading", { level: 1, name: "Incomplete simulation" })
    ).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Exam complete" })).toBeNull();
  });
});
