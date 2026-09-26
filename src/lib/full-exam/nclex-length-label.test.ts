import { describe, expect, it } from "vitest";
import {
  nclexCatQuestionRange,
  nclexFullPracticeBadge,
  nclexFullPracticeLengthLabel,
} from "./nclex-length-label";

describe("NCLEX practice length labels", () => {
  it("uses one range on the setup badge and in the exam", () => {
    expect(nclexCatQuestionRange()).toBe("85–150");
    expect(nclexFullPracticeBadge(true)).toBe("85–150");
    expect(nclexFullPracticeLengthLabel(true)).toBe("85–150 questions");
    expect(nclexFullPracticeLengthLabel(true)).not.toMatch(/up to 150|85-150Q|85 Q/);
  });

  it("names a fixed full form as 85 questions", () => {
    expect(nclexFullPracticeBadge(false)).toBe("85");
    expect(nclexFullPracticeLengthLabel(false)).toBe("85 questions");
  });
});
