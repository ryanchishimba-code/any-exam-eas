/**
 * AI generation pipeline for NAPLEX full-length practice exams (2026 blueprint).
 */
import { getOpenAiClient } from "@/lib/openai-client";
import type { BankItem } from "@/lib/question-bank";
import type { ExamQuestion } from "@/lib/ai";
import { BATCH_DIVERSITY_RULES } from "@/lib/engine/prompts/batch-diversity";
import { PHARMACY_EXAM_SYSTEM_AUGMENTATION, getPharmacyUserAugmentation } from "@/lib/subjects/pharmacy/prompts";
import { VIGNETTE_REQUIREMENTS } from "@/lib/engine/prompts/vignette";
import { UNIVERSAL_EXAM_SYSTEM } from "@/lib/engine/prompts/base";
import { examQuestionToBankItem } from "@/lib/engine/curation/exam-to-bank";
import { filterBankItemsForIngest } from "../bank-ingest-gate";
import { prepareNaplexBankItem } from "../naplex-serve-gate";
import { fixNaplexFormatCoherence } from "../naplex-format-coherence";
import {
  dedupeBatchItems,
  filterBatchByDiversity,
} from "../pance/batch-diversity";
import { NAPLEX_PHYSICIAN_EDUCATOR_BATCH_01 } from "@/lib/edtech/seeds/naplex-physician-educator-batch-01";
import {
  planNaplexFullExamSlots,
  summarizeExamBlueprint,
  summarizeExamFormats,
} from "./blueprint-quota";
import { assessNaplexFullExamItem, naplexFullExamItemPasses } from "./quality-gate";
import type {
  NaplexFullExamBundle,
  NaplexGenerationMeta,
  NaplexGenerationResult,
  NaplexGenerationSlot,
  NaplexQuestionFormat,
} from "./types";
import {
  NAPLEX_FULL_EXAM_DEFAULT_COUNT,
  NAPLEX_FULL_EXAM_VERSION,
  NAPLEX_GENERATION_CHUNK_SIZE,
  NAPLEX_GENERATION_CONCURRENCY,
} from "./types";

const openai = getOpenAiClient("generation");

const MAX_CHUNK_RETRIES = 5;
const CHUNK_RETRY_BASE_MS = 3000;

function resolveConcurrency(): number {
  const raw = process.env.NAPLEX_GENERATION_CONCURRENCY;
  if (!raw) return NAPLEX_GENERATION_CONCURRENCY;
  const n = parseInt(raw, 10);
  if (!Number.isFinite(n) || n < 1) return NAPLEX_GENERATION_CONCURRENCY;
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
        `[naplex-full-exam] ${label} failed (attempt ${attempt}/${MAX_CHUNK_RETRIES}), retrying in ${waitMs}ms…`
      );
      await sleep(waitMs);
    }
  }
  throw lastError;
}

