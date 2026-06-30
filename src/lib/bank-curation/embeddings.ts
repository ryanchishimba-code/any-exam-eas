import { getOpenAiClient } from "@/lib/openai-client";

export const CURATION_EMBEDDING_MODEL = "text-embedding-3-large";
export const CURATION_EMBEDDING_DIM = 3072;
const BATCH_SIZE = 64;

/** Batch embed texts with text-embedding-3-large (curation purpose). */
export async function embedCurationTexts(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];

  const openai = getOpenAiClient("curation") ?? getOpenAiClient("rag");
  if (!openai) {
    throw new Error(
      "OpenAI client unavailable — set OPENAI_API_KEY and allow curation or rag purpose."
    );
  }

  const vectors: number[][] = [];
  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE).map((t) => t.slice(0, 8000));
    const res = await openai.embeddings.create({
      model: CURATION_EMBEDDING_MODEL,
      input: batch,
      dimensions: CURATION_EMBEDDING_DIM,
    });
    const sorted = [...res.data].sort((a, b) => a.index - b.index);
    for (const item of sorted) {
      vectors.push(item.embedding);
    }
  }
  return vectors;
}

/** Serialize vector for pgvector literal: '[0.1,0.2,...]' */
export function vectorToPgLiteral(vec: number[]): string {
  return `[${vec.map((v) => (Number.isFinite(v) ? v : 0).toFixed(8)).join(",")}]`;
}
