/**
 * AI batch generation for NPTE-PT question bank — blueprint-aligned slots + diversity controls.
 */
import { getOpenAiClient } from "@/lib/openai-client";
import type { BankItem } from "@/lib/question-bank";
import type { ExamQuestion } from "@/lib/ai";
import { BATCH_DIVERSITY_RULES } from "@/lib/engine/prompts/batch-diversity";
import { NPTE_PT_SYSTEM_AUGMENTATION } from "@/lib/subjects/npte-pt/prompts";
import { VIGNETTE_REQUIREMENTS } from "@/lib/engine/prompts/vignette";
import { UNIVERSAL_EXAM_SYSTEM } from "@/lib/engine/prompts/base";
import { examQuestionToBankItem } from "@/lib/engine/curation/exam-to-bank";
import { analyzeQuestionPatterns } from "@/lib/rag/pattern-analyzer";
import type { QuestionPatternProfile } from "@/lib/rag/types";
import { filterBankItemsForIngest } from "../bank-ingest-gate";
import {
  auditBatchDiversity,
  batchPassesDiversity,
  dedupeBatchItems,
  filterBatchByDiversity,
} from "./batch-diversity";
import { assessNptePtBankItem } from "./quality-gate";
import { stemFormatForIndex, planNptePtGenerationSlots } from "./blueprint-quota";
import type { NptePtGenerationMeta, NptePtGenerationSlot } from "./types";
import {
  NPTE_PT_GENERATION_CHUNK_SIZE,
  NPTE_PT_GENERATION_CONCURRENCY,
  NPTE_PT_GENERATION_VERSION,
} from "./types";

const openai = getOpenAiClient("generation");

const MAX_CHUNK_RETRIES = 5;
const CHUNK_RETRY_BASE_MS = 3000;

function resolveConcurrency(): number {
  const raw = process.env.NPTE_PT_GENERATION_CONCURRENCY;
  if (!raw) return NPTE_PT_GENERATION_CONCURRENCY;
  const n = parseInt(raw, 10);
  if (!Number.isFinite(n) || n < 1) return NPTE_PT_GENERATION_CONCURRENCY;
  return Math.min(16, n);
}

function resolveChunkSize(): number {
  const raw = process.env.NPTE_PT_GENERATION_CHUNK_SIZE;
  if (!raw) return NPTE_PT_GENERATION_CHUNK_SIZE;
  const n = parseInt(raw, 10);
  if (!Number.isFinite(n) || n < 5) return NPTE_PT_GENERATION_CHUNK_SIZE;
  return Math.min(30, n);
}

function skipPatternPrefetch(): boolean {
  return process.env.NPTE_PT_SKIP_PATTERN_PREFETCH === "1";
}

const EMPTY_PATTERN_PROFILE: QuestionPatternProfile = {
  fieldId: "npte-pt",
  topic: "clinical",
  sampleSize: 0,
  avgStemLength: 180,
  avgExplanationLength: 120,
  commonTags: [],
  distractorPatterns: [],
  formatMix: { multiple_choice: 1 },
  difficultySignals: [],
  exemplarStems: [],
  exemplarDistractors: [],
  clinicalJudgmentFlows: [],
};

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function withOpenAiRetries<T>(label: string, fn: () => Promise<T>): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_CHUNK_RETRIES; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      const retryable =
        err instanceof Error &&
        (err.name === "APIConnectionError" ||
          err.message.includes("ECONNRESET") ||
          err.message.includes("ENOTFOUND") ||
          err.message.includes("429") ||
          err.message.includes("503") ||
          err.message.includes("rate limit"));
      if (!retryable || attempt === MAX_CHUNK_RETRIES) break;
      const waitMs = CHUNK_RETRY_BASE_MS * 2 ** (attempt - 1);
      console.warn(
        `[npte-pt] ${label} failed (attempt ${attempt}/${MAX_CHUNK_RETRIES}), retrying in ${waitMs}ms…`
      );
      await sleep(waitMs);
    }
  }
  throw lastError;
}

export type NptePtGenerationResult = {
  items: BankItem[];
  rejected: number;
  batchId: string;
  diversityIssues: number;
};

function buildPatternBlock(pattern: QuestionPatternProfile): string {
  return pattern.exemplarStems.length
    ? `EXEMPLAR PATTERNS FROM BANK:\nStems: ${pattern.exemplarStems.slice(0, 3).join("\n---\n")}\nDistractor logic: ${pattern.distractorPatterns.join("; ")}`
    : "";
}

function buildExemplarBlock(exemplarItems?: BankItem[]): string {
  return exemplarItems?.length
    ? `SEED EXEMPLARS (mirror quality, do NOT copy):\n${exemplarItems
        .slice(0, 3)
        .map(
          (e, i) =>
            `[${i + 1}] Vignette: ${(e.vignette ?? "").slice(0, 200)}…\nStem: ${e.question}\nCorrect: ${e.correctAnswer}`
        )
        .join("\n\n")}`
    : "";
}

