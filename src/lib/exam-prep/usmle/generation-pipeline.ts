/**
 * AI generation pipeline for USMLE full-length block-style practice exams (2026 blueprint).
 */
import { getOpenAiClient } from "@/lib/openai-client";
import type { BankItem } from "@/lib/question-bank";
import type { ExamQuestion } from "@/lib/ai";
import { BATCH_DIVERSITY_RULES } from "@/lib/engine/prompts/batch-diversity";
import {
  USMLE_STEP_1_SYSTEM_AUGMENTATION,
  getUsmleStep1UserAugmentation,
} from "@/lib/subjects/medicine/prompts-step1";
import {
  USMLE_STEP_2_SYSTEM_AUGMENTATION,
  getUsmleStep2UserAugmentation,
} from "@/lib/subjects/medicine/prompts-step2";
import { VIGNETTE_REQUIREMENTS } from "@/lib/engine/prompts/vignette";
import { UNIVERSAL_EXAM_SYSTEM } from "@/lib/engine/prompts/base";
import { examQuestionToBankItem } from "@/lib/engine/curation/exam-to-bank";
import {
  dedupeBatchItems,
  filterBatchByDiversity,
} from "../pance/batch-diversity";
import { USMLE_PHYSICIAN_EDUCATOR_BATCH_01 } from "@/lib/edtech/seeds/usmle-physician-educator-batch-01";
import {
  planUsmleFullExamSlots,
  resolveExamQuestionCount,
  resolveExamTitle,
  summarizeExamBlueprint,
  summarizeExamFormats,
  summarizeExamTasks,
} from "./blueprint-quota";
import {
  assessUsmleFullExamItem,
  normalizeUsmleFullExamItem,
  usmleFullExamItemPasses,
} from "./quality-gate";
import type {
  UsmleFullExamBundle,
  UsmleGenerationMeta,
  UsmleGenerationResult,
  UsmleGenerationSlot,
  UsmleStepLevel,
} from "./types";
import {
  USMLE_FULL_EXAM_VERSION,
  USMLE_GENERATION_CHUNK_SIZE,
  USMLE_GENERATION_CONCURRENCY,
  USMLE_SLOT_MAX_RETRIES,
} from "./types";

const openai = getOpenAiClient("generation");

const MAX_CHUNK_RETRIES = 5;
const CHUNK_RETRY_BASE_MS = 3000;

function resolveConcurrency(): number {
  const raw = process.env.USMLE_GENERATION_CONCURRENCY;
  if (!raw) return USMLE_GENERATION_CONCURRENCY;
  const n = parseInt(raw, 10);
  if (!Number.isFinite(n) || n < 1) return USMLE_GENERATION_CONCURRENCY;
  return Math.min(12, n);
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
          err.message.includes("429") ||
          err.message.includes("503") ||
          err.message.includes("rate limit"));
      if (!retryable || attempt === MAX_CHUNK_RETRIES) break;
      const waitMs = CHUNK_RETRY_BASE_MS * 2 ** (attempt - 1);
      console.warn(
        `[usmle-full-exam] ${label} failed (attempt ${attempt}/${MAX_CHUNK_RETRIES}), retrying in ${waitMs}ms…`
      );
      await sleep(waitMs);
    }
  }
  throw lastError;
}

function collectExemplars(stepLevel: UsmleStepLevel): BankItem[] {
  return USMLE_PHYSICIAN_EDUCATOR_BATCH_01.filter(
    (item) => item.ngnPayload?.stepLevel === stepLevel || stepLevel === "step2"
  )
    .slice(0, 6)
    .map((item) => ({
      subjectId: item.subjectId,
      vignette: item.vignette,
      question: item.question,
      options: item.options,
      correctAnswer: item.correctAnswer,
      explanation: item.explanation,
      itemType: item.itemType,
      tags: item.tags,
      ngnPayload: item.ngnPayload,
    }));
}

