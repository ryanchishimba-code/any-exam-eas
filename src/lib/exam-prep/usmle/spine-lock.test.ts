import { describe, expect, it } from "vitest";
import {
  lockGenerationSlotToSpine,
  bankItemHasValidSpineTags,
  isValidUsmlePhysicianTaskId,
} from "./spine-lock";
import { planUsmleFullExamSlots } from "./blueprint-quota";
import { buildUsmleSkillCells } from "@/lib/engine/mastery/cells";
import { USMLE_ORGAN_SYSTEMS, organSystemWeightsForStep } from "./official-content-model";
import { selectUsmleSessionBankItems } from "./session-selection";
import type { BankItem } from "@/lib/question-bank";
import type { UsmleGenerationSlot } from "./types";

function stubSlot(overrides: Partial<UsmleGenerationSlot> = {}): UsmleGenerationSlot {
  return {
    categoryId: "cardiovascular",
    categoryLabel: "Cardiovascular",
    subjectIds: ["cardiology"],
    highYieldTopics: [],
    slotIndex: 0,
    stepLevel: "step2",
    subjectId: "cardiology",
    blueprintSystem: "cardiovascular",
    blueprintTopic: "acs-management",
    physicianTask: "diagnosis",
    difficulty: 3,
    stemFormat: "Which of the following is the most likely diagnosis?",
    questionFormat: "vignette",
    ...overrides,
  };
}

describe("spine-lock", () => {
  it("coerces legacy domains onto organ-system spine", () => {
    const locked = lockGenerationSlotToSpine(
      stubSlot({
        blueprintSystem: "hematology-immunology",
        categoryId: "hematology-immunology",
        blueprintTopic: "unknown-heme-topic",
      })
    );
    expect(locked.blueprintSystem).toBe("blood-lymph-immune");
    expect(locked.categoryId).toBe("blood-lymph-immune");
  });

  it("accepts official and legacy physician tasks", () => {
    expect(isValidUsmlePhysicianTaskId("diagnosis")).toBe(true);
    expect(isValidUsmlePhysicianTaskId("foundational-science")).toBe(true);
    expect(isValidUsmlePhysicianTaskId("not-a-task")).toBe(false);
  });

  it("validates bank spine tags", () => {
    expect(
      bankItemHasValidSpineTags({
        blueprintDomain: "cardiovascular",
        blueprintTopic: "acs-management",
        physicianTask: "diagnosis",
      })
    ).toBe(true);
    expect(
      bankItemHasValidSpineTags({
        blueprintDomain: "not-a-real-system",
        blueprintTopic: null,
      })
    ).toBe(false);
  });
});

describe("planUsmleFullExamSlots spine emit", () => {
  it("emits only organ-system blueprintSystem ids", () => {
    const slots = planUsmleFullExamSlots({ examNumber: 1, questionCount: 22, stepLevel: "step1" });
    const allowed = new Set(USMLE_ORGAN_SYSTEMS.map((s) => s.id));
    for (const slot of slots) {
      expect(allowed.has(slot.blueprintSystem as (typeof USMLE_ORGAN_SYSTEMS)[number]["id"])).toBe(
        true
      );
    }
  });
});

describe("buildUsmleSkillCells", () => {
  it("covers all organ systems for each Step", () => {
    for (const step of ["step1", "step2", "step3"] as const) {
      const cells = buildUsmleSkillCells(step);
      const systems = new Set(cells.map((c) => c.systemKey));
      for (const sys of USMLE_ORGAN_SYSTEMS) {
        expect(systems.has(sys.id)).toBe(true);
      }
      const weights = organSystemWeightsForStep(step);
      expect(Object.values(weights).reduce((a, b) => a + b, 0)).toBeCloseTo(1, 5);
    }
  });
});

describe("selectUsmleSessionBankItems", () => {
  it("soft-caps a single organ system", () => {
    const pool: BankItem[] = Array.from({ length: 40 }, (_, i) => ({
      id: `item-${i}`,
      question: `Q${i}?`,
      options: ["A", "B", "C", "D"],
      correctAnswer: "A",
      explanation: "x".repeat(80),
      subjectId: "cardiology",
      blueprintDomain: i < 30 ? "cardiovascular" : "gastrointestinal",
      blueprintTopic: i < 30 ? "acs-management" : "gi-bleed-management",
      tags: [],
    }));
    const selected = selectUsmleSessionBankItems(pool, 20, {
      seed: 7,
      stepLevel: "step2",
    });
    expect(selected.length).toBeLessThanOrEqual(20);
    const cardio = selected.filter((r) => r.blueprintDomain === "cardiovascular").length;
    expect(cardio).toBeLessThan(20);
  });
});
