/**
 * AI generation pipeline for NCLEX-RN full-length practice exams.
 */
import { getOpenAiClient } from "@/lib/openai-client";
import type { BankItem } from "@/lib/question-bank";
import type { ExamQuestion } from "@/lib/ai";
import { BATCH_DIVERSITY_RULES } from "@/lib/engine/prompts/batch-diversity";
import { NURSING_EXAM_SYSTEM_AUGMENTATION } from "@/lib/subjects/nursing/prompts";
import { VIGNETTE_REQUIREMENTS } from "@/lib/engine/prompts/vignette";
import { UNIVERSAL_EXAM_SYSTEM } from "@/lib/engine/prompts/base";
import { buildOerGroundingBlock } from "@/lib/engine/prompts/oer-grounding";
import { buildHighYieldRequirements } from "@/lib/engine/prompts/high-yield";
import { gatherAdvancedStudyMaterial } from "@/lib/rag/orchestrator";
import { nursingModule } from "@/lib/subjects/nursing";
import { examQuestionToBankItem } from "@/lib/engine/curation/exam-to-bank";
import { filterBankItemsForIngest } from "../bank-ingest-gate";
import {
  dedupeBatchItems,
  filterBatchByDiversity,
} from "../pance/batch-diversity";
import { NCLEX_CURATED_QUALITY } from "../nclex-curated-quality";
import { NGN_NURSING_SEEDS } from "../ngn-nursing-seeds";
import {
  planNclexFullExamSlots,
  summarizeCaseStudies,
  summarizeExamBlueprint,
} from "./blueprint-quota";
import { buildNclex2026TopicCatalogBlock, labelForNclex2026TopicSlug } from "./blueprint-topics-2026";
import { assessNclexFullExamItem, nclexFullExamItemPasses } from "./quality-gate";
import { repairGeneratedNclexNgnItem } from "../repair-generated-nclex-ngn";
import { maybeEnrichExpertBankItemRationale } from "@/lib/engine/rationale/generate-expert-rationale";
import { attachVisualRationaleToItem } from "@/lib/engine/rationale/enrich-visual-rationale";
import type {
  NclexFullExamBundle,
  NclexGenerationMeta,
  NclexGenerationResult,
  NclexGenerationSlot,
} from "./types";
import {
  NCLEX_FULL_EXAM_DEFAULT_COUNT,
  NCLEX_FULL_EXAM_VERSION,
  NCLEX_GENERATION_CHUNK_SIZE,
  NCLEX_GENERATION_CONCURRENCY,
  resolveNclexGenerationModel,
} from "./types";

const openai = getOpenAiClient("generation");

const MAX_CHUNK_RETRIES = 5;
const CHUNK_RETRY_BASE_MS = 3000;

function resolveConcurrency(): number {
  const raw = process.env.NCLEX_GENERATION_CONCURRENCY;
  if (!raw) return NCLEX_GENERATION_CONCURRENCY;
  const n = parseInt(raw, 10);
  if (!Number.isFinite(n) || n < 1) return NCLEX_GENERATION_CONCURRENCY;
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
        `[nclex-full-exam] ${label} failed (attempt ${attempt}/${MAX_CHUNK_RETRIES}), retrying in ${waitMs}ms…`
      );
      await sleep(waitMs);
    }
  }
  throw lastError;
}

function collectExemplars(): BankItem[] {
  return [...NCLEX_CURATED_QUALITY, ...NGN_NURSING_SEEDS].slice(0, 4).map((item) => ({
    subjectId: item.subjectId,
    vignette: item.vignette,
    question: item.question,
    options: item.options,
    correctAnswer: item.correctAnswer,
    explanation: item.explanation,
    clinicalReasoning: item.clinicalReasoning,
    distractorRationale: item.distractorRationale,
    itemType: item.itemType,
    tags: item.tags,
    ngnPayload: item.ngnPayload,
  }));
}

