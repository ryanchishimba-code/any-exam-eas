import type { PrismaClient } from "@prisma/client";
import { buildEmbeddingText } from "./embedding-text";
import { embedCurationTexts, vectorToPgLiteral } from "./embeddings";
import { CURATION_FIELD_ID, type CurationQuestionRow } from "./types";

type RawRow = {
  id: string;
  subjectId: string;
  topicCategory: string | null;
  blueprintTopic: string | null;
  question: string;
  scenario: string | null;
  options: string;
  correctAnswer: string;
  explanation: string;
  source: string;
  tags: string | null;
  hasEmbedding: boolean;
};

export function mapRow(row: RawRow): CurationQuestionRow {
  return {
    id: row.id,
    subjectId: row.subjectId,
    topicCategory: row.topicCategory,
    blueprintTopic: row.blueprintTopic,
    question: row.question,
    scenario: row.scenario,
    options: row.options,
    correctAnswer: row.correctAnswer,
    explanation: row.explanation,
    source: row.source,
    tags: row.tags,
    hasEmbedding: row.hasEmbedding,
  };
}

export async function ensurePgVectorExtension(prisma: PrismaClient): Promise<void> {
  await prisma.$executeRawUnsafe(`CREATE EXTENSION IF NOT EXISTS vector`);
}

/** Create HNSW index after embeddings exist (safe to re-run). Skips when dim > 2000 (pgvector HNSW limit). */
export async function ensureEmbeddingIndex(prisma: PrismaClient): Promise<void> {
  const { CURATION_EMBEDDING_DIM } = await import("./embeddings");
  if (CURATION_EMBEDDING_DIM > 2000) {
    console.log(
      `  skipping HNSW index (${CURATION_EMBEDDING_DIM} dims > pgvector 2000 limit; neighbor search uses sequential scan)`
    );
    return;
  }
  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "QuestionBankItem_embedding_hnsw_idx"
    ON "QuestionBankItem" USING hnsw (embedding vector_cosine_ops)
    WHERE embedding IS NOT NULL
  `);
}

export async function loadCurationQuestions(
  prisma: PrismaClient,
  opts: { limit?: number; missingEmbeddingsOnly?: boolean } = {}
): Promise<CurationQuestionRow[]> {
  const limitClause = opts.limit && opts.limit > 0 ? `LIMIT ${opts.limit}` : "";
  const embedFilter = opts.missingEmbeddingsOnly ? `AND embedding IS NULL` : "";

  const rows = await prisma.$queryRawUnsafe<RawRow[]>(
    `
    SELECT
      id,
      "subjectId",
      "topicCategory",
      "blueprintTopic",
      question,
      scenario,
      options,
      "correctAnswer",
      explanation,
      source,
      tags,
      (embedding IS NOT NULL) AS "hasEmbedding"
    FROM "QuestionBankItem"
    WHERE "fieldId" = $1 AND active = true ${embedFilter}
    ORDER BY id ASC
    ${limitClause}
    `,
    CURATION_FIELD_ID
  );

  return rows.map(mapRow);
}

export async function countMissingEmbeddings(prisma: PrismaClient): Promise<number> {
  const [{ count }] = await prisma.$queryRawUnsafe<Array<{ count: bigint }>>(
    `
    SELECT COUNT(*)::bigint AS count
    FROM "QuestionBankItem"
    WHERE "fieldId" = $1 AND active = true AND embedding IS NULL
    `,
    CURATION_FIELD_ID
  );
  return Number(count);
}

export async function storeEmbedding(
  prisma: PrismaClient,
  id: string,
  vector: number[]
): Promise<void> {
  const literal = vectorToPgLiteral(vector);
  await prisma.$executeRawUnsafe(
    `UPDATE "QuestionBankItem" SET embedding = $1::vector, "updatedAt" = NOW() WHERE id = $2`,
    literal,
    id
  );
}

export async function embedQuestionsBatch(
  prisma: PrismaClient,
  rows: CurationQuestionRow[],
  onProgress?: (done: number, total: number) => void
): Promise<number> {
  if (rows.length === 0) return 0;

  const texts = rows.map((r) => buildEmbeddingText(r));
  const vectors = await embedCurationTexts(texts);

  for (let i = 0; i < rows.length; i++) {
    await storeEmbedding(prisma, rows[i]!.id, vectors[i]!);
    onProgress?.(i + 1, rows.length);
  }
  return rows.length;
}

export type NeighborHit = { id: string; similarity: number };

/** Find nearest neighbors via pgvector cosine distance. */
export async function findSimilarNeighbors(
  prisma: PrismaClient,
  questionId: string,
  opts: { limit?: number; minSimilarity?: number } = {}
): Promise<NeighborHit[]> {
  const limit = opts.limit ?? 25;
  const minSimilarity = opts.minSimilarity ?? 0.87;

  const rows = await prisma.$queryRawUnsafe<Array<{ id: string; similarity: number }>>(
    `
    SELECT
      neighbor.id,
      1 - (anchor.embedding <=> neighbor.embedding) AS similarity
    FROM "QuestionBankItem" anchor
    JOIN "QuestionBankItem" neighbor
      ON neighbor."fieldId" = anchor."fieldId"
     AND neighbor.active = true
     AND neighbor.id <> anchor.id
     AND neighbor.embedding IS NOT NULL
    WHERE anchor.id = $1
      AND anchor.embedding IS NOT NULL
    ORDER BY anchor.embedding <=> neighbor.embedding
    LIMIT $2
    `,
    questionId,
    limit
  );

  return rows.filter((r) => r.similarity >= minSimilarity);
}
