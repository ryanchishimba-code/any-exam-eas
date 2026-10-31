import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  RETIRED_STUDY_BOARDS,
  boardStudyToolsPath,
  retiredStudyRedirects,
} from "./retired-study-redirects";

describe("retired study surface redirects", () => {
  const rules = retiredStudyRedirects();

  it("sends every board's library and topics URLs to that board's study hub with 308", () => {
    for (const exam of RETIRED_STUDY_BOARDS) {
      for (const source of ["/library", "/dashboard/topics", "/study-hub/topics"]) {
        const match = rules.find(
          (rule) =>
            rule.source === source && rule.has?.some((entry) => entry.key === "exam" && entry.value === exam)
        );
        expect(match?.statusCode).toBe(308);
        expect(match?.destination).toBe(`/dashboard?exam=${exam}`);
      }
    }
  });

  it("sends bare retired paths to the study hub", () => {
    for (const source of ["/library", "/dashboard/topics", "/study-hub/topics"]) {
      const match = rules.find((rule) => rule.source === source && !rule.has);
      expect(match).toEqual({
        source,
        destination: "/dashboard",
        statusCode: 308,
      });
    }
  });

  it("lists exam-specific rules before the catch-all for the same path", () => {
    const library = rules.filter((rule) => rule.source === "/library");
    expect(library.at(-1)?.has).toBeUndefined();
    expect(library.slice(0, -1).every((rule) => rule.has)).toBe(true);
  });

  it("builds a study hub path only for known boards", () => {
    expect(boardStudyToolsPath("pance")).toBe("/dashboard?exam=pance");
    expect(boardStudyToolsPath("not-a-board")).toBe("/dashboard");
    expect(boardStudyToolsPath()).toBe("/dashboard");
  });
});

describe("retired pages stay out of the public sitemap", () => {
  it("does not list library or high-yield topics", () => {
    const sitemap = fs.readFileSync(path.join(process.cwd(), "src/app/sitemap.ts"), "utf8");
    expect(sitemap).not.toContain('"/library"');
    expect(sitemap).not.toContain('"/dashboard/topics"');
    expect(sitemap).not.toContain("/study-hub/topics");
  });
});
