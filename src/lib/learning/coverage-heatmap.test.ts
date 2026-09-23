import { describe, expect, it } from "vitest";
import { getExamBlueprint } from "@/lib/engine/blueprints";
import {
  buildCoverageHeatmap,
  domainsLabelForField,
  touchCoveragePct,
} from "./coverage-heatmap";

const now = new Date("2026-09-22T15:00:00.000Z");

describe("buildCoverageHeatmap", () => {
  it("names nursing domains Client Needs and other boards Blueprint topics", () => {
    expect(domainsLabelForField("nursing")).toBe("Client Needs");
    expect(domainsLabelForField("pharmacy")).toBe("Blueprint topics");
    expect(domainsLabelForField("usmle-step-2")).toBe("Blueprint topics");
  });

  it("puts an untouched high-weight domain first and chips it", () => {
    const heatmap = buildCoverageHeatmap({
      fieldId: "nursing",
      now,
      topics: [
        {
          id: "management-of-care",
          label: "Management of Care",
          blueprintWeightPct: 18,
          attempts: 0,
          accuracyPct: null,
          coveragePct: 0,
        },
        {
          id: "safety-infection",
          label: "Safety & Infection Control",
          blueprintWeightPct: 13,
          attempts: 20,
          accuracyPct: 80,
          coveragePct: 40,
        },
      ],
    });

    expect(heatmap.domainsLabel).toBe("Client Needs");
    expect(heatmap.topGapId).toBe("management-of-care");
    expect(heatmap.domains[0]?.untouched).toBe(true);
    expect(heatmap.domains[0]?.fillPct).toBe(0);
    expect(heatmap.chips[0]).toMatchObject({
      kind: "untouched",
      domainId: "management-of-care",
      subjectId: "management-of-care",
    });
    expect(heatmap.touchCoveragePct).toBe(touchCoveragePct(heatmap.domains));
    expect(JSON.stringify(heatmap)).not.toMatch(/you will pass/i);
  });

  it("ranks a very low high-weight domain ahead of a covered one", () => {
    const heatmap = buildCoverageHeatmap({
      fieldId: "pharmacy",
      now,
      topics: [
        {
          id: "covered",
          label: "Covered domain",
          blueprintWeightPct: 25,
          attempts: 40,
          accuracyPct: 80,
          coveragePct: 80,
        },
        {
          id: "thin",
          label: "Thin domain",
          blueprintWeightPct: 40,
          attempts: 6,
          accuracyPct: 70,
          coveragePct: 5,
        },
      ],
    });

    expect(heatmap.topGapId).toBe("thin");
    expect(heatmap.domains[0]?.veryLow).toBe(true);
    expect(heatmap.chips[0]?.kind).toBe("weak");
    expect(heatmap.domainsLabel).toBe("Blueprint topics");
  });

  it("keeps inventory category counts and labels on the same domains", () => {
    const blueprint = getExamBlueprint("nursing");
    const categories = (blueprint?.categories ?? []).slice(0, 3).map((category, index) => ({
      id: category.id,
      label: category.label,
      count: (index + 1) * 100,
    }));
    const topicTotal = 640;
    const heatmap = buildCoverageHeatmap({
      fieldId: "nursing",
      now,
      topics: categories.map((category) => ({
        id: category.id,
        label: category.label,
        blueprintWeightPct: Math.round(
          (blueprint?.categories.find((row) => row.id === category.id)?.weight ?? 0) * 100
        ),
        attempts: category.id === categories[0]?.id ? 0 : 4,
        accuracyPct: category.id === categories[0]?.id ? null : 55,
        coveragePct: category.id === categories[0]?.id ? 0 : 10,
        seen: category.id === categories[0]?.id ? 0 : 8,
      })),
      inventoryCategories: categories,
      topicQuestionTotal: topicTotal,
      bankSubjectIds: ["management-of-care", "safety-infection", "health-promotion", "med-surg"],
    });

    expect(heatmap.countsAgree).toBe(true);
    expect(heatmap.categoryQuestionTotal).toBe(600);
    expect(heatmap.topicQuestionTotal).toBe(topicTotal);
    for (const category of categories) {
      const domain = heatmap.domains.find((row) => row.id === category.id);
      expect(domain?.available).toBe(category.count);
      expect(domain?.label).toBe(category.label);
    }
    expect(heatmap.topGapId).toBe(categories[0]?.id);
    expect(heatmap.chips[0]?.available).toBe(categories[0]?.count);
  });

  it("does not treat a topic total below the category sum as agreement", () => {
    const heatmap = buildCoverageHeatmap({
      fieldId: "pance",
      now,
      topics: [
        {
          id: "cardio",
          label: "Cardiovascular",
          blueprintWeightPct: 12,
          attempts: 0,
          accuracyPct: null,
          coveragePct: 0,
        },
      ],
      inventoryCategories: [{ id: "cardio", label: "Cardiovascular", count: 80 }],
      topicQuestionTotal: 10,
    });
    expect(heatmap.domains[0]?.available).toBe(80);
    expect(heatmap.countsAgree).toBe(false);
  });

  it("keeps questions outside the blueprint in the total without a fake domain", () => {
    const heatmap = buildCoverageHeatmap({
      fieldId: "nursing",
      now,
      topics: [
        {
          id: "management-of-care",
          label: "Management of Care",
          blueprintWeightPct: 18,
          attempts: 0,
          accuracyPct: null,
          coveragePct: 0,
        },
      ],
      inventoryCategories: [
        { id: "management-of-care", label: "Management of Care", count: 100 },
        { id: "fundamentals", label: "Fundamentals", count: 8 },
      ],
      topicQuestionTotal: 108,
    });
    expect(heatmap.domains.map((domain) => domain.id)).toEqual(["management-of-care"]);
    expect(heatmap.categoryQuestionTotal).toBe(100);
    expect(heatmap.unmappedQuestionTotal).toBe(8);
    expect(heatmap.countsAgree).toBe(true);
    expect(heatmap.topGapId).toBe("management-of-care");
  });

  it("leaves an empty blueprint as an empty heatmap", () => {
    const heatmap = buildCoverageHeatmap({ fieldId: "nursing", now, topics: [] });
    expect(heatmap.topGapId).toBeNull();
    expect(heatmap.domains).toEqual([]);
    expect(heatmap.chips).toEqual([]);
    expect(heatmap.touchCoveragePct).toBe(0);
    expect(heatmap.countsAgree).toBe(true);
  });
});
