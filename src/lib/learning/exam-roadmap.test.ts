import { describe, expect, it } from "vitest";
import { getExamBlueprint } from "@/lib/engine/blueprints";
import {
  aggregateAttemptsBySubject,
  buildRoadmapTopics,
  classifyReadiness,
  computeCategoryReadinessScore,
  computeOverallPushCoverage,
  computeOverallRoadmapReadiness,
  selectPriorityTopics,
} from "./exam-roadmap";

describe("exam roadmap", () => {
  it("classifies strong readiness with enough attempts", () => {
    expect(classifyReadiness(85, 10)).toEqual({
      key: "strong",
      label: "Strong",
    });
  });

  it("classifies needs review in mid range", () => {
    expect(classifyReadiness(70, 8)).toEqual({
      key: "needs_review",
      label: "Needs Review",
    });
  });

  it("classifies needs more work when score is low or no attempts", () => {
    expect(classifyReadiness(50, 12).label).toBe("Needs More Work");
    expect(classifyReadiness(90, 0).label).toBe("Needs More Work");
  });

  it("caps readiness below strong threshold with few attempts", () => {
    const score = computeCategoryReadinessScore(
      { attempts: 2, correct: 2 },
      []
    );
    expect(score).toBeLessThanOrEqual(74);
  });

  it("scores untouched categories at 0 (no false prior confidence)", () => {
    expect(computeCategoryReadinessScore({ attempts: 0, correct: 0 }, [])).toBe(0);
    expect(computeCategoryReadinessScore({ attempts: 0, correct: 0 }, [90])).toBe(0);
  });

  it("builds NCLEX roadmap topics from official blueprint", () => {
    const blueprint = getExamBlueprint("nursing")!;
    const attemptMap = aggregateAttemptsBySubject([
      { subjectId: "pharmacology-nursing", correct: true },
      { subjectId: "pharmacology-nursing", correct: false },
      { subjectId: "management-of-care", correct: true },
    ]);
    const topics = buildRoadmapTopics(blueprint, "nclex", attemptMap, new Map());
    expect(topics).toHaveLength(blueprint.categories.length);
    const pharm = topics.find((t) => t.categoryId === "pharmacology");
    expect(pharm?.attempts).toBe(2);
    expect(pharm?.readinessLabel).toBeDefined();
  });

  it("prioritizes high-weight weak categories", () => {
    const topics = buildRoadmapTopics(
      getExamBlueprint("nursing")!,
      "nclex",
      new Map(),
      new Map()
    ).map((t, i) =>
      i === 0
        ? {
            ...t,
            readinessScore: 40,
            readinessKey: "needs_more_work" as const,
            readinessLabel: "Needs More Work" as const,
            blueprintWeightPct: 20,
          }
        : {
            ...t,
            readinessScore: 90,
            readinessKey: "strong" as const,
            readinessLabel: "Strong" as const,
          }
    );
    const priorities = selectPriorityTopics(topics, 3);
    expect(priorities[0]?.categoryId).toBe(topics[0]!.categoryId);
  });

  it("computes weighted overall readiness and push coverage", () => {
    const topics = [
      {
        categoryId: "a",
        label: "A",
        blueprintWeightPct: 50,
        readinessScore: 80,
        readinessKey: "strong" as const,
        readinessLabel: "Strong" as const,
        attempts: 10,
        correct: 8,
        accuracy: 80,
        pushesCompleted: 20,
        pushesAvailable: 100,
        pushCoveragePct: 20,
        highYieldTopics: [],
        practiceHref: "/",
      },
      {
        categoryId: "b",
        label: "B",
        blueprintWeightPct: 50,
        readinessScore: 60,
        readinessKey: "needs_review" as const,
        readinessLabel: "Needs Review" as const,
        attempts: 10,
        correct: 6,
        accuracy: 60,
        pushesCompleted: 40,
        pushesAvailable: 100,
        pushCoveragePct: 40,
        highYieldTopics: [],
        practiceHref: "/",
      },
    ];
    expect(computeOverallRoadmapReadiness(topics)).toBe(70);
    expect(computeOverallPushCoverage(topics)).toBe(30);
  });

  it("attaches push coverage from bySubject map", () => {
    const blueprint = getExamBlueprint("nursing")!;
    const topics = buildRoadmapTopics(blueprint, "nclex", new Map(), new Map(), {
      "pharmacology-nursing": { seen: 25, available: 100, coveragePct: 25 },
    });
    const pharm = topics.find((t) => t.categoryId === "pharmacology");
    expect(pharm?.pushCoveragePct).toBeGreaterThanOrEqual(0);
    expect(pharm?.pushesCompleted).toBeGreaterThanOrEqual(0);
  });

  it("builds PANCE roadmap from NCCPA 2026 blueprint (14 knowledge areas)", () => {
    const blueprint = getExamBlueprint("pance")!;
    expect(blueprint.categories).toHaveLength(14);
    const weightSum = blueprint.categories.reduce((s, c) => s + c.weight, 0);
    expect(weightSum).toBeGreaterThan(0.9);

    const topics = buildRoadmapTopics(blueprint, "pance", new Map(), new Map());
    expect(topics).toHaveLength(14);
    expect(topics.find((t) => t.categoryId === "cardiovascular")?.blueprintWeightPct).toBe(13);
    expect(topics.find((t) => t.categoryId === "pulmonary")?.blueprintWeightPct).toBe(10);
  });

  it("builds NPTE-PT roadmap from FSBPT 2024 blueprint (14 categories)", () => {
    const blueprint = getExamBlueprint("npte-pt")!;
    expect(blueprint.categories).toHaveLength(14);
    const weightSum = blueprint.categories.reduce((s, c) => s + c.weight, 0);
    expect(Math.round(weightSum * 100)).toBe(100);

    const topics = buildRoadmapTopics(blueprint, "npte-pt", new Map(), new Map());
    expect(topics).toHaveLength(14);
    expect(topics.find((t) => t.categoryId === "musculoskeletal")?.blueprintWeightPct).toBe(28);
    expect(topics.find((t) => t.categoryId === "neuromuscular-nervous")?.blueprintWeightPct).toBe(24);
  });
});