function buildExemplarBlock(exemplars: BankItem[]): string {
  return exemplars.length
    ? `QUALITY EXEMPLARS (mirror depth and distractor logic — do NOT copy):\n${exemplars
        .slice(0, 3)
        .map(
          (e, i) =>
            `[${i + 1}] ${e.subjectId}\nVignette: ${(e.vignette ?? "").slice(0, 280)}…\nStem: ${e.question.slice(0, 120)}…\nCorrect: ${e.correctAnswer}`
        )
        .join("\n\n")}`
    : "";
}

function resolveItemType(format: string): string {
  if (format === "lab_interpretation") return "vignette";
  if (format === "image_based") return "exhibit";
  if (format === "sequential") return "sequential";
  if (format === "biostats") return "biostats";
  if (format === "ethics") return "ethics";
  return "vignette";
}

function systemAugmentation(stepLevel: UsmleStepLevel): string {
  return stepLevel === "step1"
    ? USMLE_STEP_1_SYSTEM_AUGMENTATION
    : USMLE_STEP_2_SYSTEM_AUGMENTATION;
}

function userAugmentation(stepLevel: UsmleStepLevel): string {
  const fieldId =
    stepLevel === "step1"
      ? "usmle-step-1"
      : stepLevel === "step3"
        ? "usmle-step-3"
        : "usmle-step-2";
  const ctx = {
    field: fieldId,
    fieldId,
    topic: "USMLE full-length block-style practice exam",
    questionCount: 10,
    difficulty: "hard" as const,
    subject: undefined,
    sources: [],
    researchBrief: "",
  };
  return stepLevel === "step1"
    ? getUsmleStep1UserAugmentation(ctx)
    : getUsmleStep2UserAugmentation(ctx);
}

function buildSlotPrompt(
  slots: UsmleGenerationSlot[],
  exemplarBlock: string
): string {
  const stepLevel = slots[0]?.stepLevel ?? "step1";
  const slotLines = slots.map((s, i) => {
    const parts = [
      `Organ system: ${s.categoryLabel}`,
      `subjectId: ${s.subjectId}`,
      `topic: ${s.blueprintTopic}`,
      `physician task: ${s.physicianTask}`,
      `difficulty: ${s.difficulty}/5`,
      `stem style: ${s.stemFormat}`,
      `format: ${s.questionFormat}`,
    ];
    if (s.questionFormat === "lab_interpretation") {
      parts.push("include numeric labs/vitals that discriminate answer choices");
    }
    if (s.questionFormat === "image_based") {
      parts.push("describe exhibit in chartData.exhibit (findings students would see on image/histology slide)");
    }
    if (s.questionFormat === "sequential") {
      parts.push("multi-step: same vignette, 2 related questions in one object with sequentialSteps array");
    }
    if (s.questionFormat === "calculation") {
      parts.push(
        "quantitative calculation: provide all data needed in vignette; stem asks for a numeric result with units; exactly one option matches verified math; include step-by-step solution in explanation"
      );
    }
    return `${i + 1}. ${parts.join(" | ")}`;
  });

  return `Generate exactly ${slots.length} USMLE ${stepLevel === "step1" ? "Step 1" : "Step 2 CK"} block-style practice questions for a full-length simulated exam.

${userAugmentation(stepLevel)}

${BATCH_DIVERSITY_RULES}

${VIGNETTE_REQUIREMENTS}

${exemplarBlock}

ASSIGNED SLOTS (one question per slot — follow exactly):
${slotLines.join("\n")}

Return JSON: { "questions": [ ... ] }
Each question object MUST include:
- vignette (2–5 sentences: MUST include patient age e.g. "58-year-old man" AND numeric vitals/labs e.g. "K+ 6.8 mEq/L", "BP 142/88 mm Hg" — separate from stem)
- question (lead-in stem ending with ? — use assigned stem style)
- options (exactly 4 unique, board-level plausible distractors)
- correctAnswer (exact match to one option)
- explanation (150+ words: why correct + why EACH distractor is wrong; cite USMLE 2026 content outline / guidelines)
- distractorRationale (object mapping each wrong option → why incorrect)
- clinicalReasoning (assess → analyze → integrate science/clinical reasoning → answer)
- topicCategory (organ system label)
- blueprintSystem (slug from slot)
- physicianTask (slug from slot)
- difficultyLabel (Easy | Medium | Hard)
- chartData (for image_based: { kind: "exhibit", title, description, findings[] }; for lab_interpretation: include labTable)
- references (array with USMLE Content Outline 2026 / guideline citations)
- tags (include "usmle-full-exam", "USMLE-2026", "curated", step level, blueprint system slug)`;
}

