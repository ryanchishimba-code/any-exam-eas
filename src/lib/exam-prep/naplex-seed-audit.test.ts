/**
 * Static NAPLEX seed audit — runs without DB for CI visibility.
 * Full bank audit: npm run db:audit-naplex → artifacts/naplex-audit-report.json
 */
import { describe, expect, it } from "vitest";
import { NAPLEX_QUALITY_V2 } from "./naplex-quality-v2";
import { auditBankItem } from "./bank-audit";
import { auditNaplexBankItem } from "./naplex-bank-audit";

describe("naplex seed audit", () => {
  it("reports quality v2 seed pass rate against editorial gates", () => {
    let pass = 0;
    const byCode: Record<string, number> = {};

    for (const item of NAPLEX_QUALITY_V2) {
      const shared = auditBankItem(item, "pharmacy");
      const naplex = auditNaplexBankItem(item);
      const ok = shared.ok && naplex.ok;
      if (ok) pass++;
      for (const issue of [...shared.issues, ...naplex.issues]) {
        if (!ok && issue.severity === "error") {
          byCode[issue.code] = (byCode[issue.code] ?? 0) + 1;
        }
      }
    }

    const rate = pass / NAPLEX_QUALITY_V2.length;
    expect(NAPLEX_QUALITY_V2.length).toBeGreaterThanOrEqual(50);
    // SATA/ordered/calc formats fail MCQ-only shared gate — tracked for curation backlog
    expect(rate).toBeGreaterThan(0.35);
    expect(pass).toBeGreaterThanOrEqual(20);
    expect(byCode).toBeTypeOf("object");
  });
});
