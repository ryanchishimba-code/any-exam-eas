import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("PANCE feed is not a public listing", () => {
  it("stays out of the sitemap and is disallowed for crawlers", () => {
    const root = process.cwd();
    const sitemap = fs.readFileSync(path.join(root, "src/app/sitemap.ts"), "utf8");
    const robots = fs.readFileSync(path.join(root, "src/app/robots.ts"), "utf8");
    expect(sitemap).not.toContain("/study-tools/pance/feed");
    expect(robots).toContain("/study-tools/");
    expect(fs.existsSync(path.join(root, "public", "pance-feed"))).toBe(false);
  });
});
