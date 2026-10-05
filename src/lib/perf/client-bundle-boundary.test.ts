import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

function source(relativePath: string): string {
  return readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

describe("client practice bundles do not import the Neon driver", () => {
  it("keeps format helpers and API mapping off the database modules", () => {
    const serve = source("src/lib/assessment/serve.ts");
    expect(serve).not.toContain("@/lib/inventory/active-questions");
    expect(serve).toContain("@/lib/inventory/question-format");

    const bank = source("src/lib/question-bank-db.ts");
    expect(bank).not.toContain("@/lib/inventory/active-questions");
    expect(bank).toContain("@/lib/inventory/question-format");

    const simulator = source("src/components/exam/FullExamSimulator.tsx");
    expect(simulator).not.toContain("finalize-exam-session");
    expect(simulator).toContain("@/lib/questions/map-api-questions");

    const proposed = source("prisma/proposed/20261005_dashboard_question_bank_indexes.sql");
    expect(proposed).toContain("CREATE INDEX CONCURRENTLY");
    expect(proposed).toContain("PROPOSED ONLY");
    const migrations = source("prisma/migrations/20260909000000_perf_hot_path_indexes/migration.sql");
    expect(migrations).not.toContain("QuestionAttempt_userId_fieldId_createdAt_correct_idx");
  });
});