function collectExemplars(): BankItem[] {
  return NAPLEX_PHYSICIAN_EDUCATOR_BATCH_01.slice(0, 6).map((item) => ({
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
            `[${i + 1}] Subject: ${e.subjectId}\nVignette: ${(e.vignette ?? "").slice(0, 250)}…\nStem: ${e.question.slice(0, 120)}…\nCorrect: ${e.correctAnswer}`
        )
        .join("\n\n")}`
    : "";
}

function resolveItemType(format: NaplexQuestionFormat): string {
  if (format === "select_all") return "select_all";
  if (format === "ordered_response") return "ordered_response";
  if (format === "highlight") return "ngn_highlight";
  if (format === "constructed_response") return "constructed_response";
  return "vignette";
}

function formatInstructions(format: NaplexQuestionFormat): string {
  switch (format) {
    case "select_all":
      return "Multiple response — 5–6 options, 2–4 correct answers (comma-separated in correctAnswer)";
    case "ordered_response":
      return "Ordered response — provide 4–6 steps in options; correctAnswer = correct order comma-separated";
    case "highlight":
      return "Hot spot — chartData.kind=highlight with segments array; correctAnswer = exact segment text to select";
    case "constructed_response":
      return "Calculation — all data in vignette; correctAnswer = numeric value only; chartData.unit required";
    default:
      return "Multiple choice — exactly 4 unique options";
  }
}

function buildSlotPrompt(slots: NaplexGenerationSlot[], exemplarBlock: string): string {
  const slotLines = slots.map((s, i) => {
    const parts = [
      `Blueprint area: ${s.categoryLabel}`,
      `blueprintArea: ${s.blueprintArea}`,
      `subjectId: ${s.subjectId}`,
      `topic: ${s.blueprintTopic}`,
      `difficulty: ${s.difficulty}/5`,
      `stem style: ${s.stemFormat}`,
      `format: ${s.questionFormat} — ${formatInstructions(s.questionFormat)}`,
    ];
    return `${i + 1}. ${parts.join(" | ")}`;
  });

  return `Generate exactly ${slots.length} original NAPLEX practice questions for a full-length board-style exam.

NABP NAPLEX Content Outline (2026) — align each item to its assigned blueprint area.

${PHARMACY_EXAM_SYSTEM_AUGMENTATION}

${getPharmacyUserAugmentation()}

${BATCH_DIVERSITY_RULES}

${VIGNETTE_REQUIREMENTS}

${exemplarBlock}

ASSIGNED SLOTS (one question per slot — follow exactly):
${slotLines.join("\n")}

CRITICAL CORRECTNESS RULES (an item is unusable if any are violated):
- The keyed correctAnswer MUST be the single BEST answer for THIS specific patient/vignette — not a statement that is merely true in general. If a more appropriate action exists (e.g. escalate/step-up therapy, refer to prescriber), that must be the keyed answer.
- The question content MUST match the assigned subjectId and blueprintArea. Do NOT write an asthma question for a cardiovascular slot, etc.
- For "constructed_response" (calculation): the stem must be a real calculation answerable from the vignette data, and correctAnswer MUST be a numeric value (digits), never a sentence. Match the stem to the data provided (mg/kg dosing → dose in mg; suspension strength + dose → mL; IV volume + time → mL/hr; compounding/reconstitution → mg for preparation) — never ask for mg/mL concentration without mass/volume inputs or "milligrams for this preparation" without compounding data. Do NOT attach calculation stems to acute clinical exacerbation vignettes (e.g. ED asthma, hypertensive emergency, worsening COPD with SOB/cough, sepsis with renal impairment on IV antibiotics); use MCQ management or counseling instead. Do NOT pair symptom-driven clinical vignettes with unrelated self-contained dispense stems (e.g. amlodipine tablet count when the case is about respiratory worsening).
- For "ordered_response": the stem must explicitly ask the student to place/sequence/prioritize steps IN ORDER, and options must be the orderable steps.
- Every distractor must be plausible and clearly wrong for a defensible clinical reason — never an absurd "never do this" giveaway.

Return JSON: { "questions": [ ... ] }
Each question object MUST include:
- vignette (2–4 sentences: demographics, PMH, meds, labs/vitals — separate from stem)
- question (lead-in stem ending with ? — use assigned stem style)
- options (format-specific — see slot format)
- correctAnswer (exact match; comma-separated for select_all / ordered_response)
- explanation (150+ words: why correct + why EACH distractor/step is wrong; cite guidelines)
- distractorRationale (object mapping each wrong option → why incorrect)
- clinicalReasoning (assess → analyze → recommend → counsel → monitor)
- topicCategory (blueprint area label)
- blueprintArea (slug from slot)
- difficultyLabel (Easy | Medium | Hard)
- chartData (for highlight: { kind: "highlight", segments: [{ id, text }] }; for calc: { kind: "constructed", unit })
- references (array with NABP NAPLEX 2026 / guideline citations)
- tags (include "naplex-full-exam", "NAPLEX-2026", "curated", blueprint area slug)`;
}

function normalizeSpecialFormats(item: BankItem, slot: NaplexGenerationSlot): BankItem {
  const itemType = item.itemType ?? "vignette";
  let working = item;

  if (itemType === "ordered_response" && item.options.length >= 3) {
    const optionSet = new Set(item.options.map((o) => o.trim()));
    const parts = (item.correctAnswer.includes("|||")
      ? item.correctAnswer.split("|||")
      : item.correctAnswer.split(",")
    )
      .map((p) => p.trim())
      .filter(Boolean);

    const normalized = parts.filter((p) => optionSet.has(p));
    if (normalized.length >= 2) {
      return { ...item, correctAnswer: normalized.join("|||") };
    }

    if (item.options.length >= 4) {
      return { ...item, correctAnswer: item.options.slice(0, 4).join("|||") };
    }
  }

  if (itemType === "select_all" && item.options.length >= 4) {
    const parts = (item.correctAnswer.includes("|||")
      ? item.correctAnswer.split("|||")
      : item.correctAnswer.split(",")
    )
      .map((p) => p.trim())
      .filter(Boolean);

    const matched = parts.filter((p) => item.options.includes(p));
    if (matched.length >= 2) {
      return { ...item, correctAnswer: matched.join("|||") };
    }

    const inferred = inferCorrectFromDistractors(item.options, item.distractorRationale);
    if (inferred) {
      const second = item.options.find((o) => o !== inferred && !item.distractorRationale?.[o]);
      if (second) {
        return { ...item, correctAnswer: [inferred, second].join("|||") };
      }
    }
  }

  if (itemType === "constructed_response") {
    // Extract a numeric value, but never collapse a non-numeric text answer to
    // a stray "."/empty string — keep the original so format repair / QA can
    // reclassify mis-generated counseling MCQs labeled as calculations.
    const numeric = item.correctAnswer.replace(/[^\d.]/g, "").replace(/^\.+|\.+$/g, "").trim();
    const hasNumber = /\d/.test(numeric);
    const unit = (item.ngnPayload?.unit as string | undefined) ?? "mg";
    working = {
      ...item,
      correctAnswer: hasNumber ? numeric : item.correctAnswer,
      ngnPayload: { ...item.ngnPayload, kind: "constructed", unit },
    };
  } else if (itemType === "ngn_highlight" && item.vignette) {
    const segments = item.vignette
      .split(/(?<=[.!?])\s+/)
      .filter(Boolean)
      .map((text, i) => ({ id: `seg-${i}`, text: text.trim() }));
    const correct =
      item.correctAnswer.trim() ||
      segments.find((s) => /counsel|monitor|hold|avoid|report/i.test(s.text))?.text ||
      segments[segments.length - 1]?.text ||
      "";
    return {
      ...item,
      correctAnswer: correct,
      ngnPayload: {
        ...item.ngnPayload,
        kind: "highlight",
        segments,
      },
    };
  }

  const formatFix = fixNaplexFormatCoherence(working);
  return formatFix.changed ? formatFix.item : working;
}

function inferCorrectFromDistractors(
  options: string[],
  distractorRationale?: Record<string, string>
): string | null {
  if (!distractorRationale) return null;
  const wrong = new Set(Object.keys(distractorRationale).map((k) => k.trim().toLowerCase()));
  const candidates = options.filter((o) => !wrong.has(o.trim().toLowerCase()));
  return candidates.length === 1 ? candidates[0]! : null;
}

function parseGenerationResponse(raw: string): ExamQuestion[] {
  const parsed = JSON.parse(raw) as { questions?: ExamQuestion[] };
  return Array.isArray(parsed.questions) ? parsed.questions : [];
}

function slotToBankItem(
  exam: ExamQuestion,
  slot: NaplexGenerationSlot,
  batchId: string,
  examNumber: number,
  qcScore: number
): BankItem {
  const meta: NaplexGenerationMeta = {
    batchId,
    examNumber,
    slotIndex: slot.slotIndex,
    model: "gpt-4o-mini",
    pipelineVersion: NAPLEX_FULL_EXAM_VERSION,
    qcScore,
    generatedAt: new Date().toISOString(),
  };

  const itemType = resolveItemType(slot.questionFormat);
  const tags = [
    "naplex-full-exam",
    "NAPLEX-2026",
    "curated",
    "full-exam-generated",
    `exam-${examNumber}`,
    slot.blueprintArea,
    slot.subjectId,
    slot.blueprintTopic.replace(/\s+/g, "-"),
    `batch-${batchId}`,
  ];

  const base = examQuestionToBankItem(exam, {
    subjectId: slot.subjectId,
    topicCategory: slot.categoryLabel,
    blueprintDomain: slot.blueprintArea,
    difficulty: slot.difficulty,
    tags,
    source: "ai-curated",
  });

  const chartData = exam.chartData ?? exam.ngnPayload;
  const ngnPayload: Record<string, unknown> = {
    ...base.ngnPayload,
    kind: slot.questionFormat === "mcq" ? "vignette" : slot.questionFormat,
    blueprintArea: slot.blueprintArea,
    blueprintTopic: slot.blueprintTopic,
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
  slots: NaplexGenerationSlot[];
  batchId: string;
  examNumber: number;
  exemplars: BankItem[];
}): Promise<{ accepted: BankItem[]; rejected: number; issues: string[] }> {
  if (!openai) {
    throw new Error("OPENAI_API_KEY required for NAPLEX full exam generation.");
  }

  const completion = await withOpenAiRetries("OpenAI completion", () =>
    openai!.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `${UNIVERSAL_EXAM_SYSTEM}\n${PHARMACY_EXAM_SYSTEM_AUGMENTATION}`,
        },
        {
          role: "user",
          content: buildSlotPrompt(params.slots, buildExemplarBlock(params.exemplars)),
        },
      ],
      temperature: 0.34,
      max_tokens: 16000,
      response_format: { type: "json_object" },
    })
  );

  const raw = completion.choices[0]?.message?.content ?? "{}";
  const questions = parseGenerationResponse(raw);

  const bankItems: BankItem[] = [];
  let rejected = 0;
  const issues: string[] = [];

  for (let i = 0; i < params.slots.length; i++) {
    const slot = params.slots[i]!;
    const exam = questions[i];
    if (!exam?.question || !exam.correctAnswer) {
      rejected++;
      issues.push(`slot-${slot.slotIndex}:missing_fields`);
      continue;
    }

    const item = normalizeSpecialFormats(
      slotToBankItem(exam, slot, params.batchId, params.examNumber, 0),
      slot
    );
    const aligned = prepareNaplexBankItem(item);
    const globalIndex = slot.slotIndex;

    if (!naplexFullExamItemPasses(aligned, globalIndex)) {
      const qc = assessNaplexFullExamItem(aligned, globalIndex);
      rejected++;
      issues.push(`slot-${slot.slotIndex}:${qc.issues.join(",")}`);
      continue;
    }

    bankItems.push({
      ...aligned,
      ngnPayload: {
        ...aligned.ngnPayload,
        generationMeta: {
          ...(aligned.ngnPayload?.generationMeta as NaplexGenerationMeta),
          qcScore: assessNaplexFullExamItem(aligned, globalIndex).score,
        },
      },
    });
  }

  const deduped = dedupeBatchItems(bankItems);
  rejected += bankItems.length - deduped.length;

  const { kept: diversityKept, dropped: diversityDropped } = filterBatchByDiversity(deduped);
  rejected += diversityDropped;

  const accepted = filterBankItemsForIngest("pharmacy", diversityKept, "ai-curated");
  rejected += diversityKept.length - accepted.length;

  return { accepted, rejected, issues };
}

const MAX_SLOT_RETRY_ROUNDS = 6;

/** Regenerate failed slots until the exam reaches target count or retries exhaust. */
async function fillMissingSlots(params: {
  slots: NaplexGenerationSlot[];
  batchId: string;
  examNumber: number;
  exemplars: BankItem[];
  acceptedBySlot: Map<number, BankItem>;
  onProgress?: (done: number, total: number) => void;
}): Promise<{ rejected: number; issues: string[] }> {
  let totalRejected = 0;
  const allIssues: string[] = [];
  const concurrency = resolveConcurrency();

  for (let round = 0; round < MAX_SLOT_RETRY_ROUNDS; round++) {
    const missing = params.slots.filter((s) => !params.acceptedBySlot.has(s.slotIndex));
    if (missing.length === 0) break;

    console.log(
      `[naplex-full-exam] Exam ${params.examNumber}: retry round ${round + 1} — ${missing.length} missing slot(s)`
    );

    const chunkStarts: number[] = [];
    for (let i = 0; i < missing.length; i += NAPLEX_GENERATION_CHUNK_SIZE) {
      chunkStarts.push(i);
    }

    const tasks = chunkStarts.map((start) => async () => {
      const chunkSlots = missing.slice(start, start + NAPLEX_GENERATION_CHUNK_SIZE);
      return generateChunk({
        slots: chunkSlots,
        batchId: params.batchId,
        examNumber: params.examNumber,
        exemplars: params.exemplars,
      });
    });

    const chunkResults = await runChunkWave(tasks, concurrency);

    for (const result of chunkResults) {
      totalRejected += result.rejected;
      allIssues.push(...result.issues);
      for (const item of result.accepted) {
        const slotIndex =
          (item.ngnPayload?.generationMeta as NaplexGenerationMeta | undefined)?.slotIndex;
        if (slotIndex != null && !params.acceptedBySlot.has(slotIndex)) {
          params.acceptedBySlot.set(slotIndex, item);
        }
      }
    }

    params.onProgress?.(params.acceptedBySlot.size, params.slots.length);
  }

  return { rejected: totalRejected, issues: allIssues };
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

/** Generate one full-length NAPLEX practice exam. */
export async function generateNaplexFullExam(params: {
  examNumber: number;
  questionCount?: number;
  batchId: string;
  onProgress?: (done: number, total: number) => void;
}): Promise<NaplexFullExamBundle> {
  const questionCount = params.questionCount ?? NAPLEX_FULL_EXAM_DEFAULT_COUNT;
  const slots = planNaplexFullExamSlots({
    examNumber: params.examNumber,
    questionCount,
  });
  const exemplars = collectExemplars();
  const concurrency = resolveConcurrency();

  const chunkStarts: number[] = [];
  for (let i = 0; i < slots.length; i += NAPLEX_GENERATION_CHUNK_SIZE) {
    chunkStarts.push(i);
  }

  console.log(
    `[naplex-full-exam] Exam ${params.examNumber}: ${slots.length} slots, ${chunkStarts.length} chunks`
  );

  const allItems: BankItem[] = [];
  let totalRejected = 0;
  const allIssues: string[] = [];
  const acceptedBySlot = new Map<number, BankItem>();
  let done = 0;

  const tasks = chunkStarts.map((start) => async () => {
    const chunkSlots = slots.slice(start, start + NAPLEX_GENERATION_CHUNK_SIZE);
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
    totalRejected += result.rejected;
    allIssues.push(...result.issues);
    for (const item of result.accepted) {
      const slotIndex =
        (item.ngnPayload?.generationMeta as NaplexGenerationMeta | undefined)?.slotIndex;
      if (slotIndex != null) acceptedBySlot.set(slotIndex, item);
    }
  }

  const retryResult = await fillMissingSlots({
    slots,
    batchId: params.batchId,
    examNumber: params.examNumber,
    exemplars,
    acceptedBySlot,
    onProgress: params.onProgress,
  });
  totalRejected += retryResult.rejected;
  allIssues.push(...retryResult.issues);

  allItems.push(
    ...[...acceptedBySlot.entries()]
      .sort(([a], [b]) => a - b)
      .map(([, item]) => item)
  );

  const acceptedCount = allItems.length;
  const allPassed = acceptedCount === questionCount;

  return {
    examNumber: params.examNumber,
    title: `NAPLEX Practice Exam ${params.examNumber}`,
    questionCount,
    blueprintSummary: summarizeExamBlueprint(slots),
    formatSummary: summarizeExamFormats(slots),
    items: allItems,
    qaReport: {
      accepted: acceptedCount,
      rejected: totalRejected,
      allPassed,
      issues: allIssues.slice(0, 50),
    },
  };
}

/** Generate multiple full-length NAPLEX practice exams. */
export async function generateNaplexFullExamSet(params: {
  examCount?: number;
  questionCountPerExam?: number;
  batchId?: string;
  onExamComplete?: (exam: NaplexFullExamBundle) => void | Promise<void>;
}): Promise<NaplexGenerationResult> {
  const examCount = params.examCount ?? 10;
  const batchId =
    params.batchId ??
    `naplex-full-${new Date().toISOString().slice(0, 10)}-${Math.random().toString(36).slice(2, 8)}`;

  const exams: NaplexFullExamBundle[] = [];
  let totalAccepted = 0;
  let totalRejected = 0;

  for (let examNumber = 1; examNumber <= examCount; examNumber++) {
    console.log(`\n[naplex-full-exam] === Generating Exam ${examNumber}/${examCount} ===`);
    const exam = await generateNaplexFullExam({
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

/** Serialize exam bundle for database import. */
export function serializeExamForImport(exam: NaplexFullExamBundle): Record<string, unknown> {
  return {
    examNumber: exam.examNumber,
    title: exam.title,
    fieldId: "pharmacy",
    questionCount: exam.questionCount,
    blueprintSummary: exam.blueprintSummary,
    formatSummary: exam.formatSummary,
    qaReport: exam.qaReport,
    questions: exam.items.map((item, index) => ({
      sortOrder: index + 1,
      fieldId: "pharmacy",
      subjectId: item.subjectId,
      topicCategory: item.topicCategory ?? item.subjectId,
      blueprintDomain: item.blueprintDomain,
      blueprintArea: item.ngnPayload?.blueprintArea ?? item.blueprintDomain,
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
