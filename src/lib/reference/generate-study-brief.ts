import OpenAI from "openai";
import {
  cacheDelete,
  cacheGet,
  cacheGetOrSetDeduped,
  cacheKey,
  CACHE_TTL,
} from "@/lib/cache";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import { resolveExamFieldId } from "@/lib/edtech/exam-preference";
import type { WeakTopicRow } from "@/lib/learning/student-dashboard";
import { getStudentDashboardData } from "@/lib/learning/student-dashboard";
import { gatherStudyMaterial } from "@/lib/research";
import type { SearchResult } from "@/lib/search";
import {
  sanitizeBoardUpdates,
  sanitizeFocusAreas,
  validateReferenceBrief,
} from "./brief-validation";
import { getMemoryCardIdsForTopic } from "./memory-cards";
import { getPinnedMemoryCardIds } from "./pinned-essentials";
import type {
  ReferenceBriefSource,
  ReferenceFocusArea,
  ReferenceStudyBrief,
} from "./study-brief-types";
import type { ExamSlug } from "@/types/edtech";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

function normalizeTopicKey(key: string): string {
  return key.trim().toLowerCase().replace(/^(tag|subject):/, "");
}

function filterWeakTopicsForExam(weakTopics: WeakTopicRow[], examSlug: ExamSlug): WeakTopicRow[] {
  const fieldId = resolveExamFieldId(examSlug);
  return weakTopics.filter((t) => t.fieldId === fieldId).slice(0, 4);
}

function collectMemoryCardIds(examSlug: ExamSlug, weakTopics: WeakTopicRow[]): string[] {
  const ids = new Set<string>(getPinnedMemoryCardIds(examSlug));
  for (const topic of weakTopics) {
    for (const id of getMemoryCardIdsForTopic(normalizeTopicKey(topic.id))) {
      ids.add(id);
    }
  }
  return [...ids].slice(0, 12);
}

function toBriefSources(sources: SearchResult[], topic?: string): ReferenceBriefSource[] {
  return sources.map((s) => ({
    title: s.title,
    url: s.url,
    sourceType: s.sourceType,
    topic,
  }));
}

function dedupeBriefSources(sources: ReferenceBriefSource[]): ReferenceBriefSource[] {
  const seen = new Set<string>();
  const out: ReferenceBriefSource[] = [];
  for (const source of sources) {
    const key = source.url.trim().toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(source);
  }
  return out.slice(0, 12);
}

async function gatherMultiTopicResearch(
  fieldId: string,
  examSlug: ExamSlug,
  weakTopics: WeakTopicRow[]
): Promise<{ researchBrief: string; sources: ReferenceBriefSource[] }> {
  const exam = EXAM_CATALOG[examSlug];
  const topics =
    weakTopics.length > 0
      ? weakTopics
      : [
          {
            id: "general",
            name: `${exam.shortName} high-yield board review clinical pearls`,
            fieldId,
            masteryScore: 0,
            attempts: 0,
            weight: 0,
          },
        ];

  const blocks = await Promise.all(
    topics.map(async (topic) => {
      const subjectId = topic.id !== "general" ? normalizeTopicKey(topic.id) : undefined;
      const { researchBrief, sources } = await gatherStudyMaterial(
        fieldId,
        topic.name,
        subjectId,
        { useAdvancedRag: true }
      );
      return {
        topicName: topic.name,
        researchBrief,
        sources: toBriefSources(sources, topic.name),
      };
    })
  );

  const mergedSources = dedupeBriefSources(blocks.flatMap((b) => b.sources));
  const researchBrief = blocks
    .map((b) => `## ${b.topicName}\n${b.researchBrief}`)
    .join("\n\n")
    .slice(0, 12_000);

  return { researchBrief, sources: mergedSources };
}

