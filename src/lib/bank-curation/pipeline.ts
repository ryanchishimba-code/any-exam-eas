import type { PrismaClient } from "@prisma/client";
import { randomUUID } from "node:crypto";
import {
  assignClusterIds,
  averagePairwiseSimilarity,
  buildClustersFromPairs,
  dedupePairs,
} from "./similarity-clusters";
import {
  allocateToTarget,
  buildCategoryBalance,
  pickClusterKeepers,
  selectKeepersFromClusters,
  type ScoredItem,
} from "./cluster-selection";
import {
  countMissingEmbeddings,
  embedQuestionsBatch,
  ensureEmbeddingIndex,
  ensurePgVectorExtension,
  findSimilarNeighbors,
  loadCurationQuestions,
} from "./pgvector-store";
import { scoreQuestion, scoreQuestionSync } from "./quality-scorer";
import { writeCurationReport } from "./report";
import {
  CURATION_FIELD_ID,
  DEFAULT_CURATION_TARGET,
  SIMILARITY_THRESHOLD,
  type CurationCluster,
  type CurationPipelineOptions,
  type CurationReport,
  type SimilarPair,
} from "./types";

const EMBED_BATCH = 100;

export async function runCurationPipeline(
  prisma: PrismaClient,
  opts: CurationPipelineOptions
): Promise<CurationReport> {
  const runId = randomUUID().slice(0, 8);
  const startedAt = new Date().toISOString();

  await ensurePgVectorExtension(prisma);

  const allQuestions = await loadCurationQuestions(prisma, {
    limit: opts.limit > 0 ? opts.limit : undefined,
  });
  const inputCount = allQuestions.length;

  let embeddedCount = inputCount - (await countMissingEmbeddings(prisma));

  if (!opts.skipEmbed && (opts.embedOnly || !opts.clusterOnly)) {
    let remaining = await countMissingEmbeddings(prisma);
    while (remaining > 0) {
      const batch = await loadCurationQuestions(prisma, {
        missingEmbeddingsOnly: true,
        limit: opts.limit > 0 ? Math.min(EMBED_BATCH, opts.limit) : EMBED_BATCH,
      });
      if (!batch.length) break;
      await embedQuestionsBatch(prisma, batch, (done, total) => {
        if (done === total || done % 25 === 0) {
          console.log(`  embedded batch progress ${done}/${total}`);
        }
      });
      remaining = await countMissingEmbeddings(prisma);
      if (opts.limit > 0) break;
    }
    embeddedCount = inputCount - (await countMissingEmbeddings(prisma));
    await ensureEmbeddingIndex(prisma);
    if (opts.embedOnly) {
      return finishEarly(runId, startedAt, inputCount, embeddedCount, opts);
    }
  }

  const questions = await loadCurationQuestions(prisma, {
    limit: opts.limit > 0 ? opts.limit : undefined,
  });

  const pairs: SimilarPair[] = [];
  console.log(`\nFinding similar pairs (threshold ${opts.similarityThreshold})…`);
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i]!;
    if (!q.hasEmbedding && !opts.skipEmbed) continue;
    const neighbors = await findSimilarNeighbors(prisma, q.id, {
      limit: opts.neighborsPerItem,
      minSimilarity: opts.similarityThreshold,
    });
    for (const n of neighbors) {
      pairs.push({ a: q.id, b: n.id, similarity: n.similarity });
    }
    if ((i + 1) % 200 === 0) console.log(`  scanned ${i + 1}/${questions.length}`);
  }
  const uniquePairs = dedupePairs(pairs);

  const groups = buildClustersFromPairs(
    questions.map((q) => q.id),
    uniquePairs
  );
  const idToCluster = assignClusterIds(groups);

  if (opts.clusterOnly) {
    for (const [id, clusterId] of idToCluster) {
      await prisma.questionBankItem.update({
        where: { id },
        data: { clusterId },
      });
    }
    return finishEarly(runId, startedAt, inputCount, embeddedCount, opts, groups.size);
  }

  console.log(`\nScoring ${questions.length} questions…`);
  const scored: ScoredItem[] = [];
  for (let i = 0; i < questions.length; i++) {
    const row = questions[i]!;
    const quality = opts.useLlm
      ? await scoreQuestion(row, { useLlm: true })
      : scoreQuestionSync(row);
    scored.push({
      id: row.id,
      subjectId: row.subjectId,
      blueprintTopic: row.blueprintTopic,
      clusterId: idToCluster.get(row.id) ?? `nclex-c-solo-${row.id.slice(0, 6)}`,
      quality,
    });
    if ((i + 1) % 250 === 0) console.log(`  scored ${i + 1}/${questions.length}`);
  }

  if (opts.scoreOnly) {
    if (!opts.dryRun) await persistScores(prisma, scored, runId);
    return finishEarly(runId, startedAt, inputCount, embeddedCount, opts, groups.size);
  }

  const clusterMap = new Map<string, ScoredItem[]>();
  for (const item of scored) {
    const list = clusterMap.get(item.clusterId) ?? [];
    list.push(item);
    clusterMap.set(item.clusterId, list);
  }

  const clusterDecisions = selectKeepersFromClusters(clusterMap);
  const preBalanceCandidates = scored.filter((item) => {
    const d = clusterDecisions.get(item.id);
    return d?.keep || d?.review;
  });

  const { kept, dropped } = allocateToTarget(
    preBalanceCandidates.filter((item) => clusterDecisions.get(item.id)?.keep),
    opts.target
  );
  const keptIds = new Set(kept.map((i) => i.id));

  const curationClusters: CurationCluster[] = [];
  for (const [clusterId, members] of clusterMap) {
    if (members.length < 2) continue;
    const recommendedKeepIds = pickClusterKeepers(members).filter((id) => keptIds.has(id));
    curationClusters.push({
      clusterId,
      memberIds: members.map((m) => m.id),
      avgSimilarity: averagePairwiseSimilarity(
        members.map((m) => m.id),
        uniquePairs
      ),
      recommendedKeepIds,
      droppedIds: members.map((m) => m.id).filter((id) => !keptIds.has(id)),
    });
  }

  const finalDecisions = new Map<string, { keep: boolean; review: boolean }>();
  for (const item of scored) {
    const inReview = clusterDecisions.get(item.id)?.review && !keptIds.has(item.id);
    finalDecisions.set(item.id, {
      keep: keptIds.has(item.id),
      review: inReview ?? false,
    });
  }

  if (!opts.dryRun) {
    await persistCurationResults(prisma, scored, finalDecisions, runId);
  } else {
    console.log("  dry-run: skipping curation metadata persist to DB");
  }

  if (opts.apply && !opts.dryRun) {
    await applyCuration(prisma, keptIds);
  }

  const report: CurationReport = {
    runId,
    startedAt,
    completedAt: new Date().toISOString(),
    fieldId: CURATION_FIELD_ID,
    targetCount: opts.target,
    inputCount,
    embeddedCount,
    clusterCount: groups.size,
    duplicateClusters: curationClusters.length,
    recommendedKeep: kept.length,
    recommendedReview: [...finalDecisions.values()].filter((d) => d.review).length,
    recommendedDrop: scored.length - kept.length,
    applied: opts.apply && !opts.dryRun,
    categoryBalance: buildCategoryBalance(scored, kept, opts.target),
    topDuplicateTopics: summarizeTopics(curationClusters),
    sampleClusters: curationClusters
      .filter((c) => c.memberIds.length >= 3)
      .sort((a, b) => b.memberIds.length - a.memberIds.length)
      .slice(0, 12),
  };

  const path = writeCurationReport(report);
  console.log(`\nReport written to ${path}`);
  return report;
}