function formatExemplar(e: BankItem, index: number): string {
  const lines = [
    `[${index + 1}] Client Needs: ${e.subjectId ?? "physiological-adaptation"}`,
    `Vignette:\n${e.vignette ?? ""}`,
    `Stem: ${e.question}`,
    `Options:\n${(e.options ?? []).map((o, i) => `  ${String.fromCharCode(65 + i)}. ${o}`).join("\n")}`,
    `Correct: ${e.correctAnswer}`,
  ];
  if (e.clinicalReasoning?.trim()) {
    lines.push(`Clinical reasoning (CJMM): ${e.clinicalReasoning.trim()}`);
  }
  const dr = e.distractorRationale ?? {};
  const wrong = (e.options ?? []).filter(
    (o) => o.trim().toLowerCase() !== (e.correctAnswer ?? "").trim().toLowerCase()
  );
  if (Object.keys(dr).length > 0 || wrong.length > 0) {
    lines.push("Distractor rationales (YOU MUST provide one per wrong option, citing vignette data):");
    for (const opt of wrong) {
      const why =
        dr[opt] ??
        Object.entries(dr).find(([k]) => k.trim().toLowerCase() === opt.trim().toLowerCase())?.[1];
      if (why) lines.push(`  • ${opt}: ${why}`);
    }
  }
  return lines.join("\n");
}

function buildExemplarBlock(exemplars: BankItem[]): string {
  return exemplars.length
    ? `QUALITY EXEMPLARS (mirror depth, vitals/labs trends, and distractor logic — do NOT copy scenarios):\n\n${exemplars
        .slice(0, 2)
        .map((e, i) => formatExemplar(e, i))
        .join("\n\n---\n\n")}`
    : "";
}

function resolveItemType(slot: NclexGenerationSlot): string {
  if (slot.caseGroupId) return "case_study";
  const fmt = slot.ngnFormat;
  if (fmt === "bow_tie") return "ngn_bowtie";
  if (fmt === "matrix") return "ngn_matrix";
  if (fmt === "select_all") return "select_all";
  if (fmt === "ordered_response" || fmt === "drag_drop") return "ordered_response";
  if (fmt === "highlight") return "ngn_highlight";
  return "vignette";
}

async function buildOerBriefForSlots(slots: NclexGenerationSlot[]): Promise<string> {
  const topics = [...new Set(slots.map((s) => s.blueprintTopic))].slice(0, 4);
  const topic = topics.join("; ");
  const subjectId = slots[0]?.subjectId;
  try {
    const ctx = await gatherAdvancedStudyMaterial("nursing", topic, subjectId);
    const chunkLines = ctx.retrievedChunks
      .slice(0, 8)
      .map((c, i) => `[${i + 1}] ${c.title} (${c.url})\n${c.content.slice(0, 600)}`);
    const brief = ctx.researchBrief?.trim();
    if (brief || chunkLines.length > 0) {
      return [
        buildOerGroundingBlock(),
        brief ? `RESEARCH BRIEF:\n${brief}` : "",
        chunkLines.length ? `OER SOURCE EXCERPTS:\n${chunkLines.join("\n\n")}` : "",
      ]
        .filter(Boolean)
        .join("\n\n");
    }
  } catch (err) {
    console.warn(
      `[nclex-full-exam] OER brief fetch failed (${topic}): ${err instanceof Error ? err.message : String(err)}`
    );
  }
  return buildOerGroundingBlock();
}

