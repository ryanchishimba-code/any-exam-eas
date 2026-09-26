import { describe, expect, it } from "vitest";
import { practiceFormatChooser, offeredDeliberateFormats } from "@/lib/study/offered-formats";
import {
  clinicalFormatAddition,
  mergeClinicalFormatCounts,
  selectPublishedCatalog,
  studentFacingItem,
  takeSessionUnits,
  type ServeCase,
  type ServeItem,
} from "@/lib/assessment/serve";

const subjects = [
  { id: "management-of-care", label: "Management of Care" },
  { id: "physiological-adaptation", label: "Physiological Adaptation" },
];

function item(overrides: Partial<ServeItem> & Pick<ServeItem, "id">): ServeItem {
  return {
    version: 1,
    batchId: "batch",
    itemType: "bowtie",
    caseId: null,
    caseStep: null,
    caseVersion: null,
    cjmmFunction: [],
    timepoint: null,
    responseFormat: "bowtie",
    scoringRule: "zero_one",
    maxPoints: 1,
    stem: overrides.id,
    payload: { key: "secret", options: [{ id: "a", text: "A" }] },
    rationale: {
      short: "because",
      expanded: { perOption: { a: { verdict: "key", text: "yes" } }, cjmmCoaching: "", pointsLost: "", takeaway: "" },
    },
    clientNeeds: { subcategory: "Management of Care" },
    references: [],
    rnFlags: [],
    status: "published",
    ...overrides,
  };
}

function caseRow(overrides: Partial<ServeCase> & Pick<ServeCase, "id" | "status">): ServeCase {
  return {
    version: 1,
    batchId: "batch",
    title: overrides.id,
    boardProfile: "nclex-rn-2026",
    primaryClientNeed: "Management of Care",
    setting: "unit",
    patient: { displayName: "A", age: 40, sex: "female", weightKg: 70, allergies: "None" },
    timepoints: [],
    chart: { tabs: [] },
    revealRule: "baseline",
    references: [],
    ...overrides,
  };
}

describe("published NGN serving", () => {
  it("serves only published standalones and hides every format at zero", () => {
    const catalog = selectPublishedCatalog({
      items: [
        item({ id: "B01", itemType: "bowtie", status: "published" }),
        item({ id: "B02", itemType: "bowtie", status: "draft" }),
        item({ id: "T01", itemType: "trend", status: "published" }),
        item({ id: "C01-S1", itemType: "case_item", caseId: "C01", caseVersion: 1, caseStep: 1, status: "published" }),
      ],
      cases: [caseRow({ id: "C01", status: "draft" })],
      subjects,
    });
    expect(catalog.standalones.map((unit) => unit.item.id)).toEqual(["B01", "T01"]);
    expect(catalog.cases).toEqual([]);
    const hidden = mergeClinicalFormatCounts(
      { mcq: 5596, ngn: 0, case: 0 },
      {},
      { ngn: 0, case: 0, topics: {} }
    );
    expect(practiceFormatChooser({ formats: hidden.formats, ngnLabel: "NGN" })).toBeNull();
    expect(hidden.formats).toEqual({ mcq: 5596, ngn: 0, case: 0 });
    const shown = mergeClinicalFormatCounts(
      { mcq: 5596, ngn: 0, case: 0 },
      {},
      clinicalFormatAddition(catalog)
    );
    expect(offeredDeliberateFormats(shown.formats)).toEqual(["ngn"]);
    expect(practiceFormatChooser({ formats: shown.formats, ngnLabel: "NGN" })?.intro).not.toMatch(
      /coming soon|shortfall|placeholder/i
    );
  });

  it("serves a case only when every step and the case are published, in step order", () => {
    const steps = [1, 2, 3, 4, 5, 6].map((step) =>
      item({
        id: `C01-S${step}`,
        itemType: "case_item",
        caseId: "C01",
        caseVersion: 1,
        caseStep: step,
        status: step === 4 ? "draft" : "published",
      })
    );
    const partial = selectPublishedCatalog({
      items: steps,
      cases: [caseRow({ id: "C01", status: "published" })],
      subjects,
    });
    expect(partial.cases).toEqual([]);
    expect(partial.standalones).toEqual([]);

    const whole = selectPublishedCatalog({
      items: steps.map((step) => ({ ...step, status: "published" })),
      cases: [caseRow({ id: "C01", status: "published" })],
      subjects,
    });
    expect(whole.cases).toHaveLength(1);
    expect(whole.cases[0]?.items.map((entry) => entry.caseStep)).toEqual([1, 2, 3, 4, 5, 6]);
    const session = takeSessionUnits({
      catalog: whole,
      format: "case",
      limit: 1,
      seed: "student",
    });
    expect(session).toHaveLength(1);
    expect(session[0]?.kind === "case" && session[0].items).toHaveLength(6);

    const draftCase = selectPublishedCatalog({
      items: steps.map((step) => ({ ...step, status: "published" })),
      cases: [caseRow({ id: "C01", status: "draft" })],
      subjects,
    });
    expect(draftCase.cases).toEqual([]);
  });

  it("strips keys and rationale before a student sees the item", () => {
    const facing = studentFacingItem(item({ id: "B01" }));
    expect(JSON.stringify(facing.payload)).not.toContain("secret");
    expect(facing.rationale.short).toBe("");
    expect(facing.stem).toBe("B01");
  });
});
