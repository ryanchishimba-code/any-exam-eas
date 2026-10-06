/**
 * Read-only sitting metrics. Prints JSON. Does not update question rows.
 *
 *   DATABASE_URL=... npx tsx scripts/measure-sitting-pools.ts
 */
import { prisma } from "../src/lib/prisma";
import { studentEligibleAndSql } from "../src/lib/exam-prep/student-eligibility-sql";
import { assignSittingClusters, questionFrame, scenarioKeys } from "../src/lib/exam-prep/sitting-clusters";
import { finalizeAssembledSitting } from "../src/lib/exam-prep/sitting-selection";
import { clusterDupRate } from "../src/lib/exam-prep/sitting-simulation";
import { loadPublishedClinicalExamItems } from "../src/lib/full-exam/published-clinical-exam-load";
import { isPublishedClinicalBankItem } from "../src/lib/full-exam/published-clinical-exam";
import type { BankItem } from "../src/lib/question-bank";

const SESSIONS = ["cmuw0wplof3c5ions", "cmuw0sqdcbx2z0nq8"] as const;

type Row = {
  id: string;
  question: string;
  scenario: string | null;
  clusterId: string | null;
  itemType: string | null;
};

function bankItem(row: Row): BankItem {
  return {
    id: row.id,
    question: row.question,
    scenario: row.scenario,
    vignette: row.scenario,
    options: ["A", "B", "C", "D"],
    correctAnswer: "A",
    explanation: "Measured for cluster shape only.",
    clusterId: row.clusterId,
    itemType: row.itemType ?? "vignette",
  };
}

function frameCounts(items: readonly BankItem[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of items) {
    const frame = questionFrame(item.question ?? "");
    counts[frame] = (counts[frame] ?? 0) + 1;
  }
  return counts;
}