function buildSlotPrompt(
  slots: NclexGenerationSlot[],
  exemplarBlock: string,
  oerBlock: string
): string {
  const highYieldBlock = buildHighYieldRequirements(nursingModule, {
    field: "nursing",
    fieldId: "nursing",
    topic: "NCLEX-RN full-length practice exam",
    questionCount: slots.length,
    difficulty: "hard",
    subjectId: undefined,
    sources: [],
    researchBrief: "",
  });

  const slotLines = slots.map((s, i) => {
    const parts = [
      `Client Needs: ${s.categoryLabel}`,
      `subjectId: ${s.subjectId}`,
      `topic slug: ${s.blueprintTopic}`,
      `topic focus: ${labelForNclex2026TopicSlug(s.blueprintTopic)}`,
      `difficulty: ${s.difficulty}/5`,
      `stem style: ${s.stemFormat}`,
    ];
    if (s.ngnFormat) parts.push(`NGN format: ${s.ngnFormat}`);
    if (s.caseGroupId) {
      parts.push(`case study group: ${s.caseGroupId}, step ${s.caseStep}/6`);
      parts.push(
        "unfolding case — add NEW assessment data in vignette vs prior steps; CJMM at this step"
      );
    }
    return `${i + 1}. ${parts.join(" | ")}`;
  });

  return `Generate exactly ${slots.length} original NCLEX-RN practice questions for a full-length board-style exam.

${NURSING_EXAM_SYSTEM_AUGMENTATION}

${highYieldBlock}

${buildNclex2026TopicCatalogBlock()}

${BATCH_DIVERSITY_RULES}

${VIGNETTE_REQUIREMENTS}

${oerBlock}

${exemplarBlock}

ASSIGNED SLOTS (one question per slot — follow exactly):
${slotLines.join("\n")}

Return JSON: { "questions": [ ... ] }
Each question object MUST include:
- vignette (2–4 sentences: demographics, CC, history, vitals/labs — separate from stem)
- question (lead-in stem ending with ? — use assigned stem style)
- options (4 unique strings for MCQ; 5–6 for select_all; bow_tie/matrix use format-specific options)
- correctAnswer (exact match to option(s); comma-separated for select_all / ordered_response)
- explanation (150+ words teaching rationale with pathophysiology)
- clinicalReasoning (CJMM steps: Recognize → Analyze → Prioritize → Generate → Act → Evaluate)
- distractorRationale (object: each WRONG option → why incorrect, citing vignette data)
- topicCategory (Client Needs label, e.g. "Management of Care")
- bloomLevel (apply or analyze)
- difficultyLabel (Easy | Medium | Hard)
- ngnFormat (when assigned: bow_tie | matrix | select_all | ordered_response | highlight | unfolding_case)
- caseStep (when case study: 1–6)
- ngnPayload (REQUIRED when ngnFormat set):
  - bow_tie: { kind:"bow_tie", actions:[4 strings], monitors:[4 strings], monitorPickCount:2, condition }
    correctAnswer = "one action,monitor1,monitor2" using exact action/monitor strings
  - matrix: { kind:"matrix", rows:[3+], columns:[2+] }
    correctAnswer = "row|||column,row|||column" pairs
  - select_all / ordered_response: { kind, options: same as options array }
  - highlight: { kind:"highlight", highlights:[strings], text }
- references (array with NCSBN NCLEX-RN Test Plan / CJMM citation)
- tags (include "nclex-ngn", "curated", "full-exam-generated", and the assigned topic slug)`;
}

function countDistractorRationales(exam: ExamQuestion): number {
  const dr = exam.distractorRationale ?? {};
  return Object.keys(dr).filter((k) => k.trim() && dr[k]?.trim()).length;
}

function parseGenerationResponse(raw: string): ExamQuestion[] {
  const parsed = JSON.parse(raw) as { questions?: ExamQuestion[] };
  return Array.isArray(parsed.questions) ? parsed.questions : [];
}

function stripOptionPrefix(option: unknown): string {
  return String(option ?? "")
    .replace(/^(?:[A-Da-d]|[1-4])[.)]\s*/, "")
    .trim();
}

function coerceOptions(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.map((o) => String(o ?? "").trim()).filter(Boolean);
  if (raw && typeof raw === "object") {
    return Object.values(raw as Record<string, unknown>)
      .map((o) => String(o ?? "").trim())
      .filter(Boolean);
  }
  return [];
}

