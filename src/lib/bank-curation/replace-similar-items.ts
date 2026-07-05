/**
 * Find semantic near-duplicates for a field and plan 1:1 retirement (keep highest-scored).
 */
import type { PrismaClient } from "@prisma/client";
import { enrichBankItemFromRow } from "@/lib/mpje/parse-bank-options";
import { scoreNclexBankItem } from "@/lib/engine/polish/nclex-polish";
import { runCurationPipeline, parseCurationCliArgs } from "@/lib/bank-curation/pipeline";
import { countMissingEmbeddings } from "@/lib/bank-curation/pgvector-store";
import { resolveNclexClientNeedsCategory } from "@/lib/exam-prep/nclex/blueprint-quota";
import { CURATION_FIELD_ID } from "@/lib/bank-curation/types";

export type SemanticDedupePlan = {
  fieldId: string;
  clustersAffected: number;
  retireIds: string[];
  retiredByCategory: Record<string, number>;
  clusters: Array<{ clusterId: string; size: number; keptId: string; retiredCount: number }>;
};

type ScoreFn = (row: {
  question: string;
  scenario: string | null;
  options: string;
  correctAnswer: string;
  explanation: string;
  tags: string | null;
  source: string;
}) => number;

type CategoryFn = (subjectId: string) => string;

const defaultNclexScore: ScoreFn = (row) =>
  scoreNclexBankItem(enrichBankItemFromRow(row));

const defaultNclexCategory: CategoryFn = (subjectId) =>
  resolveNclexClientNeedsCategory(subjectId);

export async function ensureNclexEmbeddingsAndClusters(prisma: PrismaClient): Promise<number> {
  const missing = await countMissingEmbeddings(prisma);
  if (missing > 0) {
    console.log(`  embedding ${missing} NCLEX items (may take several minutes)…`);
    await runCurationPipeline(prisma, parseCurationCliArgs(["--embed-only"]));
  }

  console.log("  assigning semantic clusters…");
  await runCurationPipeline(
    prisma,
    parseCurationCliArgs(["--cluster-only", "--skip-embed"])
  );
  return missing;
}

export async function planSemanticDedupe(
  prisma: PrismaClient,
  opts: {
    fieldId: string;
    minClusterSize: number;
    scoreFn?: ScoreFn;
    categoryFn?: CategoryFn;
  }
): Promise<SemanticDedupePlan> {
  const { fieldId, minClusterSize } = opts;
  const scoreFn = opts.scoreFn ?? defaultNclexScore;
  const categoryFn = opts.categoryFn ?? defaultNclexCategory;

  if (fieldId !== CURATION_FIELD_ID) {
    return {
      fieldId,
      clustersAffected: 0,
      retireIds: [],
      retiredByCategory: {},
      clusters: [],
    };
  }

  const rows = await prisma.questionBankItem.findMany({
    where: { fieldId, active: true, clusterId: { not: null } },
    select: {
      id: true,
      clusterId: true,
      subjectId: true,
      source: true,
      question: true,
      scenario: true,
      options: true,
      correctAnswer: true,
      explanation: true,
      tags: true,
    },
  });

  const byCluster = new Map<string, typeof rows>();
  for (const row of rows) {
    const cid = row.clusterId?.trim();
    if (!cid || cid.includes("-solo-")) continue;
    const list = byCluster.get(cid) ?? [];
    list.push(row);
    byCluster.set(cid, list);
  }

  const retireIds: string[] = [];
  const retiredByCategory: Record<string, number> = {};
  const clusters: SemanticDedupePlan["clusters"] = [];

  for (const [clusterId, members] of byCluster) {
    if (members.length < minClusterSize) continue;

    const ranked = [...members].sort((a, b) => scoreFn(b) - scoreFn(a));
    const retire = ranked.slice(1);
    retireIds.push(...retire.map((r) => r.id));
    for (const row of retire) {
      const cat = categoryFn(row.subjectId);
      retiredByCategory[cat] = (retiredByCategory[cat] ?? 0) + 1;
    }
    clusters.push({
      clusterId,
      size: members.length,
      keptId: ranked[0]!.id,
      retiredCount: retire.length,
    });
  }

  clusters.sort((a, b) => b.retiredCount - a.retiredCount);

  return {
    fieldId,
    clustersAffected: clusters.length,
    retireIds,
    retiredByCategory,
    clusters,
  };
}

export async function applyRetirements(
  prisma: PrismaClient,
  ids: string[],
  dryRun: boolean
): Promise<number> {
  if (dryRun || ids.length === 0) return ids.length;
  const BATCH = 500;
  for (let i = 0; i < ids.length; i += BATCH) {
    await prisma.questionBankItem.updateMany({
      where: { id: { in: ids.slice(i, i + BATCH) } },
      data: { active: false, qaPassed: false },
    });
  }
  return ids.length;
}
