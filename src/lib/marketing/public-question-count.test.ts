import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { formatExactQuestionCount, formatRoundedDownQuestionCount } from "@/lib/counts";
import { staticQuestionCountLabel } from "@/lib/marketing/public-question-count";

describe("staticQuestionCountLabel", () => {
  it("floors the live total and never claims more than that total", () => {
    expect(staticQuestionCountLabel(43475)).toBe("43,400+");
    expect(staticQuestionCountLabel(43475)).toBe(formatRoundedDownQuestionCount(43475));
    expect(staticQuestionCountLabel(43338)).toBe("43,300+");
    expect(staticQuestionCountLabel(99)).toBe("99");
    expect(staticQuestionCountLabel(0)).toBe("");
    expect(staticQuestionCountLabel(Number.NaN)).toBe("");

    for (const total of [43475, 43338, 43210, 100]) {
      const label = staticQuestionCountLabel(total);
      const floor = Number(label.replace(/[^0-9]/g, ""));
      expect(floor).toBeLessThanOrEqual(total);
      expect(label.endsWith("+")).toBe(true);
      expect(label).not.toBe(formatExactQuestionCount(total));
    }
  });
});

const MARKETING_COPY_ROOTS = [
  "src/app/(marketing)",
  "src/app/nclex",
  "src/components/marketing",
  "src/components/landing",
  "src/components/home",
  "src/components/pricing",
  "src/components/seo",
  "src/components/compare",
  "src/components/checkout",
  "src/lib/seo",
];

/** A thousands-formatted total written into copy, not a color channel. */
const HARDCODED_TOTAL = /(?<![\d.(])\d{2},\d{3}\+?(?!\d)/;
const STAMP_CALL = /publishedSiteQuestionCounts|PUBLISHED_BOARD_UNITS/;

function walk(dir: string, out: string[] = []): string[] {
  let names: string[];
  try {
    names = readdirSync(dir);
  } catch {
    return out;
  }
  for (const name of names) {
    if (name === "node_modules" || name === ".next") continue;
    const full = path.join(dir, name);
    const stat = statSync(full);
    if (stat.isDirectory()) walk(full, out);
    else if (/\.(tsx|ts|jsx|js)$/.test(name) && !/\.test\./.test(name)) out.push(full);
  }
  return out;
}

describe("marketing copy does not hard-code a question total", () => {
  it("fails when a page or component renders a frozen bank total", () => {
    const hits: string[] = [];
    for (const root of MARKETING_COPY_ROOTS) {
      for (const file of walk(path.resolve(process.cwd(), root))) {
        const text = readFileSync(file, "utf8");
        if (HARDCODED_TOTAL.test(text) || STAMP_CALL.test(text)) {
          hits.push(path.relative(process.cwd(), file));
        }
      }
    }
    expect(hits).toEqual([]);
  });
});
