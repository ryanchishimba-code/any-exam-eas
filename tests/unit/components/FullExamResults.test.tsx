import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ExamResultsScoreHeader } from "@/components/exam/ExamResultsScoreHeader";
import { FullExamResults } from "@/components/exam/FullExamResults";
import { FULL_EXAM_PRACTICE_DISCLAIMER } from "@/lib/learning/full-exam-pass-path";
import type { FullExamQuestion, FullExamResultsAnalysis } from "@/types/full-exam";
import type { ExamAnswerRecord } from "@/lib/exam-sessions/service";

const EARLY_SUMMARY = "Session ended early. Your saved answers were scored.";

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
  summary: EARLY_SUMMARY,
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
  questions?: FullExamQuestion[];
  score?: number;
  analysis?: Partial<FullExamResultsAnalysis>;
}) {
  const qs = opts.questions ?? questions;
  const receipt = {
    ...analysis,
    ...opts.analysis,
    summary: opts.summary ?? opts.analysis?.summary ?? analysis.summary,
    sessionConfig: {
      ...analysis.sessionConfig,
      ...opts.analysis?.sessionConfig,
    },
  };
  const score = opts.score ?? 0;
  render(
    <>
      <ExamResultsScoreHeader
        examName="NCLEX-RN"
        examShortName="NCLEX"
        score={score}
        correct={opts.answers.filter((row) => row.correct).length}
        questionCount={qs.length}
        summary={receipt.summary}
        endedEarly={opts.endedEarly}
        analysisEndedEarly={receipt.endedEarly === true}
        answeredCount={receipt.answeredCount}
        plannedQuestionCount={receipt.sessionConfig.questionCount}
        answers={opts.answers}
      />
      <FullExamResults
        examSlug="nclex"
        sessionId="session-early"
        score={score}
        analysis={receipt}
        answers={opts.answers}
        questions={qs}
        missCount={0}
        passPathPersisted
        reviewIncorrectHref={null}
        proofHref="/dashboard"
        endedEarly={opts.endedEarly}
      />
    </>
  );
}

/** Live miss: the early-end sentence and an "Exam complete" heading on one receipt. */
function expectEarlySummaryDoesNotShareExamCompleteHeading() {
  expect(document.body.textContent).toContain(EARLY_SUMMARY);
  const headings = screen.getAllByRole("heading", { level: 1 }).map((node) => node.textContent?.trim());
  expect(headings).toContain("You ended the exam early");
  expect(headings).not.toContain("Exam complete");
  expect(screen.queryByRole("heading", { name: "Exam complete" })).toBeNull();
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
    expect(screen.getByText(EARLY_SUMMARY)).toBeInTheDocument();
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

  it("does not say Exam complete for a 50-question sprint ended with no answers", () => {
    const sprintQuestions: FullExamQuestion[] = Array.from({ length: 50 }, (_, index) => ({
      id: `q${index}`,
      question: `Stem ${index + 1}`,
      options: ["A", "B"],
      correctAnswer: "A",
      explanation: "Because A.",
    }));
    renderResults({
      endedEarly: false,
      answers: [],
      questions: sprintQuestions,
      analysis: {
        sessionConfig: {
          lengthPreset: "50",
          questionCount: 50,
          timed: true,
          timeLimitSec: 3600,
          adaptive: false,
        },
        timeUsedSec: 12,
        topicBreakdown: [],
        questionIds: sprintQuestions.map((question) => question.id),
        questionSnapshots: [],
        summary: EARLY_SUMMARY,
        answeredCount: 0,
      },
    });

    expectEarlySummaryDoesNotShareExamCompleteHeading();
    expect(screen.getByText("0 / 50 correct")).toBeInTheDocument();
    expect(screen.getAllByText("0%").length).toBeGreaterThan(0);
    expect(screen.getByText("NCLEX-RN")).toBeInTheDocument();
    expect(screen.getByText(FULL_EXAM_PRACTICE_DISCLAIMER)).toBeInTheDocument();
  });

  it("keeps the early summary and Exam complete heading from coexisting on the client card", () => {
    const sprintQuestions: FullExamQuestion[] = Array.from({ length: 50 }, (_, index) => ({
      id: `q${index}`,
      question: `Stem ${index + 1}`,
      options: ["A", "B"],
      correctAnswer: "A",
      explanation: "Because A.",
    }));
    render(
      <FullExamResults
        examSlug="nclex"
        sessionId="session-sprint-50"
        score={0}
        analysis={{
          sessionConfig: {
            lengthPreset: "50",
            questionCount: 50,
            timed: true,
            timeLimitSec: 3600,
            adaptive: false,
          },
          timeUsedSec: 12,
          topicBreakdown: [],
          questionIds: sprintQuestions.map((question) => question.id),
          questionSnapshots: [],
          summary: EARLY_SUMMARY,
          answeredCount: 0,
        }}
        answers={[]}
        questions={sprintQuestions}
        missCount={0}
        passPathPersisted
        reviewIncorrectHref={null}
        proofHref="/dashboard"
        endedEarly={false}
      />
    );

    const text = document.body.textContent ?? "";
    const earlySummaryShown = text.includes(EARLY_SUMMARY);
    const completeHeadingShown = screen.queryByRole("heading", { name: "Exam complete" }) !== null;
    expect(earlySummaryShown && completeHeadingShown).toBe(false);
    expect(screen.queryByRole("heading", { name: "Exam complete" })).toBeNull();
  });

  it("does not say Exam complete for an early-end receipt when status stayed completed", () => {
    renderResults({
      endedEarly: false,
      analysis: {
        summary: EARLY_SUMMARY,
        sessionConfig: { ...analysis.sessionConfig, questionCount: 50, lengthPreset: "50" },
        answeredCount: 0,
        questionSnapshots: [],
      },
      answers: [answer(0, "Wrong", false), answer(1, "Wrong", false)],
    });

    expectEarlySummaryDoesNotShareExamCompleteHeading();
    expect(screen.getByText("0 / 2 correct")).toBeInTheDocument();
    expect(screen.getByText(FULL_EXAM_PRACTICE_DISCLAIMER)).toBeInTheDocument();
  });

  it("renders the score heading from the server receipt, not the client results module", () => {
    const page = readFileSync(
      join(process.cwd(), "src/app/(app)/full-exam/[examSlug]/[sessionId]/results/page.tsx"),
      "utf8"
    );
    const client = readFileSync(
      join(process.cwd(), "src/components/exam/FullExamResults.tsx"),
      "utf8"
    );
    const simulator = readFileSync(
      join(process.cwd(), "src/components/exam/FullExamSimulator.tsx"),
      "utf8"
    );
    expect(page).toContain("<ExamResultsScoreHeader");
    expect(page.indexOf("<ExamResultsScoreHeader")).toBeLessThan(page.indexOf("<FullExamResults"));
    expect(client).not.toContain("Exam complete");
    expect(client).not.toContain("fullExamResultsTitle");
    expect(simulator).toContain("window.location.assign(fullExamResultsHref(examSlug, sessionId))");
    expect(simulator).not.toContain("router.push(fullExamResultsHref");
  });
});