function parseGenerationResponse(raw: string): ExamQuestion[] {
  try {
    const parsed = JSON.parse(raw) as { questions?: ExamQuestion[] };
    return Array.isArray(parsed.questions) ? parsed.questions : [];
  } catch {
    return [];
  }
}

function extractJsonObject(raw: string): string | null {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  return raw.slice(start, end + 1);
}

function slotToBankItem(
  exam: ExamQuestion,
  slot: UsmleGenerationSlot,
  batchId: string,
  examNumber: number,
  qcScore: number
): BankItem {
  const meta: UsmleGenerationMeta = {
    batchId,
    examNumber,
    slotIndex: slot.slotIndex,
    stepLevel: slot.stepLevel,
    model: "gpt-4o-mini",
    pipelineVersion: USMLE_FULL_EXAM_VERSION,
    qcScore,
    generatedAt: new Date().toISOString(),
  };

  const itemType = resolveItemType(slot.questionFormat);
  const tags = [
    "usmle-full-exam",
    "USMLE-2026",
    "curated",
    "full-exam-generated",
    slot.stepLevel,
    `exam-${examNumber}`,
    slot.blueprintSystem,
    slot.physicianTask,
    slot.subjectId,
    slot.blueprintTopic.replace(/\s+/g, "-"),
    `batch-${batchId}`,
  ];

  const base = examQuestionToBankItem(exam, {
    subjectId: slot.subjectId,
    topicCategory: slot.categoryLabel,
    blueprintDomain: slot.blueprintSystem,
    difficulty: slot.difficulty,
    tags,
    source: "ai-curated",
  });

  const chartData = exam.chartData ?? exam.ngnPayload;
  const ngnPayload: Record<string, unknown> = {
    ...base.ngnPayload,
    kind: slot.questionFormat === "mcq" ? "vignette" : slot.questionFormat,
    stepLevel: slot.stepLevel,
    blueprintSystem: slot.blueprintSystem,
    blueprintTopic: slot.blueprintTopic,
    physicianTask: slot.physicianTask,
    generationMeta: meta,
    ...(chartData ?? {}),
  };

  return {
    ...base,
    itemType,
    ngnPayload,
    references:
      exam.references?.map((label) =>
        typeof label === "string" ? { label } : label
      ) ?? base.references,
  };
}

