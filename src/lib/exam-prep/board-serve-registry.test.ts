import { describe, expect, it } from "vitest";
import {
  BOARD_FIELD_IDS,
  bankItemIsBoardBestQuality,
  bankItemIsBoardServeReady,
  isBoardFieldId,
  resolveBoardFieldArg,
} from "./board-serve-registry";
import type { BankItem } from "@/lib/question-bank";

function mcq(overrides: Partial<BankItem> = {}): BankItem {
  return {
    id: "test-1",
    subjectId: "med-surg",
    question: "A nurse is caring for a client with acute heart failure. Which action is the priority?",
    vignette:
      "A 68-year-old client presents with dyspnea, crackles, and SpO2 88% on room air. BP 168/94, HR 112.",
    options: [
      "Administer furosemide IV",
      "Place the client in high Fowler's position",
      "Obtain a chest x-ray",
      "Start continuous pulse oximetry",
    ],
    correctAnswer: "Place the client in high Fowler's position",
    explanation:
      "High Fowler's position reduces preload and improves ventilation in acute pulmonary edema. ABCs and positioning precede diagnostics when the client is hypoxic.",
    itemType: "mcq",
    source: "seed",
    ...overrides,
  };
}

describe("board-serve-registry", () => {
  it("lists all board field ids", () => {
    expect(BOARD_FIELD_IDS).toContain("nursing");
    expect(BOARD_FIELD_IDS).toContain("pharmacy");
    expect(BOARD_FIELD_IDS).toContain("pance");
    expect(BOARD_FIELD_IDS).toContain("aanp-fnp");
    expect(BOARD_FIELD_IDS).toContain("npte-pt");
    expect(BOARD_FIELD_IDS).toContain("usmle-step-1");
  });

  it("resolves field aliases", () => {
    expect(resolveBoardFieldArg("nclex")).toEqual(["nursing"]);
    expect(resolveBoardFieldArg("naplex")).toEqual(["pharmacy"]);
    expect(resolveBoardFieldArg("usmle")).toEqual([
      "usmle-step-1",
      "usmle-step-2",
      "usmle-step-3",
    ]);
    expect(resolveBoardFieldArg("all").length).toBe(BOARD_FIELD_IDS.length);
  });

  it("rejects unknown fields", () => {
    expect(() => resolveBoardFieldArg("dentistry")).toThrow(/Unknown board field/);
  });

  it("identifies board fields", () => {
    expect(isBoardFieldId("nursing")).toBe(true);
    expect(isBoardFieldId("dentistry")).toBe(false);
  });

  it("blocks items missing answers at serve gate", () => {
    const broken = mcq({ correctAnswer: "" });
    expect(bankItemIsBoardServeReady("nursing", broken)).toBe(false);
    expect(bankItemIsBoardBestQuality("nursing", broken)).toBe(false);
  });
});
