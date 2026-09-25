import { describe, expect, it } from "vitest";
import { getExamBlueprint } from "@/lib/engine/blueprints";
import {
  allocateReadinessAreaCounts,
  backfillShortAreaCounts,
  levelForArea,
  noteThinAreas,
  summarizeReadiness,
} from "@/lib/learning/readiness-check/scoring";
import {
  READINESS_CHECK_LENGTH,
  READINESS_MIN_EVIDENCE,
} from "@/lib/learning/readiness-check/thresholds";

describe("readiness check scoring", () => {
  it("withholds a level until the evidence minimum", () => {
    expect(levelForArea(0, 0)).toBe("insufficient");
    expect(levelForArea(1, 1)).toBe("insufficient");
    expect(levelForArea(READINESS_MIN_EVIDENCE, READINESS_MIN_EVIDENCE)).toBe("on_track");
  });

  it("uses inclusive 70% and 50% boundaries", () => {
    expect(levelForArea(10, 7)).toBe("on_track");
    expect(levelForArea(10, 6)).toBe("getting_close");
    expect(levelForArea(2, 1)).toBe("getting_close");
    expect(levelForArea(10, 4)).toBe("not_yet");
  });

  it("states a count and a focus, never a pass probability", () => {
    const summary = summarizeReadiness([
      { areaId: "a", label: "Alpha", answered: 4, correct: 4 },
      { areaId: "b", label: "Beta", answered: 4, correct: 3 },
      { areaId: "c", label: "Gamma", answered: 4, correct: 2 },
      { areaId: "d", label: "Delta", answered: 4, correct: 1 },
      { areaId: "e", label: "Epsilon", answered: 1, correct: 1 },
      { areaId: "f", label: "Zeta", answered: 4, correct: 4 },
      { areaId: "g", label: "Eta", answered: 4, correct: 4 },
      { areaId: "h", label: "Theta", answered: 4, correct: 4 },
    ]);

    expect(summary.areasOnTrack).toBe(5);
    expect(summary.areaCount).toBe(8);
    expect(summary.line).toBe("Not yet. A place to practice next: Delta and Gamma.");
    expect(summary.line).not.toMatch(/of \d+ areas/);
    expect(summary.line.toLowerCase()).not.toContain("probability");
    expect(summary.line).not.toMatch(/%/);
    expect(summary.overallLevel).toBe("not_yet");
    expect(summary.areas.find((row) => row.areaId === "e")?.level).toBe("insufficient");
  });

  it("calls an even board On track only when the share clears the bar", () => {
    const strong = summarizeReadiness([
      { areaId: "a", label: "A", answered: 3, correct: 3 },
      { areaId: "b", label: "B", answered: 3, correct: 3 },
      { areaId: "c", label: "C", answered: 3, correct: 3 },
      { areaId: "d", label: "D", answered: 3, correct: 2 },
    ]);
    expect(strong.overallLevel).toBe("on_track");
    expect(strong.line).toBe("On track. A place to practice next: D.");

    const close = summarizeReadiness([
      { areaId: "a", label: "A", answered: 2, correct: 2 },
      { areaId: "b", label: "B", answered: 2, correct: 1 },
      { areaId: "c", label: "C", answered: 2, correct: 1 },
      { areaId: "d", label: "D", answered: 2, correct: 1 },
    ]);
    expect(close.overallLevel).toBe("getting_close");
    expect(close.line).toBe("Getting close. A place to practice next: B and C.");
  });

  it("refuses an overall level when half the areas have no evidence", () => {
    const summary = summarizeReadiness([
      { areaId: "a", label: "A", answered: 2, correct: 2 },
      { areaId: "b", label: "B", answered: 0, correct: 0 },
      { areaId: "c", label: "C", answered: 0, correct: 0 },
      { areaId: "d", label: "D", answered: 0, correct: 0 },
    ]);
    expect(summary.overallLevel).toBe("insufficient");
    expect(summary.line).toBe("Not enough data yet");
  });

  it("names a thin clean bank and does not turn it into a level", () => {
    const summary = noteThinAreas(
      summarizeReadiness([
        { areaId: "a", label: "Alpha", answered: 2, correct: 2 },
        { areaId: "b", label: "Beta", answered: 0, correct: 0 },
        { areaId: "c", label: "Gamma", answered: 1, correct: 1 },
      ]),
      new Set(["b", "c"])
    );
    expect(summary.areas.find((row) => row.areaId === "a")?.thinBank).toBeUndefined();
    expect(summary.areas.find((row) => row.areaId === "b")?.level).toBe("insufficient");
    expect(summary.areas.find((row) => row.areaId === "b")?.thinBank).toBe(true);
    expect(summary.line).toBe("Not enough data yet. 2 areas don't have enough clean questions yet.");
    expect(summary.line.toLowerCase()).not.toContain("probability");
  });
});

