import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import { finalizeAssembledSitting } from "@/lib/exam-prep/sitting-selection";
import { nursingClientNeedsWhere } from "@/lib/exam-prep/nclex-client-needs-topup";
import { enrichBankItemFromRow } from "@/lib/mpje/parse-bank-options";
import { NCLEX_2026_CLIENT_NEEDS } from "@/lib/exam-prep/nclex/blueprint-topics-2026";
import type { NclexClientNeedsId } from "@/lib/exam-prep/nclex/types";
import {
  clientNeedsCounts,
  clientNeedsDeficits,
  clientNeedsStoredValues,
  clientNeedsTargets,
  clientNeedsWithinRanges,
  composeWithinClientNeeds,
  examClientNeedsCategory,
} from "@/lib/exam-prep/nclex-client-needs-quota";

function row(id: string, category: string, extra: Partial<BankItem> = {}): BankItem {
  return {
    id,
    question: `Which action is first for ${id}?`,
    options: ["Assess", "Wait", "Document", "Delegate"],
    correctAnswer: "Assess",
    explanation: `Assess ${id} before the other steps.`,
    subjectId: category,
    qaPassed: true,
    active: true,
    ...extra,
  };
}

function balancedPool(limit: number): BankItem[] {
  const targets = clientNeedsTargets(limit);
  if (!targets) throw new Error(`no targets for ${limit}`);
  const items: BankItem[] = [];
  for (const target of targets) {
    for (let index = 0; index < target.count + 4; index += 1) {
      items.push(row(`${target.id}-${index}`, target.id));
    }
  }
  return items;
}

