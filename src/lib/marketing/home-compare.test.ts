import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { GUIDELINE_CHECKED_LABEL } from "@/components/study/questions/CollapsibleSources";
import { LANDING_HERO_EXAMS } from "@/lib/landing/content";
import { HOME_GUIDELINE_LINE, homeCompareRows } from "@/lib/marketing/home-compare";

const FORBIDDEN =
  /Kaplan|Archer|UWorld|AMBOSS|RxPrep|BoardVitals|Hurst|\bonly\b|\bbest\b|\bnever\b|#1|\$\d|pass rate|\d[\d,]* questions/i;

describe("homepage comparison rows", () => {
  it("uses one subscription row and leaves question totals out", () => {
    const rows = homeCompareRows(true);
    expect(rows).toHaveLength(6);
    expect(rows.map((row) => row.id)).toEqual([
      "boards",
      "sources",
      "ngn",
      "videos",
      "readiness",
      "qotd",
    ]);
    expect(rows[0]).toMatchObject({
      feature: `${LANDING_HERO_EXAMS.length} boards in one subscription`,
      detail: LANDING_HERO_EXAMS.map((exam) => exam.label).join(", "),
      typical: "Often one exam per subscription",
    });
    expect(rows.map((row) => row.feature).join(" ")).not.toMatch(/\d[\d,]* questions/);
  });

  it("names NGN case studies when the snapshot has them", () => {
    expect(homeCompareRows(true).find((row) => row.id === "ngn")?.feature).toBe(
      "NGN case studies and NCLEX exam mode"
    );
    expect(homeCompareRows(false).find((row) => row.id === "ngn")?.feature).toBe("NCLEX exam mode");
  });

  it("keeps the other column short and neutral", () => {
    const rows = homeCompareRows(true);
    expect(HOME_GUIDELINE_LINE.startsWith(GUIDELINE_CHECKED_LABEL)).toBe(true);
    expect(rows.map((row) => row.typical)).toEqual([
      "Often one exam per subscription",
      "Not always shown",
      "Varies",
      "Often a separate purchase",
      "Varies",
      "Varies",
    ]);
    const joined = rows.flatMap((row) => [row.feature, row.detail, row.typical]).join(" ");
    expect(joined).not.toMatch(FORBIDDEN);
  });

  it("does not name a competitor or hard-code a bank total in the section", () => {
    const files = [
      "src/lib/marketing/home-compare.ts",
      "src/components/marketing/elevation/HomeCompare.tsx",
      "src/components/marketing/elevation/PublicHome.tsx",
    ];
    for (const file of files) {
      const text = readFileSync(path.resolve(process.cwd(), file), "utf8");
      expect(text, file).not.toMatch(/Kaplan|Archer|UWorld|AMBOSS|RxPrep|BoardVitals|Hurst|#1|\$\d|pass rate|\bnever\b/i);
      expect(text, file).not.toMatch(/43,348|43348|43,338|43338/);
    }
  });
});
