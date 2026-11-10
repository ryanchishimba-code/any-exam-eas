import { describe, expect, it } from "vitest";
import { allUsmle2026TopicSlugs, getUsmle2026Topic } from "@/lib/exam-prep/usmle/blueprint-topics-2026";
import { usmleFieldIdToStepLevel } from "@/lib/exam-prep/usmle/steps";
import { usmleWeakAreaServedSubject } from "@/lib/exam-prep/usmle/weak-area-served-subject";
import { getSubjectsForFieldId } from "@/lib/subjects/subject-catalog";

const FIELDS = ["usmle-step-1", "usmle-step-2", "usmle-step-3"] as const;

describe("USMLE weak areas stay on the served topic", () => {
  it("keeps a topic only on its own step and never substitutes another subject", () => {
    for (const fieldId of FIELDS) {
      const step = usmleFieldIdToStepLevel(fieldId);
      const catalog = new Set(
        getSubjectsForFieldId(fieldId).map((subject) => subject.id.toLowerCase())
      );
      for (const slug of allUsmle2026TopicSlugs()) {
        const topic = getUsmle2026Topic(slug);
        const practice = usmleWeakAreaServedSubject({ fieldId, topicKey: slug });
        const onThisStep = topic?.stepLevel === step || catalog.has(slug.toLowerCase());
        if (!onThisStep) {
          expect(practice, `${fieldId} ${slug}`).toBeNull();
          continue;
        }
        expect(practice?.subjectId).toBe(catalog.has(slug.toLowerCase()) ? practice?.subjectId : slug);
        expect(practice?.subjectId).not.toBe("internal-medicine");
      }
    }
  });

  it("drops Step 1 Antibiotic Mechanisms on Step 3", () => {
    expect(
      usmleWeakAreaServedSubject({
        fieldId: "usmle-step-3",
        topicKey: "antibiotic-mechanisms",
      })
    ).toBeNull();
    expect(
      usmleWeakAreaServedSubject({
        fieldId: "usmle-step-3",
        topicKey: "clinical-intervention",
      })
    ).toBeNull();
    expect(
      usmleWeakAreaServedSubject({
        fieldId: "usmle-step-3",
        topicKey: "confidentiality-reporting",
      })
    ).toEqual({
      subjectId: "confidentiality-reporting",
      blueprintTopics: ["confidentiality-reporting"],
    });
  });
});
