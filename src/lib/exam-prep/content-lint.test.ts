import { describe, expect, it } from "vitest";
import {
  contentLintRowsToCsv,
  exhibitTextFromBankItem,
  lintContentItems,
  type ContentLintItem,
} from "@/lib/exam-prep/content-lint";

function item(partial: Partial<ContentLintItem> & Pick<ContentLintItem, "id" | "question">): ContentLintItem {
  return {
    options: ["Hold the dose", "Continue therapy", "Call the prescriber", "Document only"],
    correctAnswer: "Hold the dose",
    explanation: "The keyed action matches the current guideline.",
    ...partial,
  };
}

describe("lintContentItems", () => {
  it("flags merged stems, round-to fragments, and spaced decimals", () => {
    const rows = lintContentItems([
      item({
        id: "merged",
        question: "The client is receiving warfarin therapy Which action should the nurse take first?",
      }),
      item({
        id: "round",
        question: "Calculate the infusion rate in mL/hr. (Round to",
      }),
      item({
        id: "space",
        question: "The order is digoxin 0. 125 mg daily. Which assessment is the priority?",
      }),
      item({
        id: "clean",
        question: "Which action should the nurse take first for a client with chest pain?",
      }),
    ]);
    const codes = rows.map((row) => `${row.id}:${row.code}`);
    expect(codes).toContain("merged:merged_stem");
    expect(codes).toContain("round:round_to_fragment");
    expect(codes).toContain("space:odd_number_spacing");
    expect(codes.some((code) => code.startsWith("clean:"))).toBe(false);
  });

  it("flags stray unit tags and a calculation stem with advice options", () => {
    const rows = lintContentItems([
      item({
        id: "unit",
        question: "The nurse reviews the order. (Unit 19).",
      }),
      item({
        id: "alligation",
        question: "Alligation | Prepare 120 mL of 15% dextrose. How many mL of 50% dextrose are required?",
        options: ["Counsel the patient", "Call the prescriber", "Document the interaction", "Refuse the order"],
        correctAnswer: "",
      }),
      item({
        id: "dpi",
        question: "Which teaching point applies when this patient uses a dry-powder inhaler (DPI)?",
        exhibitText: "Metered-dose inhaler with a spacer",
      }),
    ]);
    const codes = rows.map((row) => `${row.id}:${row.code}`);
    expect(codes).toContain("unit:stray_fragment");
    expect(codes).toContain("alligation:calc_option_mismatch");
    expect(codes).toContain("dpi:exhibit_mismatch");
  });

  it("flags an exhibit about a different drug", () => {
    const rows = lintContentItems([
      item({
        id: "gent",
        question: "A gentamicin peak is due. Which level should the pharmacist report?",
        exhibitText: "Vancomycin dosing nomogram",
      }),
    ]);
    expect(rows.some((row) => row.code === "exhibit_mismatch")).toBe(true);
  });

  it("reads an insulin-chart exhibit and flags a dabigatran stem", () => {
    const exhibitText = exhibitTextFromBankItem({
      id: "dabi",
      question: "A patient starts dabigatran. Which counseling point applies?",
      options: ["Take with food", "Store in the original bottle", "Crush the capsule", "Skip a dose"],
      correctAnswer: "Store in the original bottle",
      explanation: "Keep dabigatran in the original container.",
      ngnPayload: {
        media: [{ kind: "insulin_chart", alt: "High-alert insulin label", caption: "Insulin" }],
      },
    });
    const rows = lintContentItems([
      item({
        id: "dabi",
        question: "A patient starts dabigatran. Which counseling point applies?",
        exhibitText,
      }),
    ]);
    expect(exhibitText?.toLowerCase()).toContain("insulin");
    expect(rows.some((row) => row.id === "dabi" && row.code === "exhibit_mismatch")).toBe(true);
  });

  it("flags calculation keys that disagree with the rationale or a recomputed dose", () => {
    const rows = lintContentItems([
      item({
        id: "calc",
        question: "The patient weighs 80 kg. The order is 2 mg/kg. Calculate the dose in mg.",
        correctAnswer: "100",
        explanation: "80 kg times 2 mg/kg equals 160 mg.",
        itemType: "constructed_response",
        options: [],
      }),
    ]);
    expect(rows.some((row) => row.code === "calc_key_mismatch")).toBe(true);
  });

  it("flags near-duplicate clusters whose keys disagree", () => {
    const stem =
      "A patient taking lamotrigine starts an oral contraceptive. Which counseling point is most appropriate?";
    const rows = lintContentItems([
      item({
        id: "k1",
        question: stem,
        correctAnswer: "Use backup contraception",
        options: ["Use backup contraception", "Stop lamotrigine", "Double the dose", "No interaction"],
      }),
      item({
        id: "k2",
        question:
          "A 28-year-old patient taking lamotrigine starts an oral contraceptive. Which counseling point is most appropriate?",
        correctAnswer: "Stop lamotrigine",
        options: ["Use backup contraception", "Stop lamotrigine", "Double the dose", "No interaction"],
      }),
    ]);
    expect(rows.some((row) => row.code === "conflicting_cluster_key")).toBe(true);
  });

  it("flags withdrawn ranitidine in the stem or options", () => {
    const rows = lintContentItems([
      item({
        id: "rant",
        question: "Which histamine blocker is preferred for this ulcer?",
        options: ["Ranitidine", "Famotidine", "Omeprazole", "Sucralfate"],
      }),
    ]);
    expect(rows.some((row) => row.code === "withdrawn_drug" && row.detail.includes("ranitidine"))).toBe(
      true
    );
  });

  it("writes a csv report", () => {
    const csv = contentLintRowsToCsv(
      lintContentItems([
        item({ id: "rant", question: "Start ranitidine tonight.", options: ["Yes", "No", "Hold", "Call"] }),
      ])
    );
    expect(csv.split("\n")[0]).toBe("id,code,severity,detail,excerpt");
    expect(csv).toContain("withdrawn_drug");
  });
});
