import { describe, expect, it } from "vitest";
import {
  assessStudentEligibility,
  completeCaseGroupKeys,
  readStudentEligibilityRecord,
  type StudentEligibilityInput,
} from "./student-eligibility";
import {
  KEY_REVIEW_AUDIT_REF,
  KEY_UNCERTAIN_RN_REVIEW,
  KEY_WRONG_PENDING_RN_REVIEW,
  withKeyWrongAudit,
} from "./reviewed-key-queue";
import { STUDENT_ELIGIBLE_SQL } from "./student-eligibility-sql";
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

  it("suppresses incomplete case groups and keeps a group of six", () => {
    const members = Array.from({ length: 6 }, (_, index) =>
      row({
        id: `case-${index}`,
        itemType: "case_study",
        ngnPayload: {
          kind: "matrix",
          caseGroupId: "group-1",
          caseStep: index + 1,
          rows: ["Low SpO2"],
          columns: ["Intervene now"],
        },
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

  it("hides a reviewed wrong key and keeps an uncertain key visible", () => {
    const wrong = assessStudentEligibility(
      row({ id: KEY_WRONG_PENDING_RN_REVIEW[0]!.id, itemType: "vignette" })
    );
    expect(wrong.reasons).toContain("key_wrong_pending_rn_review");
    expect(wrong.eligible).toBe(false);

    const uncertain = assessStudentEligibility(
      row({ id: KEY_UNCERTAIN_RN_REVIEW[0]!.id, itemType: "vignette" })
    );
    expect(uncertain.reasons).not.toContain("key_wrong_pending_rn_review");
    expect(uncertain.eligible).toBe(true);
  });

  it("lets an RN restore override a reviewed wrong key and records the audit", () => {
    const id = "cmqwifwvc000a1yec5d73ooad";
    const verdict = assessStudentEligibility(
      row({
        id,
        itemType: "vignette",
        curationMeta: {
          studentEligibility: {
            pipeline: "student-eligibility-v1",
            status: "restored",
            reasons: ["key_wrong_pending_rn_review"],
            assessedAt: "2026-09-25T00:00:00.000Z",
            restoredAt: "2026-09-25T00:00:00.000Z",
            auditRef: KEY_REVIEW_AUDIT_REF,
            sampleId: "S35",
          },
        },
      })
    );
    expect(verdict.eligible).toBe(true);
    expect(verdict.restored).toBe(true);
    const record = withKeyWrongAudit(id, {
      pipeline: "student-eligibility-v1" as const,
      status: "suppressed" as const,
      reasons: ["key_wrong_pending_rn_review" as const],
      assessedAt: "2026-09-26T00:00:00.000Z",
    });
    expect(record.auditRef).toBe(KEY_REVIEW_AUDIT_REF);
    expect(record.sampleId).toBe("S35");
    expect(readStudentEligibilityRecord({ studentEligibility: record })?.auditRef).toBe(KEY_REVIEW_AUDIT_REF);
  });

  it("mirrors the reviewed ids in SQL behind the restore override", () => {
    for (const item of KEY_WRONG_PENDING_RN_REVIEW) {
      expect(STUDENT_ELIGIBLE_SQL).toContain(`'${item.id}'`);
    }
    for (const item of KEY_UNCERTAIN_RN_REVIEW) {
      expect(STUDENT_ELIGIBLE_SQL).not.toContain(`'${item.id}'`);
    }
    expect(STUDENT_ELIGIBLE_SQL).toContain("studentEligibility,status");
    expect(STUDENT_ELIGIBLE_SQL.indexOf("'restored'")).toBeLessThan(STUDENT_ELIGIBLE_SQL.indexOf("OR NOT"));
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
