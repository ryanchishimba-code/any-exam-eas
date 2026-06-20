import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import { getExamBlueprint } from "@/lib/engine/blueprints";
import {
  domainTargets,
  selectBlueprintBalancedSet,
} from "./blueprint-selection";

const blueprint = getExamBlueprint("pharmacy")!;
const AREAS = blueprint.categories.map((c) => c.id);

function makePool(perArea: number): BankItem[] {
  const items: BankItem[] = [];
  let n = 0;
  for (const area of AREAS) {
    for (let i = 0; i < perArea; i++) {
      n += 1;
      items.push({
        id: `${area}-${i}`,
        question: `Q${n} about ${area}?`,
        options: ["A", "B", "C", "D"],
        correctAnswer: ["A", "B", "C", "D"][n % 4],
        explanation: "because",
        subjectId: "pharmacology",
        blueprintDomain: area,
        difficulty: (n % 5) + 1,
        itemType: n % 6 === 0 ? "select_all" : "mcq",
        tags: [`concept-${n % 20}`, "curated"],
        blueprintTopic: `topic-${n % 12}`,
        topicCategory: "pharmacology",
        source: "curated",
      });
    }
  }
  return items;
}

describe("domainTargets", () => {
  it("sums to the requested count and follows blueprint weights", () => {
    const targets = domainTargets(100, blueprint);
    const total = [...targets.values()].reduce((a, b) => a + b, 0);
    expect(total).toBe(100);
    // Area 3 has the largest weight (0.40) → largest target.
    const max = Math.max(...targets.values());
    expect(targets.get("naplex-area3-treatment-planning")).toBe(max);
  });

  it("overweights focus areas without zeroing donors", () => {
    const base = domainTargets(100, blueprint);
    const focused = domainTargets(100, blueprint, ["naplex-area5-management"]);
    expect([...focused.values()].reduce((a, b) => a + b, 0)).toBe(100);
    expect(focused.get("naplex-area5-management")!).toBeGreaterThan(
      base.get("naplex-area5-management")!
    );
    for (const v of focused.values()) expect(v).toBeGreaterThanOrEqual(0);
  });
});

describe("selectBlueprintBalancedSet", () => {
  it("selects exactly numQuestions when the pool is ample", () => {
    const pool = makePool(60);
    const { items, summary } = selectBlueprintBalancedSet(pool, blueprint, {
      numQuestions: 100,
    });
    expect(items).toHaveLength(100);
    expect(summary.selected).toBe(100);
    expect(new Set(items.map((i) => i.id)).size).toBe(100);
  });

  it("approximately matches blueprint domain targets", () => {
    const pool = makePool(60);
    const { summary } = selectBlueprintBalancedSet(pool, blueprint, { numQuestions: 100 });
    const area3 = summary.rows.find((r) => r.domainId === "naplex-area3-treatment-planning")!;
    expect(area3.selectedCount).toBe(area3.targetCount);
    expect(area3.targetCount).toBeGreaterThanOrEqual(35);
  });

  it("flags shortfalls and backfills to preserve length", () => {
    // Starve the largest domain entirely.
    const pool = makePool(60).filter(
      (i) => i.blueprintDomain !== "naplex-area3-treatment-planning"
    );
    const { items, summary } = selectBlueprintBalancedSet(pool, blueprint, {
      numQuestions: 100,
    });
    expect(items).toHaveLength(100);
    const area3 = summary.rows.find((r) => r.domainId === "naplex-area3-treatment-planning")!;
    expect(area3.shortfall).toBeGreaterThan(0);
    expect(summary.notes.join(" ")).toMatch(/short/i);
  });

  it("respects difficulty preference direction", () => {
    const pool = makePool(80);
    const easier = selectBlueprintBalancedSet(pool, blueprint, {
      numQuestions: 100,
      difficultyPreference: "easier",
    }).summary.difficultyMix;
    const harder = selectBlueprintBalancedSet(pool, blueprint, {
      numQuestions: 100,
      difficultyPreference: "harder",
    }).summary.difficultyMix;
    expect(easier.Easy).toBeGreaterThan(harder.Easy);
    expect(harder.Hard).toBeGreaterThan(easier.Hard);
  });
});