describe("NCSBN 2026 client-needs quotas", () => {
  it("keeps an 85-item draw inside every published range", () => {
    const pool = balancedPool(85);
    const draw = composeWithinClientNeeds({ preferred: pool.slice(0, 85), pool, limit: 85, seed: 85 });
    expect(draw).not.toBeNull();
    expect(draw).toHaveLength(85);
    expect(clientNeedsWithinRanges(draw!)).toBe(true);
    for (const category of NCLEX_2026_CLIENT_NEEDS) {
      const count = draw!.filter((item) => examClientNeedsCategory(item) === category.id).length;
      const min = Math.ceil((category.weightPct.min * 85) / 100);
      const max = Math.floor((category.weightPct.max * 85) / 100);
      expect(count).toBeGreaterThanOrEqual(min);
      expect(count).toBeLessThanOrEqual(max);
    }
  });

  it("uses options.clientNeedsCategory and leaves subject-only maternal and pediatric items out", () => {
    const bankRow = {
      question: "Which action is first?",
      correctAnswer: "Assess",
      explanation: "Assess before the other steps.",
      solutionSteps: null,
      tags: null,
    };
    const tagged = enrichBankItemFromRow({
      ...bankRow,
      id: "maternal-tagged",
      subjectId: "maternal-child",
      topicCategory: "Maternal & Child Health",
      options: JSON.stringify({
        options: ["Assess", "Wait", "Document", "Delegate"],
        clientNeedsCategory: "physiological-adaptation",
      }),
    });
    expect(tagged.clientNeedsCategory).toBe("physiological-adaptation");
    expect(examClientNeedsCategory(tagged)).toBe("physiological-adaptation");

    const fromColumn = enrichBankItemFromRow({
      ...bankRow,
      id: "peds-column",
      subjectId: "pediatrics-nursing",
      topicCategory: "Pediatric Nursing",
      clientNeeds: "safety-infection",
      options: JSON.stringify(["Assess", "Wait", "Document", "Delegate"]),
    });
    expect(examClientNeedsCategory(fromColumn)).toBe("safety-infection");

    const maternalOnly = enrichBankItemFromRow({
      ...bankRow,
      id: "maternal-plain",
      subjectId: "maternal-child",
      topicCategory: "Maternal & Child Health",
      options: JSON.stringify(["Assess", "Wait", "Document", "Delegate"]),
    });
    const pedsOnly = row("peds-plain", "pediatrics-nursing", {
      subjectLabel: "Pediatric Nursing",
    } as Partial<BankItem>);
    expect(examClientNeedsCategory(maternalOnly)).toBeNull();
    expect(examClientNeedsCategory(pedsOnly)).toBeNull();

    const targets = clientNeedsTargets(85)!;
    const items: BankItem[] = [tagged, maternalOnly, pedsOnly, row("yacht-1", "yacht-racing")];
    for (const target of targets) {
      for (let index = 0; index < target.count + 2; index += 1) {
        items.push(row(`${target.id}-${index}`, target.id));
      }
    }
    const draw = composeWithinClientNeeds({ preferred: [], pool: items, limit: 85, seed: 3 });
    expect(draw).not.toBeNull();
    expect(clientNeedsWithinRanges(draw!)).toBe(true);
    expect(draw!.some((item) => item.id === "maternal-plain" || item.id === "peds-plain" || item.id === "yacht-1")).toBe(
      false
    );
    const promotion = draw!.filter((item) => examClientNeedsCategory(item) === "health-promotion");
    expect(promotion.length).toBeGreaterThan(0);
    expect(promotion.every((item) => item.subjectId === "health-promotion")).toBe(true);
  });

  it("leaves an unclassifiable pool out of the quota math", () => {
    const pool = Array.from({ length: 20 }, (_, index) =>
      row(`plain-${index}`, "yacht-racing", { subjectId: undefined, topicCategory: undefined })
    );
    expect(composeWithinClientNeeds({ preferred: pool, pool, limit: 20, seed: 1 })).toBeNull();
    const selected = finalizeAssembledSitting({ pool, limit: 20, fieldId: "nursing", seed: 1 });
    expect(selected.items).toHaveLength(20);
    expect(selected.items.every((item) => examClientNeedsCategory(item) == null)).toBe(true);
  });

  it("keeps a classified nursing sitting inside the ranges", () => {
    const pool = balancedPool(85);
    const selected = finalizeAssembledSitting({ pool, limit: 85, fieldId: "nursing", seed: 11 });
    expect(selected.items).toHaveLength(85);
    expect(clientNeedsWithinRanges(selected.items)).toBe(true);
  });

  it("keeps CAT and linear full exams inside the ranges", () => {
    for (const limit of [85, 150]) {
      const pool = balancedPool(limit);
      for (const nclexExamMode of [false, true]) {
        const selected = finalizeAssembledSitting({
          pool,
          limit,
          fieldId: "nursing",
          seed: limit,
          nclexExamMode,
        });
        expect(selected.items).toHaveLength(limit);
        expect(clientNeedsWithinRanges(selected.items)).toBe(true);
      }
    }
  });

  it("meets a minimum from the wider pool when the first window is short", () => {
    const limit = 150;
    const targets = clientNeedsTargets(limit)!;
    const hpmMin = targets.find((row) => row.id === "health-promotion")!.min;
    const preferred: BankItem[] = [];
    for (const target of targets) {
      const count = target.id === "health-promotion" ? 4 : target.count;
      for (let index = 0; index < count; index += 1) {
        preferred.push(row(`window-${target.id}-${index}`, target.id));
      }
    }
    const specialties = [
      ...Array.from({ length: 5 }, (_, index) => row(`peds-${index}`, "pediatrics-nursing")),
      ...Array.from({ length: 4 }, (_, index) => row(`maternal-${index}`, "maternal-child")),
      ...Array.from({ length: 2 }, (_, index) => row(`medsurg-${index}`, "med-surg")),
    ];
    expect(specialties.every((item) => examClientNeedsCategory(item) == null)).toBe(true);
    const window = [...preferred, ...specialties].slice(0, limit);
    expect(window.filter((item) => examClientNeedsCategory(item) === "health-promotion")).toHaveLength(4);
    expect(clientNeedsDeficits(window, limit).some((row) => row.id === "health-promotion")).toBe(true);

    const wider = [...window];
    for (const target of targets) {
      for (let index = 0; index < target.max; index += 1) {
        wider.push(row(`pool-${target.id}-${index}`, target.id));
      }
    }
    const draw = composeWithinClientNeeds({ preferred: window, pool: wider, limit, seed: 4 });
    expect(draw).not.toBeNull();
    expect(draw).toHaveLength(limit);
    expect(clientNeedsWithinRanges(draw!)).toBe(true);
    const promotion = draw!.filter((item) => examClientNeedsCategory(item) === "health-promotion");
    expect(promotion.length).toBeGreaterThanOrEqual(hpmMin);
    expect(draw!.some((item) => item.subjectId === "pediatrics-nursing" || item.subjectId === "maternal-child" || item.subjectId === "med-surg")).toBe(
      false
    );
  });

  it("keeps a category that is under its midpoint when the minimum is met", () => {
    const limit = 150;
    const targets = clientNeedsTargets(limit)!;
    const hpm = targets.find((row) => row.id === "health-promotion")!;
    const items: BankItem[] = [];
    for (const target of targets) {
      const count = target.id === "health-promotion" ? hpm.min : target.max;
      for (let index = 0; index < count; index += 1) {
        items.push(row(`${target.id}-${index}`, target.id));
      }
    }
    expect(clientNeedsDeficits(items, limit)).toEqual([]);
    const draw = composeWithinClientNeeds({ preferred: items.slice(0, 4), pool: items, limit, seed: 9 });
    expect(draw).not.toBeNull();
    expect(clientNeedsWithinRanges(draw!)).toBe(true);
    const promotion = draw!.filter((item) => examClientNeedsCategory(item) === "health-promotion").length;
    expect(promotion).toBeGreaterThanOrEqual(hpm.min);
    expect(promotion).toBeLessThan(hpm.count);
  });

  it("returns null until a short category is topped up, then meets the minimum", () => {
    const limit = 150;
    const targets = clientNeedsTargets(limit)!;
    const hpm = targets.find((row) => row.id === "health-promotion")!;
    const items: BankItem[] = [];
    for (const target of targets) {
      const count = target.id === "health-promotion" ? 4 : target.max;
      for (let index = 0; index < count; index += 1) {
        items.push(row(`${target.id}-${index}`, target.id));
      }
    }
    items.push(...Array.from({ length: 11 }, (_, index) => row(`plain-${index}`, "pediatrics-nursing")));
    const deficits = clientNeedsDeficits(items, limit);
    expect(deficits).toEqual([{ id: "health-promotion", have: 4, min: hpm.min }]);
    expect(composeWithinClientNeeds({ preferred: items.slice(0, limit), pool: items, limit, seed: 2 })).toBeNull();

    const topped = [
      ...items,
      ...Array.from({ length: hpm.min }, (_, index) => row(`hpm-top-${index}`, "health-promotion")),
    ];
    expect(clientNeedsDeficits(topped, limit).some((row) => row.id === "health-promotion")).toBe(false);
    const draw = composeWithinClientNeeds({ preferred: items.slice(0, limit), pool: topped, limit, seed: 2 });
    expect(draw).not.toBeNull();
    expect(clientNeedsWithinRanges(draw!)).toBe(true);
    expect(draw!.filter((item) => examClientNeedsCategory(item) === "health-promotion").length).toBeGreaterThanOrEqual(
      hpm.min
    );
  });

  it("fills leftover slots with uncategorised items and leaves them out of Health Promotion", () => {
    const limit = 150;
    const targets = clientNeedsTargets(limit)!;
    const items: BankItem[] = [];
    for (const target of targets) {
      for (let index = 0; index < target.min; index += 1) {
        items.push(row(`${target.id}-${index}`, target.id));
      }
    }
    const specialties = [
      ...Array.from({ length: 20 }, (_, index) => row(`peds-${index}`, "pediatrics-nursing", { subjectLabel: "Pediatric Nursing" } as Partial<BankItem>)),
      ...Array.from({ length: 16 }, (_, index) => row(`maternal-${index}`, "maternal-child", { subjectLabel: "Maternal & Child Health" } as Partial<BankItem>)),
      ...Array.from({ length: 8 }, (_, index) => row(`medsurg-${index}`, "med-surg")),
    ];
    const draw = composeWithinClientNeeds({
      preferred: [...items, ...specialties].slice(0, limit),
      pool: [...items, ...specialties],
      limit,
      seed: 6,
    });
    expect(draw).not.toBeNull();
    expect(draw).toHaveLength(limit);
    expect(clientNeedsWithinRanges(draw!)).toBe(true);
    const leftover = draw!.filter((item) => examClientNeedsCategory(item) == null);
    expect(leftover.length).toBeGreaterThan(0);
    expect(leftover.every((item) => item.subjectId === "pediatrics-nursing" || item.subjectId === "maternal-child" || item.subjectId === "med-surg")).toBe(
      true
    );
    expect(draw!.filter((item) => examClientNeedsCategory(item) === "health-promotion").every((item) => item.subjectId === "health-promotion")).toBe(
      true
    );
    const classified = limit - leftover.length;
    expect(classified).toBe(targets.reduce((total, row) => total + row.min, 0));
  });

  it("keeps an uncategorised case block and still meets every minimum", () => {
    const limit = 85;
    const caseItems = Array.from({ length: 6 }, (_, index) =>
      row(`case-s${index + 1}`, "pediatrics-nursing", {
        ngnPayload: { setId: "case-plain", stepIndex: index + 1, kind: "sequential" },
      })
    );
    expect(caseItems.every((item) => examClientNeedsCategory(item) == null)).toBe(true);
    const pool = [...caseItems, ...balancedPool(limit)];
    const draw = composeWithinClientNeeds({ preferred: pool, pool, limit, seed: 12 });
    expect(draw).not.toBeNull();
    expect(draw!.slice(0, 6).map((item) => item.id)).toEqual(caseItems.map((item) => item.id));
    expect(clientNeedsWithinRanges(draw!)).toBe(true);
  });

  it("does not pad leftover slots with a step from another case", () => {
    const limit = 150;
    const targets = clientNeedsTargets(limit)!;
    const items: BankItem[] = [];
    for (const target of targets) {
      for (let index = 0; index < target.min; index += 1) {
        items.push(row(`${target.id}-pad-${index}`, target.id));
      }
    }
    const orphan = row("orphan-step", "pediatrics-nursing", {
      ngnPayload: { setId: "other-case", stepIndex: 4, kind: "highlight" },
    });
    const specialties = Array.from({ length: 80 }, (_, index) => row(`peds-pad-${index}`, "pediatrics-nursing"));
    const draw = composeWithinClientNeeds({
      preferred: [orphan, ...items, ...specialties].slice(0, limit),
      pool: [orphan, ...items, ...specialties],
      limit,
      seed: 4,
    });
    expect(draw).not.toBeNull();
    expect(draw!.some((item) => item.id === "orphan-step")).toBe(false);
  });

  it("stores category labels without specialty subject ids", () => {
    const values = clientNeedsStoredValues("health-promotion");
    expect(values).toContain("health-promotion");
    expect(values).toContain("Health Promotion");
    expect(values).toContain("Health Promotion and Maintenance");
    expect(values.some((value) => /maternal|pediatric|med-surg/i.test(value))).toBe(false);
    expect(clientNeedsStoredValues("pharmacology-nursing")).toContain("Pharmacological Therapies");
    expect(clientNeedsStoredValues("basic-care-comfort")).toEqual(
      expect.arrayContaining(["Basic Care & Comfort", "Basic Care and Comfort"])
    );
    expect(clientNeedsStoredValues("safety-infection")).toContain("Safety & Infection Control");
  });

  it("normalizes bank display strings and keeps parent categories untagged", () => {
    expect(examClientNeedsCategory(row("pharm", "med-surg", { clientNeedsCategory: "Pharmacological Therapies" }))).toBe(
      "pharmacology-nursing"
    );
    expect(examClientNeedsCategory(row("basic-amp", "med-surg", { clientNeedsCategory: "Basic Care & Comfort" }))).toBe(
      "basic-care-comfort"
    );
    expect(examClientNeedsCategory(row("basic-and", "med-surg", { clientNeedsCategory: "Basic Care and Comfort" }))).toBe(
      "basic-care-comfort"
    );
    expect(examClientNeedsCategory(row("safe", "med-surg", { clientNeedsCategory: "Safety & Infection Control" }))).toBe(
      "safety-infection"
    );
    expect(examClientNeedsCategory(row("hpm", "med-surg", { clientNeedsCategory: "Health Promotion" }))).toBe(
      "health-promotion"
    );
    expect(
      examClientNeedsCategory(row("parent-phys", "med-surg", { clientNeedsCategory: "Physiological Integrity" }))
    ).toBeNull();
    expect(
      examClientNeedsCategory(
        row("parent-safe", "maternal-child", { clientNeedsCategory: "Safe and Effective Care Environment" })
      )
    ).toBeNull();
  });

  it("uses an NGN subcategory and a blank bank subject slug", () => {
    const ngn = row("ngn-pharm", "med-surg", {
      clientNeedsCategory: "Physiological Integrity",
      topicCategory: "Physiological Integrity",
      ngnPayload: {
        setId: "case-pharm",
        stepIndex: 2,
        clinicalItemType: "case_item",
        clientNeeds: {
          category: "Physiological Integrity",
          subcategory: "Pharmacological and Parenteral Therapies",
        },
      },
    });
    expect(examClientNeedsCategory(ngn)).toBe("pharmacology-nursing");

    const safety = row("ngn-safe", "med-surg", {
      clientNeedsCategory: "Safe and Effective Care Environment",
      ngnPayload: {
        setId: "case-safe",
        stepIndex: 1,
        clinicalItemType: "case_item",
        clientNeeds: {
          category: "Safe and Effective Care Environment",
          subcategory: "Safety and Infection Prevention and Control",
        },
      },
    });
    expect(examClientNeedsCategory(safety)).toBe("safety-infection");

    expect(examClientNeedsCategory(row("blank-hpm", "health-promotion"))).toBe("health-promotion");
    expect(examClientNeedsCategory(row("blank-safe", "safety-infection"))).toBe("safety-infection");
    expect(examClientNeedsCategory(row("blank-pharm", "pharmacology-nursing"))).toBe("pharmacology-nursing");
    expect(examClientNeedsCategory(row("blank-maternal", "maternal-child", { subjectLabel: "Maternal & Child Health" } as Partial<BankItem>))).toBeNull();
    expect(examClientNeedsCategory(row("blank-peds", "pediatrics-nursing"))).toBeNull();
    expect(examClientNeedsCategory(row("blank-medsurg", "med-surg"))).toBeNull();
  });

  it("searches the bank display strings when topping up a short category", () => {
    const promotion = JSON.stringify(nursingClientNeedsWhere("health-promotion", []));
    expect(promotion).toContain("Health Promotion");
    expect(promotion).not.toMatch(/maternal|pediatric|med-surg/i);
    const safety = JSON.stringify(nursingClientNeedsWhere("safety-infection", []));
    expect(safety).toContain("Safety & Infection Control");
    const pharm = JSON.stringify(nursingClientNeedsWhere("pharmacology-nursing", []));
    expect(pharm).toContain("Pharmacological Therapies");
    const basic = JSON.stringify(nursingClientNeedsWhere("basic-care-comfort", []));
    expect(basic).toContain("Basic Care & Comfort");
    expect(basic).toContain("Basic Care and Comfort");
  });

  it("replays the two short sittings and meets every area from the category pool", () => {
    const stored = JSON.parse(
      readFileSync(resolve(process.cwd(), "src/lib/exam-prep/nclex-client-needs-sessions.fixture.json"), "utf8")
    ) as StoredSittingRow[];
    for (const session of ["cat", "linear"] as const) {
      const limit = session === "cat" ? 150 : 85;
      const preferred = stored
        .filter((entry) => entry.session === session)
        .sort((a, b) => a.position - b.position)
        .map(storedSittingItem);
      expect(preferred).toHaveLength(limit);
      const pool = [...preferred, ...displayPool(limit), ...untaggedLeftovers()];
      const draw = composeWithinClientNeeds({ preferred, pool, limit, seed: limit });
      expect(draw).not.toBeNull();
      expect(draw).toHaveLength(limit);
      expect(clientNeedsWithinRanges(draw!)).toBe(true);
      const counts = clientNeedsCounts(draw!);
      for (const category of NCLEX_2026_CLIENT_NEEDS) {
        const count = counts?.[category.id] ?? 0;
        const min = Math.ceil((category.weightPct.min * limit) / 100);
        const max = Math.floor((category.weightPct.max * limit) / 100);
        expect(count).toBeGreaterThanOrEqual(min);
        expect(count).toBeLessThanOrEqual(max);
      }
      expect(draw!.some((item) => item.id?.startsWith("replay-"))).toBe(false);
      expect(draw!.every((item) => examClientNeedsCategory(item) != null)).toBe(true);
    }
  });
});