function summarizeTopics(clusters: CurationCluster[]) {
  const topicCounts = new Map<string, { clusters: number; removed: number }>();
  for (const c of clusters) {
    const key = c.clusterId;
    const entry = topicCounts.get(key) ?? { clusters: 0, removed: 0 };
    entry.clusters++;
    entry.removed += c.droppedIds.length;
    topicCounts.set(key, entry);
  }
  return [...topicCounts.entries()]
    .map(([topic, v]) => ({ topic, clusterCount: v.clusters, removedCount: v.removed }))
    .sort((a, b) => b.removedCount - a.removedCount)
    .slice(0, 15);
}

async function persistScores(prisma: PrismaClient, scored: ScoredItem[], runId: string) {
  for (const item of scored) {
    await prisma.questionBankItem.update({
      where: { id: item.id },
      data: {
        qualityScore: item.quality.composite,
        clusterId: item.clusterId,
        curationMeta: { runId, quality: item.quality },
      },
    });
  }
}

async function persistCurationResults(
  prisma: PrismaClient,
  scored: ScoredItem[],
  decisions: Map<string, { keep: boolean; review: boolean }>,
  runId: string
) {
  for (const item of scored) {
    const d = decisions.get(item.id)!;
    await prisma.questionBankItem.update({
      where: { id: item.id },
      data: {
        qualityScore: item.quality.composite,
        clusterId: item.clusterId,
        keepRecommendation: d.keep,
        reviewFlag: d.review,
        curationMeta: { runId, quality: item.quality, decision: d },
      },
    });
  }
}

