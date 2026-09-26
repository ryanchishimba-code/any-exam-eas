import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { explainPointsLost, perfect, score, scoringRegistry } from "@/lib/assessment/scoring/registry";
import type { PilotDocument, ScorableItem } from "@/lib/assessment/types";

const pilot = JSON.parse(
  readFileSync("content/ngn-pilot/pilot-items.json", "utf8")
) as PilotDocument;

function allItems() {
  return [...pilot.cases.flatMap((caseDoc) => caseDoc.items), ...pilot.standalone];
}

describe("NGN scoring (Python reference port)", () => {
  it("scores a perfect response at maxPoints for all 70 pilot items", () => {
    const items = allItems();
    expect(items).toHaveLength(70);
    for (const item of items) {
      expect(score(item, perfect(item)), item.id).toBe(item.maxPoints);
      expect(scoringRegistry[item.scoringRule](item, perfect(item)), item.id).toBe(item.maxPoints);
    }
  });

  it("floors SATA and highlight +/- at 0", () => {
    const item: ScorableItem = {
      responseFormat: "mr_sata",
      scoringRule: "plus_minus",
      payload: { keys: ["a", "b"], options: [] },
    };
    expect(score(item, ["c", "d"])).toBe(0);
    expect(score(item, ["a", "c"])).toBe(0);
    expect(score(item, ["a", "b", "c"])).toBe(1);
    expect(score(item, ["a", "b"])).toBe(2);
  });

  it("truncates select-N to N and scores 0/1 per kept selection", () => {
    const item: ScorableItem = {
      responseFormat: "mr_select_n",
      scoringRule: "zero_one",
      payload: { n: 2, keys: ["a", "b"] },
    };
    expect(score(item, ["a", "c", "b"])).toBe(1);
    expect(score(item, ["b", "a"])).toBe(2);
    expect(score(item, ["c", "d"])).toBe(0);
  });

  it("floors matrix multiple-response per column", () => {
    const item: ScorableItem = {
      responseFormat: "matrix_mr",
      scoringRule: "plus_minus",
      payload: {
        columns: [
          { id: "c1", label: "C1" },
          { id: "c2", label: "C2" },
        ],
        rows: [
          { id: "r1", keys: ["c1"] },
          { id: "r2", keys: ["c1", "c2"] },
        ],
      },
    };
    expect(score(item, { r1: ["c1", "c2"], r2: ["c1"] })).toBe(2);
    expect(score(item, { r1: ["c1"], r2: ["c1", "c2"] })).toBe(3);
  });

  it("scores rationale dyads and triads", () => {
    const dyad: ScorableItem = {
      responseFormat: "dropdown_rationale",
      scoringRule: "rationale",
      payload: {
        kind: "dyad",
        dropdowns: [
          { id: "cause", role: "cause", key: "a" },
          { id: "e1", role: "effect", key: "b" },
        ],
      },
    };
    expect(score(dyad, { cause: "a", e1: "b" })).toBe(1);
    expect(score(dyad, { cause: "a", e1: "c" })).toBe(0);
    const triad: ScorableItem = {
      responseFormat: "dropdown_rationale",
      scoringRule: "rationale",
      payload: {
        kind: "triad",
        dropdowns: [
          { id: "cause", role: "cause", key: "a" },
          { id: "e1", role: "effect", key: "b" },
          { id: "e2", role: "effect", key: "c" },
        ],
      },
    };
    expect(score(triad, { cause: "z", e1: "b", e2: "c" })).toBe(0);
    expect(score(triad, { cause: "a", e1: "b", e2: "no" })).toBe(1);
    expect(score(triad, { cause: "a", e1: "b", e2: "c" })).toBe(2);
    expect(scoringRegistry.rationale(triad, { cause: "a", e1: "b", e2: "c" })).toBe(2);
  });

  it("accepts bow-tie action and monitor tokens in either slot and caps at 5", () => {
    const item: ScorableItem = {
      responseFormat: "bowtie",
      scoringRule: "zero_one",
      payload: {
        condition: { keys: ["c1"] },
        actions: { keys: ["a1", "a2"] },
        monitor: { keys: ["m1", "m2"] },
      },
    };
    expect(score(item, { condition: "c1", actions: ["a2", "a1"], monitor: ["m2", "m1"] })).toBe(5);
    expect(score(item, { condition: "c1", actions: ["a1", "a2", "a3"], monitor: ["m1"] })).toBe(4);
    expect(score(item, { condition: "no", actions: ["a3", "a4"], monitor: ["m3", "m4"] })).toBe(0);
  });

  it("explains +/- lines in the Python order and wording", () => {
    const item: ScorableItem = {
      responseFormat: "highlight_text",
      payload: { keys: ["h1", "h2"] },
    };
    expect(explainPointsLost(item, ["h2", "h9", "h1"])).toEqual([
      "+1 h1: correct selection",
      "+1 h2: correct selection",
      "-1 h9: incorrect selection (+/- scoring subtracts)",
    ]);
    expect(explainPointsLost(item, [])).toEqual([
      " 0 h1: missed correct answer",
      " 0 h2: missed correct answer",
    ]);
    expect(explainPointsLost({ responseFormat: "matrix_mc", payload: {} }, {})).toEqual([]);
  });
});
