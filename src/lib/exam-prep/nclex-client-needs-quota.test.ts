import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import { finalizeAssembledSitting } from "@/lib/exam-prep/sitting-selection";
import { enrichBankItemFromRow } from "@/lib/mpje/parse-bank-options";
import { NCLEX_2026_CLIENT_NEEDS } from "@/lib/exam-prep/nclex/blueprint-topics-2026";
import {
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

  it("stores category labels without specialty subject ids", () => {
    const values = clientNeedsStoredValues("health-promotion");
    expect(values).toContain("health-promotion");
    expect(values).toContain("Health Promotion and Maintenance");
    expect(values.some((value) => /maternal|pediatric|med-surg/i.test(value))).toBe(false);
  });
});
