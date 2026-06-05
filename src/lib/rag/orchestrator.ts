import type { SearchResult } from "@/lib/search";
import {
  buildFieldSearchQueries,
  dedupeSources,
  searchWeb,
  type SearchOptions,
} from "@/lib/search";
import { getFieldMeta } from "@/lib/fields";
import { getFieldSubject } from "@/lib/field-subjects";
import { resolveSubjectModule } from "@/lib/subjects/registry";
import { mergeOerDomains } from "@/lib/oer";
import { cacheGetOrSet, cacheKey, CACHE_TTL } from "@/lib/cache";
import OpenAI from "openai";
import { chunkSearchResults } from "./chunking";
import { embedChunks } from "./embeddings";
import { hybridRetrieve, reciprocalRankFusion } from "./hybrid-retriever";
import { rerankChunks } from "./reranker";
import { expandQueries } from "./query-expansion";
import {
  analyzeQuestionPatterns,
  formatPatternProfileForPrompt,
} from "./pattern-analyzer";
import { getCuratedSourcesForField } from "./sources";
import type { AdvancedStudyContext, RagChunk } from "./types";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export async function gatherAdvancedStudyMaterial(
  field: string,
  topic: string,
  subjectId?: string
): Promise<AdvancedStudyContext> {
  const id = cacheKey(["advanced-rag", field, topic, subjectId]);
  return cacheGetOrSet(id, CACHE_TTL.researchBrief, () =>
    gatherAdvancedStudyMaterialUncached(field, topic, subjectId)
  );
}

async function gatherAdvancedStudyMaterialUncached(
  field: string,
  topic: string,
  subjectId?: string
): Promise<AdvancedStudyContext> {
  const meta = getFieldMeta(field);
  const fieldId = meta?.id ?? field.toLowerCase().replace(/\s+/g, "-");
  const subject = subjectId ? getFieldSubject(field, subjectId) : undefined;
  const subjectModule = resolveSubjectModule(fieldId);

  const subjectHints = subjectModule.buildSearchQueryHints?.(topic, subjectId) ?? [];

  const expanded = await expandQueries({
    fieldId,
    topic,
    subjectLabel: subject?.label,
    subjectHints,
    examFocus: subject?.examHints ?? meta?.examFocus,
  });

  const legacyQueries = buildFieldSearchQueries(field, topic, subjectId);
  const curated = getCuratedSourcesForField(fieldId);
  const curatedDomains = [...new Set(curated.flatMap((c) => c.domains))];

  const searchJobs: Array<{ query: string; options: SearchOptions }> = [
    ...legacyQueries,
    ...expanded.all.slice(0, 6).map((query) => ({
      query,
      options: {
        maxResults: 5,
        includeDomains: curatedDomains.length ? mergeOerDomains(curatedDomains) : undefined,
        sourceType: "oer" as const,
      },
    })),
  ];

  const batches = await Promise.all(
    searchJobs.map(({ query, options }) =>
      searchWeb(query, options).catch(() => [] as SearchResult[])
    )
  );

  const sources = dedupeSources(batches.flat()).slice(0, 45);

  const patternProfile = await analyzeQuestionPatterns({
    fieldId,
    topic,
    subjectId,
    sampleSize: 35,
  });

  const bankExemplars: SearchResult[] = patternProfile.exemplarStems.map((stem, i) => ({
    title: `Bank exemplar ${i + 1}`,
    url: `bank://${fieldId}/${subjectId ?? "general"}/${i}`,
    content: `${stem}\n\nDistractor patterns observed: ${patternProfile.distractorPatterns.join("; ")}`,
    sourceType: "exam_focus" as const,
  }));

  const allSources = [...sources, ...bankExemplars];
  const documents = chunkSearchResults(allSources, fieldId);
  const flatChunks: RagChunk[] = documents.flatMap((d) => d.chunks);
  const embedded = await embedChunks(flatChunks);

  const retrievalQueries = [expanded.primary, ...expanded.expanded.slice(0, 3)];
  const lists = await Promise.all(
    retrievalQueries.map((q) => hybridRetrieve(q, embedded, { topK: 20 }))
  );
  const fused = reciprocalRankFusion(lists);
  const retrievedChunks = await rerankChunks(expanded.primary, fused, 14);

  const researchBrief = await synthesizeAdvancedBrief({
    field,
    topic,
    subjectLabel: subject?.label,
    examFocus: subject?.examHints ?? meta?.examFocus ?? "board exam",
    chunks: retrievedChunks,
    patternBlock: formatPatternProfileForPrompt(patternProfile),
  });

  const sourceCounts = sources.reduce(
    (acc, s) => {
      acc[s.sourceType] = (acc[s.sourceType] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return {
    sources,
    researchBrief,
    retrievedChunks,
    patternProfile,
    expandedQueries: expanded.all,
    sourceCounts,
    retrievalMeta: {
      totalChunks: flatChunks.length,
      retrievedCount: fused.length,
      rerankedCount: retrievedChunks.length,
    },
  };
}

async function synthesizeAdvancedBrief(params: {
  field: string;
  topic: string;
  subjectLabel?: string;
  examFocus: string;
  chunks: AdvancedStudyContext["retrievedChunks"];
  patternBlock: string;
}): Promise<string> {
  const chunkBlock = params.chunks
    .map(
      (c, i) =>
        `[${i + 1}] (${c.sourceType}) ${c.title}\n${c.content.slice(0, 900)}\nURL: ${c.url}`
    )
    .join("\n\n");

  if (!openai || params.chunks.length === 0) {
    return [
      `Topic: ${params.topic} (${params.field})`,
      params.patternBlock,
      `Retrieved ${params.chunks.length} semantic chunks.`,
    ].join("\n\n");
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.15,
    max_tokens: 2500,
    messages: [
      {
        role: "system",
        content: `Expert curriculum researcher for board exams. Synthesize ONLY from retrieved OER chunks (Open RN, OpenStax, NCSBN/NABP guidelines).
Extract: core pathophysiology, etiology, common clinical presentations (signs/symptoms, labs, imaging), high-yield facts, vignette patterns, distractor logic, and cite chunk numbers.
Prioritize content that supports realistic clinical vignettes — demographics, chief complaint, history, objective findings.
Include NGN/item format recommendations where relevant.`,
      },
      {
        role: "user",
        content: `Field: ${params.field}
Subject: ${params.subjectLabel ?? params.topic}
Exam focus: ${params.examFocus}

${params.patternBlock}

RETRIEVED CHUNKS (${params.chunks.length}):
${chunkBlock}

Write sections:
## Core pathophysiology & etiology
## Common clinical presentations (signs, symptoms, labs, imaging)
## High-yield exam facts
## Vignette patterns & distractor logic
## NGN / format recommendations
## Source anchors (cite chunk numbers — prefer Open RN, OpenStax, NCSBN)
## Gaps to verify`,
      },
    ],
  });

  return completion.choices[0]?.message?.content ?? "";
}

export function buildRetrievalContext(chunks: AdvancedStudyContext["retrievedChunks"]): string {
  if (chunks.length === 0) return "No retrieved context.";
  return chunks
    .map(
      (c, i) =>
        `[${i + 1}] (${c.sourceType}, score=${(c.rerankScore ?? c.hybridScore).toFixed(2)}) ${c.title}\n${c.content.slice(0, 700)}\nSource: ${c.url}`
    )
    .join("\n\n");
}
