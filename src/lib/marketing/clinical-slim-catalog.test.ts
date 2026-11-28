import { describe, expect, it } from "vitest";
import { catalogFromSlimRows } from "@/lib/marketing/clinical-extra-http";
import { servedItemKeys } from "@/lib/assessment/serve";

const subjects = [
  { id: "pharmacology-nursing", label: "Pharmacological and Parenteral Therapies" },
  { id: "management-of-care", label: "Management of Care" },
];

describe("catalogFromSlimRows", () => {
  it("attributes published items from the client-need label and keeps charts out", () => {
    const catalog = catalogFromSlimRows({
      fieldId: "nursing",
      subjects,
      items: [
        {
          id: "bow-1",
          version: 2,
          status: "published",
          caseId: null,
          caseVersion: null,
          caseStep: null,
          itemType: "bowtie",
          clientNeedsSubcategory: "Pharmacological and Parenteral Therapies",
        },
        {
          id: "step-1",
          version: 1,
          status: "published",
          caseId: "case-1",
          caseVersion: 3,
          caseStep: 1,
          itemType: "mcq",
          clientNeedsSubcategory: "",
        },
        {
          id: "draft-bow",
          version: 1,
          status: "draft",
          caseId: null,
          caseVersion: null,
          caseStep: null,
          itemType: "bowtie",
          clientNeedsSubcategory: "Pharmacological and Parenteral Therapies",
        },
      ],
      cases: [
        {
          id: "case-1",
          version: 3,
          status: "published",
          primaryClientNeed: "Management of Care",
        },
      ],
    });

    expect(catalog.standalones).toHaveLength(1);
    expect(catalog.standalones[0]?.subjectId).toBe("pharmacology-nursing");
    expect(catalog.standalones[0]?.item.stem).toBe("");
    expect(catalog.cases).toHaveLength(1);
    expect(catalog.cases[0]?.subjectId).toBe("management-of-care");
    expect(catalog.cases[0]?.caseDoc.chart).toEqual({ tabs: [] });
    expect(servedItemKeys(catalog).sort()).toEqual(["ngn:bow-1:v2", "ngn:step-1:v1"].sort());
  });
});