type StoredSittingRow = {
  session: "cat" | "linear";
  position: number;
  source: "bank" | "ngn";
  optionsCategory: string;
  subject: string;
  ngnCategory: string;
  ngnSubcategory: string;
  caseKey: string;
  caseStep: number | null;
};

function storedSittingItem(entry: StoredSittingRow): BankItem {
  const item = row(`${entry.session}-${entry.position}`, entry.subject || "untagged");
  if (entry.source === "ngn") {
    return {
      ...item,
      subjectId: undefined,
      clientNeedsCategory: entry.ngnCategory || undefined,
      topicCategory: entry.ngnSubcategory || entry.ngnCategory || undefined,
      ngnPayload: {
        setId: entry.caseKey,
        stepIndex: entry.caseStep ?? undefined,
        clinicalItemType: "case_item",
        clientNeeds: {
          category: entry.ngnCategory,
          subcategory: entry.ngnSubcategory,
        },
      },
    };
  }
  return {
    ...item,
    subjectId: entry.subject || undefined,
    topicCategory: undefined,
    clientNeedsCategory: entry.optionsCategory || undefined,
  };
}

const DISPLAY_BY_AREA: Record<NclexClientNeedsId, string> = {
  "management-of-care": "Management of Care",
  "safety-infection": "Safety & Infection Control",
  "health-promotion": "Health Promotion",
  psychosocial: "Psychosocial Integrity",
  "basic-care-comfort": "Basic Care & Comfort",
  "pharmacology-nursing": "Pharmacological Therapies",
  "reduction-risk": "Reduction of Risk Potential",
  "physiological-adaptation": "Physiological Adaptation",
};

function displayPool(limit: number): BankItem[] {
  const targets = clientNeedsTargets(limit);
  if (!targets) return [];
  const items: BankItem[] = [];
  for (const target of targets) {
    for (let index = 0; index < target.max; index += 1) {
      items.push(
        row(`pool-${limit}-${target.id}-${index}`, target.id, {
          clientNeedsCategory: DISPLAY_BY_AREA[target.id],
        })
      );
    }
  }
  return items;
}

function untaggedLeftovers(): BankItem[] {
  return [
    ...Array.from({ length: 12 }, (_, index) => row(`replay-maternal-${index}`, "maternal-child")),
    ...Array.from({ length: 8 }, (_, index) => row(`replay-peds-${index}`, "pediatrics-nursing")),
    ...Array.from({ length: 6 }, (_, index) => row(`replay-medsurg-${index}`, "med-surg")),
  ];
}
