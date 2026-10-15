import { describe, expect, it } from "vitest";
import { planNp001AgeMonths, patientWithAgeMonths } from "./infant-age-catalog";

const history = "Term 4-month-old boy (born at 39 weeks), no chronic medical conditions.";

function sourceCase(patient: Record<string, unknown> = { age: 0, history, displayName: "Mateo Herrera" }) {
  return { id: "NP001", version: 1, status: "published", patient };
}

function steps(version = 4, caseVersion = 1, status = "published") {
  return [1, 2, 3, 4, 5, 6].map((step) => ({
    id: `NP001-S${step}`,
    version,
    caseId: "NP001",
    caseVersion,
    status,
  }));
}

describe("NP001 age-months catalog version", () => {
  it("plans a new case version and copies each item forward", () => {
    const plan = planNp001AgeMonths({
      cases: [sourceCase()],
      items: steps(),
      narrative: history,
    });
    expect(plan).toMatchObject({
      action: "insert",
      caseId: "NP001",
      fromCaseVersion: 1,
      caseVersion: 2,
      ageMonths: 4,
    });
    if (plan.action !== "insert") return;
    expect(plan.items.map((item) => [item.id, item.fromVersion, item.version])).toEqual([
      ["NP001-S1", 4, 5],
      ["NP001-S2", 4, 5],
      ["NP001-S3", 4, 5],
      ["NP001-S4", 4, 5],
      ["NP001-S5", 4, 5],
      ["NP001-S6", 4, 5],
    ]);
    expect(patientWithAgeMonths(sourceCase().patient, 4).ageMonths).toBe(4);
  });

  it("skips when the published case already stores the months", () => {
    const plan = planNp001AgeMonths({
      cases: [sourceCase({ age: 0, ageMonths: 4, history })],
      items: steps(),
      narrative: history,
    });
    expect(plan).toEqual({ action: "noop", reason: "NP001 v1 already has ageMonths 4." });
  });

  it("refuses when the chart does not say 4-month-old", () => {
    const plan = planNp001AgeMonths({
      cases: [sourceCase({ age: 0, history: "Term newborn." })],
      items: steps(),
      narrative: "Term newborn.",
    });
    expect(plan.action).toBe("error");
  });

  it("uses the highest existing item version so the new key does not collide", () => {
    const plan = planNp001AgeMonths({
      cases: [sourceCase(), { id: "NP001", version: 2, status: "draft", patient: { age: 0, history } }],
      items: [...steps(4), { id: "NP001-S1", version: 9, caseId: "NP001", caseVersion: 2, status: "draft" }],
      narrative: `${history} Chart also says 4-month-old.`,
    });
    expect(plan.action).toBe("insert");
    if (plan.action !== "insert") return;
    expect(plan.caseVersion).toBe(3);
    expect(plan.fromCaseVersion).toBe(1);
    expect(plan.items.find((item) => item.id === "NP001-S1")).toEqual({
      id: "NP001-S1",
      fromVersion: 4,
      version: 10,
    });
  });
});