function normalizeOptions(raw: unknown): [string, string, string, string] {
  const cleaned = coerceOptions(raw).map(stripOptionPrefix).filter(Boolean);
  while (cleaned.length < 4) cleaned.push(`Option ${cleaned.length + 1}`);
  return cleaned.slice(0, 4) as [string, string, string, string];
}

function alignCorrectAnswer(options: string[], correctAnswer: string): string {
  const norm = (s: string) =>
    stripOptionPrefix(s)
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  const target = norm(correctAnswer);
  const match = options.find((o) => norm(o) === target);
  if (match) return match;

  let best: { option: string; score: number } | null = null;
  for (const option of options) {
    const n = norm(option);
    if (n.includes(target) || target.includes(n)) {
      const score = Math.min(n.length, target.length) / Math.max(n.length, target.length);
      if (!best || score > best.score) best = { option, score };
    }
  }
  if (best && best.score >= 0.5) return best.option;

  const targetTokens = new Set(target.split(" ").filter((t) => t.length > 3));
  for (const option of options) {
    const tokens = norm(option).split(" ").filter((t) => t.length > 3);
    const overlap = tokens.filter((t) => targetTokens.has(t)).length;
    if (overlap >= Math.min(3, targetTokens.size)) return option;
  }

  return options[0]!;
}

function normalizeGeneratedExplanation(item: BankItem): BankItem {
  const options = normalizeOptions(item.options);
  const correctAnswer = alignCorrectAnswer(options, item.correctAnswer);

  let question = item.question.trim();
  if (!/(most likely|most appropriate|best|priority|first|select|which|what is the nurse)/i.test(question)) {
    question = `${question.replace(/\?$/, "")} Which action should the nurse take first?`;
  }
  if (!question.endsWith("?")) question += "?";

  let explanation = item.explanation?.trim() ?? "";
  const wrongOptions = options.filter((o) => o.trim() !== correctAnswer.trim());

  if (item.distractorRationale && Object.keys(item.distractorRationale).length > 0) {
    const lines = Object.entries(item.distractorRationale)
      .filter(([opt]) => alignCorrectAnswer(options, opt) !== correctAnswer)
      .map(([opt, why]) => {
        const matchedOpt =
          options.find((o) => o === opt) ??
          options.find((o) => stripOptionPrefix(o) === stripOptionPrefix(opt)) ??
          opt;
        const reason = String(why ?? "").trim();
        const formatted = reason.replace(/^Incorrect\s*[—-]\s*/i, "");
        return `• ${matchedOpt}: Incorrect — ${formatted}`;
      });
    if (lines.length > 0) {
      explanation = explanation.replace(/\n\nWhy other options are incorrect:[\s\S]*$/i, "").trim();
      explanation = `${explanation}\n\nWhy other options are incorrect:\n${lines.join("\n")}`.trim();
    }
  }

  const references =
    item.references?.length && item.references.some((r) => (r.label?.length ?? 0) >= 8)
      ? item.references
      : [
          {
            label: "NCSBN NCLEX-RN Test Plan",
            citation: "Clinical Judgment Measurement Model (CJMM) — 2026",
          },
          ...(item.references ?? []),
        ];

  return { ...item, question, options, correctAnswer, explanation, references };
}

