import { describe, expect, it } from "vitest";
import { resolvePathAfterExamSwitch } from "@/lib/client/exam-switch-reset";
import { ROUTES } from "@/lib/routes";

describe("resolvePathAfterExamSwitch", () => {
  it("rewrites question bank field and clears topic session params", () => {
    const qs = new URLSearchParams(
      "field=nursing&mode=bank&subjectId=pharmacology-nursing&count=25&style=adaptive"
    );
    const href = resolvePathAfterExamSwitch(ROUTES.questionBank, qs, "naplex");
    expect(href).toContain("field=pharmacy");
    expect(href).toContain("mode=bank");
    expect(href).not.toContain("subjectId=");
    expect(href).not.toContain("count=");
    expect(href).not.toContain("style=");
  });

  it("updates library exam query and clears card/topic deep links", () => {
    const qs = new URLSearchParams("exam=nclex&card=nclex-sepsis-bundle&topic=sepsis");
    const href = resolvePathAfterExamSwitch(ROUTES.library, qs, "naplex");
    expect(href).toBe(`${ROUTES.library}?exam=naplex`);
  });

  it("moves full-exam route to the newly selected exam slug", () => {
    const href = resolvePathAfterExamSwitch(
      `${ROUTES.fullExam}/nclex`,
      new URLSearchParams(),
      "naplex"
    );
    expect(href).toBe(`${ROUTES.fullExam}/naplex`);
  });
});
