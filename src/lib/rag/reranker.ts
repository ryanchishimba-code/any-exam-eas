import { getOpenAiClient } from "@/lib/openai-client";
import type { RetrievedChunk } from "./types";

const openai = getOpenAiClient("rag");

/**
 * LLM-based reranking (cross-encoder surrogate) — scores relevance 0–10 per chunk.
 */
export async function rerankChunks(
  query: string,
  chunks: RetrievedChunk[],
  topK = 12
): Promise<RetrievedChunk[]> {
  if (chunks.length === 0) return [];
  if (chunks.length <= topK && !openai) return chunks.slice(0, topK);

  if (!openai) {
    return chunks.slice(0, topK).map((c) => ({ ...c, rerankScore: c.hybridScore }));
  }

  const candidates = chunks.slice(0, Math.min(chunks.length, 20));
  const listing = candidates
    .map((c, i) => `[${i}] ${c.title}\n${c.content.slice(0, 400)}`)
    .join("\n\n");

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0,
    max_tokens: 500,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "Score each passage 0-10 for relevance to generating board-style exam questions on the query topic. Return JSON: { scores: [{ index: number, score: number }] }",
      },
      {
        role: "user",
        content: `Query: ${query}\n\nPassages:\n${listing}`,
      },
    ],
  });

  let scores: Array<{ index: number; score: number }> = [];
  try {
    const parsed = JSON.parse(completion.choices[0]?.message?.content ?? "{}") as {
      scores?: Array<{ index: number; score: number }>;
    };
    scores = parsed.scores ?? [];
  } catch {
    return candidates.slice(0, topK);
  }

  const scoreMap = new Map(scores.map((s) => [s.index, s.score]));
  const reranked = candidates.map((c, i) => ({
    ...c,
    rerankScore: scoreMap.get(i) ?? c.hybridScore * 10,
  }));

  reranked.sort((a, b) => (b.rerankScore ?? 0) - (a.rerankScore ?? 0));
  return reranked.slice(0, topK);
}
