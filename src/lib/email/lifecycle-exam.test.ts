import { describe, expect, it } from "vitest";
import { lifecycleExamFromSlug } from "@/lib/email/lifecycle-exam";

const OTHER_BOARDS = /NAPLEX|PANCE|USMLE|NPTE|Step 2|six boards/i;

describe("lifecycle exam copy", () => {
  it("uses only the selected board for the first step", () => {
    const nclex = lifecycleExamFromSlug("nclex");
    expect(nclex.name).toBe("NCLEX");
    expect(nclex.startCta).toBe("Start with 10 NCLEX questions");
    expect(nclex.startUrl).toContain("field=nursing");
    expect(nclex.startUrl).toContain("count=10");
    expect(`${nclex.name} ${nclex.startCta}`).not.toMatch(OTHER_BOARDS);

    const fnp = lifecycleExamFromSlug("aanp-fnp");
    expect(fnp.name).toBe("AANP FNP");
    expect(fnp.startUrl).toContain("field=aanp-fnp");
  });

  it("falls back to choosing an exam without naming other boards", () => {
    const none = lifecycleExamFromSlug(null);
    expect(none.name).toBeNull();
    expect(none.startCta).toBe("Choose your exam, then start 10 questions");
    expect(none.startUrl).toMatch(/\/select-exam$/);
    expect(none.startCta).not.toMatch(/NCLEX|NAPLEX|PANCE|USMLE|FNP|NPTE|Step 2/i);
  });
});
