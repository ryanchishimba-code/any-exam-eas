import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/edtech/exam-preference", () => ({
  getUserExamPreference: vi.fn(),
  setUserExamPreference: vi.fn(),
}));

vi.mock("@/lib/edtech/user-metadata", () => ({
  getUserEdtechMetadata: vi.fn(async () => ({})),
}));

import { getUserExamPreference } from "@/lib/edtech/exam-preference";
import {
  canonicalPracticeFieldId,
  enforceQuestionBankFieldAccess,
  examSlugForFieldId,
  fieldIdForExamSlug,
  fieldMatchesExamSlug,
  resolveQuestionBankFieldId,
} from "./question-bank-scope";

describe("question-bank-scope", () => {
  beforeEach(() => {
    vi.mocked(getUserExamPreference).mockReset();
  });

  it("allows matching exam field access without throwing", async () => {
    vi.mocked(getUserExamPreference).mockResolvedValue({
      userId: "user-1",
      examSlug: "nclex",
      lastStudiedAt: null,
    });

    const access = await enforceQuestionBankFieldAccess("user-1", "nursing");
    expect(access.ok).toBe(true);
    if (access.ok) {
      expect(access.fieldId).toBe("nursing");
      expect(access.examSlug).toBe("nclex");
    }
  });

  it("rejects fields that do not match the selected exam", async () => {
    vi.mocked(getUserExamPreference).mockResolvedValue({
      userId: "user-1",
      examSlug: "nclex",
      lastStudiedAt: null,
    });

    const access = await enforceQuestionBankFieldAccess("user-1", "pharmacy");
    expect(access.ok).toBe(false);
    if (!access.ok) {
      expect(access.response.status).toBe(403);
      const body = await access.response.json();
      expect(body.code).toBe("EXAM_FIELD_MISMATCH");
    }
  });

  it("maps exam slugs to field ids", () => {
    expect(fieldIdForExamSlug("nclex")).toBe("nursing");
    expect(fieldIdForExamSlug("naplex")).toBe("pharmacy");
    expect(fieldIdForExamSlug("usmle")).toBe("usmle-step-2");
    expect(fieldIdForExamSlug("pance")).toBe("pance");
    expect(fieldIdForExamSlug("aanp-fnp")).toBe("aanp-fnp");
    expect(fieldIdForExamSlug("npte-pt")).toBe("npte-pt");
  });

  it("maps field ids back to exam slugs", () => {
    expect(examSlugForFieldId("nursing")).toBe("nclex");
    expect(examSlugForFieldId("pharmacy")).toBe("naplex");
    expect(examSlugForFieldId("usmle-step-1")).toBe("usmle");
    expect(examSlugForFieldId("usmle-step-2")).toBe("usmle");
    expect(examSlugForFieldId("usmle-step-3")).toBe("usmle");
    expect(examSlugForFieldId("pance")).toBe("pance");
    expect(examSlugForFieldId("aanp-fnp")).toBe("aanp-fnp");
    expect(examSlugForFieldId("npte-pt")).toBe("npte-pt");
    expect(examSlugForFieldId("mpje")).toBe("pance");
  });

  it("detects field/exam mismatches", () => {
    expect(fieldMatchesExamSlug("nursing", "nclex")).toBe(true);
    expect(fieldMatchesExamSlug("pharmacy", "nclex")).toBe(false);
    expect(fieldMatchesExamSlug("pance", "pance")).toBe(true);
    expect(fieldMatchesExamSlug("aanp-fnp", "aanp-fnp")).toBe(true);
    expect(fieldMatchesExamSlug("aanp-fnp", "pance")).toBe(false);
    expect(fieldMatchesExamSlug("usmle-step-1", "usmle")).toBe(true);
    expect(fieldMatchesExamSlug("usmle-step-3", "usmle")).toBe(true);
    expect(fieldMatchesExamSlug("nursing", "usmle")).toBe(false);
  });

  it("normalizes field query values to canonical exam field ids", () => {
    expect(resolveQuestionBankFieldId("USMLE Step 2 CK")).toBe("usmle-step-2");
    expect(resolveQuestionBankFieldId("usmle-step-1")).toBe("usmle-step-1");
    expect(resolveQuestionBankFieldId("step-3")).toBe("usmle-step-3");
    expect(resolveQuestionBankFieldId("usmle")).toBe("usmle-step-2");
    expect(resolveQuestionBankFieldId("nclex")).toBe("nursing");
    expect(resolveQuestionBankFieldId("NAPLEX")).toBe("pharmacy");
  });

  it("resolves canonical practice field per exam selection", () => {
    expect(canonicalPracticeFieldId("nclex")).toBe("nursing");
    expect(canonicalPracticeFieldId("usmle", "usmle-step-1")).toBe("usmle-step-1");
    expect(canonicalPracticeFieldId("usmle", null)).toBe("usmle-step-2");
    expect(canonicalPracticeFieldId("pance")).toBe("pance");
  });
});
