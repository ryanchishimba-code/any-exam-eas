import { describe, expect, it } from "vitest";
import { normalizeStem } from "./stem";

describe("normalizeStem", () => {
  it("strips Case: and Scenario: prefixes", () => {
    expect(normalizeStem("Case: Which enzyme breaks down starch?")).toBe(
      "Which enzyme breaks down starch?"
    );
    expect(normalizeStem("Scenario: Select the best antibiotic.")).toBe(
      "Select the best antibiotic."
    );
  });

  it("leaves short direct questions unchanged", () => {
    const q = "What is the mechanism of action of metoprolol?";
    expect(normalizeStem(q)).toBe(q);
  });

  it("adds question mark to short stems without terminal punctuation", () => {
    expect(normalizeStem("Select the antibiotic with anaerobic coverage")).toBe(
      "Select the antibiotic with anaerobic coverage?"
    );
  });
});
