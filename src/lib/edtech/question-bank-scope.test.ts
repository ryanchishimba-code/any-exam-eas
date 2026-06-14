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
    expect(fieldIdForExamSlug("mpje")).toBe("mpje");
  });

  it("maps field ids back to exam slugs", () => {
    expect(examSlugForFieldId("nursing")).toBe("nclex");
    expect(examSlugForFieldId("pharmacy")).toBe("naplex");
    expect(examSlugForFieldId("usmle-step-2")).toBe("usmle");
    expect(examSlugForFieldId("mpje")).toBe("mpje");
  });

  it("detects field/exam mismatches", () => {
    expect(fieldMatchesExamSlug("nursing", "nclex")).toBe(true);
    expect(fieldMatchesExamSlug("pharmacy", "nclex")).toBe(false);
    expect(fieldMatchesExamSlug("mpje", "mpje")).toBe(true);
  });
});