function slotToBankItem(
  exam: ExamQuestion,
  slot: NclexGenerationSlot,
  batchId: string,
  examNumber: number,
  qcScore: number
): BankItem {
  const model = resolveNclexGenerationModel();
  const meta: NclexGenerationMeta = {
    batchId,
    examNumber,
    slotIndex: slot.slotIndex,
    model,
    pipelineVersion: NCLEX_FULL_EXAM_VERSION,
    qcScore,
    generatedAt: new Date().toISOString(),
  };

  const itemType = resolveItemType(slot);
  const tags = [
    "nclex-ngn",
    "curated",
    "full-exam-generated",
    `exam-${examNumber}`,
    slot.subjectId,
    slot.blueprintTopic.replace(/\s+/g, "-"),
    `batch-${batchId}`,
  ];

  const base = examQuestionToBankItem(exam, {
    subjectId: slot.subjectId,
    topicCategory: slot.categoryLabel,
    blueprintDomain:
      slot.subjectId === "management-of-care" || slot.subjectId === "safety-infection"
        ? "nclex-safe-care"
        : slot.subjectId === "psychosocial" || slot.subjectId === "health-promotion"
          ? "nclex-health-promotion"
          : "nclex-physiological",
    difficulty: slot.difficulty,
    tags,
    source: "ai-curated",
  });

  const ngnPayload: Record<string, unknown> = {
    ...base.ngnPayload,
    kind: slot.ngnFormat ?? "mcq",
    blueprintTopic: slot.blueprintTopic,
    clientNeedsCategory: slot.categoryLabel,
    generationMeta: meta,
    ...(slot.caseGroupId
      ? { caseGroupId: slot.caseGroupId, caseStep: slot.caseStep ?? 1 }
      : {}),
    ...(exam.ngnPayload ?? {}),
    ...(exam.chartData ?? {}),
  };

  if (slot.ngnFormat === "bow_tie" && exam.chartData) {
    Object.assign(ngnPayload, exam.chartData);
  }

  return repairGeneratedNclexNgnItem(
    normalizeGeneratedExplanation({
      ...base,
      itemType,
      ngnPayload,
      references: exam.references?.map((label) =>
        typeof label === "string" ? { label } : label
      ) ?? base.references,
    })
  );
}

async function generateChunk(params: {
  slots: NclexGenerationSlot[];
  batchId: string;
  examNumber: number;
  exemplars: BankItem[];
}): Promise<{ accepted: BankItem[]; rejected: number; issues: string[] }> {
  if (!openai) {
    throw new Error("OPENAI_API_KEY required for NCLEX full exam generation.");
  }

  const model = resolveNclexGenerationModel();
  const oerBlock = await buildOerBriefForSlots(params.slots);

  const completion = await withOpenAiRetries("OpenAI completion", () =>
    openai!.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: `${UNIVERSAL_EXAM_SYSTEM}\n${NURSING_EXAM_SYSTEM_AUGMENTATION}`,
        },
        {
          role: "user",
          content: buildSlotPrompt(params.slots, buildExemplarBlock(params.exemplars), oerBlock),
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

    const plannedType = resolveItemType(slot);
    const isNgnSlot =
      Boolean(slot.caseGroupId) || Boolean(slot.ngnFormat) || plannedType !== "vignette";

    // Classic MCQ vignettes still need 3 distractor rationales; NGN formats often
    // encode correctness in payload structure (bowtie/matrix/SATA) instead.
    if (!isNgnSlot && countDistractorRationales(exam) < 3) {
      rejected++;
      issues.push(`slot-${slot.slotIndex}:missing_distractor_rationales`);
      continue;
    }

    try {
      let item = repairGeneratedNclexNgnItem(
        normalizeGeneratedExplanation(
          slotToBankItem(exam, slot, params.batchId, params.examNumber, 0)
        )
      );
      const globalIndex = slot.slotIndex;
      let qc = assessNclexFullExamItem(item, globalIndex);

      if (!qc.ok) {
        // Second repair pass after assessment mutates nothing — rebuild from slot type hints.
        item = repairGeneratedNclexNgnItem({
          ...item,
          itemType: plannedType,
          ngnPayload: {
            ...(item.ngnPayload && typeof item.ngnPayload === "object"
              ? (item.ngnPayload as Record<string, unknown>)
              : {}),
            kind: slot.ngnFormat ?? plannedType,
          },
        });
        qc = assessNclexFullExamItem(item, globalIndex);
      }

      if (!qc.ok) {
        rejected++;
        issues.push(`slot-${slot.slotIndex}:${qc.issues.join(",")}`);
        if (process.env.NCLEX_NGN_DEBUG === "1") {
          console.warn(
            `[ngn-debug] reject slot=${slot.slotIndex} type=${item.itemType} fmt=${slot.ngnFormat} opts=${item.options?.length ?? 0} ans=${JSON.stringify(item.correctAnswer).slice(0, 80)} issues=${qc.issues.join(",")}`
          );
        }
        continue;
      }

      bankItems.push(
        attachVisualRationaleToItem(
          await maybeEnrichExpertBankItemRationale(
            {
              ...item,
              ngnPayload: {
                ...item.ngnPayload,
                generationMeta: {
                  ...(item.ngnPayload?.generationMeta as NclexGenerationMeta),
                  qcScore: qc.score,
                },
              },
            },
            "nursing"
          )
        )
      );
    } catch (err) {
      rejected++;
      issues.push(
        `slot-${slot.slotIndex}:parse_error:${err instanceof Error ? err.message : String(err)}`
      );
    }
  }

  const deduped = dedupeBatchItems(bankItems);
  rejected += bankItems.length - deduped.length;

  const { kept: diversityKept, dropped: diversityDropped } = filterBatchByDiversity(deduped);
  rejected += diversityDropped;

  const accepted = filterBankItemsForIngest("nursing", diversityKept, "ai-curated");
  rejected += diversityKept.length - accepted.length;

  return { accepted, rejected, issues };
}

