import { describe, expect, it } from "vitest";
import { weakAreaPracticeHref } from "@/lib/learning/weak-area-practice-href";
import {
  pickWrongOrUnseen,
  weakAreasFromAttempts,
  type AttemptSubjectRow,
} from "@/lib/learning/weak-areas-from-attempts";

/**
 * Attempt aggregates for dev@anyexameasy.test on 2026-11-10.
 * Subject ids only. No question text.
 */
const DEV_TEST_ATTEMPTS: AttemptSubjectRow[] = [
  { fieldId: "usmle-step-1", subjectId: "Physiology", attempts: 88, correct: 29 },
  { fieldId: "usmle-step-1", subjectId: "anatomy", attempts: 51, correct: 15 },
  { fieldId: "usmle-step-1", subjectId: "metabolic-pathways", attempts: 47, correct: 23 },
  { fieldId: "usmle-step-1", subjectId: "Pathology", attempts: 22, correct: 8 },
  { fieldId: "usmle-step-1", subjectId: "antibiotic-mechanisms", attempts: 1, correct: 1 },
  { fieldId: "usmle-step-2", subjectId: "cardiology", attempts: 75, correct: 18 },
  { fieldId: "usmle-step-2", subjectId: "pediatric-infections", attempts: 36, correct: 12 },
  { fieldId: "usmle-step-2", subjectId: "sepsis-bundles", attempts: 6, correct: 3 },
  { fieldId: "usmle-step-2", subjectId: "antibiotic-mechanisms", attempts: 4, correct: 0 },
  { fieldId: "usmle-step-3", subjectId: "cardiology", attempts: 75, correct: 21 },
  { fieldId: "usmle-step-3", subjectId: "informed-consent-capacity", attempts: 23, correct: 6 },
  { fieldId: "usmle-step-3", subjectId: "confidentiality-reporting", attempts: 16, correct: 2 },
  { fieldId: "usmle-step-3", subjectId: "chf-management", attempts: 13, correct: 4 },
  { fieldId: "usmle-step-3", subjectId: "internal-medicine", attempts: 1, correct: 0 },
  { fieldId: "usmle-step-3", subjectId: "antibiotic-mechanisms", attempts: 1, correct: 0 },
  { fieldId: "usmle-step-3", subjectId: "clinical-intervention", attempts: 12, correct: 2 },
];

function ids(fieldId: string): string[] {
  return weakAreasFromAttempts({ fieldId, rows: DEV_TEST_ATTEMPTS, limit: 12 }).map(
    (row) => row.subjectId
  );
}

describe("dev test account weak areas by step", () => {
  it("uses each step's own answered subjects and drops unmapped blueprint slugs", () => {
    const step3 = ids("usmle-step-3");
    expect(step3).toContain("cardiology");
    expect(step3).toContain("confidentiality-reporting");
    expect(step3).toContain("informed-consent-capacity");
    expect(step3).not.toContain("antibiotic-mechanisms");
    expect(step3).not.toContain("clinical-intervention");
    expect(step3).not.toContain("internal-medicine");

    const step2 = ids("usmle-step-2");
    expect(step2).toContain("cardiology");
    expect(step2).toContain("sepsis-bundles");
    expect(step2).not.toContain("confidentiality-reporting");
    expect(step2).not.toContain("antibiotic-mechanisms");

    const step1 = ids("usmle-step-1");
    expect(step1).toContain("physiology");
    expect(step1).toContain("anatomy");
    expect(step1).toContain("metabolic-pathways");
    expect(step1).not.toContain("confidentiality-reporting");
    expect(step1).not.toContain("antibiotic-mechanisms");
  });

  it("opens the exact subject or topic and not a shared Internal Medicine set", () => {
    const cardio = weakAreaPracticeHref({
      examSlug: "usmle",
      topicKey: "subject:cardiology",
      fieldId: "usmle-step-3",
      count: 5,
    })!;
    const ethics = weakAreaPracticeHref({
      examSlug: "usmle",
      topicKey: "subject:confidentiality-reporting",
      fieldId: "usmle-step-3",
      count: 5,
    })!;
    const cardioUrl = new URL(cardio, "https://anyexameasy.local");
    const ethicsUrl = new URL(ethics, "https://anyexameasy.local");
    expect(cardioUrl.searchParams.get("subjectId")).toBe("cardiology");
    expect(cardioUrl.searchParams.get("blueprintTopics")).toBeNull();
    expect(ethicsUrl.searchParams.get("subjectId")).toBe("confidentiality-reporting");
    expect(ethicsUrl.searchParams.get("blueprintTopics")).toBe("confidentiality-reporting");
    expect(cardioUrl.searchParams.get("subjectId")).not.toBe(ethicsUrl.searchParams.get("subjectId"));
    expect(cardio).not.toContain("internal-medicine");
    expect(ethics).not.toContain("internal-medicine");
    expect(
      weakAreaPracticeHref({
        examSlug: "usmle",
        topicKey: "antibiotic-mechanisms",
        fieldId: "usmle-step-3",
        count: 5,
      })
    ).toBeNull();
  });

  it("serves missed items before unseen and skips items already answered correctly", () => {
    const picked = pickWrongOrUnseen(
      [{ id: "seen-right" }, { id: "missed" }, { id: "new" }],
      [
        { id: "seen-right", correct: true },
        { id: "missed", correct: false },
      ],
      5
    );
    expect(picked.map((item) => item.id)).toEqual(["missed", "new"]);
  });
});
