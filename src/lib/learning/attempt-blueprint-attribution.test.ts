import { describe, expect, it, vi } from "vitest";
import { prisma } from "@/lib/prisma";
import {
  aggregateAttemptsByBlueprintCategory,
  hydrateAttemptAreaFromBank,
  resolveBlueprintCategoryIdForAttempt,
} from "./attempt-blueprint-attribution";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    questionBankItem: {
      findMany: vi.fn(),
    },
  },
}));

describe("attempt blueprint attribution", () => {
  it("maps pharmacology-nursing attempts to the pharmacology category", () => {
    expect(
      resolveBlueprintCategoryIdForAttempt("nursing", { subjectId: "pharmacology-nursing" })
    ).toBe("pharmacology");
  });

  it("maps legacy med-surg to physiological adaptation", () => {
    expect(resolveBlueprintCategoryIdForAttempt("nursing", { subjectId: "med-surg" })).toBe(
      "physiological-adaptation"
    );
  });

  it("does not map placeholder session subjects", () => {
    expect(
      resolveBlueprintCategoryIdForAttempt("nursing", { subjectId: "__mixed__" })
    ).toBeNull();
    expect(resolveBlueprintCategoryIdForAttempt("nursing", { subjectId: "mixed" })).toBeNull();
  });

  it("hydrates mixed-topic attempts from the bank so coverage can attribute", async () => {
    vi.mocked(prisma.questionBankItem.findMany).mockResolvedValue([
      {
        id: "bank-pharm",
        subjectId: "pharmacology-nursing",
        clientNeeds: null,
        topicCategory: null,
        blueprintDomain: null,
      },
    ] as never);

    const hydrated = await hydrateAttemptAreaFromBank([
      {
        subjectId: "__mixed__",
        correct: true,
        bankItemId: "bank-pharm",
        questionKey: "bank-pharm",
      },
    ]);

    expect(hydrated[0]?.subjectId).toBe("pharmacology-nursing");
    const { statsByCategory } = aggregateAttemptsByBlueprintCategory("nursing", hydrated);
    expect(statsByCategory.get("pharmacology")?.attempts).toBe(1);
  });

  it("counts distinct items per blueprint category", () => {
    const { statsByCategory, seenByCategory } = aggregateAttemptsByBlueprintCategory("npte-pt", [
      { subjectId: "musculoskeletal", correct: true, bankItemId: "a" },
      { subjectId: "musculoskeletal", correct: false, bankItemId: "a" },
      { subjectId: "musculoskeletal", correct: true, bankItemId: "b" },
    ]);
    expect(statsByCategory.get("musculoskeletal")).toEqual({ attempts: 3, correct: 2 });
    expect(seenByCategory.get("musculoskeletal")).toBe(2);
  });
});
