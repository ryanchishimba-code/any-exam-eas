import { prisma } from "@/lib/prisma";
import type { QuestionPatternProfile } from "./types";

const PRIORITIZATION_RE = /first|priority|initial|most appropriate|see first|nurse should/i;
const VIGNETTE_RE = /patient|client|year-old|presents|admitted|diagnosed|vital signs/i;

function parseTags(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function parseOptions(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

/**
 * Analyze existing question bank items to extract distractor logic, format mix,
 * and clinical judgment patterns — feeds generation prompts as exemplars.
 */
export async function analyzeQuestionPatterns(params: {
  fieldId: string;
  topic: string;
  subjectId?: string;
  sampleSize?: number;
}): Promise<QuestionPatternProfile> {
  const sampleSize = params.sampleSize ?? 40;
  const topicTokens = params.topic.toLowerCase().split(/\W+/).filter((t) => t.length > 3);

  const where = {
    fieldId: params.fieldId,
    active: true,
    ...(params.subjectId ? { subjectId: params.subjectId } : {}),
  };

  const candidates = await prisma.questionBankItem.findMany({
    where,
    take: sampleSize * 3,
    orderBy: { updatedAt: "desc" },
    select: {
      question: true,
      options: true,
      explanation: true,
      tags: true,
    },
  });

  const scored = candidates.map((item) => {
    const q = item.question.toLowerCase();
    const overlap = topicTokens.filter((t) => q.includes(t)).length;
    return { item, score: overlap };
  });

  scored.sort((a, b) => b.score - a.score);
  const sample = scored.slice(0, sampleSize).map((s) => s.item);

  if (sample.length === 0) {
    return emptyProfile(params.fieldId, params.topic);
  }

  const tagCounts = new Map<string, number>();
  const formatMix: Record<string, number> = {};
  const exemplarStems: string[] = [];
  const exemplarDistractors: string[] = [];
  const clinicalJudgmentFlows: string[] = [];
  let stemLen = 0;
  let explLen = 0;

  for (const item of sample) {
    stemLen += item.question.length;
    explLen += item.explanation.length;
    if (exemplarStems.length < 5) exemplarStems.push(item.question.slice(0, 280));

    const tags = parseTags(item.tags);
    for (const t of tags) tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1);

    const options = parseOptions(item.options);
    if (exemplarDistractors.length < 8 && options.length >= 2) {
      exemplarDistractors.push(...options.slice(0, 2).map((o) => o.slice(0, 120)));
    }

    if (PRIORITIZATION_RE.test(item.question)) {
      formatMix.prioritization = (formatMix.prioritization ?? 0) + 1;
      clinicalJudgmentFlows.push("prioritization: who to see first / best nursing action");
    }
    if (VIGNETTE_RE.test(item.question)) {
      formatMix.clinical_vignette = (formatMix.clinical_vignette ?? 0) + 1;
      clinicalJudgmentFlows.push("vignette: assessment → intervention → evaluation");
    }
    if (options.length >= 4) formatMix.multiple_choice = (formatMix.multiple_choice ?? 0) + 1;
    if (/select all|which of the following/i.test(item.question)) {
      formatMix.select_all = (formatMix.select_all ?? 0) + 1;
    }
  }

  const commonTags = [...tagCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([t]) => t);

  const distractorPatterns = [
    "partially correct but not the BEST action",
    "correct intervention wrong priority/sequence",
    "scope-of-practice / delegation error",
    "confuses similar conditions or drug classes",
    "ignores patient safety or contraindication",
  ];

  const difficultySignals = [
    "single-best-answer with plausible alternatives",
    "requires synthesis of 2+ clinical findings",
    "tests application not recall when possible",
  ];

  return {
    fieldId: params.fieldId,
    topic: params.topic,
    sampleSize: sample.length,
    avgStemLength: Math.round(stemLen / sample.length),
    avgExplanationLength: Math.round(explLen / sample.length),
    commonTags,
    distractorPatterns,
    formatMix,
    difficultySignals,
    exemplarStems,
    exemplarDistractors: [...new Set(exemplarDistractors)].slice(0, 8),
    clinicalJudgmentFlows: [...new Set(clinicalJudgmentFlows)].slice(0, 6),
  };
}

function emptyProfile(fieldId: string, topic: string): QuestionPatternProfile {
  return {
    fieldId,
    topic,
    sampleSize: 0,
    avgStemLength: 180,
    avgExplanationLength: 120,
    commonTags: [],
    distractorPatterns: [
      "plausible misconception",
      "correct but not priority",
      "scope error",
    ],
    formatMix: { multiple_choice: 1 },
    difficultySignals: ["application-level reasoning"],
    exemplarStems: [],
    exemplarDistractors: [],
    clinicalJudgmentFlows: ["assess → prioritize → intervene → evaluate"],
  };
}

export function formatPatternProfileForPrompt(profile: QuestionPatternProfile): string {
  return [
    "## Question pattern analysis (from real bank exemplars)",
    `Sample size: ${profile.sampleSize}`,
    `Avg stem length: ~${profile.avgStemLength} chars`,
    `Format mix: ${JSON.stringify(profile.formatMix)}`,
    `Common tags: ${profile.commonTags.join(", ") || "n/a"}`,
    `Distractor patterns: ${profile.distractorPatterns.join("; ")}`,
    `Clinical judgment flows: ${profile.clinicalJudgmentFlows.join("; ")}`,
    profile.exemplarStems.length
      ? `Exemplar stems:\n${profile.exemplarStems.map((s, i) => `${i + 1}. ${s}`).join("\n")}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");
}
