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
    expect(marketingExamKeyFromPath("/usmle")).toBe("usmle");
    expect(marketingExamKeyFromPath("/pricing")).toBeNull();
  });

  it("sends study-guide boards to the trial offer, not an open manuscript", () => {
    expect(examHubSecondaryLink("nclex").href).toBe("/free-guides#study-guides");
    expect(examHubSecondaryLink("nclex").label).toBe("NCLEX reference book");
    expect(examHubSecondaryLink("naplex").label).toMatch(/NAPLEX reference book/i);
    expect(examHubSecondaryLink("usmle").href).toBe("#usmle-steps");
    const book = examHubProductLinks("nclex")[0];
    expect(book?.href).toBe("/nclex/study-guide");
    expect(book?.title).toMatch(/study guide/i);
    expect(book?.body).toMatch(/included with the 5-day free trial/i);
    expect(book?.body).toBe(
      "Included with the 5-day free trial. 5-day free trial · no payment method required · then $27.99/mo"
    );
    expect(book?.body).not.toMatch(/%/);
    expect(book?.body).not.toMatch(/without an account/i);
    expect(book?.body).not.toMatch(/free guide/i);
  });

  it("builds a three-card start-here band", () => {
    const links = examHubProductLinks("pance");
    expect(links).toHaveLength(2);
    expect(links[0]?.title).toMatch(/question bank/i);
    expect(examHubProductLinks("nclex")).toHaveLength(3);
  });
});
