import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { GUIDELINE_CHECKED_LABEL } from "@/components/study/questions/CollapsibleSources";
import { LANDING_HERO_EXAMS } from "@/lib/landing/content";
import {
  HOME_COMPARE_OTHER,
  HOME_GUIDELINE_LINE,
  homeCompareItems,
} from "@/lib/marketing/home-compare";

const FORBIDDEN =
  /Kaplan|Archer|UWorld|AMBOSS|RxPrep|BoardVitals|Hurst|\bonly\b|\bbest\b|#1|\$\d|pass rate/i;

describe("homepage comparison rows", () => {
  it("lists each board and appends a live count only when one is present", () => {
    const items = homeCompareItems(
      [
        { slug: "nclex", countLabel: "5,483" },
        { slug: "naplex", countLabel: "7,300" },
        { slug: "usmle", countLabel: "" },
      ],
      false
    );
    expect(items.find((item) => item.id === "nclex")?.text).toBe("NCLEX · 5,483 questions");
    expect(items.find((item) => item.id === "naplex")?.text).toBe("NAPLEX · 7,300 questions");
    expect(items.find((item) => item.id === "usmle")?.text).toBe("USMLE");
    expect(items.map((item) => item.id).slice(0, LANDING_HERO_EXAMS.length)).toEqual(
      LANDING_HERO_EXAMS.map((exam) => exam.slug)
    );
    expect(items.some((item) => item.id === "ngn")).toBe(false);
  });

  it("adds NGN case studies only when the snapshot has them", () => {
    const items = homeCompareItems([], true);
    expect(items.find((item) => item.id === "ngn")?.text).toBe("NGN case studies");
  });

  it("uses the product label for cited rationales and a fair other column", () => {
    const items = homeCompareItems([], false);
    expect(HOME_GUIDELINE_LINE.startsWith(GUIDELINE_CHECKED_LABEL)).toBe(true);
    expect(items.map((item) => item.text)).toEqual(
      expect.arrayContaining([
        HOME_GUIDELINE_LINE,
        "NCLEX exam mode",
        "Quick Bites videos",
        "Practice readiness",
        "Question of the Day",
      ])
    );
    expect(HOME_COMPARE_OTHER).toBe("Often extra or not included");
    const joined = [...items.map((item) => item.text), HOME_COMPARE_OTHER].join(" ");
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
      expect(text, file).not.toMatch(/Kaplan|Archer|UWorld|AMBOSS|RxPrep|BoardVitals|Hurst|#1|\$\d|pass rate/i);
      expect(text, file).not.toMatch(/43,348|43348|43,338|43338/);
    }
  });
});
