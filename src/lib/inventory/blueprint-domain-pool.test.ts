import { describe, expect, it } from "vitest";
import { aggregateActiveInventory, type ActiveInventoryRow } from "@/lib/inventory/active-questions";
import {
  activeBlueprintAreaWhere,
  blueprintAreaCountFromTopics,
  blueprintAreaSelectsSingleTopic,
  exclusiveSubjectsForBlueprintCategory,
  questionInBlueprintArea,
  topicRowCountQualifier,
} from "@/lib/inventory/blueprint-domain-pool";

/**
 * Active published counts traced from the live bank on 2026-09-25.
 * clientNeeds was blank on every active row, so an area count is the
 * first-match subject rollup. The topic count is that subject's own rows.
 */
const AANP_TOPIC_COUNTS: Record<string, number> = {
  cardiovascular: 840,
  pediatrics: 696,
  geriatrics: 596,
  "womens-health": 585,
  "psychiatry-behavioral": 572,
  "infectious-disease": 564,
  endocrine: 555,
  pulmonary: 544,
  neurology: 381,
  gastrointestinal: 375,
  musculoskeletal: 189,
  "dermatology-ent": 181,
  assess: 10,
  plan: 9,
  evaluate: 6,
  diagnose: 2,
};

const NCLEX_TOPIC_COUNTS: Record<string, number> = {
  "pharmacology-nursing": 956,
  "management-of-care": 953,
  "physiological-adaptation": 918,
  "safety-infection": 729,
  "reduction-risk": 657,
  "health-promotion": 547,
  psychosocial: 510,
  "basic-care-comfort": 478,
  "maternal-child": 215,
  fundamentals: 97,
  "pediatrics-nursing": 96,
  "med-surg": 87,
};

const NAPLEX_TOPIC_COUNTS: Record<string, number> = {
  "patient-counseling": 2527,
  "compounding-calculations": 1379,
  pharmacology: 1327,
  "cardiovascular-rx": 1088,
  "otc-self-care": 740,
  "infectious-disease-rx": 688,
  "cns-rx": 621,
  "endocrine-rx": 549,
  "pharmacy-law": 503,
  pharmacokinetics: 466,
  pharmaceutics: 449,
};

function row(
  fieldId: string,
  subjectId: string,
  count: number,
  clientNeeds: string | null = null
): ActiveInventoryRow {
  return { fieldId, subjectId, clientNeeds, itemType: "mcq", hasCaseGroup: false, count };
}

function rowsFromTopics(fieldId: string, counts: Record<string, number>): ActiveInventoryRow[] {
  return Object.entries(counts).map(([subjectId, count]) => row(fieldId, subjectId, count));
}