/** Retry individual failed slots until exam count is met or max attempts reached. */
async function fillExamDeficit(params: {
  slots: NclexGenerationSlot[];
  existing: BankItem[];
  batchId: string;
  examNumber: number;
  exemplars: BankItem[];
  targetCount: number;
  maxRounds?: number;
}): Promise<{ items: BankItem[]; rejected: number; issues: string[] }> {
  const filled = [...params.existing];
  const covered = new Set(
    filled.map(
      (item) => (item.ngnPayload?.generationMeta as NclexGenerationMeta)?.slotIndex
    )
  );
  let rejected = 0;
  const issues: string[] = [];
  const maxRounds = params.maxRounds ?? 6;

  for (let round = 0; round < maxRounds && filled.length < params.targetCount; round++) {
    const missing = params.slots.filter((s) => !covered.has(s.slotIndex));
    if (!missing.length) break;

    const batch = missing.slice(0, NCLEX_GENERATION_CHUNK_SIZE);
    const result = await generateChunk({
      slots: batch,
      batchId: params.batchId,
      examNumber: params.examNumber,
      exemplars: params.exemplars,
    });

    for (const item of result.accepted) {
      const slotIndex = (item.ngnPayload?.generationMeta as NclexGenerationMeta)?.slotIndex;
      if (slotIndex == null || covered.has(slotIndex)) continue;
      covered.add(slotIndex);
      filled.push(item);
    }
    rejected += result.rejected;
    issues.push(...result.issues);
  }

  filled.sort(
    (a, b) =>
      ((a.ngnPayload?.generationMeta as NclexGenerationMeta)?.slotIndex ?? 0) -
      ((b.ngnPayload?.generationMeta as NclexGenerationMeta)?.slotIndex ?? 0)
  );

  return { items: filled, rejected, issues };
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

/** Generate one full-length NCLEX practice exam. */
export async function generateNclexFullExam(params: {
  examNumber: number;
  questionCount?: number;
  batchId: string;
  /** Override slot plan (e.g. gap-fill toward blueprint deficits). */
  slots?: NclexGenerationSlot[];
  onProgress?: (done: number, total: number) => void;
}): Promise<NclexFullExamBundle> {
  const questionCount = params.questionCount ?? NCLEX_FULL_EXAM_DEFAULT_COUNT;
  const slots =
    params.slots ??
    planNclexFullExamSlots({
      examNumber: params.examNumber,
      questionCount,
    });
  const exemplars = collectExemplars();
  const concurrency = resolveConcurrency();

  const chunkStarts: number[] = [];
  for (let i = 0; i < slots.length; i += NCLEX_GENERATION_CHUNK_SIZE) {
    chunkStarts.push(i);
  }

  console.log(
    `[nclex-full-exam] Exam ${params.examNumber}: ${slots.length} slots, ${chunkStarts.length} chunks`
  );

  const allItems: BankItem[] = [];
  let totalRejected = 0;
  const allIssues: string[] = [];
  let done = 0;

  const tasks = chunkStarts.map((start) => async () => {
    const chunkSlots = slots.slice(start, start + NCLEX_GENERATION_CHUNK_SIZE);
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
    allItems.push(...result.accepted);
    totalRejected += result.rejected;
    allIssues.push(...result.issues);
  }

  if (allItems.length < questionCount) {
    console.log(
      `  Exam ${params.examNumber}: filling deficit (${allItems.length}/${questionCount})…`
    );
    const filled = await fillExamDeficit({
      slots,
      existing: allItems,
      batchId: params.batchId,
      examNumber: params.examNumber,
      exemplars,
      targetCount: questionCount,
    });
    allItems.length = 0;
    allItems.push(...filled.items);
    totalRejected += filled.rejected;
    allIssues.push(...filled.issues);
  }

  allItems.sort(
    (a, b) =>
      ((a.ngnPayload?.generationMeta as NclexGenerationMeta)?.slotIndex ?? 0) -
      ((b.ngnPayload?.generationMeta as NclexGenerationMeta)?.slotIndex ?? 0)
  );

  const acceptedCount = allItems.length;
  const allPassed = acceptedCount === questionCount;

  return {
    examNumber: params.examNumber,
    title: `NCLEX-RN Full-Length Practice Exam ${params.examNumber}`,
    questionCount,
    blueprintSummary: summarizeExamBlueprint(slots),
    caseStudyGroups: summarizeCaseStudies(slots),
    items: allItems,
    qaReport: {
      accepted: acceptedCount,
      rejected: totalRejected,
      allPassed,
      issues: allIssues.slice(0, 50),
    },
  };
}

/** Generate multiple full-length NCLEX practice exams. */
export async function generateNclexFullExamSet(params: {
  examCount?: number;
  questionCountPerExam?: number;
  batchId?: string;
  onExamComplete?: (exam: NclexFullExamBundle) => void | Promise<void>;
}): Promise<NclexGenerationResult> {
  const examCount = params.examCount ?? 10;
  const batchId =
    params.batchId ??
    `nclex-full-${new Date().toISOString().slice(0, 10)}-${Math.random().toString(36).slice(2, 8)}`;

  const exams: NclexFullExamBundle[] = [];
  let totalAccepted = 0;
  let totalRejected = 0;

  for (let examNumber = 1; examNumber <= examCount; examNumber++) {
    console.log(`\n[nclex-full-exam] === Generating Exam ${examNumber}/${examCount} ===`);
    const exam = await generateNclexFullExam({
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
export function serializeExamForImport(exam: NclexFullExamBundle): Record<string, unknown> {
  return {
    examNumber: exam.examNumber,
    title: exam.title,
    fieldId: "nursing",
    questionCount: exam.questionCount,
    blueprintSummary: exam.blueprintSummary,
    caseStudyGroups: exam.caseStudyGroups,
    qaReport: exam.qaReport,
    questions: exam.items.map((item, index) => ({
      sortOrder: index + 1,
      fieldId: "nursing",
      subjectId: item.subjectId,
      topicCategory: item.topicCategory ?? item.subjectId,
      blueprintDomain: item.blueprintDomain,
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
      clientNeedsCategory:
        (item.ngnPayload?.clientNeedsCategory as string | undefined) ?? item.topicCategory,
    })),
  };
}
