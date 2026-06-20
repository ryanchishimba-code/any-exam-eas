import { describe, it, expect } from "vitest";
import { getRegisteredSubjectIds, getSubjectsForFieldId } from "./registry";
import {
  CANONICAL_TOPICS,
  SUBJECT_CROSSWALK,
  getCanonicalTopic,
  getFieldSubjectsForCanonical,
  validateCrosswalkCoverage,
} from "./canonical-taxonomy";

function registrySnapshot(): Record<string, string[]> {
  const snapshot: Record<string, string[]> = {};
  for (const fieldId of getRegisteredSubjectIds()) {
    snapshot[fieldId] = getSubjectsForFieldId(fieldId).map((s) => s.id);
  }
  return snapshot;
}

describe("canonical taxonomy crosswalk", () => {
  it("maps every registered (fieldId, subjectId) to a known canonical topic", () => {
    const issues = validateCrosswalkCoverage(registrySnapshot());
    // Surface the first few offenders for a readable failure message.
    expect(issues.slice(0, 10)).toEqual([]);
    expect(issues).toHaveLength(0);
  });

  it("has unique canonical topic ids", () => {
    const ids = CANONICAL_TOPICS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("references only defined canonical ids in the crosswalk", () => {
    const known = new Set(CANONICAL_TOPICS.map((t) => t.id));
    for (const map of Object.values(SUBJECT_CROSSWALK)) {
      for (const canonicalId of Object.values(map)) {
        expect(known.has(canonicalId)).toBe(true);
      }
    }
  });

  it("groups the same clinical system across multiple exams", () => {
    const cardio = getFieldSubjectsForCanonical("cardiovascular");
    const fields = new Set(cardio.map((c) => c.fieldId));
    // USMLE Step 2, PANCE, AANP-FNP, NPTE, NAPLEX all contribute cardiovascular content.
    expect(fields.size).toBeGreaterThanOrEqual(4);
  });

  it("resolves field-specific slugs to the shared canonical", () => {
    expect(getCanonicalTopic("usmle-step-2", "cardiology")?.id).toBe("cardiovascular");
    expect(getCanonicalTopic("pance", "cardiovascular")?.id).toBe("cardiovascular");
    expect(getCanonicalTopic("npte-pt", "cardiovascular-pulmonary")?.id).toBe("cardiovascular");
    expect(getCanonicalTopic("usmle-step-1", "anatomy")?.id).toBe("anatomy");
  });

  it("normalizes field aliases", () => {
    expect(getCanonicalTopic("nclex", "med-surg")?.id).toBe("internal-medicine");
    expect(getCanonicalTopic("naplex", "cardiovascular-rx")?.id).toBe("cardiovascular");
  });
});
