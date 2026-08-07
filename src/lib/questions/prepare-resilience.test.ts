import { describe, expect, it } from "vitest";
import { coerceOptionList } from "./option-coerce";
import { examQuestionToStudy } from "./prepare";

describe("coerceOptionList", () => {
  it("keeps normal option arrays", () => {
    expect(coerceOptionList(["A", "B", "C"])).toEqual(["A", "B", "C"]);
  });

  it("parses JSON option envelopes instead of spreading characters", () => {
    const raw = JSON.stringify({ kind: "bow_tie", options: ["Action 1", "Monitor 1"] });
    expect(coerceOptionList(raw)).toEqual(["Action 1", "Monitor 1"]);
    expect(coerceOptionList(raw).length).toBeLessThan(10);
  });
});

describe("examQuestionToStudy resilience", () => {
  it("does not crash when question text is missing", () => {
    const q = examQuestionToStudy(
      {
        id: 1,
        type: "multiple_choice",
        question: undefined as unknown as string,
        options: ["Give oxygen", "Call rapid response", "Recheck vitals", "Document only"],
        correctAnswer: "Call rapid response",
        explanation: "Airway and perfusion first.",
      },
      0,
      { shuffleOptions: false }
    );
    expect(q.stem.length).toBeGreaterThan(0);
    expect(q.options).toHaveLength(4);
  });

  it("coerces stringified NAPLEX option payloads safely", () => {
    const q = examQuestionToStudy(
      {
        id: 2,
        type: "multiple_choice",
        question: "Which counseling point is highest priority?",
        options: JSON.stringify(["Take with food", "Avoid grapefruit", "Stop abruptly", "Double dose"]),
        correctAnswer: "Avoid grapefruit",
        explanation: "CYP3A4 interaction risk.",
      } as never,
      0,
      { shuffleOptions: false }
    );
    expect(q.options.length).toBe(4);
    expect(q.options[0]).toContain("Take with food");
  });
});
