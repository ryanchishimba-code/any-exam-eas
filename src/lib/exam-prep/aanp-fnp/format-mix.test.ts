import { describe, expect, it } from "vitest";
import {
  formatInstructionsForAanp,
  planAanpFnpGenerationSlots,
  questionFormatForIndex,
} from "./blueprint-quota";
import { normalizeAanpFnpSpecialFormats } from "./generation-pipeline";
import type { BankItem } from "@/lib/question-bank";
import type { AanpFnpGenerationSlot } from "./types";

describe("AANP FNP format mix", () => {
  it("assigns ~12% select_all via stable index mix", () => {
    const formats = Array.from({ length: 100 }, (_, i) => questionFormatForIndex(i));
    const sata = formats.filter((f) => f === "select_all").length;
    expect(sata).toBeGreaterThanOrEqual(10);
    expect(sata).toBeLessThanOrEqual(15);
  });

  it("plans slots with questionFormat set", () => {
    const slots = planAanpFnpGenerationSlots({
      count: 16,
      domainDeficits: { assess: 100, diagnose: 100, plan: 100, evaluate: 100 },
    });
    expect(slots.every((s) => s.questionFormat === "mcq" || s.questionFormat === "select_all")).toBe(
      true
    );
    expect(slots.some((s) => s.questionFormat === "select_all")).toBe(true);
  });

  it("documents select_all format instructions", () => {
    expect(formatInstructionsForAanp("select_all")).toMatch(/select all/i);
    expect(formatInstructionsForAanp("mcq")).toMatch(/4 unique/i);
  });
});

describe("normalizeAanpFnpSpecialFormats", () => {
  const slot: AanpFnpGenerationSlot = {
    blueprintDomain: "plan",
    clinicalSystem: "cardiovascular",
    patientAgeGroup: "middle-adult",
    blueprintTopic: "hypertension-jnc-acc",
    difficulty: 3,
    questionFormat: "select_all",
  };

  it("joins multi-correct answers with |||", () => {
    const item = {
      subjectId: "cardiovascular",
      question: "Select all that apply. Which counseling points are appropriate?",
      options: ["A", "B", "C", "D", "E"],
      correctAnswer: "A, C, E",
      explanation: "x",
      distractorRationale: { B: "wrong", D: "wrong" },
      itemType: "select_all",
    } as BankItem;

    const next = normalizeAanpFnpSpecialFormats(item, slot);
    expect(next.correctAnswer).toBe("A|||C|||E");
    expect(next.itemType).toBe("select_all");
  });
});
