import { describe, expect, it } from "vitest";
import {
  assessStudentEligibility,
  buildCaseGroupFacts,
  completeCaseGroupKeys,
  type StudentEligibilityInput,
} from "./student-eligibility";
import { planPresetExamFill } from "./preset-exam-fill";

function row(partial: Partial<StudentEligibilityInput> & Pick<StudentEligibilityInput, "itemType">): StudentEligibilityInput {
  return {
    active: true,
    qaPassed: true,
    fieldId: "nursing",
    question: "Which action should the nurse take first?",
    correctAnswer: "Give the prescribed medication",
    explanation: "The prescribed medication treats the presenting problem.",
    options: ["Give the prescribed medication", "Discharge the client", "Withhold all care", "Document and leave"],
    ...partial,
  };
}

describe("student eligibility", () => {
  it("keeps a standard single-answer item", () => {
    expect(assessStudentEligibility(row({ itemType: "vignette" })).eligible).toBe(true);
  });

  it("suppresses a SATA item with one keyed option", () => {
    const verdict = assessStudentEligibility(
      row({
        itemType: "select_all",
        correctAnswer: "Check the INR",
        options: ["Check the INR", "Give vitamin K", "Ambulate", "Discharge"],
        ngnPayload: { kind: "select_all", options: ["Check the INR", "Give vitamin K", "Ambulate", "Discharge"] },
      })
    );
    expect(verdict.reasons).toContain("sata_fewer_than_two_keys");
    expect(verdict.eligible).toBe(false);
  });

  it("keeps a SATA item with two keyed options", () => {
    const options = ["Check the INR", "Hold the warfarin", "Give vitamin K now", "Discharge"];
    const verdict = assessStudentEligibility(
      row({
        itemType: "select_all",
        correctAnswer: "Check the INR|||Hold the warfarin",
        options,
        ngnPayload: { kind: "select_all", options },
      })
    );
    expect(verdict.eligible).toBe(true);
  });

  it("suppresses a select-all stem with a single key", () => {
    const verdict = assessStudentEligibility(
      row({
        itemType: "vignette",
        question: "Select all that apply. Which findings require a call to the provider?",
      })
    );
    expect(verdict.reasons).toContain("select_all_stem_single_key");
  });

  it("suppresses an unkeyed matrix and an ordered key that matches display order", () => {
    const matrix = assessStudentEligibility(
      row({
        itemType: "ngn_matrix",
        correctAnswer: "Low SpO2|||Intervene now,Pain|||Expected",
        ngnPayload: {
          kind: "matrix",
          rows: ["Low SpO2", "Pain", "New chest pain", "Absent bowel sounds"],
          columns: ["Intervene now", "Expected"],
        },
      })
    );
    expect(matrix.reasons).toContain("matrix_rows_unkeyed");

    const orderedOptions = ["Notify the provider", "Draw cultures", "Start fluids", "Give antibiotics"];
    const ordered = assessStudentEligibility(
      row({
        itemType: "ordered_response",
        correctAnswer: orderedOptions.join(","),
        options: orderedOptions,
        ngnPayload: { kind: "ordered_response", options: orderedOptions },
      })
    );
    expect(ordered.reasons).toContain("ordered_key_equals_display");
  });

  it("keeps an ordered key that is not the display order", () => {
    const options = ["Draw cultures", "Notify the provider", "Give antibiotics", "Start fluids"];
    const verdict = assessStudentEligibility(
      row({
        itemType: "ordered_response",
        correctAnswer: "Notify the provider,Draw cultures,Start fluids",
        options,
        ngnPayload: { kind: "ordered_response", options },
      })
    );
    expect(verdict.reasons).not.toContain("ordered_key_equals_display");
  });

  it("suppresses a highlight item with no passage", () => {
    const verdict = assessStudentEligibility(
      row({
        itemType: "ngn_highlight",
        ngnPayload: { kind: "highlight", options: ["A", "B", "C", "D"] },
      })
    );
    expect(verdict.reasons).toContain("highlight_missing_passage");
  });

  it("suppresses highlight options that are not in the passage and keeps spans that are", () => {
    const passage = "The note says the client has a plan to end their life tonight.";
    const missing = assessStudentEligibility(
      row({
        itemType: "ngn_highlight",
        ngnPayload: {
          kind: "highlight",
          text: passage,
          highlights: ["Notify the healthcare provider", "Hold the next dose"],
          options: ["Notify the healthcare provider", "Hold the next dose"],
        },
      })
    );
    expect(missing.reasons).toContain("highlight_options_not_in_passage");
    expect(missing.eligible).toBe(false);

    const present = assessStudentEligibility(
      row({
        itemType: "ngn_highlight",
        ngnPayload: {
          kind: "highlight",
          text: passage,
          highlights: ["a plan to end their life"],
        },
      })
    );
    expect(present.reasons).not.toContain("highlight_options_not_in_passage");
    expect(present.eligible).toBe(true);
  });

  it("suppresses a bow-tie whose rationale calls a keyed action incorrect", () => {
    const action = "Leave the bed in the highest position";
    const verdict = assessStudentEligibility(
      row({
        itemType: "ngn_bowtie",
        correctAnswer: action,
        explanation: `Some note.\n\nWhy other options are incorrect:\n• ${action}: Incorrect — this increases fall risk.`,
        ngnPayload: {
          kind: "bow_tie",
          condition: "Fall risk",
          actions: [action, "Lower the bed"],
          monitors: ["Orthostatic vital signs", "Hourly rounding"],
        },
      })
    );
    expect(verdict.reasons).toContain("bowtie_rationale_contradicts_key");
  });

  it("suppresses a bow-tie whose options are comma-split fragments", () => {
    const verdict = assessStudentEligibility(
      row({
        itemType: "ngn_bowtie",
        correctAnswer: "Administer the DTaP, Hib, IPV, and PCV vaccines",
        ngnPayload: {
          kind: "bow_tie",
          condition: "Delayed immunization schedule",
          actions: [
            "Administer the DTaP",
            "Administer the DTaP, Hib, IPV, and PCV vaccines",
            "Advise the parent to return in 2 months",
          ],
          monitors: ["and PCV vaccines", "IPV", "Hib", "Infant reaction to the vaccines"],
        },
      })
    );
    expect(verdict.reasons).toContain("bowtie_invalid_structure");
    expect(verdict.eligible).toBe(false);
  });

  it("suppresses incomplete case groups and keeps a group of six", () => {
    const members = Array.from({ length: 6 }, (_, index) =>
      row({
        id: `case-${index}`,
        itemType: "case_study",
        ngnPayload: { kind: "case_study", caseGroupId: "group-1", caseStep: index + 1 },
      })
    );
    const incomplete = assessStudentEligibility(members[0]!, {
      completeCaseGroups: completeCaseGroupKeys(members.slice(0, 4)),
    });
    expect(incomplete.reasons).toContain("incomplete_case_study");

    const complete = assessStudentEligibility(members[0]!, {
      completeCaseGroups: completeCaseGroupKeys(members),
    });
    expect(complete.eligible).toBe(true);
  });

  it("suppresses a six-item case of unrelated single-answer questions", () => {
    const members = [
      "A 72-year-old male client with congestive heart failure is admitted.",
      "A 45-year-old male with alcohol use disorder is admitted for detoxification.",
      "A 60-year-old female with osteoarthritis reports increased joint pain.",
      "A 55-year-old male with type 2 diabetes is prescribed metformin.",
      "A 50-year-old female with type 2 diabetes reports new symptoms.",
      "A 32-year-old female in labor is admitted at 39 weeks.",
    ].map((scenario, index) =>
      row({
        id: `unrelated-${index}`,
        itemType: "case_study",
        scenario,
        ngnPayload: { kind: "mcq", caseGroupId: "unrelated", caseStep: index + 1, options: ["A", "B", "C", "D"] },
      })
    );
    const facts = buildCaseGroupFacts(members);
    const verdict = assessStudentEligibility(members[0]!, { caseGroups: facts });
    expect(verdict.reasons).toContain("case_set_distinct_patients");
    expect(verdict.reasons).toContain("case_set_single_answer_only");
    expect(verdict.eligible).toBe(false);
  });

  it("keeps a six-item case that shares one patient and includes an NGN step", () => {
    const shared = "A 72-year-old male client with heart failure is admitted to the unit.";
    const members = Array.from({ length: 6 }, (_, index) =>
      row({
        id: `shared-${index}`,
        itemType: "case_study",
        scenario: index === 5 ? `${shared} Two hours later the same client is short of breath.` : shared,
        ngnPayload:
          index === 2
            ? {
                kind: "highlight",
                caseGroupId: "shared",
                caseStep: index + 1,
                text: "The note says the client is short of breath at rest.",
                highlights: ["short of breath at rest"],
              }
            : { kind: "mcq", caseGroupId: "shared", caseStep: index + 1, options: ["A", "B", "C", "D"] },
      })
    );
    const facts = buildCaseGroupFacts(members);
    const verdict = assessStudentEligibility(members[0]!, { caseGroups: facts });
    expect(verdict.eligible).toBe(true);
    expect(facts.get("nursing\tcase_study\tshared")).toMatchObject({
      members: 6,
      sharedPatient: true,
      hasNgnItem: true,
    });
  });

  it("suppresses qa failures and retired-but-active rows", () => {
    expect(assessStudentEligibility(row({ itemType: "vignette", qaPassed: false })).reasons).toContain(
      "qa_gate_failed"
    );
    const retired = assessStudentEligibility(
      row({
        itemType: "vignette",
        curationMeta: {
          itemQa: {
            pipeline: "item-qa-v1",
            checkedAt: "2026-09-01T00:00:00.000Z",
            codes: [],
            summary: "retired",
            retiredAt: "2026-09-01T00:00:00.000Z",
            retiredReason: "empty_stem",
          },
        },
      })
    );
    expect(retired.reasons).toContain("retired_but_active");
    expect(retired.eligible).toBe(false);
  });

  it("honors an explicit restore without changing the recorded reasons", () => {
    const verdict = assessStudentEligibility(
      row({
        itemType: "select_all",
        correctAnswer: "Only one",
        options: ["Only one", "Two", "Three", "Four"],
        curationMeta: {
          studentEligibility: {
            pipeline: "student-eligibility-v1",
            status: "restored",
            reasons: ["sata_fewer_than_two_keys"],
            assessedAt: "2026-09-25T00:00:00.000Z",
            restoredAt: "2026-09-25T00:00:00.000Z",
          },
        },
      })
    );
    expect(verdict.restored).toBe(true);
    expect(verdict.eligible).toBe(true);
    expect(verdict.reasons).toContain("sata_fewer_than_two_keys");
  });
});

