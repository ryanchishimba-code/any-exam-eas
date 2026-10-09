import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { planBankWrite, shouldSkipHandCorrected } from "@/lib/questions/manual-correction";

const ROOT = path.resolve(__dirname, "../../..");

const ENRICH_SCRIPTS = [
  "scripts/enrich-nclex-visual-rationales.ts",
  "scripts/enrich-bank-guidelines.ts",
  "scripts/enrich-naplex-rationales.ts",
  "scripts/enrich-aanp-fnp-visual-rationales.ts",
  "scripts/enrich-bank-rationales.ts",
  "scripts/enrich-board-expert-rationales.ts",
  "scripts/enrich-nclex-expert-rationales.ts",
  "scripts/enrich-usmle-visual-rationales.ts",
];

const GENERATION_INSERTS = [
  "src/lib/exam-prep/nclex/bank-insert.ts",
  "src/lib/exam-prep/usmle/bank-insert.ts",
  "src/lib/exam-prep/naplex/bank-insert.ts",
  "src/lib/exam-prep/pance/bank-insert.ts",
  "src/lib/exam-prep/npte-pt/bank-insert.ts",
];

describe("manual correction writes", () => {
  it("creates a new row and skips a hand-fixed row without updating it", () => {
    expect(planBankWrite(null)).toBe("create");
    expect(planBankWrite(undefined)).toBe("create");
    expect(planBankWrite({ manualCorrection: false })).toBe("skip-existing");
    expect(planBankWrite({ manualCorrection: true })).toBe("skip-hand-corrected");
    expect(shouldSkipHandCorrected({ manualCorrection: true })).toBe(true);
    expect(shouldSkipHandCorrected({ manualCorrection: false })).toBe(false);
  });

  it("keeps enrich and generation scripts from selecting hand-fixed rows", () => {
    for (const file of ENRICH_SCRIPTS) {
      const source = readFileSync(path.join(ROOT, file), "utf8");
      expect(source, file).toContain("manualCorrection: false");
      expect(source, file).toContain("shouldSkipHandCorrected");
    }
    for (const file of GENERATION_INSERTS) {
      const source = readFileSync(path.join(ROOT, file), "utf8");
      expect(source, file).toContain("planBankWrite");
    }
  });
});