function familyDupRate(items: readonly BankItem[]): number {
  if (items.length === 0) return 0;
  const counts = new Map<string, number>();
  for (const item of items) {
    const id = item.clusterId?.trim() || item.id || "row";
    counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  let extras = 0;
  for (const count of counts.values()) {
    if (count > 1) extras += count - 1;
  }
  return extras / items.length;
}

function topClusters(
  items: readonly BankItem[],
  clusters: readonly string[]
): Array<{ size: number; key: string; sample: string }> {
  const groups = new Map<string, BankItem[]>();
  items.forEach((item, index) => {
    const id = clusters[index]!;
    const list = groups.get(id) ?? [];
    list.push(item);
    groups.set(id, list);
  });
  return [...groups.values()]
    .filter((group) => group.length > 1)
    .sort((a, b) => b.length - a.length)
    .slice(0, 8)
    .map((group) => {
      const counts = new Map<string, number>();
      for (const item of group) {
        for (const key of scenarioKeys(item)) {
          if (key.startsWith("copy:")) continue;
          counts.set(key, (counts.get(key) ?? 0) + 1);
        }
      }
      const key = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "copy";
      return {
        size: group.length,
        key,
        sample: (group[0]?.scenario || group[0]?.question || "").replace(/\s+/g, " ").slice(0, 110),
      };
    });
}

async function loadPool(fieldId: string): Promise<BankItem[]> {
  const rows = (await prisma.$queryRawUnsafe(
    `
    SELECT id, question, scenario, cluster_id AS "clusterId", "itemType"
    FROM "QuestionBankItem"
    WHERE active = true
      AND "qaPassed" = true
      AND "fieldId" = $1
      ${studentEligibleAndSql()}
    ORDER BY id
    `,
    fieldId
  )) as Row[];
  return rows.map(bankItem);
}

function shuffle<T>(items: readonly T[], seed: number): T[] {
  let state = seed >>> 0;
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const j = state % (i + 1);
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

async function liveSessions() {
  const rows = await prisma.examSession.findMany({
    where: { id: { in: [...SESSIONS] } },
    select: { id: true, examType: true, fieldId: true, questionCount: true, analysis: true },
  });
  const reports = [];
  for (const row of rows) {
    const analysis = row.analysis && typeof row.analysis === "object" ? (row.analysis as Record<string, unknown>) : {};
    const ids = Array.isArray(analysis.questionIds) ? analysis.questionIds.map(String).filter(Boolean) : [];
    let items: BankItem[] = [];
    if (ids.length) {
      const found = (await prisma.$queryRawUnsafe(
        `
        SELECT id, question, scenario, cluster_id AS "clusterId", "itemType"
        FROM "QuestionBankItem"
        WHERE id = ANY($1::text[])
        `,
        ids
      )) as Row[];
      const byId = new Map(found.map((item) => [item.id, bankItem(item)]));
      items = ids.map((id) => byId.get(id)).filter((item): item is BankItem => Boolean(item));
    }
    const clusters = items.length ? assignSittingClusters(items) : [];
    reports.push({
      id: row.id,
      examType: row.examType,
      fieldId: row.fieldId,
      questionCount: row.questionCount,
      served: items.length,
      ids: ids.length,
      contentDupRate: items.length ? clusterDupRate(items) : null,
      first30DupRate: items.length ? clusterDupRate(items.slice(0, 30)) : null,
      storedFamilyDupRate: items.length ? familyDupRate(items) : null,
      frames: frameCounts(items),
      repeatedClusters: topClusters(items, clusters),
    });
  }
  return reports;
}

async function measureField(fieldId: string, limit: number, sprint: number) {
  const classic = await loadPool(fieldId);
  const clinical = fieldId === "nursing" ? await loadPublishedClinicalExamItems(fieldId) : [];
  const pool = [...classic, ...clinical];
  const clusters = assignSittingClusters(classic);
  const unique = new Set(clusters).size;
  const assembled = finalizeAssembledSitting({
    pool,
    limit,
    fieldId,
    seed: 42,
    includeNgn: fieldId === "nursing",
  });
  const short = finalizeAssembledSitting({
    pool,
    limit: 30,
    fieldId,
    seed: 42,
    includeNgn: fieldId === "nursing",
  });
  const sprintPool = shuffle(classic, 11).slice(0, sprint);
  const sprintAssembled = finalizeAssembledSitting({
    pool: [...sprintPool, ...clinical],
    limit,
    fieldId,
    seed: 42,
    includeNgn: fieldId === "nursing",
  });
  return {
    fieldId,
    eligible: classic.length,
    publishedClinical: clinical.length,
    uniqueScenarioClusters: unique,
    fillsExamWithoutRepeats: unique + clinical.length >= limit,
    bankContentDupRate: clusterDupRate(classic),
    storedFamilyDupRate: familyDupRate(classic),
    largestClusters: topClusters(classic, clusters),
    assembled: {
      count: assembled.items.length,
      relaxed: assembled.relaxed,
      contentDupRate: clusterDupRate(assembled.items),
      frames: frameCounts(assembled.items),
      clinical: assembled.items.filter((item) => isPublishedClinicalBankItem(item)).length,
    },
    first30: {
      count: short.items.length,
      relaxed: short.relaxed,
      contentDupRate: clusterDupRate(short.items),
      frames: frameCounts(short.items),
      clinical: short.items.filter((item) => isPublishedClinicalBankItem(item)).length,
    },
    sprintSample: {
      pulled: sprintPool.length,
      uniqueClusters: new Set(assignSittingClusters(sprintPool)).size,
      assembled: sprintAssembled.items.length,
      relaxed: sprintAssembled.relaxed,
      contentDupRate: clusterDupRate(sprintAssembled.items),
      clinical: sprintAssembled.items.filter((item) => isPublishedClinicalBankItem(item)).length,
    },
  };
}

async function main() {
  const live = await liveSessions();
  const nursing = await measureField("nursing", 150, 330);
  const pharmacy = await measureField("pharmacy", 225, 360);
  console.log(JSON.stringify({ live, nursing, pharmacy }, null, 2));
  await prisma.$disconnect();
}

main().catch(async (error) => {
  console.error(error instanceof Error ? error.message : error);
  await prisma.$disconnect();
  process.exitCode = 1;
});
