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

  it("serves unseen cases before least-recent ones and reaches every case", () => {
    const items: ServeItem[] = [];
    const cases: ServeCase[] = [];
    for (let index = 1; index <= 25; index += 1) {
      const id = `C${String(index).padStart(2, "0")}`;
      cases.push(caseRow({ id, status: "published", title: id }));
      for (let step = 1; step <= 6; step += 1) {
        items.push(
          item({
            id: `${id}-S${step}`,
            itemType: "case_item",
            caseId: id,
            caseVersion: 1,
            caseStep: step,
            status: "published",
          })
        );
      }
    }
    const catalog = selectPublishedCatalog({ items, cases, subjects });
    expect(catalog.cases).toHaveLength(25);

    const stamps = new Map<string, number>();
    const served = new Set<string>();
    for (let session = 0; session < 3; session += 1) {
      const units = takeSessionUnits({
        catalog,
        format: "case",
        limit: 10,
        seed: `session-${session}`,
        caseLastAttemptedAt: stamps,
      });
      expect(units).toHaveLength(10);
      const ids = units.map((unit) => (unit.kind === "case" ? unit.caseDoc.id : ""));
      const firstSeen = ids.findIndex((id) => stamps.has(id));
      if (firstSeen === -1) {
        expect(ids.every((id) => !stamps.has(id))).toBe(true);
      } else {
        expect(ids.slice(0, firstSeen).every((id) => !stamps.has(id))).toBe(true);
        expect(ids.slice(firstSeen).every((id) => stamps.has(id))).toBe(true);
        let previous = -Infinity;
        for (const id of ids.slice(firstSeen)) {
          const at = stamps.get(id) ?? 0;
          expect(at).toBeGreaterThanOrEqual(previous);
          previous = at;
        }
      }
      for (const unit of units) {
        if (unit.kind !== "case") continue;
        expect(unit.items.map((entry) => entry.caseStep)).toEqual([1, 2, 3, 4, 5, 6]);
        served.add(unit.caseDoc.id);
        stamps.set(unit.caseDoc.id, session + 1);
      }
    }
    expect([...served].sort()).toEqual(catalog.cases.map((unit) => unit.caseDoc.id).sort());
  });

  it("puts an unseen case ahead of a less recent attempt", () => {
    const catalog = selectPublishedCatalog({
      items: ["A", "B", "C"].flatMap((id) =>
        [1, 2, 3, 4, 5, 6].map((step) =>
          item({
            id: `${id}-S${step}`,
            itemType: "case_item",
            caseId: id,
            caseVersion: 1,
            caseStep: step,
            status: "published",
          })
        )
      ),
      cases: ["A", "B", "C"].map((id) => caseRow({ id, status: "published" })),
      subjects,
    });
    const picked = takeSessionUnits({
      catalog,
      format: "case",
      limit: 2,
      seed: "recency",
      caseLastAttemptedAt: new Map([
        ["A", 10],
        ["B", 5],
      ]),
    });
    expect(picked.map((unit) => (unit.kind === "case" ? unit.caseDoc.id : ""))).toEqual(["C", "B"]);
  });

  it("offers physiological cases on the medical-surgical topic", () => {
    const catalog = selectPublishedCatalog({
      items: [1, 2, 3, 4, 5, 6].map((step) =>
        item({
          id: `P-S${step}`,
          itemType: "case_item",
          caseId: "P",
          caseVersion: 1,
          caseStep: step,
          status: "published",
          clientNeeds: { subcategory: "Physiological Adaptation" },
        })
      ),
      cases: [caseRow({ id: "P", status: "published", primaryClientNeed: "Physiological Adaptation" })],
      subjects: [
        ...subjects,
        { id: "med-surg", label: "Medical-Surgical Nursing" },
        { id: "pharmacology-nursing", label: "Pharmacological Therapies" },
      ],
    });
    expect(catalog.cases[0]?.practiceSubjectIds).toEqual(
      expect.arrayContaining(["physiological-adaptation", "med-surg"])
    );
    const onMedSurg = takeSessionUnits({
      catalog,
      format: "case",
      subjectId: "med-surg",
      limit: 5,
      seed: "topic",
    });
    expect(onMedSurg.map((unit) => (unit.kind === "case" ? unit.caseDoc.id : ""))).toEqual(["P"]);
    expect(
      takeSessionUnits({
        catalog,
        format: "case",
        subjectId: "pharmacology-nursing",
        limit: 5,
        seed: "topic",
      })
    ).toEqual([]);
    expect(clinicalFormatAddition(catalog).topics["med-surg"]?.case).toBe(1);
    expect(clinicalFormatAddition(catalog).topics["physiological-adaptation"]?.case).toBe(1);
    expect(clinicalFormatAddition(catalog).case).toBe(1);
  });

  it("strips keys and rationale before a student sees the item", () => {
    const facing = studentFacingItem(item({ id: "B01" }));
    expect(JSON.stringify(facing.payload)).not.toContain("secret");
    expect(facing.rationale.short).toBe("");
    expect(facing.stem).toBe("B01");
  });
});
