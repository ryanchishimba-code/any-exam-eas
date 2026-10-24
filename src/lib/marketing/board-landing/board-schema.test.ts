import { describe, expect, it } from "vitest";
import { SEO_TITLE_MAX } from "@/lib/seo/meta-budget";
import { boardLandingMetaTitle } from "@/lib/marketing/board-landing/board-landing-copy";

const BOARD_LABELS = ["NCLEX-RN", "NAPLEX", "USMLE", "PANCE", "AANP FNP", "NPTE-PT"] as const;

describe("boardLandingMetaTitle", () => {
  it("fits every board label inside the SEO title budget", () => {
    for (const label of BOARD_LABELS) {
      const title = boardLandingMetaTitle(label);
      expect(title.length, label).toBeLessThanOrEqual(SEO_TITLE_MAX);
      expect(title).toMatch(/Practice Questions \+ 5-Day Free Trial \| \$27\.99\/mo$/);
    }
  });
});
