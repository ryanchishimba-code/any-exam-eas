import { describe, expect, it } from "vitest";
import {
  rationaleAfterLead,
  selectRationaleLead,
  shortRationaleLead,
  shouldCollapseRationale,
  uniqueRationaleParts,
} from "./rationale-disclosure";

describe("rationale disclosure", () => {
  it("keeps a short rationale fully inline", () => {
    expect(shouldCollapseRationale(["ABCs take priority in acute assessment."])).toBe(false);
    expect(
      shouldCollapseRationale([
        "GDMT pillars reduce mortality in HFrEF; diuretics treat congestion only.",
      ])
    ).toBe(false);
  });

  it("collapses a long paragraph and a stack of short lines", () => {
    const long =
      "Airway comes before any other action. Later steps include documentation, calling the provider, and analgesia only after breathing is stable and the client is safe.";
    expect(shouldCollapseRationale([long])).toBe(true);
    expect(
      shouldCollapseRationale([
        "Check the airway.",
        "Support breathing.",
        "Then circulation.",
        "Document last.",
      ])
    ).toBe(true);
  });

  it("uses the principle line as the lead when one is present", () => {
    expect(
      selectRationaleLead({
        principle: "Airway before paperwork.",
        explanation: "A much longer explanation that walks through every distractor in detail and should not be the lead.",
      })
    ).toBe("Airway before paperwork.");
  });

  it("shortens a long explanation to the first sentence", () => {
    const explanation =
      "Protect the airway before routine tasks. Charting, calling the provider, and analgesia all wait until breathing is secure and the client is safe from immediate harm.";
    expect(shortRationaleLead(explanation)).toBe("Protect the airway before routine tasks.");
    expect(rationaleAfterLead(explanation, "Protect the airway before routine tasks.")).toMatch(
      /^Charting, calling the provider/
    );
  });

  it("does not measure text that is already inside the explanation", () => {
    const explanation = "Protect the airway before routine tasks. Charting waits.";
    expect(uniqueRationaleParts(explanation, ["Charting waits.", "Open RN — airway"])).toEqual([
      explanation,
      "Open RN — airway",
    ]);
  });
});
