import { describe, expect, it } from "vitest";
import { aanpFnpBlueprintTopicCounts } from "./blueprint-domain-pool";

describe("aanpFnpBlueprintTopicCounts", () => {
  it("uses one category total for the dashboard and the bank", () => {
    const topics = { assess: 10, plan: 9, diagnose: 2, evaluate: 6, cardiovascular: 400 };
    const categories = { assess: 1600, diagnose: 2061, plan: 488, evaluate: 6 };
    expect(aanpFnpBlueprintTopicCounts(topics, categories)).toMatchObject(categories);
  });

  it("does not add a subject into two domains when categories are missing", () => {
    const topics = {
      assess: 10,
      pediatrics: 20,
      geriatrics: 30,
      "womens-health": 40,
      diagnose: 2,
      cardiovascular: 50,
      plan: 9,
      evaluate: 6,
    };
    const counts = aanpFnpBlueprintTopicCounts(topics, null);
    expect(counts.assess).toBe(10 + 20 + 30 + 40);
    expect(counts.evaluate).toBe(6);
    expect(counts.cardiovascular).toBe(50);
  });
});
