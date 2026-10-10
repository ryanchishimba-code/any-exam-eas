import { describe, expect, it } from "vitest";
import { mergeRecentTests, recentTestFromExamSession } from "./recent-tests";

describe("recent exam sessions", () => {
  it("turns a finished exam session into a dashboard row", () => {
    const row = recentTestFromExamSession({
      id: "sess-1",
      examType: "nclex",
      fieldId: "nursing",
      title: "NCLEX-RN Full Simulation",
      score: 72.4,
      questionCount: 85,
      completedAt: new Date("2026-10-10T01:00:00.000Z"),
      answers: [
        { selected: "A", correct: true },
        { selected: "B", correct: false },
        { selected: "  ", correct: true },
      ],
    });
    expect(row).toMatchObject({
      id: "sess-1",
      examId: "sess-1",
      title: "NCLEX-RN Full Simulation",
      field: "nursing",
      score: 72,
      correct: 1,
      total: 85,
      completedAt: "2026-10-10T01:00:00.000Z",
    });
  });

  it("keeps finished exam sessions ahead of older generated exams", () => {
    const exams = [1, 2, 3, 4, 5, 6, 7].map((n) =>
      recentTestFromExamSession({
        id: `exam-${n}`,
        examType: "usmle",
        fieldId: "usmle-step-2",
        title: `USMLE Step 2 Full Simulation ${n}`,
        score: 60 + n,
        questionCount: 80,
        completedAt: new Date(`2026-10-10T0${n}:00:00.000Z`),
        answers: [],
      })
    );
    const progress = [
      {
        id: "progress-1",
        examId: "generated-1",
        title: "Old generated exam",
        field: "usmle-step-2",
        score: 50,
        correct: 1,
        total: 2,
        completedAt: "2026-10-09T00:00:00.000Z",
      },
    ];
    const merged = mergeRecentTests(progress, exams, 20);
    expect(merged.map((row) => row.id)).toEqual([
      "exam-7",
      "exam-6",
      "exam-5",
      "exam-4",
      "exam-3",
      "exam-2",
      "exam-1",
      "progress-1",
    ]);
  });
});
