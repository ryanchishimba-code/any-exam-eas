import { describe, expect, it } from "vitest";
import { DEFAULT_MATRIX_ROW_HEADER, matrixRowHeader } from "./matrix-row-header";

describe("matrix row header", () => {
  it("uses the item label and falls back to Finding", () => {
    expect(matrixRowHeader("Task")).toBe("Task");
    expect(matrixRowHeader("Action")).toBe("Action");
    expect(matrixRowHeader("Statement")).toBe("Statement");
    expect(matrixRowHeader("  Nursing action  ")).toBe("Nursing action");
    expect(matrixRowHeader(undefined)).toBe(DEFAULT_MATRIX_ROW_HEADER);
    expect(matrixRowHeader("")).toBe("Finding");
    expect(matrixRowHeader("   ")).toBe("Finding");
    expect(matrixRowHeader(3)).toBe("Finding");
    expect(matrixRowHeader("", "Statement")).toBe("Statement");
    expect(matrixRowHeader("  ", undefined, "Action")).toBe("Action");
    expect(matrixRowHeader(3, "")).toBe("Finding");
  });
});
