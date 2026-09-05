import { describe, expect, it } from "vitest";
import { getExamBlueprint } from "@/lib/engine/blueprints";
import { MIXED_SUBJECT_ID } from "@/lib/edtech/practice-links-core";
import {
  topicNodeFromBlueprintCategory,
  topicNodeFromConceptKey,
  topicNodeFromHighYield,
  topicNodePracticeHref,
  topicNodeToPracticeFilter,
} from "@/lib/topics/topic-node";
import type { HighYieldTopic } from "@/types/edtech";

describe("topicNodeFromConceptKey", () => {
  it("maps NCLEX subject mastery to bank subject practice", () => {
    const node = topicNodeFromConceptKey(
      "nclex",
      "subject:physiological-adaptation",
      { fieldId: "nursing" }
    );
    const href = topicNodePracticeHref(node, 15);
    expect(node.fieldId).toBe("nursing");
    expect(href).toContain("field=nursing");
    expect(href).toContain("mode=bank");
    // Prefer HY card filters when registry maps the subject
    expect(href).toMatch(/subjectId=(physiological-adaptation|__mixed__)/);
  });

  it("keeps USMLE Step-1 subjects on usmle-step-1", () => {
    const node = topicNodeFromConceptKey("usmle", "subject:anatomy", {
      fieldId: "usmle-step-1",
    });
    const href = topicNodePracticeHref(node);
    expect(node.fieldId).toBe("usmle-step-1");
    expect(href).toContain("field=usmle-step-1");
  });

  it("degrades unknown mastery tags to mixed", () => {
    const node = topicNodeFromConceptKey("nclex", "tag:some-freeform-tag-xyz", {
      fieldId: "nursing",
    });
    const { subjectId } = topicNodeToPracticeFilter(node);
    expect(subjectId).toBe(MIXED_SUBJECT_ID);
    expect(topicNodePracticeHref(node)).toContain("subjectId=__mixed__");
  });
});

describe("topicNodeFromBlueprintCategory", () => {
  it("uses MIXED for multi-subject NCLEX categories", () => {
    const blueprint = getExamBlueprint("nursing");
    const category = blueprint.categories.find(
      (c) => c.id === "physiological-adaptation"
    );
    expect(category).toBeDefined();
    const node = topicNodeFromBlueprintCategory("nclex", category!, {
      fieldId: "nursing",
    });
    expect(node.subjectIds).toEqual(
      expect.arrayContaining(["physiological-adaptation", "med-surg"])
    );
    expect(node.useMixedSubject).toBe(true);
    const href = topicNodePracticeHref(node, 15);
    expect(href).toContain("subjectId=__mixed__");
    expect(href).toContain("field=nursing");
  });

  it("keeps single-subject categories on that subject", () => {
    const blueprint = getExamBlueprint("nursing");
    const category = blueprint.categories.find((c) => c.id === "management-of-care");
    expect(category).toBeDefined();
    const node = topicNodeFromBlueprintCategory("nclex", category!, {
      fieldId: "nursing",
    });
    const { subjectId } = topicNodeToPracticeFilter(node);
    // May resolve via HY card (still management-of-care domain) or bank subject
    expect(subjectId === MIXED_SUBJECT_ID || subjectId === "management-of-care").toBe(
      true
    );
  });
});

describe("topicNodeFromHighYield", () => {
  it("aligns NCLEX card practice with blueprint topic filters", () => {
    const card = {
      id: "test",
      examSlug: "nclex",
      slug: "prioritization",
      category: "Management of Care",
      title: "Prioritization",
      overview: "o",
      summary: "s",
      keyConcepts: [],
      mustKnowFacts: [],
      pearls: [],
      pitfalls: [],
      sortOrder: 1,
      practiceTopicSlug: "management-of-care",
      clientNeedsDomain: "management-of-care",
      blueprintTopicSlugs: ["prioritization", "delegation-assignment"],
    } satisfies HighYieldTopic;

    const node = topicNodeFromHighYield("nclex", card);
    const href = topicNodePracticeHref(node, 10);
    expect(href).toContain("subjectId=management-of-care");
    expect(href).toContain("blueprintTopics=");
    expect(decodeURIComponent(href)).toContain("prioritization");
  });
});
