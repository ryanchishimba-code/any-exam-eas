import { cosineSimilarity, embedQuery } from "./embeddings";
import { rankByKeyword } from "./keyword";
import type { RagChunk, RetrievedChunk } from "./types";

export type HybridRetrieveOptions = {
  topK?: number;
  vectorWeight?: number;
  keywordWeight?: number;
};

/**
 * Hybrid retrieval: normalize vector + keyword scores, fuse via weighted sum.
 * Reciprocal-rank fusion alternative used when scores are sparse.
 */
export async function hybridRetrieve(
  query: string,
  chunks: RagChunk[],
  options: HybridRetrieveOptions = {}
): Promise<RetrievedChunk[]> {
  const topK = options.topK ?? 24;
  const vectorWeight = options.vectorWeight ?? 0.65;
  const keywordWeight = options.keywordWeight ?? 0.35;

  if (chunks.length === 0) return [];

  const queryVec = await embedQuery(query);
  const keywordRanked = rankByKeyword(query, chunks, Math.min(chunks.length, topK * 2));

  const keywordScoreMap = new Map(keywordRanked.map((r) => [r.chunk.id, r.score]));
  const maxKw = Math.max(...keywordRanked.map((r) => r.score), 0.001);

  const scored: RetrievedChunk[] = chunks.map((chunk) => {
    const vectorScore = chunk.embedding
      ? cosineSimilarity(queryVec, chunk.embedding)
      : 0;
    const rawKw = keywordScoreMap.get(chunk.id) ?? 0;
    const keywordScore = rawKw / maxKw;
    const hybridScore = vectorWeight * vectorScore + keywordWeight * keywordScore;

    return {
      ...chunk,
      vectorScore,
      keywordScore: rawKw,
      hybridScore,
    };
  });

  scored.sort((a, b) => b.hybridScore - a.hybridScore);
  return scored.slice(0, topK);
}

/** Reciprocal rank fusion for merging multiple query result lists. */
export function reciprocalRankFusion(
  resultLists: RetrievedChunk[][],
  k = 60
): RetrievedChunk[] {
  const scores = new Map<string, { chunk: RetrievedChunk; score: number }>();

  for (const list of resultLists) {
    list.forEach((chunk, rank) => {
      const prev = scores.get(chunk.id);
      const rrf = 1 / (k + rank + 1);
      if (prev) {
        prev.score += rrf;
      } else {
        scores.set(chunk.id, { chunk, score: rrf });
      }
    });
  }

  return [...scores.values()]
    .sort((a, b) => b.score - a.score)
    .map(({ chunk, score }) => ({ ...chunk, hybridScore: score }));
}
