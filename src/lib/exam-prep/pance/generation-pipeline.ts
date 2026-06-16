/**
 * AI batch generation for PANCE question bank — blueprint-aligned slots + diversity controls.
 */
import { getOpenAiClient } from "@/lib/openai-client";
import type { BankItem } from "@/lib/question-bank";
import type { ExamQuestion } from "@/lib/ai";
import { BATCH_DIVERSITY_RULES } from "@/lib/engine/prompts/batch-diversity";
import { PANCE_SYSTEM_AUGMENTATION } from "@/lib/subjects/pance/prompts";
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
import { assessPanceBankItem } from "./quality-gate";
import { stemFormatForIndex, planPanceGenerationSlots } from "./blueprint-quota";
import type { PanceGenerationMeta, PanceGenerationSlot } from "./types";
import {
  PANCE_GENERATION_CHUNK_SIZE,
  PANCE_GENERATION_CONCURRENCY,
  PANCE_GENERATION_VERSION,
} from "./types";

const openai = getOpenAiClient("generation");

const MAX_CHUNK_RETRIES = 5;
const CHUNK_RETRY_BASE_MS = 3000;

function resolveConcurrency(): number {
  const raw = process.env.PANCE_GENERATION_CONCURRENCY;
  if (!raw) return PANCE_GENERATION_CONCURRENCY;
  const n = parseInt(raw, 10);
  if (!Number.isFinite(n) || n < 1) return PANCE_GENERATION_CONCURRENCY;
  return Math.min(16, n);
}

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
        `[pance] ${label} failed (attempt ${attempt}/${MAX_CHUNK_RETRIES}), retrying in ${waitMs}ms…`
      );
      await sleep(waitMs);
    }
  }
  throw lastError;
}

