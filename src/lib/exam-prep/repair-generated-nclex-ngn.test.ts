import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import { nclexNgnCorrectAnswerValid } from "./nclex-ngn-audit";
import { repairGeneratedNclexNgnItem } from "./repair-generated-nclex-ngn";

function base(partial: Partial<BankItem>): BankItem {
  return {
    question: "Which nursing action is the priority?",
    options: ["A", "B", "C", "D"],
    correctAnswer: "A",
    explanation: "x".repeat(100),
    ...partial,
  };
}

describe("repairGeneratedNclexNgnItem", () => {
  it("repairs bow-tie actions/monitors from options + composite answer", () => {
    const repaired = repairGeneratedNclexNgnItem(
      base({
        itemType: "ngn_bowtie",
        options: [
          "Hold warfarin and notify provider",
          "Give next warfarin dose",
          "Signs of bleeding",
          "INR recheck",
          "Weekly weights only",
          "Vision changes only",
        ],
        correctAnswer: "Hold warfarin and notify provider,Signs of bleeding,INR recheck",
        ngnPayload: { kind: "bow_tie" },
      })
    );

    expect(repaired.ngnPayload?.actions?.length).toBeGreaterThanOrEqual(1);
    expect(repaired.ngnPayload?.monitors?.length).toBeGreaterThanOrEqual(2);
    expect(nclexNgnCorrectAnswerValid(repaired)).toBe(true);
  });

  it("treats case_study steps as MCQ answers", () => {
    const repaired = repairGeneratedNclexNgnItem(
      base({
        itemType: "case_study",
        options: [
          "Apply oxygen and notify the provider",
          "Encourage ambulation now",
          "Defer vitals until morning",
          "Document only",
        ],
        correctAnswer: "Apply oxygen and notify the provider",
        ngnPayload: { kind: "mcq", caseGroupId: "case-1", caseStep: 2 },
      })
    );

    expect(repaired.ngnPayload?.kind).toBe("mcq");
    expect(nclexNgnCorrectAnswerValid(repaired)).toBe(true);
  });

  it("attaches selectable options for select_all payloads", () => {
    const repaired = repairGeneratedNclexNgnItem(
      base({
        itemType: "select_all",
        options: [
          "Wash hands",
          "Don gown",
          "Skip PPE",
          "Discard in regular trash",
          "Use alcohol gel after glove removal",
        ],
        correctAnswer: "Wash hands,Don gown,Use alcohol gel after glove removal",
        ngnPayload: { kind: "select_all" },
      })
    );

    expect(Array.isArray(repaired.ngnPayload?.options)).toBe(true);
    expect(nclexNgnCorrectAnswerValid(repaired)).toBe(true);
  });

  it("synthesizes bow-tie structure from a single correct option", () => {
    const repaired = repairGeneratedNclexNgnItem(
      base({
        itemType: "ngn_bowtie",
        options: [
          "Hold warfarin and notify provider",
          "Give next warfarin dose",
          "Discharge home",
          "Signs of bleeding",
          "INR recheck",
          "Weekly weights only",
        ],
        correctAnswer: "Hold warfarin and notify provider",
        ngnPayload: { kind: "bow_tie" },
      })
    );

    expect(nclexNgnCorrectAnswerValid(repaired)).toBe(true);
  });

  it("synthesizes bow-tie from only four MCQ options", () => {
    const repaired = repairGeneratedNclexNgnItem(
      base({
        itemType: "ngn_bowtie",
        options: [
          "Hold warfarin and notify provider",
          "Give next warfarin dose",
          "Signs of bleeding",
          "INR recheck",
        ],
        correctAnswer: "Hold warfarin and notify provider",
        ngnPayload: { kind: "bow_tie" },
      })
    );

    expect(nclexNgnCorrectAnswerValid(repaired)).toBe(true);
  });

  it("builds indicated/not-indicated matrix from flat options", () => {
    const repaired = repairGeneratedNclexNgnItem(
      base({
        itemType: "ngn_matrix",
        options: [
          "Start IV fluid bolus",
          "Hold next diuretic dose",
          "Encourage high sodium diet",
          "Document only and reassess tomorrow",
        ],
        correctAnswer: "Start IV fluid bolus,Hold next diuretic dose",
        ngnPayload: { kind: "matrix" },
      })
    );

    expect(repaired.ngnPayload?.columns).toEqual(["Indicated", "Not indicated"]);
    expect(nclexNgnCorrectAnswerValid(repaired)).toBe(true);
  });

  it("pads single custom-column matrix answers to two pairs", () => {
    const repaired = repairGeneratedNclexNgnItem(
      base({
        itemType: "ngn_matrix",
        options: [
          "Administer aspirin|||Priority Intervention",
          "Administer aspirin|||Delayed",
          "Encourage ambulation|||Priority Intervention",
          "Encourage ambulation|||Delayed",
        ],
        correctAnswer: "Administer aspirin|||Priority Intervention",
        ngnPayload: {
          kind: "matrix",
          rows: ["Administer aspirin", "Encourage ambulation"],
          columns: ["Priority Intervention", "Delayed"],
        },
      })
    );

    expect(repaired.correctAnswer.split(/,(?=[^,]+\|\|\|)/).length).toBeGreaterThanOrEqual(2);
    expect(nclexNgnCorrectAnswerValid(repaired)).toBe(true);
  });
});
