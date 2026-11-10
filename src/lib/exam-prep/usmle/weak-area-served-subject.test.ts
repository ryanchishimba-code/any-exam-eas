import { describe, expect, it } from "vitest";
import { allUsmle2026TopicSlugs } from "@/lib/exam-prep/usmle/blueprint-topics-2026";
import {
  usmleWeakAreaServedSubject,
  usmleWeakAreaSubjectsAreHandled,
  WEAK_AREA_MIN_SERVED,
} from "@/lib/exam-prep/usmle/weak-area-served-subject";
import { getSubjectsForFieldId } from "@/lib/subjects/subject-catalog";

const FIELDS = ["usmle-step-1", "usmle-step-2", "usmle-step-3"] as const;

describe("USMLE weak areas use the served subject taxonomy", () => {
  it("maps every blueprint topic on every step to a served subject", () => {
    expect(usmleWeakAreaSubjectsAreHandled(FIELDS)).toBe(true);
    for (const fieldId of FIELDS) {
      const allowed = new Set(getSubjectsForFieldId(fieldId).map((subject) => subject.id));
      for (const slug of allUsmle2026TopicSlugs()) {
        const practice = usmleWeakAreaServedSubject({ fieldId, topicKey: slug });
        expect(practice, `${fieldId} ${slug}`).not.toBeNull();
        expect(allowed.has(practice!.subjectId)).toBe(true);
      }
    }
  });

  it("keeps a same-step topic filter and drops one that belongs to another step", () => {
    const step3 = usmleWeakAreaServedSubject({
      fieldId: "usmle-step-3",
      topicKey: "antibiotic-mechanisms",
    });
    expect(step3?.subjectId).toBe("internal-medicine");
    expect(step3?.blueprintTopics).toEqual([]);

    const step1 = usmleWeakAreaServedSubject({
      fieldId: "usmle-step-1",
      topicKey: "antibiotic-mechanisms",
      subjectCounts: { pharmacology: 2, microbiology: 8 },
    });
    expect(step1?.subjectId).toBe("microbiology");
    expect(step1?.blueprintTopics).toEqual(["antibiotic-mechanisms"]);
    expect(WEAK_AREA_MIN_SERVED).toBe(5);
  });
});
