import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  STUDY_GUIDES,
  USMLE_STUDY_STEPS,
  getStudyGuideConfig,
  usmleStudyBook,
  usmleStudyBookForField,
  usmleStudyGuideRouteBases,
} from "@/lib/nclex-study-guide/guide-registry";
import {
  isUsmleGuideFileFallback,
  isUsmleStudyGuidePublic,
  isUsmleStudyGuideReleased,
} from "@/lib/nclex-study-guide/usmle-guide-flags";

const REQUIRED = [
  "What this chapter covers",
  "The framework",
  "Checklist",
  "Common traps",
  "Practice this in the Qbank",
  "Sources",
];

describe("USMLE study-guide registry", () => {
  it("keeps the existing books as the only public StudyGuideExam entries", () => {
    expect(Object.keys(STUDY_GUIDES).sort()).toEqual(
      ["aanp-fnp", "naplex", "nclex", "pance"].sort()
    );
    expect(getStudyGuideConfig("usmle")).toBeUndefined();
    expect(getStudyGuideConfig("nclex")?.routeBase).toBe("/nclex/study-guide");
  });

  it("ships one book per Step, on its own route, outside the public exam map", () => {
    expect(USMLE_STUDY_STEPS).toEqual(["step-1", "step-2-ck", "step-3"]);
    expect(usmleStudyGuideRouteBases()).toEqual([
      "/usmle/study-guide/step-1",
      "/usmle/study-guide/step-2-ck",
      "/usmle/study-guide/step-3",
    ]);
    expect(usmleStudyBookForField("usmle-step-2").step).toBe("step-2-ck");
    expect(usmleStudyBookForField("usmle-step-3").step).toBe("step-3");
    expect(usmleStudyBookForField(undefined).step).toBe("step-1");
    expect(usmleStudyBook("step-1").legal.owner).toMatch(/Federation of State Medical Boards/);
    expect(usmleStudyBook("step-1").legal.owner).toMatch(/National Board of Medical Examiners/);
  });
});

describe("USMLE study-guide flags", () => {
  it("stays hidden when the flags are unset", () => {
    const previousPublic = process.env.NEXT_PUBLIC_USMLE_STUDY_GUIDE_PUBLIC;
    const previousServer = process.env.USMLE_STUDY_GUIDE_PUBLIC;
    delete process.env.NEXT_PUBLIC_USMLE_STUDY_GUIDE_PUBLIC;
    delete process.env.USMLE_STUDY_GUIDE_PUBLIC;
    expect(isUsmleStudyGuidePublic()).toBe(false);
    expect(isUsmleStudyGuideReleased()).toBe(false);
    if (previousPublic === undefined) delete process.env.NEXT_PUBLIC_USMLE_STUDY_GUIDE_PUBLIC;
    else process.env.NEXT_PUBLIC_USMLE_STUDY_GUIDE_PUBLIC = previousPublic;
    if (previousServer === undefined) delete process.env.USMLE_STUDY_GUIDE_PUBLIC;
    else process.env.USMLE_STUDY_GUIDE_PUBLIC = previousServer;
  });

  it("does not turn on the file fallback in production", () => {
    const previousNode = process.env.NODE_ENV;
    const previousFlag = process.env.USMLE_STUDY_GUIDE_FILE_FALLBACK;
    process.env.USMLE_STUDY_GUIDE_FILE_FALLBACK = "1";
    (process.env as { NODE_ENV?: string }).NODE_ENV = "production";
    expect(isUsmleGuideFileFallback()).toBe(false);
    (process.env as { NODE_ENV?: string }).NODE_ENV = "test";
    expect(isUsmleGuideFileFallback()).toBe(true);
    (process.env as { NODE_ENV?: string }).NODE_ENV = previousNode;
    if (previousFlag === undefined) delete process.env.USMLE_STUDY_GUIDE_FILE_FALLBACK;
    else process.env.USMLE_STUDY_GUIDE_FILE_FALLBACK = previousFlag;
  });
});

describe("USMLE study-guide manuscripts", () => {
  it("has 15 to 20 chapters per Step, each with the required sections and a source", () => {
    for (const step of USMLE_STUDY_STEPS) {
      const book = usmleStudyBook(step);
      const dir = path.join(process.cwd(), "content", book.contentDir);
      const files = fs.readdirSync(dir).filter((file) => /^\d{2}-.+\.md$/.test(file)).sort();
      expect(files.length, step).toBeGreaterThanOrEqual(15);
      expect(files.length, step).toBeLessThanOrEqual(20);
      for (const file of files) {
        const text = fs.readFileSync(path.join(dir, file), "utf8");
        for (const heading of REQUIRED) {
          expect(text, `${step}/${file} missing ${heading}`).toContain(heading);
        }
        expect(text, `${step}/${file}`).toMatch(/^Source:/m);
        expect(text.toLowerCase()).not.toContain("pass rate");
        expect(text.toLowerCase()).not.toContain("guaranteed");
        expect(text.toLowerCase()).not.toContain("you will pass");
      }
    }
  });
});