function buildSlotPrompt(
  slots: NptePtGenerationSlot[],
  patternBlock: string,
  exemplarBlock: string
): string {
  const slotLines = slots.map((s, i) => {
    const stemHint = stemFormatForIndex(i);
    return `${i + 1}. Content: ${s.contentCategory} | Task: ${s.taskCategory} | Topic: ${s.blueprintTopic} | Difficulty: ${s.difficulty}/5 | Format: ${stemHint}${s.presentationHint ? ` | Setting: ${s.presentationHint}` : ""}`;
  });

  return `Generate exactly ${slots.length} original NPTE-PT practice questions.

${NPTE_PT_SYSTEM_AUGMENTATION}

${BATCH_DIVERSITY_RULES}

${VIGNETTE_REQUIREMENTS}

${patternBlock}

${exemplarBlock}

ASSIGNED SLOTS (follow exactly — one question per slot):
${slotLines.join("\n")}

Return JSON: { "questions": [ ... ] }
Each question object:
- vignette (2–4 sentences: demographics, CC, history, vitals/labs/imaging)
- question (lead-in stem only, ending with ?)
- options (exactly 4 unique strings, no A/B/C/D prefix)
- correctAnswer (must match one option exactly)
- explanation (detailed teaching rationale, 150+ words)
- topicCategory (content category slug)
- taskCategory (task slug from slot)
- blueprintTopic (specific topic from slot)
- difficulty (1–5)
- tags (array including "npte-pt-generated", "NPTE_PT_2025", content category, task category)`;
}

function parseGenerationResponse(raw: string): ExamQuestion[] {
  const parsed = JSON.parse(raw) as { questions?: ExamQuestion[] };
  return Array.isArray(parsed.questions) ? parsed.questions : [];
}

function slotToBankItem(
  exam: ExamQuestion,
  slot: NptePtGenerationSlot,
  batchId: string,
  slotIndex: number,
  qcScore: number
): BankItem {
  const meta: NptePtGenerationMeta = {
    batchId,
    slotIndex,
    model: "gpt-4o-mini",
    pipelineVersion: NPTE_PT_GENERATION_VERSION,
    blueprintAligned: true,
    difficultyRating: slot.difficulty,
    qcScore,
    generatedAt: new Date().toISOString(),
  };

  const base = examQuestionToBankItem(exam, {
    subjectId: slot.contentCategory,
    topicCategory: slot.contentCategory,
    blueprintDomain: slot.contentCategory,
    difficulty: slot.difficulty,
    tags: [
      "npte-pt-generated",
      "NPTE_PT_2025",
      slot.contentCategory,
      slot.taskCategory,
      slot.blueprintTopic.toLowerCase().replace(/\s+/g, "-"),
      `batch-${batchId}`,
    ],
    source: "generated",
  });

  return {
    ...base,
    itemType: "vignette",
    ngnPayload: {
      ...base.ngnPayload,
      taskCategory: slot.taskCategory,
      blueprintTopic: slot.blueprintTopic,
      blueprintSystem: slot.contentCategory,
      generationMeta: meta,
    },
  };
}

/** Load pattern profiles once per batch (field-wide + per content category). */
export async function prefetchNptePtPatternProfiles(
  subjectIds: string[]
): Promise<Map<string, QuestionPatternProfile>> {
  const unique = [...new Set(subjectIds.filter(Boolean))];
  const profiles = new Map<string, QuestionPatternProfile>();

  const [fieldWide, ...bySubject] = await Promise.all([
    analyzeQuestionPatterns({
      fieldId: "npte-pt",
      topic: "NPTE-PT clinical medicine",
      sampleSize: 20,
    }),
    ...unique.map((subjectId) =>
      analyzeQuestionPatterns({
        fieldId: "npte-pt",
        topic: subjectId,
        subjectId,
        sampleSize: 15,
      })
    ),
  ]);

  profiles.set("_default", fieldWide);
  unique.forEach((subjectId, i) => {
    profiles.set(subjectId, bySubject[i]!);
  });

  return profiles;
}

function patternForSlot(
  profiles: Map<string, QuestionPatternProfile>,
  slot: NptePtGenerationSlot
): QuestionPatternProfile {
  return profiles.get(slot.contentCategory) ?? profiles.get("_default")!;
}