function fallbackBrief(params: {
  examSlug: ExamSlug;
  weakTopics: WeakTopicRow[];
  researchBrief: string;
  sources: ReferenceBriefSource[];
  memoryCardIds: string[];
}): ReferenceStudyBrief {
  const exam = EXAM_CATALOG[params.examSlug];
  const focusAreas: ReferenceFocusArea[] = params.weakTopics.slice(0, 3).map((t) => ({
    topicKey: normalizeTopicKey(t.id),
    topicName: t.name,
    masteryScore: t.masteryScore,
    pearls: [
      `Focus your next session on ${t.name} — your weakest scored topic right now.`,
    ],
    studyAction: `Open memory cards and run 10 practice questions on ${t.name}.`,
  }));

  const lines = params.researchBrief
    .split("\n")
    .map((l) => l.replace(/^#+\s*/, "").trim())
    .filter((l) => l.length > 20 && !l.startsWith("##"))
    .slice(0, 5);

  return validateReferenceBrief({
    generatedAt: new Date().toISOString(),
    examSlug: params.examSlug,
    headline: params.weakTopics.length
      ? `Focus review: ${params.weakTopics[0]!.name}`
      : `${exam.shortName} essentials`,
    summary: params.weakTopics.length
      ? `Your practice data highlights ${params.weakTopics
          .slice(0, 2)
          .map((t) => t.name)
          .join(" and ")}. Use the cards and tools below for a targeted refresh.`
      : `Start with pinned high-yield cards and explore drugs, anatomy, and practice tools for ${exam.name}.`,
    focusAreas,
    boardUpdates: lines.length
      ? lines
      : [`High-yield ${exam.shortName} review sourced from OER textbooks and guidelines.`],
    sourceCount: params.sources.length,
    sources: params.sources,
    aiPowered: false,
    memoryCardIds: params.memoryCardIds,
  });
}

async function synthesizeBriefWithAi(params: {
  examSlug: ExamSlug;
  weakTopics: WeakTopicRow[];
  researchBrief: string;
  sources: ReferenceBriefSource[];
  memoryCardIds: string[];
}): Promise<ReferenceStudyBrief> {
  const exam = EXAM_CATALOG[params.examSlug];
  const weakBlock =
    params.weakTopics.length > 0
      ? params.weakTopics
          .map(
            (t) =>
              `- ${t.name} (mastery ${t.masteryScore}%, ${t.attempts} attempts, key: ${normalizeTopicKey(t.id)})`
          )
          .join("\n")
      : "No weak areas yet — provide a general high-yield orientation for this exam.";

  const completion = await openai!.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.2,
    max_tokens: 1600,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are a board-exam educator (${exam.name}). Synthesize ONLY from the research brief — do not invent guidelines, doses, or criteria not present in the research.
Output JSON:
{
  "headline": string (short, motivating),
  "summary": string (max 2 short sentences, actionable),
  "focusAreas": [{ "topicKey": string, "topicName": string, "masteryScore": number optional, "pearls": string[1-2], "studyAction": string }],
  "boardUpdates": string[2-3] (distinct high-yield facts not repeated in summary or pearls)
}
Prioritize weak areas. Pearls must be exam-ready. If research is thin for a topic, say "review memory cards" rather than inventing facts.`,
      },
      {
        role: "user",
        content: `Exam: ${exam.name}
Weak areas from student analytics:
${weakBlock}

OER / guideline research brief (multi-topic):
${params.researchBrief.slice(0, 8000)}`,
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(raw) as {
    headline?: string;
    summary?: string;
    focusAreas?: unknown;
    boardUpdates?: unknown;
  };

  const focusAreas = sanitizeFocusAreas(parsed.focusAreas, params.weakTopics);
  const boardUpdates = sanitizeBoardUpdates(parsed.boardUpdates);

  return validateReferenceBrief({
    generatedAt: new Date().toISOString(),
    examSlug: params.examSlug,
    headline: parsed.headline ?? `${exam.shortName} study brief`,
    summary: parsed.summary ?? "Review your weak areas and high-yield cards below.",
    focusAreas:
      focusAreas.length > 0
        ? focusAreas
        : fallbackBrief({ ...params, researchBrief: params.researchBrief }).focusAreas,
    boardUpdates:
      boardUpdates.length > 0
        ? boardUpdates
        : fallbackBrief({ ...params, researchBrief: params.researchBrief }).boardUpdates,
    sourceCount: params.sources.length,
    sources: params.sources,
    aiPowered: true,
    memoryCardIds: params.memoryCardIds,
  });
}

export async function generateReferenceStudyBrief(
  userId: string,
  examSlug: ExamSlug,
  options?: { refresh?: boolean }
): Promise<ReferenceStudyBrief> {
  const dashboard = await getStudentDashboardData(userId);
  const weakTopics = filterWeakTopicsForExam(dashboard.weakTopics, examSlug);
  const memoryCardIds = collectMemoryCardIds(examSlug, weakTopics);
  const topicKeys = weakTopics.map((t) => normalizeTopicKey(t.id)).join(",");
  const cacheId = cacheKey(["reference-brief", userId, examSlug, topicKeys || "general"]);

  if (options?.refresh) cacheDelete(cacheId);

  const cached = cacheGet<ReferenceStudyBrief>(cacheId);
  if (cached && !options?.refresh) {
    return { ...cached, cached: true };
  }

  return cacheGetOrSetDeduped(cacheId, CACHE_TTL.referenceBrief, async () => {
    const fieldId = resolveExamFieldId(examSlug);
    const { researchBrief, sources } = await gatherMultiTopicResearch(
      fieldId,
      examSlug,
      weakTopics
    );

    const base = {
      examSlug,
      weakTopics,
      researchBrief,
      sources,
      memoryCardIds,
    };

    if (!openai) return fallbackBrief(base);

    try {
      return await synthesizeBriefWithAi(base);
    } catch {
      return fallbackBrief(base);
    }
  });
}
