import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const QUOTAS: Record<string, number> = {
  "management-of-care": 17,
  "safety-infection": 11,
  "health-promotion": 7,
  psychosocial: 8,
  "basic-care-comfort": 7,
  "pharmacology-nursing": 14,
  "reduction-risk": 9,
  "physiological-adaptation": 12,
};

const applySql = readFileSync(
  resolve(process.cwd(), "scripts/nclex-relink-20261128/02-apply.sql"),
  "utf8"
);

function links(sql: string) {
  return [...sql.matchAll(/\('([^']+)', '([^']+)', (\d+), '([^']+)', 'mcq'\)/g)].map((match) => ({
    examId: match[1]!,
    questionId: match[2]!,
    sortOrder: Number(match[3]),
    category: match[4]!,
  }));
}

describe("NCLEX 85-item relink", () => {
  const rows = links(applySql);

  it("gives every active form 85 unique items and shares none across forms", () => {
    expect(rows).toHaveLength(43 * 85);
    const byExam = new Map<string, typeof rows>();
    const seen = new Set<string>();
    for (const row of rows) {
      expect(seen.has(row.questionId)).toBe(false);
      seen.add(row.questionId);
      const list = byExam.get(row.examId) ?? [];
      list.push(row);
      byExam.set(row.examId, list);
    }
    expect(byExam.size).toBe(43);
    for (const list of byExam.values()) {
      expect(list).toHaveLength(85);
      expect(new Set(list.map((row) => row.sortOrder)).size).toBe(85);
      expect(Math.min(...list.map((row) => row.sortOrder))).toBe(0);
      expect(Math.max(...list.map((row) => row.sortOrder))).toBe(84);
      const counts: Record<string, number> = {};
      for (const row of list) counts[row.category] = (counts[row.category] ?? 0) + 1;
      expect(counts).toEqual(QUOTAS);
    }
  });

  it("keeps an undo and a rolled-back dry run next to the apply script", () => {
    const undo = readFileSync(
      resolve(process.cwd(), "scripts/nclex-relink-20261128/03-undo.sql"),
      "utf8"
    );
    const dryRun = readFileSync(
      resolve(process.cwd(), "scripts/nclex-relink-20261128/02-dryrun.sql"),
      "utf8"
    );
    expect(undo).toContain("nclex_exam_question_backup_20261128");
    expect(undo).toContain("COMMIT;");
    expect(dryRun.trimEnd().endsWith("ROLLBACK;")).toBe(true);
    expect(dryRun).not.toContain("\nCOMMIT;");
    expect(links(dryRun)).toEqual(rows);
  });
});
