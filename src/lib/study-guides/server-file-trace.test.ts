import { existsSync } from "node:fs";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { PUBLIC_STUDY_GUIDES, USMLE_PUBLIC_STEPS } from "@/lib/study-guides/public-catalog";
import { STUDY_GUIDE_SERVER_FILES } from "@/lib/study-guides/server-file-trace";

function globDir(glob: string): string {
  return glob.replace(/^\.\//, "").replace(/\/\*\*\/\*$/, "");
}

describe("study guide serverless file trace", () => {
  it("copies every manuscript a public guide readdirs on revalidation", () => {
    for (const guide of Object.values(PUBLIC_STUDY_GUIDES)) {
      if (guide.contentDirs.length === 0) {
        expect(STUDY_GUIDE_SERVER_FILES[guide.path], guide.id).toBeUndefined();
        continue;
      }
      const globs = STUDY_GUIDE_SERVER_FILES[guide.path];
      expect(globs, guide.path).toBeTruthy();
      for (const dir of guide.contentDirs) {
        expect(existsSync(dir), dir).toBe(true);
        expect(
          globs!.some((glob) => glob.includes(`${dir}/**`)),
          `${guide.path} ${dir}`
        ).toBe(true);
      }
    }

    const stepGlobs = STUDY_GUIDE_SERVER_FILES["/usmle-study-guide/[step]"];
    expect(stepGlobs).toBeTruthy();
    for (const step of USMLE_PUBLIC_STEPS) {
      expect(existsSync(step.contentDir), step.contentDir).toBe(true);
      expect(stepGlobs!.some((glob) => glob.includes(`${step.contentDir}/**`)), step.path).toBe(
        true
      );
    }
  });

  it("only lists directories that exist, including public figure files", () => {
    for (const [route, globs] of Object.entries(STUDY_GUIDE_SERVER_FILES)) {
      expect(globs.length, route).toBeGreaterThan(0);
      for (const glob of globs) {
        expect(existsSync(globDir(glob)), `${route} ${glob}`).toBe(true);
      }
    }
    expect(
      STUDY_GUIDE_SERVER_FILES["/nclex-study-guide"]?.some((glob) =>
        glob.includes("public/nclex-study-guide/visuals")
      )
    ).toBe(true);
    expect(
      STUDY_GUIDE_SERVER_FILES["/pance-study-guide"]?.some((glob) =>
        glob.includes("public/pance-study-guide/visuals")
      )
    ).toBe(true);
  });

  it("is spread into outputFileTracingIncludes", () => {
    const config = readFileSync("next.config.ts", "utf8");
    expect(config).toContain("...STUDY_GUIDE_SERVER_FILES");
  });

  it("keeps the public manuscripts in the Vercel deploy", () => {
    const ignore = readFileSync(".vercelignore", "utf8");
    const ignored = ignore
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"));
    for (const dir of [
      "content/nclex-study-guide",
      "content/naplex-study-guide",
      "content/pance-study-guide",
      "content/aanp-fnp-study-guide",
      "content/usmle-study-guide",
    ]) {
      expect(ignored, dir).not.toContain(dir);
      expect(ignored, `${dir}/`).not.toContain(`${dir}/`);
    }
  });
});