async function generateChunk(params: {
  slots: UsmleGenerationSlot[];
  batchId: string;
  examNumber: number;
  exemplars: BankItem[];
}): Promise<{ accepted: BankItem[]; rejected: number; issues: string[] }> {
  if (!openai) {
    throw new Error("OPENAI_API_KEY required for USMLE full exam generation.");
  }

  const stepLevel = params.slots[0]?.stepLevel ?? "step1";
  const isSingleSlot = params.slots.length === 1;

  let lastParseError: string | null = null;

  for (let parseAttempt = 1; parseAttempt <= MAX_CHUNK_RETRIES; parseAttempt++) {
    const completion = await withOpenAiRetries("OpenAI completion", () =>
      openai!.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `${UNIVERSAL_EXAM_SYSTEM}\n${systemAugmentation(stepLevel)}`,
          },
          {
            role: "user",
            content: buildSlotPrompt(params.slots, buildExemplarBlock(params.exemplars)),
          },
        ],
        temperature: 0.34,
        max_tokens: isSingleSlot ? 4096 : 16000,
        response_format: { type: "json_object" },
      })
    );

    const raw = completion.choices[0]?.message?.content ?? "{}";
    let questions = parseGenerationResponse(raw);
    if (questions.length === 0) {
      const recovered = extractJsonObject(raw);
      if (recovered) questions = parseGenerationResponse(recovered);
    }

    if (questions.length > 0) {
      return processChunkQuestions({
        questions,
        slots: params.slots,
        stepLevel,
        batchId: params.batchId,
        examNumber: params.examNumber,
      });
    }

    lastParseError = "json_parse_fail";
    if (parseAttempt < MAX_CHUNK_RETRIES) {
      console.warn(
        `[usmle-full-exam] JSON parse failed (attempt ${parseAttempt}/${MAX_CHUNK_RETRIES}), retrying chunk…`
      );
      await sleep(CHUNK_RETRY_BASE_MS * parseAttempt);
    }
  }

  return {
    accepted: [],
    rejected: params.slots.length,
    issues: params.slots.map((s) => `slot-${s.slotIndex}:${lastParseError ?? "json_parse_fail"}`),
  };
}

function processChunkQuestions(params: {
  questions: ExamQuestion[];
  slots: UsmleGenerationSlot[];
  stepLevel: UsmleStepLevel;
  batchId: string;
  examNumber: number;
}): { accepted: BankItem[]; rejected: number; issues: string[] } {
  const { questions, slots, stepLevel, batchId, examNumber } = params;
  const bankItems: BankItem[] = [];
  let rejected = 0;
  const issues: string[] = [];

  for (let i = 0; i < slots.length; i++) {
    const slot = slots[i]!;
    const exam = questions[i];
    if (!exam?.question || !exam.correctAnswer) {
      rejected++;
      issues.push(`slot-${slot.slotIndex}:missing_fields`);
      continue;
    }

    const item = normalizeUsmleFullExamItem(
      slotToBankItem(exam, slot, batchId, examNumber, 0),
      {
        stepLevel: slot.stepLevel,
        blueprintSystem: slot.blueprintSystem,
        physicianTask: slot.physicianTask,
      }
    );
    const globalIndex = slot.slotIndex;

    if (!usmleFullExamItemPasses(item, globalIndex, stepLevel)) {
      const qc = assessUsmleFullExamItem(item, globalIndex, stepLevel);
      rejected++;
      issues.push(`slot-${slot.slotIndex}:${qc.issues.join(",")}`);
      continue;
    }

    bankItems.push({
      ...item,
      ngnPayload: {
        ...item.ngnPayload,
        generationMeta: {
          ...(item.ngnPayload?.generationMeta as UsmleGenerationMeta),
          qcScore: assessUsmleFullExamItem(item, globalIndex, stepLevel).score,
        },
      },
    });
  }

  const deduped = dedupeBatchItems(bankItems);
  rejected += bankItems.length - deduped.length;

  const { kept: diversityKept, dropped: diversityDropped } = filterBatchByDiversity(deduped);
  rejected += diversityDropped;

  const accepted = diversityKept.filter((item) => {
    const slotIndex = (item.ngnPayload?.generationMeta as UsmleGenerationMeta)?.slotIndex ?? 0;
    return usmleFullExamItemPasses(item, slotIndex, stepLevel);
  });
  rejected += diversityKept.length - accepted.length;

  return { accepted, rejected, issues };
}

