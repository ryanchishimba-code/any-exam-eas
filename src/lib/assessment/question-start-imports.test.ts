import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

function source(rel: string): string {
  return readFileSync(path.join(process.cwd(), rel), "utf8");
}

describe("question start stays off the generator and geometry graphs", () => {
  it("samples questions without importing the bank generator", () => {
    const route = source("src/app/api/questions/route.ts");
    expect(route).not.toContain("@/lib/bulk-question-generator");
    expect(route).not.toContain("@/lib/sync-question-bank");
    expect(route).toContain("@/lib/question-bank/min-per-subject");
    expect(route).toContain("@/lib/question-bank-sync-meta");
    expect(route).toContain("metaPromise");
    expect(route).toContain("@/lib/exam-prep/compose/blueprint-timed-fields");
    expect(route).not.toContain("compose-timed-exam-session");
    expect(route).toContain("@/lib/questions/exam-sample-count");
  });

  it("reads field topics from the light catalog", () => {
    const fields = source("src/lib/field-subjects.ts");
    expect(fields).not.toContain("./subjects/registry");
    expect(fields).toContain("./subjects/subject-catalog");
  });

  it("caches the published clinical bank on the inventory tag", () => {
    const serve = source("src/lib/assessment/serve-db.ts");
    expect(serve).not.toContain("@/lib/subjects/registry");
    expect(serve).toContain("@/lib/subjects/subject-catalog");
    expect(serve).toContain("published-clinical-bank-v1");
    expect(serve).toContain("ACTIVE_INVENTORY_CACHE_TAG");
  });

  it("builds study-link bone lists without the three.js instance module", () => {
    const structures = source("src/lib/anatomy/bones/structures.ts");
    expect(structures).not.toContain("./instances");
    expect(structures).toContain("./bone-identity");
    const practice = source("src/lib/exam-prep/naplex/topic-practice.ts");
    expect(practice).not.toContain("./calc-topic-qa");
    expect(practice).toContain("./naplex-calc-match");
    const match = source("src/lib/exam-prep/naplex/topic-blueprint-match.ts");
    expect(match).not.toContain("./calc-topic-qa");
    expect(match).toContain("./naplex-calc-match");
    const topicBank = source("src/lib/exam-prep/topic-bank-practice.ts");
    expect(topicBank).not.toContain("calc-topic-qa");
    expect(topicBank).toContain("naplex-calc-match");
    const stem = source("src/lib/exam-prep/naplex-stem-coherence.ts");
    expect(stem).not.toContain("high-yield-index");
    const bridge = source("src/lib/exam-prep/usmle-bank-bridge.ts");
    expect(bridge).not.toContain("usmle-clinical-gate");
    expect(bridge).toContain("usmle-bank-split");
  });
});
