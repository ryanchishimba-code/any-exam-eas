import { describe, expect, it } from "vitest";
import { EXAM_HUBS, examSlugToFieldId, getExamHub } from "./catalog";

describe("exam catalog", () => {
  it("defines seven exam hubs including NPTE-PT", () => {
    expect(EXAM_HUBS.map((h) => h.slug)).toEqual([
      "nclex",
      "usmle",
      "naplex",
      "pance",
      "aanp-fnp",
      "npte-pt",
      "top500",
    ]);
  });

  it("maps slugs to field ids", () => {
    expect(examSlugToFieldId("nclex")).toBe("nursing");
    expect(examSlugToFieldId("usmle")).toBe("usmle-step-2");
    expect(examSlugToFieldId("naplex")).toBe("pharmacy");
    expect(examSlugToFieldId("pance")).toBe("pance");
    expect(examSlugToFieldId("aanp-fnp")).toBe("aanp-fnp");
    expect(examSlugToFieldId("npte-pt")).toBe("npte-pt");
    expect(examSlugToFieldId("top500")).toBe("drugs300");
  });

  it("returns undefined for unknown slug", () => {
    expect(getExamHub("invalid")).toBeUndefined();
    expect(examSlugToFieldId("invalid" as "nclex")).toBe("invalid");
  });
});