async function generateSingleSlot(params: {
  slot: UsmleGenerationSlot;
  batchId: string;
  examNumber: number;
  exemplars: BankItem[];
}): Promise<{ item: BankItem | null; issues: string[] }> {
  for (let attempt = 1; attempt <= USMLE_SLOT_MAX_RETRIES; attempt++) {
    const result = await generateChunk({
      slots: [params.slot],
      batchId: params.batchId,
      examNumber: params.examNumber,
      exemplars: params.exemplars,
    });
    if (result.accepted.length > 0) {
      return { item: result.accepted[0]!, issues: [] };
    }
    if (attempt < USMLE_SLOT_MAX_RETRIES) {
      console.warn(
        `[usmle-full-exam] Slot ${params.slot.slotIndex} retry ${attempt}/${USMLE_SLOT_MAX_RETRIES}: ${result.issues.join("; ")}`
      );
    }
  }
  return { item: null, issues: [`slot-${params.slot.slotIndex}:exhausted_retries`] };
}

async function runChunkWave<T>(
  tasks: (() => Promise<T>)[],
  concurrency: number
): Promise<T[]> {
  const results: T[] = [];
  for (let i = 0; i < tasks.length; i += concurrency) {
    const wave = tasks.slice(i, i + concurrency);
    const waveResults = await Promise.all(wave.map((fn) => fn()));
    results.push(...waveResults);
  }
  return results;
}

/** Generate one full-length USMLE block-style practice exam. */
export async function generateUsmleFullExam(params: {
  examNumber: number;
  questionCount?: number;
  batchId: string;
  /** Override step (e.g. step3 replacements); defaults from exam number parity. */
  stepLevel?: UsmleStepLevel;
  onProgress?: (done: number, total: number) => void;
}): Promise<UsmleFullExamBundle> {
  const questionCount = params.questionCount ?? resolveExamQuestionCount(params.examNumber);
  const slots = planUsmleFullExamSlots({
    examNumber: params.examNumber,
    questionCount,
    stepLevel: params.stepLevel,
  });
  const stepLevel = slots[0]?.stepLevel ?? params.stepLevel ?? "step1";
  const exemplars = collectExemplars(stepLevel);
  const concurrency = resolveConcurrency();

  const chunkStarts: number[] = [];
  for (let i = 0; i < slots.length; i += USMLE_GENERATION_CHUNK_SIZE) {
    chunkStarts.push(i);
  }

  console.log(
    `[usmle-full-exam] Exam ${params.examNumber} (${stepLevel}): ${slots.length} slots, ${chunkStarts.length} chunks`
  );

  const acceptedBySlot = new Map<number, BankItem>();
  let totalRejected = 0;
  const allIssues: string[] = [];
  let done = 0;

  const tasks = chunkStarts.map((start) => async () => {
    const chunkSlots = slots.slice(start, start + USMLE_GENERATION_CHUNK_SIZE);
    const result = await generateChunk({
      slots: chunkSlots,
      batchId: params.batchId,
      examNumber: params.examNumber,
      exemplars,
    });
    done += chunkSlots.length;
    params.onProgress?.(done, slots.length);
    return result;
  });

  const chunkResults = await runChunkWave(tasks, concurrency);

  for (const result of chunkResults) {
    for (const item of result.accepted) {
      const slotIndex = (item.ngnPayload?.generationMeta as UsmleGenerationMeta)?.slotIndex;
      if (slotIndex != null) acceptedBySlot.set(slotIndex, item);
    }
    totalRejected += result.rejected;
    allIssues.push(...result.issues);
  }

  const missingSlots = slots.filter((s) => !acceptedBySlot.has(s.slotIndex));
  if (missingSlots.length > 0) {
    console.warn(
      `[usmle-full-exam] Exam ${params.examNumber}: regenerating ${missingSlots.length} failed slots…`
    );
    for (const slot of missingSlots) {
      const { item, issues } = await generateSingleSlot({
        slot,
        batchId: params.batchId,
        examNumber: params.examNumber,
        exemplars,
      });
      if (item) {
        acceptedBySlot.set(slot.slotIndex, item);
      } else {
        totalRejected++;
        allIssues.push(...issues);
      }
      params.onProgress?.(acceptedBySlot.size, slots.length);
    }
  }

  const allItems = slots
    .map((s) => acceptedBySlot.get(s.slotIndex))
    .filter((item): item is BankItem => item != null);

  const acceptedCount = allItems.length;
  const allPassed = acceptedCount === questionCount;

  return {
    examNumber: params.examNumber,
    title: resolveExamTitle(params.examNumber, stepLevel),
    stepLevel,
    questionCount,
    blueprintSummary: summarizeExamBlueprint(slots),
    formatSummary: summarizeExamFormats(slots),
    taskSummary: summarizeExamTasks(slots),
    items: allItems,
    qaReport: {
      accepted: acceptedCount,
      rejected: totalRejected,
      allPassed,
      issues: allIssues.slice(0, 50),
    },
  };
}

