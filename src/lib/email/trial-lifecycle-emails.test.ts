import { describe, expect, it } from "vitest";
import {
  dashboardEmailUrl,
  upgradeEmailUrl,
} from "@/lib/email/trial-lifecycle-emails";

describe("trial lifecycle email URLs", () => {
  it("builds dashboard link from app base", () => {
    expect(dashboardEmailUrl()).toMatch(/\/dashboard$/);
  });

  it("builds upgrade links with email context", () => {
    expect(upgradeEmailUrl("welcome")).toContain("from=email-welcome");
    expect(upgradeEmailUrl("welcome")).toContain("highlight=pro");
    expect(upgradeEmailUrl("trial-ending")).toContain("from=email-trial-ending");
  });
});
