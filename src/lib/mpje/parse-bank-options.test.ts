import { describe, expect, it } from "vitest";
import { enrichBankItemFromRow } from "./parse-bank-options";

describe("case group id on bank rows", () => {
  it("keeps caseGroupId when the options envelope omits kind", () => {
    const item = enrichBankItemFromRow({
      id: "case-1",
      subjectId: "management-of-care",
      fieldId: "nursing",
      question: "What is the priority action?",
      options: JSON.stringify({
        caseGroupId: "group-42",
        caseStep: 3,
        options: ["A", "B", "C", "D"],
      }),
      correctAnswer: "A",
      explanation: "Airway first.",
      solutionSteps: null,
      tags: null,
      itemType: "case_study",
      active: true,
      qaPassed: true,
    });

    expect(item.ngnPayload?.caseGroupId).toBe("group-42");
    expect(item.options).toEqual(["A", "B", "C", "D"]);
  });

  it("turns object solution steps and tags into strings", () => {
    const item = enrichBankItemFromRow({
      id: "aanp-1",
      subjectId: "endocrine",
      fieldId: "aanp-fnp",
      question: "Which plan is next?",
      options: JSON.stringify(["Start", "Delay", "Skip", "Document"]),
      correctAnswer: "Start",
      explanation: "Because the plan matches the visit.",
      solutionSteps: JSON.stringify([{ text: "Confirm the plan." }, "Recheck the result."]),
      tags: JSON.stringify([{ label: "diabetes" }, "follow-up"]),
      itemType: "vignette",
      active: true,
      qaPassed: true,
    });

    expect(item.solutionSteps).toEqual(["Confirm the plan.", "Recheck the result."]);
    expect(item.tags).toEqual(["diabetes", "follow-up"]);
  });
});
