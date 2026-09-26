import { describe, expect, it } from "vitest";
import {
  applyEffectiveMcqForServe,
  assessEffectiveType,
  isPlainSingleAnswerReclass,
} from "./effective-type";
import { assessStudentEligibility, completeCaseGroupKeys } from "./student-eligibility";

const options = [
  "Notify the healthcare provider",
  "Hold the next dose of warfarin",
  "Administer vitamin K",
  "Continue monitoring the INR",
];

describe("effective type", () => {
  it("relabels a highlight whose choices are a single-answer MCQ", () => {
    const verdict = assessEffectiveType({
      itemType: "ngn_highlight",
      question: "Which action should the nurse take?",
      correctAnswer: "Notify the healthcare provider",
      options,
      ngnPayload: {
        kind: "highlight",
        text: "A client is admitted for anticoagulation.",
        highlights: options,
        options,
      },
    });
    expect(verdict).toMatchObject({
      action: "relabel",
      effectiveType: "mcq",
      reason: "plain_single_answer_mcq",
      originalType: "ngn_highlight",
    });
  });

  it("keeps a highlight whose spans are in the passage", () => {
    const verdict = assessEffectiveType({
      itemType: "ngn_highlight",
      question: "Highlight the finding that requires a call.",
      correctAnswer: "potassium 6.2",
      ngnPayload: {
        kind: "highlight",
        text: "Labs include potassium 6.2 and a stable heart rate.",
        highlights: ["potassium 6.2"],
        options: ["potassium 6.2", "stable heart rate"],
      },
    });
    expect(verdict.action).toBe("keep");
    expect(verdict.reason).toBe("sound_format");
  });

  it("relabels a case item that is one single-answer question", () => {
    const verdict = assessEffectiveType({
      itemType: "case_study",
      question: "Which medication should the nurse give?",
      scenario: "A 72-year-old male client with heart failure is admitted.",
      correctAnswer: "Administer the prescribed furosemide.",
      ngnPayload: {
        kind: "mcq",
        caseGroupId: "group-1",
        caseStep: 1,
        options: [
          "Administer the prescribed furosemide.",
          "Hold all medications",
          "Discharge the client",
          "Start a new antibiotic",
        ],
      },
    });
    expect(verdict.action).toBe("relabel");
    const member = {
      active: true,
      qaPassed: true,
      fieldId: "nursing",
      itemType: "case_study",
      question: "Which medication should the nurse give?",
      correctAnswer: "Administer the prescribed furosemide.",
      options: [
        "Administer the prescribed furosemide.",
        "Hold all medications",
        "Discharge the client",
        "Start a new antibiotic",
      ],
      ngnPayload: {
        kind: "mcq",
        caseGroupId: "group-1",
        options: [
          "Administer the prescribed furosemide.",
          "Hold all medications",
          "Discharge the client",
          "Start a new antibiotic",
        ],
      },
    };
    const members = Array.from({ length: 6 }, (_, index) => ({ ...member, id: `case-${index}` }));
    expect(
      assessStudentEligibility(members[0]!, { completeCaseGroups: completeCaseGroupKeys(members) }).eligible
    ).toBe(true);
    expect(assessStudentEligibility(members[0]!, {}).reasons).toContain("incomplete_case_study");
  });

  it("does not force a fragment bow-tie into MCQ", () => {
    const verdict = assessEffectiveType({
      itemType: "ngn_bowtie",
      question: "Which intervention is the priority?",
      correctAnswer: "Administer the DTaP, Hib, IPV, and PCV vaccines",
      ngnPayload: {
        kind: "bow_tie",
        condition: "Delayed immunization schedule",
        actions: ["Administer the DTaP", "Administer the DTaP, Hib, IPV, and PCV vaccines"],
        monitors: ["and PCV vaccines", "IPV", "Hib", "Infant reaction to the vaccines"],
      },
    });
    expect(verdict.action).toBe("leave");
    expect(verdict.effectiveType).toBeNull();
    expect(isPlainSingleAnswerReclass({
      itemType: "ngn_bowtie",
      ngnPayload: {
        kind: "bow_tie",
        actions: ["Give the vaccine"],
        monitors: ["and PCV vaccines"],
      },
    })).toBe(false);
  });

  it("keeps a CCS prompt and a two-key select-all on their own labels", () => {
    expect(
      assessEffectiveType({
        itemType: "ccs_prompt",
        question: "Manage this patient.",
        correctAnswer: "Order labs",
      }).action
    ).toBe("keep");
    expect(
      assessEffectiveType({
        itemType: "select_all",
        correctAnswer: "Check the INR|||Hold the warfarin",
        options: ["Check the INR", "Hold the warfarin", "Discharge", "Ignore the result"],
      }).reason
    ).toBe("sound_format");
  });

  it("serves a relabelled row as MCQ without keeping the highlight payload", () => {
    const served = applyEffectiveMcqForServe({
      itemType: "ngn_highlight",
      question: "Which action should the nurse take?",
      correctAnswer: options[0],
      options,
      ngnPayload: { kind: "highlight", text: "A client is admitted.", highlights: options, options },
    });
    expect(served.itemType).toBe("mcq");
    expect(served.ngnPayload).toBeUndefined();
    expect(served.options).toEqual(options);
  });

  it("honors a restore and keeps the stored label", () => {
    const verdict = assessEffectiveType({
      itemType: "case_study",
      question: "Which medication should the nurse give?",
      correctAnswer: "Administer the prescribed furosemide.",
      ngnPayload: {
        kind: "mcq",
        options: ["Administer the prescribed furosemide.", "Hold all medications", "Discharge", "Observe"],
      },
      curationMeta: {
        effectiveType: {
          pipeline: "effective-type-v1",
          status: "restored",
          effectiveType: "mcq",
          originalType: "case_study",
          reason: "plain_single_answer_mcq",
          assessedAt: "2026-09-26T00:00:00.000Z",
          restoredAt: "2026-09-26T00:00:00.000Z",
        },
      },
    });
    expect(verdict.action).toBe("keep");
    expect(verdict.reason).toBe("restored_original_type");
  });
});
