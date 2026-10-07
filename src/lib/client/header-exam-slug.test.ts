import { describe, expect, it } from "vitest";
import { headerExamSlug } from "@/lib/client/header-exam-slug";
import { fullExamHref } from "@/lib/routes";

describe("header Full Exam link after select-exam", () => {
  it("points at the exam just chosen when the server prop is still the previous board", () => {
    const slug = headerExamSlug("nclex", "aanp-fnp");
    expect(slug).toBe("aanp-fnp");
    expect(fullExamHref(slug!)).toBe("/full-exam/aanp-fnp");
  });

  it("uses the server exam when nothing was just saved", () => {
    expect(headerExamSlug("naplex", null)).toBe("naplex");
    expect(fullExamHref("naplex")).toBe("/full-exam/naplex");
  });
});
