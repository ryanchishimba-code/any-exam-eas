import { describe, expect, it } from "vitest";
import {
  examHubProductLinks,
  examHubSecondaryLink,
  marketingExamKeyFromPath,
  MARKETING_DARK_HERO_PATHS,
} from "./exam-hub";

describe("exam hub marketing helpers", () => {
  it("maps board hub paths for dark-hero nav", () => {
    expect(MARKETING_DARK_HERO_PATHS.has("/naplex")).toBe(true);
    expect(MARKETING_DARK_HERO_PATHS.has("/about")).toBe(true);
    expect(marketingExamKeyFromPath("/usmle")).toBe("usmle");
    expect(marketingExamKeyFromPath("/pricing")).toBeNull();
  });

  it("links each board to its public study guide, resources article, toolkit, and compare", () => {
    expect(examHubSecondaryLink("nclex").href).toBe("/free-guides#study-guides");
    expect(examHubSecondaryLink("usmle").href).toBe("#usmle-steps");
    const book = examHubProductLinks("nclex")[0];
    expect(book?.href).toBe("/nclex-study-guide");
    expect(book?.title).toMatch(/study guide/i);
    expect(book?.body).toMatch(/no login/i);
    expect(book?.body).not.toMatch(/%/);
    expect(examHubProductLinks("pance")[0]?.href).toBe("/pance-study-guide");
    expect(examHubProductLinks("npte-pt").some((link) => link.href === "/npte-pt-study-guide")).toBe(true);
    for (const exam of ["nclex", "naplex", "pance", "aanp-fnp", "usmle", "npte-pt"] as const) {
      const hrefs = examHubProductLinks(exam).map((link) => link.href);
      expect(hrefs, exam).toContain("/toolkit");
      expect(hrefs, exam).toContain("/compare");
    }
  });
});
