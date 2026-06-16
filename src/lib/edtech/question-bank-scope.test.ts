import { describe, expect, it } from "vitest";
import {
  examSlugForFieldId,
  fieldIdForExamSlug,
  fieldMatchesExamSlug,
} from "./question-bank-scope";

describe("question-bank-scope", () => {
  it("maps exam slugs to field ids", () => {
    expect(fieldIdForExamSlug("nclex")).toBe("nursing");
    expect(fieldIdForExamSlug("naplex")).toBe("pharmacy");
    expect(fieldIdForExamSlug("usmle")).toBe("usmle-step-2");
    expect(fieldIdForExamSlug("pance")).toBe("pance");
  });

  it("maps field ids back to exam slugs", () => {
    expect(examSlugForFieldId("nursing")).toBe("nclex");
    expect(examSlugForFieldId("pharmacy")).toBe("naplex");
    expect(examSlugForFieldId("usmle-step-2")).toBe("usmle");
    expect(examSlugForFieldId("pance")).toBe("pance");
    expect(examSlugForFieldId("aanp-fnp")).toBe(null);
    expect(examSlugForFieldId("mpje")).toBe("pance");
  });

  it("detects field/exam mismatches", () => {
    expect(fieldMatchesExamSlug("nursing", "nclex")).toBe(true);
    expect(fieldMatchesExamSlug("pharmacy", "nclex")).toBe(false);
    expect(fieldMatchesExamSlug("pance", "pance")).toBe(true);
    expect(fieldMatchesExamSlug("aanp-fnp", "pance")).toBe(false);
  });
});