/** Generate one chunk (default 10) of blueprint-aligned NPTE-PT items. */
export async function generateNptePtChunk(params: {
  slots: NptePtGenerationSlot[];
  batchId: string;
  exemplarItems?: BankItem[];
  patternProfiles?: Map<string, QuestionPatternProfile>;
}): Promise<{ accepted: BankItem[]; rejected: number }> {
  if (!openai) {
    throw new Error("OPENAI_API_KEY required for NPTE-PT generation.");
  }

  const firstSlot = params.slots[0];
  const pattern =
    params.patternProfiles && firstSlot
      ? patternForSlot(params.patternProfiles, firstSlot)
      : await analyzeQuestionPatterns({
          fieldId: "npte-pt",
          topic: firstSlot?.blueprintTopic ?? "clinical medicine",
          subjectId: firstSlot?.contentCategory,
          sampleSize: 15,
        });

  const patternBlock = buildPatternBlock(pattern);
  const exemplarBlock = buildExemplarBlock(params.exemplarItems);

  const completion = await withOpenAiRetries("OpenAI completion", () =>
    openai!.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: `${UNIVERSAL_EXAM_SYSTEM}\n${NPTE_PT_SYSTEM_AUGMENTATION}` },
        {
          role: "user",
          content: buildSlotPrompt(params.slots, patternBlock, exemplarBlock),
        },
      ],
      temperature: 0.35,
      max_tokens: 8000,
      response_format: { type: "json_object" },
    })
  );

  const raw = completion.choices[0]?.message?.content ?? "{}";
  const questions = parseGenerationResponse(raw);

  const bankItems: BankItem[] = [];
  let rejected = 0;

  for (let i = 0; i < params.slots.length; i++) {
    const slot = params.slots[i]!;
    const exam = questions[i];
    if (!exam?.question || !exam.correctAnswer) {
      rejected++;
      continue;
    }
    const item = slotToBankItem(exam, slot, params.batchId, i, 0);
    const qc = assessNptePtBankItem(item, { source: "generated" });
    if (!qc.serveReady || qc.qcScore < 6) {
      rejected++;
      continue;
    }
    bankItems.push({
      ...item,
      difficulty: slot.difficulty,
      ngnPayload: {
        ...item.ngnPayload,
        generationMeta: {
          ...(item.ngnPayload?.generationMeta as NptePtGenerationMeta),
          qcScore: qc.qcScore,
          qcFlags: qc.flags,
        },
      },
    });
  }

  const deduped = dedupeBatchItems(bankItems);
  rejected += bankItems.length - deduped.length;

  const { kept: diversityKept, dropped: diversityDropped } = filterBatchByDiversity(deduped);
  rejected += diversityDropped;

  const accepted = filterBankItemsForIngest("npte-pt", diversityKept, "generated");
  rejected += diversityKept.length - accepted.length;

  return { accepted, rejected };
}

/** Generate a full batch (e.g. 500) in parallel waves of chunks. */
export async function generateNptePtBatch(params: {
  count: number;
  deficitsByCategory: Record<string, number>;
  batchId?: string;
  exemplarItems?: BankItem[];
  concurrency?: number;
  onProgress?: (done: number, total: number) => void;
  /** Persist each chunk as it completes (streaming insert). */
  onChunkAccepted?: (
    items: BankItem[],
    meta: { chunkIndex: number; batchId: string }
  ) => Promise<void>;
}): Promise<NptePtGenerationResult> {
  const batchId =
    params.batchId ??
    `npte-pt-${new Date().toISOString().slice(0, 10)}-${Math.random().toString(36).slice(2, 8)}`;
  const slots = planNptePtGenerationSlots({
    count: params.count,
    deficitsByCategory: params.deficitsByCategory,
  });

  const concurrency = params.concurrency ?? resolveConcurrency();
  const chunkSize = resolveChunkSize();
  const patternProfiles = skipPatternPrefetch()
    ? new Map<string, QuestionPatternProfile>([["_default", EMPTY_PATTERN_PROFILE]])
    : await prefetchNptePtPatternProfiles(slots.map((s) => s.contentCategory));

  const chunkStarts: number[] = [];
  for (let i = 0; i < slots.length; i += chunkSize) {
    chunkStarts.push(i);
  }

  console.log(
    `[npte-pt] Batch ${batchId}: ${slots.length} slots, ${chunkStarts.length} chunks (size ${chunkSize}), concurrency ${concurrency}${skipPatternPrefetch() ? ", no RAG prefetch" : ""}`
  );

  const allAccepted: BankItem[] = [];
  let totalRejected = 0;
  let diversityIssues = 0;
  let processedSlots = 0;

  for (let wave = 0; wave < chunkStarts.length; wave += concurrency) {
    const waveStarts = chunkStarts.slice(wave, wave + concurrency);
    const waveResults = await Promise.all(
      waveStarts.map(async (start) => {
        const chunk = slots.slice(start, start + chunkSize);
        const result = await generateNptePtChunk({
          slots: chunk,
          batchId,
          exemplarItems: params.exemplarItems,
          patternProfiles,
        });
        return { start, chunk, result };
      })
    );

    for (const { start, chunk, result } of waveResults) {
      allAccepted.push(...result.accepted);
      totalRejected += result.rejected;
      if (result.accepted.length > 0 && !batchPassesDiversity(result.accepted)) {
        diversityIssues += auditBatchDiversity(result.accepted).length;
      }

      if (result.accepted.length > 0 && params.onChunkAccepted) {
        await params.onChunkAccepted(result.accepted, {
          chunkIndex: Math.floor(start / chunkSize),
          batchId,
        });
      }

      processedSlots += chunk.length;
    }

    params.onProgress?.(Math.min(processedSlots, slots.length), slots.length);
  }

  return {
    items: allAccepted,
    rejected: totalRejected,
    batchId,
    diversityIssues,
  };
}
