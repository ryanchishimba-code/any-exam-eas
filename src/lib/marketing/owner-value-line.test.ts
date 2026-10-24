import { describe, expect, it } from "vitest";
import { PRO_FEATURES } from "@/lib/subscription-tiers";
import { HOME_OWNER_VALUE_LINE } from "./owner-value-line";

describe("owner value line", () => {
  it("states the public Pro monthly price on the home hero only", () => {
    expect(HOME_OWNER_VALUE_LINE).toBe(
      "Pick any board for just $27.99/mo. Here to save students money and deliver premium study."
    );
  });

  it("matches billing: one Pro plan covers every exam bank", () => {
    const joined = PRO_FEATURES.join(" ");
    expect(joined).toMatch(/all 6 exam banks/i);
    expect(joined).toMatch(/USMLE|NCLEX|NAPLEX|PANCE|AANP FNP|NPTE-PT/);
  });
});
