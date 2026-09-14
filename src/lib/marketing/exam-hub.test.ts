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

  it("points study-guide boards at the free reader", () => {
    expect(examHubSecondaryLink("nclex").href).toBe("/nclex/study-guide");
    expect(examHubSecondaryLink("naplex").label).toMatch(/NAPLEX study guide/i);
    expect(examHubSecondaryLink("usmle").href).toBe("#usmle-steps");
  });

  it("builds a three-card start-here band", () => {
    const links = examHubProductLinks("pance");
    expect(links).toHaveLength(2);
    expect(links[0]?.title).toMatch(/question bank/i);
    expect(examHubProductLinks("nclex")).toHaveLength(3);
  });
});
