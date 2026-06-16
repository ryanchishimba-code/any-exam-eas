/**
 * AI batch generation for AANP FNP question bank — blueprint-aligned slots + diversity controls.
 */
import OpenAI from "openai";
import type { BankItem } from "@/lib/question-bank";
import type { ExamQuestion } from "@/lib/ai";
import { BATCH_DIVERSITY_RULES } from "@/lib/engine/prompts/batch-diversity";
import {
  AANP_FNP_EXAM_SYSTEM_AUGMENTATION,
} from "@/lib/subjects/aanp-fnp/prompts";
import { VIGNETTE_REQUIREMENTS } from "@/lib/engine/prompts/vignette";
import { UNIVERSAL_EXAM_SYSTEM } from "@/lib/engine/prompts/base";
import { examQuestionToBankItem } from "@/lib/engine/curation/exam-to-bank";
import { analyzeQuestionPatterns } from "@/lib/rag/pattern-analyzer";
import { filterBankItemsForIngest } from "../bank-ingest-gate";
import {
  auditBatchDiversity,
  batchPassesDiversity,
  dedupeBatchItems,
} from "./batch-diversity";
import { runAanpFnpHybridGate } from "./hybrid-gate";
import { stemFormatForIndex, planAanpFnpGenerationSlots } from "./blueprint-quota";
import { attachAanpFnpStudyLinks } from "./study-links";
import type { AanpFnpGenerationMeta, AanpFnpGenerationSlot } from "./types";
import {
  AANP_FNP_GENERATION_CHUNK_SIZE,
  AANP_FNP_GENERATION_CONCURRENCY,
  AANP_FNP_GENERATION_VERSION,
} from "./types";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const MAX_CHUNK_RETRIES = 5;
const CHUNK_RETRY_BASE_MS = 3000;

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
          err.message.includes("503"));
      if (!retryable || attempt === MAX_CHUNK_RETRIES) break;
      const waitMs = CHUNK_RETRY_BASE_MS * 2 ** (attempt - 1);
      console.warn(`[aanp-fnp] ${label} failed (attempt ${attempt}/${MAX_CHUNK_RETRIES}), retrying in ${waitMs}ms…`);
      await sleep(waitMs);
    }
  }
  throw lastError;
}

export type AanpFnpGenerationResult = {
  items: BankItem[];
  rejected: number;
  batchId: string;
  diversityIssues: number;
};

function buildSlotPrompt(
  slots: AanpFnpGenerationSlot[],
  patternBlock: string,
  exemplarBlock: string
): string {
  const slotLines = slots.map((s, i) => {
    const stemHint = stemFormatForIndex(i);
    return `${i + 1}. Domain: ${s.blueprintDomain} | System: ${s.clinicalSystem} | Age group: ${s.patientAgeGroup} | Topic: ${s.blueprintTopic} | Difficulty: ${s.difficulty}/5 | Format: ${stemHint}`;
  });

  return `Generate exactly ${slots.length} original AANP FNP-C practice questions.

${AANP_FNP_EXAM_SYSTEM_AUGMENTATION}

${BATCH_DIVERSITY_RULES}

${VIGNETTE_REQUIREMENTS}

${patternBlock}

${exemplarBlock}

ASSIGNED SLOTS (follow exactly — one question per slot):
${slotLines.join("\n")}

Return JSON: { "questions": [ ... ] }
Each question object:
- vignette (2–4 sentences: demographics, CC, history, exam, labs/imaging appropriate to age group)
- question (lead-in stem only, ending with ?)
- options (exactly 4 unique strings, no A/B/C/D prefix)
- correctAnswer (must match one option exactly)
- explanation (detailed teaching rationale)
- clinicalReasoning (Assess → Diagnose → Plan → Evaluate chain)
- distractorRationale (object mapping each WRONG option to why it fails)
- topicCategory (clinical system slug)
- blueprintDomain (assess | diagnose | plan | evaluate from slot)
- patientAgeGroup (age group slug from slot)
- blueprintTopic (specific topic from slot)
- difficulty (1–5)
- tags (array including "aanp-fnp-generated", "AANP-FNP-2024", domain, age group, clinical system)
- references (array of { label, url? } guideline citations when applicable)`;
}