describe("blueprint area and topic counts", () => {
  it("uses the active topic count for an AANP topic and the area rollup for its chip", () => {
    const total = Object.values(AANP_TOPIC_COUNTS).reduce((sum, n) => sum + n, 0);
    expect(total).toBe(6105);
    expect(AANP_TOPIC_COUNTS.assess).toBe(10);
    expect(AANP_TOPIC_COUNTS.diagnose).toBe(2);
    expect(AANP_TOPIC_COUNTS.plan).toBe(9);
    expect(AANP_TOPIC_COUNTS.evaluate).toBe(6);

    expect(blueprintAreaCountFromTopics("aanp-fnp", "assess", AANP_TOPIC_COUNTS)).toBe(1887);
    expect(blueprintAreaCountFromTopics("aanp-fnp", "diagnose", AANP_TOPIC_COUNTS)).toBe(2505);
    expect(blueprintAreaCountFromTopics("aanp-fnp", "plan", AANP_TOPIC_COUNTS)).toBe(581);
    expect(blueprintAreaCountFromTopics("aanp-fnp", "evaluate", AANP_TOPIC_COUNTS)).toBe(6);

    const mapped =
      1887 + 2505 + 581 + 6;
    expect(total - mapped).toBe(1126);
    expect(blueprintAreaSelectsSingleTopic({
      fieldId: "aanp-fnp",
      areaId: "assess",
      topicCounts: AANP_TOPIC_COUNTS,
      areaCount: 1887,
    })).toBeNull();
    expect(
      topicRowCountQualifier({
        fieldId: "aanp-fnp",
        subjectId: "assess",
        topicCount: 10,
        areaCounts: { assess: 1887 },
      })
    ).toBe("in this topic");
    expect(
      topicRowCountQualifier({
        fieldId: "aanp-fnp",
        subjectId: "pediatrics",
        topicCount: 696,
        areaCounts: { assess: 1887 },
      })
    ).toBeNull();
  });

  it("assigns each AANP question to one area and matches the inventory categories", () => {
    expect(exclusiveSubjectsForBlueprintCategory("aanp-fnp", "assess")).toEqual([
      "assess",
      "pediatrics",
      "geriatrics",
      "womens-health",
    ]);
    expect(questionInBlueprintArea("aanp-fnp", "assess", { subjectId: "pediatrics" })).toBe(true);
    expect(questionInBlueprintArea("aanp-fnp", "plan", { subjectId: "womens-health" })).toBe(false);
    expect(questionInBlueprintArea("aanp-fnp", "plan", { subjectId: "psychiatry-behavioral" })).toBe(
      true
    );
    expect(questionInBlueprintArea("aanp-fnp", "evaluate", { subjectId: "geriatrics" })).toBe(false);
    expect(blueprintCategoryUnmapped("aanp-fnp", "neurology")).toBe(true);

    const inventory = aggregateActiveInventory(rowsFromTopics("aanp-fnp", AANP_TOPIC_COUNTS));
    const categories = inventory.fields["aanp-fnp"]!.categories;
    expect(categories.find((category) => category.id === "assess")?.count).toBe(1887);
    expect(categories.find((category) => category.id === "diagnose")?.count).toBe(2505);
    expect(categories.find((category) => category.id === "plan")?.count).toBe(581);
    expect(categories.find((category) => category.id === "evaluate")?.count).toBe(6);
    expect(inventory.fields["aanp-fnp"]!.active).toBe(6105);
    expect(inventory.fields["aanp-fnp"]!.topics.find((topic) => topic.id === "assess")?.count).toBe(
      10
    );
  });

  it("serves a chip from the same rows the area count includes", () => {
    const where = activeBlueprintAreaWhere("aanp-fnp", "assess");
    const subjects = (where.OR[1] as { AND: Array<Record<string, unknown>> }).AND[1] as {
      subjectId: { in: string[] };
    };
    expect(subjects.subjectId.in).toEqual([
      "assess",
      "pediatrics",
      "geriatrics",
      "womens-health",
    ]);
    for (const [subjectId, count] of Object.entries(AANP_TOPIC_COUNTS)) {
      const inArea = questionInBlueprintArea("aanp-fnp", "assess", { subjectId });
      const whereMatches = subjects.subjectId.in.includes(subjectId);
      expect(whereMatches).toBe(inArea);
      if (inArea) expect(count).toBeGreaterThan(0);
    }
    expect(
      questionInBlueprintArea("aanp-fnp", "diagnose", {
        subjectId: "pediatrics",
        clientNeeds: "diagnose",
      })
    ).toBe(true);
    expect(
      questionInBlueprintArea("aanp-fnp", "assess", {
        subjectId: "pediatrics",
        clientNeeds: "diagnose",
      })
    ).toBe(false);
  });

  it("matches NCLEX Client Needs to a topic except Physiological Adaptation", () => {
    expect(blueprintAreaCountFromTopics("nursing", "management-of-care", NCLEX_TOPIC_COUNTS)).toBe(
      953
    );
    expect(
      blueprintAreaSelectsSingleTopic({
        fieldId: "nursing",
        areaId: "management-of-care",
        topicCounts: NCLEX_TOPIC_COUNTS,
        areaCount: 953,
      })
    ).toBe("management-of-care");
    expect(
      blueprintAreaSelectsSingleTopic({
        fieldId: "nursing",
        areaId: "pharmacology",
        topicCounts: NCLEX_TOPIC_COUNTS,
        areaCount: 956,
      })
    ).toBe("pharmacology-nursing");
    expect(blueprintAreaCountFromTopics("nursing", "physiological-adaptation", NCLEX_TOPIC_COUNTS)).toBe(
      1005
    );
    expect(NCLEX_TOPIC_COUNTS["physiological-adaptation"]).toBe(918);
    expect(
      blueprintAreaSelectsSingleTopic({
        fieldId: "nursing",
        areaId: "physiological-adaptation",
        topicCounts: NCLEX_TOPIC_COUNTS,
        areaCount: 1005,
      })
    ).toBeNull();
    expect(questionInBlueprintArea("nursing", "physiological-adaptation", { subjectId: "med-surg" })).toBe(
      true
    );
    const total = Object.values(NCLEX_TOPIC_COUNTS).reduce((sum, n) => sum + n, 0);
    expect(total).toBe(6243);
  });

  it("keeps NAPLEX area chips broader than the lead topic", () => {
    expect(
      blueprintAreaCountFromTopics("pharmacy", "naplex-area1-foundations", NAPLEX_TOPIC_COUNTS)
    ).toBe(3621);
    expect(NAPLEX_TOPIC_COUNTS.pharmacology).toBe(1327);
    expect(
      blueprintAreaSelectsSingleTopic({
        fieldId: "pharmacy",
        areaId: "naplex-area1-foundations",
        topicCounts: NAPLEX_TOPIC_COUNTS,
        areaCount: 3621,
      })
    ).toBeNull();
    expect(
      blueprintAreaCountFromTopics("pharmacy", "naplex-area5-management", NAPLEX_TOPIC_COUNTS)
    ).toBe(0);
    expect(
      blueprintAreaCountFromTopics("pharmacy", "naplex-area4-safety", NAPLEX_TOPIC_COUNTS)
    ).toBe(503);
    const total = Object.values(NAPLEX_TOPIC_COUNTS).reduce((sum, n) => sum + n, 0);
    expect(total).toBe(10337);
    const inventory = aggregateActiveInventory(rowsFromTopics("pharmacy", NAPLEX_TOPIC_COUNTS));
    expect(
      inventory.fields.pharmacy?.categories.find((category) => category.id === "naplex-area1-foundations")
        ?.count
    ).toBe(3621);
    expect(inventory.fields.pharmacy?.topics.find((topic) => topic.id === "pharmacology")?.count).toBe(
      1327
    );
  });
});

function blueprintCategoryUnmapped(fieldId: string, subjectId: string): boolean {
  return !questionInBlueprintArea(fieldId, "assess", { subjectId })
    && !questionInBlueprintArea(fieldId, "diagnose", { subjectId })
    && !questionInBlueprintArea(fieldId, "plan", { subjectId })
    && !questionInBlueprintArea(fieldId, "evaluate", { subjectId });
}
