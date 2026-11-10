import { describe, expect, it } from "vitest";
import { alignRationaleToDisplayedOptions } from "./displayed-option-labels";

const OPTIONS = ["11.43 mg/L", "8 mg/L", "9.41 mg/L", "13.33 mg/L"];

describe("alignRationaleToDisplayedOptions", () => {
  it("numbers the correct answer the way the choices are numbered", () => {
    const text = "Correct answer: C. 11.43 mg/L. The corrected level uses the Sheiner–Tozer equation.";
    expect(alignRationaleToDisplayedOptions(text, OPTIONS)).toContain("Correct answer: 1. 11.43 mg/L");
    expect(alignRationaleToDisplayedOptions(text, OPTIONS)).not.toContain("Correct answer: C");
  });

  it("renumbers lettered distractors to the displayed option", () => {
    const text = ["A. 8 mg/L is the uncorrected level.", "B. 9.41 mg/L skips the albumin term.", "D. 13.33 mg/L doubles the correction."].join(
      "\n"
    );
    const aligned = alignRationaleToDisplayedOptions(text, OPTIONS);
    expect(aligned).toContain("2. 8 mg/L");
    expect(aligned).toContain("3. 9.41 mg/L");
    expect(aligned).toContain("4. 13.33 mg/L");
    expect(aligned).not.toMatch(/^A\. /m);
  });
});
