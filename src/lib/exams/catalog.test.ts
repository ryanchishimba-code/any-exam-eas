import { describe, expect, it } from "vitest";
import { EXAM_HUBS, examSlugToFieldId, getExamHub } from "./catalog";

describe("exam catalog", () => {
  it("defines five exam hubs", () => {
    expect(EXAM_HUBS.map((h) => h.slug)).toEqual([
      "nclex",
      "usmle",
      "naplex",
      "pance",
      "top500",
    ]);
  });

  it("maps slugs to field ids", () => {
    expect(examSlugToFieldId("nclex")).toBe("nursing");
    expect(examSlugToFieldId("usmle")).toBe("usmle-step-2");
    expect(examSlugToFieldId("naplex")).toBe("pharmacy");
    expect(examSlugToFieldId("pance")).toBe("pance");
    expect(examSlugToFieldId("top500")).toBe("drugs300");
  });

  it("returns undefined for unknown slug", () => {
    expect(getExamHub("invalid")).toBeUndefined();
    expect(examSlugToFieldId("invalid" as "nclex")).toBe("invalid");
  });
});
