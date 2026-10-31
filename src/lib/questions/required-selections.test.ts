import { describe, expect, it } from "vitest";
import { NGN_DEMO_QUESTIONS } from "@/lib/demo/ngn-samples";
import { examQuestionToStudy } from "./prepare";
import { matrixAllRowsAnswered, requiredSelectionCount } from "./required-selections";
import { parseMatrixLayout } from "./ngn-structures";

describe("matrix submit gate", () => {
  it("is ready when every row is answered even if the key count differs", () => {
    const question = examQuestionToStudy(NGN_DEMO_QUESTIONS[1]!, 0, { shuffleOptions: false });
    const layout = parseMatrixLayout(question);
    expect(layout.rows.length).toBeGreaterThan(1);
    const selected = layout.rows.map((row) => `${row}|||${layout.columns[0]}`);
    expect(selected.length).not.toBe(requiredSelectionCount(question));
    expect(matrixAllRowsAnswered(question, selected.slice(0, -1))).toBe(false);
    expect(matrixAllRowsAnswered(question, selected)).toBe(true);
  });

  it("does not treat a missing matrix as answered when nothing is selected", () => {
    expect(
      matrixAllRowsAnswered(
        { chartData: { kind: "matrix", rows: [], columns: [] }, options: [] },
        []
      )
    ).toBe(false);
  });
});