async function applyCuration(prisma: PrismaClient, keptIds: Set<string>) {
  const BATCH = 500;
  let cursor: string | undefined;
  let retired = 0;

  while (true) {
    const rows = await prisma.questionBankItem.findMany({
      where: {
        fieldId: CURATION_FIELD_ID,
        active: true,
        ...(cursor ? { id: { gt: cursor } } : {}),
      },
      orderBy: { id: "asc" },
      take: BATCH,
      select: { id: true },
    });
    if (!rows.length) break;

    const toRetire = rows.filter((r) => !keptIds.has(r.id)).map((r) => r.id);
    if (toRetire.length) {
      await prisma.questionBankItem.updateMany({
        where: { id: { in: toRetire } },
        data: { active: false, qaPassed: false },
      });
      retired += toRetire.length;
    }
    cursor = rows[rows.length - 1]!.id;
  }
  console.log(`Retired ${retired} questions (kept ${keptIds.size})`);
}

function finishEarly(
  runId: string,
  startedAt: string,
  inputCount: number,
  embeddedCount: number,
  opts: CurationPipelineOptions,
  clusterCount = 0
): CurationReport {
  return {
    runId,
    startedAt,
    completedAt: new Date().toISOString(),
    fieldId: CURATION_FIELD_ID,
    targetCount: opts.target,
    inputCount,
    embeddedCount,
    clusterCount,
    duplicateClusters: 0,
    recommendedKeep: 0,
    recommendedReview: 0,
    recommendedDrop: 0,
    applied: false,
    categoryBalance: [],
    topDuplicateTopics: [],
    sampleClusters: [],
  };
}

export function parseCurationCliArgs(argv: string[]): CurationPipelineOptions {
  const opts: CurationPipelineOptions = {
    target: DEFAULT_CURATION_TARGET,
    dryRun: true,
    apply: false,
    embedOnly: false,
    clusterOnly: false,
    scoreOnly: false,
    useLlm: false,
    limit: 0,
    similarityThreshold: SIMILARITY_THRESHOLD,
    neighborsPerItem: 25,
    llmBatchSize: 5,
    skipEmbed: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--dry-run") opts.dryRun = true;
    else if (arg === "--apply") {
      opts.apply = true;
      opts.dryRun = false;
    } else if (arg === "--embed-only") opts.embedOnly = true;
    else if (arg === "--cluster-only") opts.clusterOnly = true;
    else if (arg === "--score-only") opts.scoreOnly = true;
    else if (arg === "--llm") opts.useLlm = true;
    else if (arg === "--skip-embed") opts.skipEmbed = true;
    else if (arg === "--target" && argv[i + 1]) opts.target = Number.parseInt(argv[++i]!, 10);
    else if (arg === "--limit" && argv[i + 1]) opts.limit = Number.parseInt(argv[++i]!, 10);
    else if (arg === "--threshold" && argv[i + 1]) opts.similarityThreshold = Number.parseFloat(argv[++i]!);
  }
  return opts;
}