/** Generate multiple full-length USMLE practice exams. */
export async function generateUsmleFullExamSet(params: {
  examCount?: number;
  startFromExam?: number;
  questionCountPerExam?: number;
  batchId?: string;
  onExamComplete?: (exam: UsmleFullExamBundle) => void | Promise<void>;
}): Promise<UsmleGenerationResult> {
  const examCount = params.examCount ?? 10;
  const startFrom = Math.max(1, params.startFromExam ?? 1);
  const batchId =
    params.batchId ??
    `usmle-full-${new Date().toISOString().slice(0, 10)}-${Math.random().toString(36).slice(2, 8)}`;

  const exams: UsmleFullExamBundle[] = [];
  let totalAccepted = 0;
  let totalRejected = 0;

  for (let examNumber = startFrom; examNumber <= examCount; examNumber++) {
    console.log(`\n[usmle-full-exam] === Generating Exam ${examNumber}/${examCount} ===`);
    const exam = await generateUsmleFullExam({
      examNumber,
      questionCount: params.questionCountPerExam,
      batchId,
      onProgress: (done, total) => {
        if (done % 20 === 0 || done === total) {
          console.log(`  Exam ${examNumber}: ${done}/${total} slots processed`);
        }
      },
    });
    exams.push(exam);
    totalAccepted += exam.qaReport.accepted;
    totalRejected += exam.qaReport.rejected;
    await params.onExamComplete?.(exam);
  }

  return { exams, batchId, totalAccepted, totalRejected };
}

/** Serialize exam bundle for database import / artifacts. */
export function serializeExamForImport(exam: UsmleFullExamBundle): Record<string, unknown> {
  const fieldId = exam.stepLevel === "step1" ? "usmle-step-1" : "usmle-step-2";
  return {
    examNumber: exam.examNumber,
    title: exam.title,
    stepLevel: exam.stepLevel,
    fieldId,
    questionCount: exam.questionCount,
    blueprintSummary: exam.blueprintSummary,
    formatSummary: exam.formatSummary,
    taskSummary: exam.taskSummary,
    qaReport: exam.qaReport,
    questions: exam.items.map((item, index) => ({
      sortOrder: index + 1,
      fieldId,
      stepLevel: exam.stepLevel,
      subjectId: item.subjectId,
      topicCategory: item.topicCategory ?? item.subjectId,
      blueprintDomain: item.blueprintDomain,
      blueprintSystem: item.ngnPayload?.blueprintSystem ?? item.blueprintDomain,
      physicianTask: item.ngnPayload?.physicianTask,
      itemType: item.itemType ?? "vignette",
      vignette: item.vignette ?? null,
      question: item.question,
      options: item.options,
      correctAnswer: item.correctAnswer,
      explanation: item.explanation,
      clinicalReasoning: item.clinicalReasoning ?? null,
      distractorRationale: item.distractorRationale ?? null,
      difficulty: item.difficulty ?? 3,
      tags: item.tags ?? [],
      ngnPayload: item.ngnPayload ?? null,
      references: item.references ?? [],
      source: "ai-curated",
    })),
  };
}
