import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { gatedStudyGuidePaths } from "@/lib/seo/gated-study-guide-paths";
import {
  USMLE_STUDY_GUIDES,
  getStudyGuideConfig,
  studyGuideRouteBases,
} from "./guide-registry";
import { isUsmleStudyGuidePublic, isUsmleStudyGuideReleased } from "./usmle-guide-public";

const BOOKS = [
  ["step-1", USMLE_STUDY_GUIDES.step1],
  ["step-2-ck", USMLE_STUDY_GUIDES.step2],
  ["step-3", USMLE_STUDY_GUIDES.step3],
] as const;

function chapters(dir: string): string[] {
  return readdirSync(path.join("content/usmle-study-guide", dir))
    .filter((name) => /^\d{2}-.+\.md$/.test(name))
    .sort();
}

describe("USMLE study guide books", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("stays off the public exam list so homepages do not grow a link", () => {
    expect(getStudyGuideConfig("usmle")).toBeUndefined();
    expect(getStudyGuideConfig("nclex")?.routeBase).toBe("/nclex/study-guide");
  });

  it("is hidden until either release flag is on", () => {
    vi.stubEnv("NEXT_PUBLIC_USMLE_STUDY_GUIDE_PUBLIC", "");
    vi.stubEnv("USMLE_STUDY_GUIDE_PUBLIC", "");
    expect(isUsmleStudyGuidePublic()).toBe(false);
    expect(isUsmleStudyGuideReleased()).toBe(false);
    vi.stubEnv("USMLE_STUDY_GUIDE_PUBLIC", "1");
    expect(isUsmleStudyGuideReleased()).toBe(true);
    expect(isUsmleStudyGuidePublic()).toBe(false);
    vi.stubEnv("USMLE_STUDY_GUIDE_PUBLIC", "");
    vi.stubEnv("NEXT_PUBLIC_USMLE_STUDY_GUIDE_PUBLIC", "true");
    expect(isUsmleStudyGuidePublic()).toBe(true);
    expect(isUsmleStudyGuideReleased()).toBe(true);
  });

  it("registers one route per Step inside the reader chrome list", () => {
    const bases = studyGuideRouteBases();
    expect(bases).toEqual(
      expect.arrayContaining([
        "/nclex/study-guide",
        "/usmle/study-guide/step-1",
        "/usmle/study-guide/step-2-ck",
        "/usmle/study-guide/step-3",
      ])
    );
    expect(gatedStudyGuidePaths()).toEqual(expect.arrayContaining(bases));
  });

  it.each(BOOKS)("%s has 15 to 20 chapters with the required frame", (_label, config) => {
    const files = chapters(config.contentDir.replace("usmle-study-guide/", ""));
    expect(files.length).toBeGreaterThanOrEqual(15);
    expect(files.length).toBeLessThanOrEqual(20);
    const slugs = files.map((file) => file.replace(/^\d{2}-/, "").replace(/\.md$/, ""));
    expect(slugs).toContain("front-matter");
    expect(slugs).toContain("exam-day");
    expect(slugs).toContain("faq");
    expect(slugs.some((slug) => slug.startsWith("how-step"))).toBe(true);
    for (const file of files) {
      const text = readFileSync(
        path.join("content", config.contentDir, file),
        "utf8"
      );
      expect(text, file).toMatch(/^#\s+\S/m);
      expect(text, file).toMatch(/## Study plan|## The outline|## Framework|## The day|## Answers|## One-page map|## Orders/i);
      expect(text, file).toMatch(/Common traps/i);
      expect(text, file).toMatch(/Practice this in the Qbank/);
      expect(text, file).toMatch(/## Sources/);
      expect(text, file).toMatch(/https?:\/\//);
      expect(text, file).not.toMatch(/pass rate of/i);
      expect(text, file).not.toMatch(/guaranteed/i);
      expect(text, file).not.toMatch(/you will pass/i);
    }
    const front = readFileSync(
      path.join("content", config.contentDir, "00-front-matter.md"),
      "utf8"
    );
    expect(front).toMatch(/Study plan/);
    expect(front).toMatch(/not a promise|does not promise|no promise/i);
  });
});