describe("preset exam fill", () => {
  it("backfills to the advertised length and does not shrink", () => {
    const plan = planPresetExamFill({
      questionCount: 4,
      slots: [
        { id: "keep-a", sortOrder: 0, areaKey: "safety", eligible: true },
        { id: "drop-b", sortOrder: 1, areaKey: "safety", eligible: false },
        { id: "keep-c", sortOrder: 2, areaKey: "pharm", eligible: true },
        { id: "drop-d", sortOrder: 3, areaKey: "pharm", eligible: false },
      ],
      pool: [
        { id: "pool-z", areaKeys: ["pharm"] },
        { id: "pool-a", areaKeys: ["safety"] },
        { id: "pool-m", areaKeys: ["pharm"] },
      ],
    });
    expect(plan.action).toBe("backfill");
    expect(plan.orderedIds).toEqual(["keep-a", "pool-a", "keep-c", "pool-m"]);
    expect(plan.orderedIds).toHaveLength(4);
  });

  it("compacts 1-based sort orders before placing replacements", () => {
    const plan = planPresetExamFill({
      questionCount: 2,
      slots: [
        { id: "drop", sortOrder: 1, areaKey: "safety", eligible: false },
        { id: "keep", sortOrder: 2, areaKey: "pharm", eligible: true },
      ],
      pool: [{ id: "pool-a", areaKeys: ["safety"] }],
    });
    expect(plan.action).toBe("backfill");
    expect(plan.orderedIds).toEqual(["pool-a", "keep"]);
  });

  it("hides a form that cannot be filled", () => {
    const plan = planPresetExamFill({
      questionCount: 3,
      slots: [
        { id: "keep", sortOrder: 0, areaKey: "safety", eligible: true },
        { id: "drop", sortOrder: 1, areaKey: "safety", eligible: false },
      ],
      pool: [],
    });
    expect(plan.action).toBe("hide");
    expect(plan.orderedIds).toEqual([]);
  });
});