function parseGenerationResponse(raw: string): ExamQuestion[] {
  const parsed = JSON.parse(raw) as { questions?: ExamQuestion[] };
  return Array.isArray(parsed.questions) ? parsed.questions : [];
}

function slotToBankItem(
  exam: ExamQuestion,
  slot: AanpFnpGenerationSlot,
  batchId: string,
  slotIndex: number,
  qcScore: number
): BankItem {
  const meta: AanpFnpGenerationMeta = {
    batchId,
    slotIndex,
    model: "gpt-4o-mini",
    pipelineVersion: AANP_FNP_GENERATION_VERSION,
    blueprintAligned: true,
    difficultyRating: slot.difficulty,
    qcScore,
    generatedAt: new Date().toISOString(),
  };

  const base = examQuestionToBankItem(exam, {
    subjectId: slot.clinicalSystem,
    topicCategory: slot.clinicalSystem,
    blueprintDomain: slot.blueprintDomain,
    difficulty: slot.difficulty,
    tags: [
      "aanp-fnp-generated",
      "AANP-FNP-2024",
      slot.blueprintDomain,
      slot.clinicalSystem,
      slot.patientAgeGroup,
      slot.blueprintTopic.toLowerCase().replace(/\s+/g, "-"),
      `batch-${batchId}`,
    ],
    source: "generated",
  });

  return {
    ...base,
    itemType: "vignette",
    patientAgeGroup: slot.patientAgeGroup,
    blueprintTopic: slot.blueprintTopic,
    ngnPayload: attachAanpFnpStudyLinks(
      {
        ...base.ngnPayload,
        clinicalSystem: slot.clinicalSystem,
        patientAgeGroup: slot.patientAgeGroup,
        blueprintTopic: slot.blueprintTopic,
        blueprintDomain: slot.blueprintDomain,
        generationMeta: meta,
      },
      {
        blueprintDomain: slot.blueprintDomain,
        clinicalSystem: slot.clinicalSystem,
        blueprintTopic: slot.blueprintTopic,
        patientAgeGroup: slot.patientAgeGroup,
      }
    ),
  };
}

export async function generateAanpFnpChunk(params: {
  slots: AanpFnpGenerationSlot[];
  batchId: string;
  exemplarItems?: BankItem[];
}): Promise<{ accepted: BankItem[]; rejected: number }> {
  if (!openai) {
    throw new Error("OPENAI_API_KEY required for AANP FNP generation.");
  }

  const topic = params.slots[0]?.blueprintTopic ?? "primary care";
  const subjectId = params.slots[0]?.clinicalSystem;
  const pattern = await analyzeQuestionPatterns({
    fieldId: "aanp-fnp",
    topic,
    subjectId,
    sampleSize: 15,
  });

  const patternBlock = pattern.exemplarStems.length
    ? `EXEMPLAR PATTERNS FROM BANK:\nStems: ${pattern.exemplarStems.slice(0, 3).join("\n---\n")}\nDistractor logic: ${pattern.distractorPatterns.join("; ")}`
    : "";

  const exemplarBlock = params.exemplarItems?.length
    ? `SEED EXEMPLARS (mirror quality, do NOT copy):\n${params.exemplarItems
        .slice(0, 3)
        .map(
          (e, i) =>
            `[${i + 1}] Vignette: ${(e.vignette ?? "").slice(0, 200)}…\nStem: ${e.question}\nCorrect: ${e.correctAnswer}`
        )
        .join("\n\n")}`
    : "";

  const completion = await withOpenAiRetries("OpenAI completion", () =>
    openai!.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: `${UNIVERSAL_EXAM_SYSTEM}\n${AANP_FNP_EXAM_SYSTEM_AUGMENTATION}` },
        {
          role: "user",
          content: buildSlotPrompt(params.slots, patternBlock, exemplarBlock),
        },
      ],
      temperature: 0.35,
      max_tokens: 12000,
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
    let item = slotToBankItem(exam, slot, params.batchId, i, 0);
    const gated = await runAanpFnpHybridGate(item, { source: "generated", useAiRepair: true });
    if (!gated.ingestReady) {
      rejected++;
      continue;
    }
    item = gated.item;
    bankItems.push({
      ...item,
      difficulty: slot.difficulty,
      ngnPayload: {
        ...item.ngnPayload,
        generationMeta: {
          ...(item.ngnPayload?.generationMeta as AanpFnpGenerationMeta),
          qcScore: gated.qcScore,
          qcFlags: gated.flags,
          repairMethod: gated.repairMethod,
          hybridGate: gated.tier,
        },
      },
    });
  }

  const deduped = dedupeBatchItems(bankItems);
  rejected += bankItems.length - deduped.length;

  return { accepted: deduped, rejected };
}

