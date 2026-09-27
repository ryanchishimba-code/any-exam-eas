import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  HOME_EDUCATIONAL_USE,
  HOME_NOT_AFFILIATED,
  HOME_PRACTICE_HEADLINE,
  HOME_READINESS_HEADING,
  HOME_READINESS_LINE,
  HOME_TESTIMONIAL_LABEL,
} from "@/lib/marketing/legal-copy";

const homeSources = [
  "src/components/marketing/elevation/PublicHome.tsx",
  "src/components/marketing/elevation/HomeQuote.tsx",
  "src/components/Footer.tsx",
].map((file) => readFileSync(path.join(process.cwd(), file), "utf8"));

describe("home legal copy", () => {
  it("keeps the footer lines and practice framing in one module", () => {
    expect(HOME_NOT_AFFILIATED).toMatch(
      /not affiliated with or endorsed by NCSBN, NABP, NBME\/FSMB, NCCPA, AANPCB, or FSBPT/i
    );
    expect(HOME_EDUCATIONAL_USE).toBe("For educational use only. Not medical advice.");
    expect(HOME_TESTIMONIAL_LABEL).toMatch(/individual experience/i);
    expect(HOME_PRACTICE_HEADLINE).toMatch(/practice/i);
    expect(HOME_PRACTICE_HEADLINE).toMatch(/prepare/i);
    expect(HOME_READINESS_HEADING).toMatch(/practice estimate/i);
    expect(HOME_READINESS_LINE).toMatch(/practice|questions you answer/i);
  });

  it("does not promise a pass or use superlatives in our own home lines", () => {
    const ours = [
      HOME_NOT_AFFILIATED,
      HOME_EDUCATIONAL_USE,
      HOME_TESTIMONIAL_LABEL,
      HOME_PRACTICE_HEADLINE,
      HOME_READINESS_HEADING,
      HOME_READINESS_LINE,
    ].join(" ");
    expect(ours).not.toMatch(/you will pass|guarantee|best|#1/i);
  });

  it("renders those lines from the shared module", () => {
    const joined = homeSources.join("\n");
    expect(joined).toContain("HOME_NOT_AFFILIATED");
    expect(joined).toContain("HOME_EDUCATIONAL_USE");
    expect(joined).toContain("HOME_TESTIMONIAL_LABEL");
    expect(joined).toContain("HOME_PRACTICE_HEADLINE");
    expect(joined).toContain("HOME_READINESS_HEADING");
    expect(joined).toMatch(/\/legal\/refunds/);
  });
});
