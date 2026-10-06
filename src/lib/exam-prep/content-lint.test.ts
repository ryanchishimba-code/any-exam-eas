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

  it("reads image alt text and does not treat a shared lead-in as one cluster", () => {
    const caption = exhibitTextFromBankItem({
      question: "Which adjustment is required?",
      options: ["Hold the dose", "Continue", "Call", "Document"],
      correctAnswer: "Hold the dose",
      explanation: "Because",
      ngnPayload: {
        media: [{ alt: "Insulin vial label", caption: "U-100 insulin chart" }],
      },
    });
    expect(caption).toContain("Insulin");

    const rows = lintContentItems([
      item({
        id: "media",
        question: "Which inhaler technique is correct?",
        scenario: "The patient uses a dry-powder inhaler.",
        exhibitText: caption,
        options: ["Shake the MDI", "Exhale fully", "Rinse the mouth", "Use a spacer"],
      }),
      item({
        id: "hf",
        fieldId: "nursing",
        question: "What is the next best step?",
        scenario: "Heart failure with edema after the first dose of lisinopril.",
        options: ["Stop lisinopril", "Give fluids", "Discharge", "Start heparin"],
        correctAnswer: "Stop lisinopril",
      }),
      item({
        id: "acs",
        fieldId: "nursing",
        question: "What is the next best step?",
        scenario: "Crushing chest pain with ST elevation in two leads.",
        options: ["Activate the cath lab", "Give acetaminophen", "Discharge", "Order a sleep study"],
        correctAnswer: "Activate the cath lab",
      }),
      item({
        id: "pharm-same-stem",
        fieldId: "pharmacy",
        question: "What is the next best step?",
        scenario: "Heart failure with edema after the first dose of lisinopril.",
        options: ["Stop lisinopril", "Give fluids", "Discharge", "Start heparin"],
        correctAnswer: "Give fluids",
      }),
    ]);
    expect(rows.some((row) => row.id === "media" && row.code === "exhibit_mismatch")).toBe(true);
    expect(rows.some((row) => row.code === "conflicting_cluster_key")).toBe(false);
  });

  it("compares a calculation key with the final stated answer", () => {
    const rows = lintContentItems([
      item({
        id: "steps",
        question: "The patient weighs 80 kg. The order is 2 mg/kg. Calculate the dose in mg.",
        correctAnswer: "160",
        explanation: "First, 2 mg times 1 kg equals 2. Then 80 kg times 2 mg/kg equals 160 mg. The correct answer is 160.",
        itemType: "constructed_response",
        options: [],
      }),
    ]);
    expect(rows.some((row) => row.id === "steps" && row.code === "calc_key_mismatch")).toBe(false);
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
