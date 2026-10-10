import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import { finalizeAssembledSitting } from "@/lib/exam-prep/sitting-selection";
import { enrichBankItemFromRow } from "@/lib/mpje/parse-bank-options";
import { NCLEX_2026_CLIENT_NEEDS } from "@/lib/exam-prep/nclex/blueprint-topics-2026";
import {
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
});
