import type { RagChunk } from "./types";

const STOP = new Set([
  "the", "a", "an", "and", "or", "of", "to", "in", "for", "on", "with", "is", "are",
  "was", "were", "be", "been", "that", "this", "from", "by", "as", "at", "it", "its",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/\W+/)
    .filter((t) => t.length > 2 && !STOP.has(t));
}

function termFrequency(tokens: string[]): Map<string, number> {
  const tf = new Map<string, number>();
  for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1);
  return tf;
}

/** Lightweight BM25-style keyword scoring without external deps. */
export function scoreKeywordMatch(query: string, chunk: RagChunk): number {
  const qTokens = tokenize(query);
  if (qTokens.length === 0) return 0;

  const docTokens = tokenize(chunk.content);
  const tf = termFrequency(docTokens);
  const docLen = docTokens.length || 1;
  const avgLen = 400;
  const k1 = 1.2;
  const b = 0.75;

  let score = 0;
  const uniqueQ = [...new Set(qTokens)];

  for (const term of uniqueQ) {
    const freq = tf.get(term) ?? 0;
    if (freq === 0) continue;
    const idf = Math.log(1 + 1 / (0.5 + freq));
    const num = freq * (k1 + 1);
    const den = freq + k1 * (1 - b + b * (docLen / avgLen));
    score += idf * (num / den);
  }

  // Boost title/url term overlap
  const titleTokens = tokenize(`${chunk.title} ${chunk.url}`);
  for (const term of uniqueQ) {
    if (titleTokens.includes(term)) score += 0.5;
  }

  return score;
}

export function rankByKeyword(
  query: string,
  chunks: RagChunk[],
  topK: number
): Array<{ chunk: RagChunk; score: number }> {
  return chunks
    .map((chunk) => ({ chunk, score: scoreKeywordMatch(query, chunk) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}