export type PanceGenerationResult = {
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

/**
 * Targets the automated serve gate (auditUsmleQaEditor overallScore ≥ 8, no
 * errors). Each requirement maps to a scored dimension so a well-formed item
 * clears the bar instead of clustering just under it.
 */
const EXAM_READY_TARGETS = `EXAM-READY SCORING TARGETS (every question is auto-scored 0–10; ONLY items scoring ≥8 with zero errors are kept — follow ALL):
- VIGNETTE (2–4 sentences) MUST contain, woven into prose:
  • age + sex + care setting (e.g., "A 58-year-old man in the emergency department")
  • pertinent history / risk factors and timing/etiology ("3 days of…", "2 weeks after…", "history of type 2 diabetes")
  • AT LEAST THREE objective values WITH UNITS — e.g., "BP 162/98 mm Hg", "HR 114/min", "temperature 38.7°C", "glucose 348 mg/dL", "WBC 15.2 × 10^9/L", "creatinine 2.3 mg/dL", "troponin 0.9 ng/mL"
  • AT LEAST ONE physical-exam finding — e.g., murmur, crackles, wheeze, tenderness, edema, rash, guarding
- STEM: ONE USMLE-style lead-in ending in "?" — "Which is the most likely diagnosis?", "What is the most appropriate next step in management?", "Which is the most likely underlying mechanism?". NEVER use "these findings", "those findings", or "the patient described above".
- OPTIONS: exactly 4 unique, homogeneous, plausible choices. The correct answer must be a SPECIFIC entity (a named diagnosis, drug, or concrete step) — never generic phrasing like "Focused evaluation with targeted history" or "High-yield fact about…".
- EXPLANATION (≥200 words): FIRST state why the correct answer is right, citing the mechanism/pathophysiology or a named guideline (e.g., ACC/AHA, IDSA, CDC). THEN, one sentence each, refute EACH of the other three options using the exact form "Option <text> is incorrect because …".
- STYLE: crisp clinical prose. NEVER use "it is important to note", "furthermore", "moreover", "in conclusion", "plays a crucial role", or "delves into".`;

function buildSlotPrompt(
  slots: PanceGenerationSlot[],
  patternBlock: string,
  exemplarBlock: string
): string {
  const slotLines = slots.map((s, i) => {
    const stemHint = stemFormatForIndex(i);
    return `${i + 1}. Content: ${s.contentCategory} | Task: ${s.taskCategory} | Topic: ${s.blueprintTopic} | Difficulty: ${s.difficulty}/5 | Format: ${stemHint}${s.presentationHint ? ` | Setting: ${s.presentationHint}` : ""}`;
  });

  return `Generate exactly ${slots.length} original PANCE practice questions.

${PANCE_SYSTEM_AUGMENTATION}

${BATCH_DIVERSITY_RULES}

${VIGNETTE_REQUIREMENTS}

${EXAM_READY_TARGETS}

${patternBlock}

${exemplarBlock}

ASSIGNED SLOTS (follow exactly — one question per slot):
${slotLines.join("\n")}

Return JSON: { "questions": [ ... ] }
Each question object:
- vignette (2–4 sentences: age+sex+setting, history/etiology, ≥3 objective values WITH units, ≥1 exam finding)
- question (lead-in stem only, ending with ?; never deictic "these findings")
- options (exactly 4 unique strings, no A/B/C/D prefix; correct answer must be specific)
- correctAnswer (must match one option exactly)
- explanation (≥200 words: why correct is right with mechanism/guideline, then "Option <text> is incorrect because …" for EACH other option)
- topicCategory (content category slug)
- taskCategory (task slug from slot)
- blueprintTopic (specific topic from slot)
- difficulty (1–5)
- tags (array including "pance-generated", "PANCE-2025", content category, task category)`;
}

function parseGenerationResponse(raw: string): ExamQuestion[] {
  const parsed = JSON.parse(raw) as { questions?: ExamQuestion[] };
  return Array.isArray(parsed.questions) ? parsed.questions : [];
}

function slotToBankItem(
  exam: ExamQuestion,
  slot: PanceGenerationSlot,
  batchId: string,
  slotIndex: number,
  qcScore: number
): BankItem {
  const meta: PanceGenerationMeta = {
    batchId,
    slotIndex,
    model: "gpt-4o-mini",
    pipelineVersion: PANCE_GENERATION_VERSION,
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
      "pance-generated",
      "PANCE-2025",
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
export async function prefetchPancePatternProfiles(
  subjectIds: string[]
): Promise<Map<string, QuestionPatternProfile>> {
  const unique = [...new Set(subjectIds.filter(Boolean))];
  const profiles = new Map<string, QuestionPatternProfile>();

  const [fieldWide, ...bySubject] = await Promise.all([
    analyzeQuestionPatterns({
      fieldId: "pance",
      topic: "PANCE clinical medicine",
      sampleSize: 20,
    }),
    ...unique.map((subjectId) =>
      analyzeQuestionPatterns({
        fieldId: "pance",
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
  slot: PanceGenerationSlot
): QuestionPatternProfile {
  return profiles.get(slot.contentCategory) ?? profiles.get("_default")!;
}

/** Generate one chunk (default 10) of blueprint-aligned PANCE items. */
export async function generatePanceChunk(params: {
  slots: PanceGenerationSlot[];
  batchId: string;
  exemplarItems?: BankItem[];
  patternProfiles?: Map<string, QuestionPatternProfile>;
}): Promise<{ accepted: BankItem[]; rejected: number }> {
  if (!openai) {
    throw new Error("OPENAI_API_KEY required for PANCE generation.");
  }

  const firstSlot = params.slots[0];
  const pattern =
    params.patternProfiles && firstSlot
      ? patternForSlot(params.patternProfiles, firstSlot)
      : await analyzeQuestionPatterns({
          fieldId: "pance",
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
        { role: "system", content: `${UNIVERSAL_EXAM_SYSTEM}\n${PANCE_SYSTEM_AUGMENTATION}` },
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
    const qc = assessPanceBankItem(item, { source: "generated" });
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
          ...(item.ngnPayload?.generationMeta as PanceGenerationMeta),
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

  const accepted = filterBankItemsForIngest("pance", diversityKept, "generated");
  rejected += diversityKept.length - accepted.length;

  return { accepted, rejected };
}

/** Generate a full batch (e.g. 500) in parallel waves of chunks. */
export async function generatePanceBatch(params: {
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
}): Promise<PanceGenerationResult> {
  const batchId =
    params.batchId ??
    `pance-${new Date().toISOString().slice(0, 10)}-${Math.random().toString(36).slice(2, 8)}`;
  const slots = planPanceGenerationSlots({
    count: params.count,
    deficitsByCategory: params.deficitsByCategory,
  });

  const concurrency = params.concurrency ?? resolveConcurrency();
  const patternProfiles = await prefetchPancePatternProfiles(
    slots.map((s) => s.contentCategory)
  );

  const chunkStarts: number[] = [];
  for (let i = 0; i < slots.length; i += PANCE_GENERATION_CHUNK_SIZE) {
    chunkStarts.push(i);
  }

  console.log(
    `[pance] Batch ${batchId}: ${slots.length} slots, ${chunkStarts.length} chunks, concurrency ${concurrency}`
  );

  const allAccepted: BankItem[] = [];
  let totalRejected = 0;
  let diversityIssues = 0;
  let processedSlots = 0;

  for (let wave = 0; wave < chunkStarts.length; wave += concurrency) {
    const waveStarts = chunkStarts.slice(wave, wave + concurrency);
    const waveResults = await Promise.all(
      waveStarts.map(async (start) => {
        const chunk = slots.slice(start, start + PANCE_GENERATION_CHUNK_SIZE);
        const result = await generatePanceChunk({
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
          chunkIndex: start / PANCE_GENERATION_CHUNK_SIZE,
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
