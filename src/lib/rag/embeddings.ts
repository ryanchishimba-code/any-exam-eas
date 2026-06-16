import { getOpenAiClient } from "@/lib/openai-client";
import type { RagChunk } from "./types";

const openai = getOpenAiClient("rag");

const EMBEDDING_MODEL = "text-embedding-3-small";
const BATCH_SIZE = 32;

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb);
  return denom === 0 ? 0 : dot / denom;
}

export async function embedTexts(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];
  if (!openai) {
    return texts.map((t) => pseudoEmbed(t));
  }

  const vectors: number[][] = [];
  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);
    const res = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: batch,
    });
    for (const item of res.data) {
      vectors.push(item.embedding);
    }
  }
  return vectors;
}

export async function embedQuery(query: string): Promise<number[]> {
  const [vec] = await embedTexts([query]);
  return vec ?? pseudoEmbed(query);
}

export async function embedChunks(chunks: RagChunk[]): Promise<RagChunk[]> {
  if (chunks.length === 0) return [];
  const vectors = await embedTexts(chunks.map((c) => c.content));
  return chunks.map((c, i) => ({ ...c, embedding: vectors[i] }));
}

/** Deterministic fallback when OpenAI unavailable — keyword-hash vector. */
function pseudoEmbed(text: string): number[] {
  const dim = 64;
  const vec = new Array(dim).fill(0);
  const tokens = text.toLowerCase().split(/\W+/).filter((t) => t.length > 2);
  for (const tok of tokens) {
    let h = 0;
    for (let i = 0; i < tok.length; i++) h = (h * 31 + tok.charCodeAt(i)) | 0;
    const idx = Math.abs(h) % dim;
    vec[idx] += 1;
  }
  const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0)) || 1;
  return vec.map((v) => v / norm);
}