/** Generate a blueprint-aligned batch of AANP FNP items. */
export async function generateAanpFnpBatch(params: {
  count: number;
  domainDeficits: Record<string, number>;
  ageGroupDeficits?: Record<string, number>;
  exemplarItems?: BankItem[];
  onProgress?: (done: number, total: number) => void;
  /** Persist each chunk as it completes (survives mid-run network failures). */
  onChunkAccepted?: (items: BankItem[], meta: { chunkIndex: number; batchId: string }) => Promise<void>;
}): Promise<AanpFnpGenerationResult> {
  const batchId = `aanp-${Date.now().toString(36)}`;
  const slots = planAanpFnpGenerationSlots({
    count: params.count,
    domainDeficits: params.domainDeficits,
    ageGroupDeficits: params.ageGroupDeficits,
  });

  const allItems: BankItem[] = [];
  let rejected = 0;
  let diversityIssues = 0;

  const chunkStarts: number[] = [];
  for (let i = 0; i < slots.length; i += AANP_FNP_GENERATION_CHUNK_SIZE) {
    chunkStarts.push(i);
  }

  const concurrency = AANP_FNP_GENERATION_CONCURRENCY;
  let processedSlots = 0;

  for (let wave = 0; wave < chunkStarts.length; wave += concurrency) {
    const waveStarts = chunkStarts.slice(wave, wave + concurrency);
    const waveResults = await Promise.all(
      waveStarts.map(async (start) => {
        const chunk = slots.slice(start, start + AANP_FNP_GENERATION_CHUNK_SIZE);
        const result = await generateAanpFnpChunk({
          slots: chunk,
          batchId,
          exemplarItems: params.exemplarItems,
        });
        return { start, chunk, result };
      })
    );

    for (const { start, chunk, result } of waveResults) {
      rejected += result.rejected;

      const diversity = auditBatchDiversity(result.accepted);
      if (!batchPassesDiversity(result.accepted)) {
        diversityIssues += diversity.length;
      }

      allItems.push(...result.accepted);

      const chunkItems = filterBankItemsForIngest("aanp-fnp", result.accepted, "generated");
      if (chunkItems.length > 0 && params.onChunkAccepted) {
        await params.onChunkAccepted(chunkItems, {
          chunkIndex: start / AANP_FNP_GENERATION_CHUNK_SIZE,
          batchId,
        });
      }

      processedSlots += chunk.length;
    }

    params.onProgress?.(Math.min(processedSlots, params.count), params.count);
  }

  const ingested = filterBankItemsForIngest("aanp-fnp", allItems, "generated");

  return {
    items: ingested,
    rejected,
    batchId,
    diversityIssues,
  };
}

export { planAanpFnpGenerationSlots };
