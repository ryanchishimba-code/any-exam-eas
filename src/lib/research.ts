import type { SearchResult } from "./search";
import {
  buildFieldSearchQueries,
  dedupeSources,
  searchWeb,
} from "./search";
import { getFieldMeta } from "./fields";
import { getFieldSubject } from "./field-subjects";
import { cacheGetOrSet, cacheKey, CACHE_TTL } from "./cache";
import { gatherAdvancedStudyMaterial } from "./rag";
import OpenAI from "openai";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export type StudyResearch = {
  sources: SearchResult[];
  researchBrief: string;
  sourceCounts: Record<string, number>;
  advanced?: Awaited<ReturnType<typeof gatherAdvancedStudyMaterial>>;
};

export async function gatherStudyMaterial(
  field: string,
  topic: string,
  subjectId?: string,
  options?: { useAdvancedRag?: boolean }
): Promise<StudyResearch> {
  const useAdvanced = options?.useAdvancedRag !== false;
  const cacheId = cacheKey(["research", useAdvanced ? "v2" : "v1", field, topic, subjectId]);
  return cacheGetOrSet(cacheId, CACHE_TTL.researchBrief, async () => {
    if (useAdvanced) {
      const advanced = await gatherAdvancedStudyMaterial(field, topic, subjectId);
      return {
        sources: advanced.sources,
        researchBrief: advanced.researchBrief,
        sourceCounts: advanced.sourceCounts,
        advanced,
      };
    }
    const legacy = await gatherStudyMaterialLegacy(field, topic, subjectId);
    return { ...legacy, advanced: undefined };
  });
}

async function gatherStudyMaterialLegacy(
  field: string,
  topic: string,
  subjectId?: string
): Promise<Omit<StudyResearch, "advanced">> {
  return gatherStudyMaterialUncached(field, topic, subjectId);
}

async function gatherStudyMaterialUncached(
  field: string,
  topic: string,
  subjectId?: string
): Promise<StudyResearch> {
  const queries = buildFieldSearchQueries(field, topic, subjectId);
  const meta = getFieldMeta(field);
  const subject = subjectId ? getFieldSubject(field, subjectId) : undefined;

  const batches = await Promise.all(
    queries.map(({ query, options }) =>
      searchWeb(query, options).catch(() => [] as SearchResult[])
    )
  );

  const sources = dedupeSources(batches.flat()).slice(0, 35);

  const sourceCounts = sources.reduce(
    (acc, s) => {
      acc[s.sourceType] = (acc[s.sourceType] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const researchBrief = await synthesizeResearchBrief({
    field,
    topic,
    subjectLabel: subject?.label,
    textbookRefs: subject?.textbookRefs,
    examFocus: subject?.examHints ?? meta?.examFocus ?? "commonly tested concepts",
    sources,
  });

  return { sources, researchBrief, sourceCounts };
}

async function synthesizeResearchBrief(params: {
  field: string;
  topic: string;
  subjectLabel?: string;
  textbookRefs?: string;
  examFocus: string;
  sources: SearchResult[];
}): Promise<string> {
  const sourceBlock = params.sources
    .map(
      (s, i) =>
        `[${i + 1}] (${s.sourceType}) ${s.title}\n${s.content.slice(0, 1200)}\nURL: ${s.url}`
    )
    .join("\n\n");

  if (!openai || params.sources.length === 0) {
    return [
      `Topic: ${params.topic} (${params.field})`,
      `Exam focus: ${params.examFocus}`,
      `Sources gathered: ${params.sources.length} (OER + web).`,
      "Add OPENAI_API_KEY for deep synthesis across all sources.",
    ].join("\n");
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are a curriculum researcher. Synthesize ONLY from provided sources.
Prioritize: (1) open textbook/OER content, (2) high-yield exam topics, (3) widely taught concepts.
Do not invent facts not supported by sources. Flag gaps where sources disagree or are thin.`,
      },
      {
        role: "user",
        content: `Field: ${params.field}
Subject (STRICT SCOPE — questions must be ONLY this subject): ${params.subjectLabel ?? params.topic}
Textbooks: ${params.textbookRefs ?? "OER"}
Topic detail: ${params.topic}
Typical exams test: ${params.examFocus}

Sources (${params.sources.length} documents from OER textbooks and web):
${sourceBlock}

Write a research brief with sections:
## Core concepts (must-know)
## High-yield facts (most likely on exams)
## Common question patterns
## OER/textbook anchors (cite source numbers)
## Gaps or verify-yourself notes`,
      },
    ],
    temperature: 0.2,
    max_tokens: 2000,
  });

  return completion.choices[0]?.message?.content ?? "";
}
