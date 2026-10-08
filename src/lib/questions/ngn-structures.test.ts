import { describe, expect, it } from "vitest";
import type { NgnLayoutInput } from "./ngn-structures";
import { parseMatrixLayout } from "./ngn-structures";

function matrixQuestion(partial: Partial<NgnLayoutInput>): NgnLayoutInput {
  return {
    type: "matrix",
    question: "Classify each row.",
    options: [],
    correctAnswer: "",
    ...partial,
  };
}

describe("parseMatrixLayout row header", () => {
  it("reads Action from a matrix payload", () => {
    const layout = parseMatrixLayout(
      matrixQuestion({
        ngnPayload: {
          kind: "matrix",
          rowHeader: "Action",
          rows: ["Give the medication"],
          columns: ["Do now", "Do later"],
        },
      })
    );
    expect(layout.rowHeader).toBe("Action");
    expect(layout.rows).toEqual(["Give the medication"]);
  });

  it("keeps Statement when the grid is parsed from option text", () => {
    const layout = parseMatrixLayout(
      matrixQuestion({
        options: ["The client is alert | True", "The client is alert | False"],
        ngnPayload: { rowHeader: "Statement" },
      })
    );
    expect(layout.rowHeader).toBe("Statement");
    expect(layout.rows).toEqual(["The client is alert"]);
    expect(layout.columns).toEqual(["True", "False"]);
  });

  it("uses the payload header when chart data omits it", () => {
    const layout = parseMatrixLayout(
      matrixQuestion({
        chartData: {
          kind: "matrix",
          rowHeader: "  ",
          rows: ["Give the medication"],
          columns: ["Do now", "Do later"],
        },
        ngnPayload: { rowHeader: "Action" },
      })
    );
    expect(layout.rowHeader).toBe("Action");
  });

  it("falls back to Finding when neither chart nor payload names a header", () => {
    const layout = parseMatrixLayout(
      matrixQuestion({
        options: ["Pain 7/10 | Present", "Pain 7/10 | Absent"],
      })
    );
    expect(layout.rowHeader).toBe("Finding");
  });
});
