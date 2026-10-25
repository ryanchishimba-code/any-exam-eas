import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const REPO_ROOT = path.resolve(import.meta.dirname, "../../..");

function collectSvgFiles(dir: string, acc: string[] = []): string[] {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectSvgFiles(full, acc);
    } else if (entry.isFile() && entry.name.endsWith(".svg")) {
      acc.push(full);
    }
  }
  return acc;
}

function repoSvgPaths(): string[] {
  const roots = ["public", "content"].map((rel) => path.join(REPO_ROOT, rel));
  const files = roots.flatMap((root) => collectSvgFiles(root));
  return [...new Set(files)].sort();
}

describe("repository SVG well-formedness", () => {
  const svgFiles = repoSvgPaths();

  it("finds SVG assets under public/ and content/", () => {
    expect(svgFiles.length).toBeGreaterThan(10);
  });

  it.each(svgFiles.map((file) => [path.relative(REPO_ROOT, file), file] as const))(
    "parses %s with xmllint",
    (_rel, absolutePath) => {
      execFileSync("xmllint", ["--noout", absolutePath], { stdio: "pipe" });
      expect(true).toBe(true);
    }
  );
});
