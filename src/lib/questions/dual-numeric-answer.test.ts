import { describe, expect, it } from "vitest";
import {
  isUnscorableDualNumeric,
  numericValueInSlot,
  planDualNumericAnswer,
  stemAsksForTwoQuantities,
} from "./dual-numeric-answer";

describe("dual numeric answers", () => {
  it("splits a pediatric amoxicillin key into mg/day and mL/dose", () => {
    const stem =
      "Calculate the total daily dose in milligrams and the volume of each dose in milliliters.";
    const plan = planDualNumericAnswer(stem, "1000 mg/day; 10 mL per dose");
    expect(plan.mode).toBe("dual");
    if (plan.mode !== "dual") return;
    expect(plan.slots[0]).toMatchObject({ min: 1000, max: 1000 });
    expect(plan.slots[1]).toMatchObject({ min: 10, max: 10 });
    expect(plan.slots[0]!.label.toLowerCase()).toContain("mg/day");
    expect(numericValueInSlot("1000", plan.slots[0]!)).toBe(true);
    expect(numericValueInSlot("10", plan.slots[1]!)).toBe(true);
    expect(numericValueInSlot("9", plan.slots[1]!)).toBe(false);
  });

  it("accepts a stored range without inventing a point key", () => {
    const stem = "Calculate the total daily dose and the dose per administration of amoxicillin for this child.";
    const plan = planDualNumericAnswer(
      stem,
      "1600-1800 mg total daily dose; 800-900 mg per administration"
    );
    expect(plan.mode).toBe("dual");
    if (plan.mode !== "dual") return;
    expect(numericValueInSlot("1700", plan.slots[0]!)).toBe(true);
    expect(numericValueInSlot("1500", plan.slots[0]!)).toBe(false);
  });

  it("leaves a one-number calculation on a single box", () => {
    expect(stemAsksForTwoQuantities("Calculate the concentration in mg/mL. Round to two decimal places.")).toBe(
      false
    );
    expect(planDualNumericAnswer("How many tablets should be dispensed for this order?", "30").mode).toBe(
      "single"
    );
  });

  it("flags a two-ask stem whose key has only one number", () => {
    const stem = "Calculate the total daily dose and the dose per administration for this child.";
    expect(isUnscorableDualNumeric(stem, "250 mg")).toBe(true);
  });
});
