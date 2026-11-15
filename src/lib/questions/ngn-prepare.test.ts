import { describe, expect, it } from "vitest";
import { examQuestionToStudy, isAnswerCorrect } from "./prepare";
import { NGN_DEMO_QUESTIONS } from "@/lib/demo/ngn-samples";
import {
  bowTieSelectionValid,
  parseBowTieLayout,
  toggleBowTieSelection,
} from "./ngn-structures";

describe("NGN question preparation", () => {
  it("prepares bow-tie with action and monitor pools", () => {
    const q = examQuestionToStudy(NGN_DEMO_QUESTIONS[0], 0);
    expect(q.type).toBe("bow_tie");
    expect(q.options.length).toBeGreaterThan(4);
    expect(q.correctAnswers).toHaveLength(3);
  });

  it("keeps one action and two monitors so Check answer can enable", () => {
    const q = examQuestionToStudy(NGN_DEMO_QUESTIONS[0], 0);
    const layout = parseBowTieLayout(q);
    const action = layout.actions[0]!;
    const [m1, m2, m3] = layout.monitors;
    let selected: string[] = [];
    selected = toggleBowTieSelection(selected, action, layout);
    selected = toggleBowTieSelection(selected, m1!, layout);
    selected = toggleBowTieSelection(selected, m2!, layout);
    expect(bowTieSelectionValid(selected, layout)).toBe(true);
    selected = toggleBowTieSelection(selected, m3!, layout);
    expect(selected.filter((s) => layout.monitors.includes(s))).toHaveLength(2);
    expect(bowTieSelectionValid(selected, layout)).toBe(true);
  });

  it("does not call a bow-tie complete when its condition column is empty", () => {
    const layout = parseBowTieLayout({
      type: "bow_tie",
      question: "Complete the bow-tie for this breastfeeding client.",
      options: [],
      correctAnswer: "Latch support",
      chartData: {
        kind: "bow_tie",
        condition: "Ineffective latch",
        conditionOptions: [],
        actions: ["Help with the latch", "Offer formula first"],
        monitors: ["Audible swallows", "Nipple pain"],
        actionPickCount: 1,
        monitorPickCount: 2,
      },
    });
    expect(layout.conditionOptions).toEqual([]);
    expect(layout.conditionChoicesListed).toBe(true);
    expect(
      bowTieSelectionValid(["Help with the latch", "Audible swallows", "Nipple pain"], layout)
    ).toBe(false);
  });

  it("reads condition choices stored as text objects", () => {
    const layout = parseBowTieLayout({
      type: "bow_tie",
      question: "Complete the bow-tie.",
      options: [],
      correctAnswer: "Ineffective latch",
      ngnPayload: {
        kind: "bow_tie",
        actions: ["Help with the latch"],
        monitors: ["Audible swallows", "Nipple pain"],
        conditions: [{ text: "Ineffective latch" }, { text: "Normal engorgement" }],
      },
    });
    expect(layout.conditionOptions).toEqual(["Ineffective latch", "Normal engorgement"]);
    expect(
      bowTieSelectionValid(
        ["Help with the latch", "Ineffective latch", "Audible swallows", "Nipple pain"],
        layout
      )
    ).toBe(true);
  });

  it("grades bow-tie selections", () => {
    const q = examQuestionToStudy(NGN_DEMO_QUESTIONS[0], 0);
    expect(isAnswerCorrect(q, q.correctAnswers)).toBe(true);
    expect(isAnswerCorrect(q, [q.correctAnswers[0]])).toBe(false);
  });

  it("prepares matrix with cell keys", () => {
    const q = examQuestionToStudy(NGN_DEMO_QUESTIONS[1], 0);
    expect(q.type).toBe("matrix");
    expect(q.options[0]).toContain("|||");
    expect(isAnswerCorrect(q, q.correctAnswers)).toBe(true);
  });

  it("prepares unfolding case as MCQ step", () => {
    const q = examQuestionToStudy(NGN_DEMO_QUESTIONS[2], 0);
    expect(q.type).toBe("unfolding_case");
    expect(q.caseStep).toBe(1);
    expect(isAnswerCorrect(q, [q.correctAnswers[0]])).toBe(true);
  });
});