describe("readiness check allocation", () => {
  it("gives every NCLEX area at least two items and sums to 24", () => {
    const blueprint = getExamBlueprint("nursing")!;
    const rows = allocateReadinessAreaCounts(blueprint);
    expect(rows).toHaveLength(blueprint.categories.length);
    expect(rows.reduce((sum, row) => sum + row.count, 0)).toBe(READINESS_CHECK_LENGTH);
    expect(rows.every((row) => row.count >= READINESS_MIN_EVIDENCE)).toBe(true);
  });

  it("gives every NAPLEX area at least two items through the same allocator", () => {
    const blueprint = getExamBlueprint("pharmacy")!;
    const rows = allocateReadinessAreaCounts(blueprint);
    expect(rows.reduce((sum, row) => sum + row.count, 0)).toBe(READINESS_CHECK_LENGTH);
    expect(rows.every((row) => row.count >= READINESS_MIN_EVIDENCE)).toBe(true);
  });

  it("backfills a NAPLEX area that has a slot but no eligible items", () => {
    const blueprint = getExamBlueprint("pharmacy")!;
    const slots = allocateReadinessAreaCounts(blueprint);
    const emptyId = "naplex-area5-management";
    expect(slots.find((row) => row.id === emptyId)?.count).toBe(2);
    const filled = slots.map((row) => ({
      id: row.id,
      count: row.id === emptyId ? 0 : row.count,
    }));
    expect(filled.reduce((sum, row) => sum + row.count, 0)).toBe(22);
    const spare = slots.map((row) => ({
      id: row.id,
      count: row.id === emptyId ? 0 : READINESS_CHECK_LENGTH,
    }));
    const extras = backfillShortAreaCounts({
      slots,
      filled,
      spare,
      length: READINESS_CHECK_LENGTH,
    });
    const served = new Map(filled.map((row) => [row.id, row.count]));
    for (const extra of extras) served.set(extra.id, (served.get(extra.id) ?? 0) + extra.extra);
    expect([...served.values()].reduce((sum, count) => sum + count, 0)).toBe(READINESS_CHECK_LENGTH);
    expect(served.get(emptyId)).toBe(0);
    expect(extras.reduce((sum, row) => sum + row.extra, 0)).toBe(2);
    expect(extras.find((row) => row.id === emptyId)).toBeUndefined();
    expect(served.get("naplex-area3-treatment-planning")).toBe(9);
    expect(served.get("naplex-area1-foundations")).toBe(7);
  });

  it("stops backfill when no area has spare items", () => {
    const extras = backfillShortAreaCounts({
      slots: [
        { id: "a", count: 6 },
        { id: "b", count: 2 },
      ],
      filled: [
        { id: "a", count: 6 },
        { id: "b", count: 0 },
      ],
      spare: [
        { id: "a", count: 0 },
        { id: "b", count: 0 },
      ],
      length: 8,
    });
    expect(extras).toEqual([]);
  });

  it("covers a wide board with at least one item per area", () => {
    const blueprint = getExamBlueprint("npte-pt")!;
    const rows = allocateReadinessAreaCounts(blueprint);
    expect(rows.reduce((sum, row) => sum + row.count, 0)).toBe(READINESS_CHECK_LENGTH);
    expect(blueprint.categories.length).toBeGreaterThan(READINESS_CHECK_LENGTH / 2);
    expect(rows.every((row) => row.count >= 1)).toBe(true);
  });
});
