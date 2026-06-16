/**
 * AI batch generation for PANCE question bank — blueprint-aligned slots + diversity controls.
 */
import OpenAI from "openai";
import type { BankItem } from "@/lib/question-bank";
import type { ExamQuestion } from "@/lib/ai";
import { BATCH_DIVERSITY_RULES } from "@/lib/engine/prompts/batch-diversity";
import { PANCE_SYSTEM_AUGMENTATION } from "@/lib/subjects/pance/prompts";
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
import { assessPanceBankItem } from "./quality-gate";
import { stemFormatForIndex, planPanceGenerationSlots } from "./blueprint-quota";
import type { PanceGenerationMeta, PanceGenerationSlot } from "./types";
import {
  PANCE_GENERATION_CHUNK_SIZE,
  PANCE_GENERATION_VERSION,
} from "./types";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export type PanceGenerationResult = {
  items: BankItem[];
  rejected: number;
  batchId: string;
  diversityIssues: number;
};

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
- explanation (detailed teaching rationale)
- clinicalReasoning (why the vignette points to the answer)
- distractorRationale (object mapping each WRONG option to why it fails)
- topicCategory (content category slug)
- taskCategory (task slug from slot)
- blueprintTopic (specific topic from slot)
- difficulty (1–5)
- tags (array including "pance-generated", "PANCE-2025", content category, task category)
- references (array of { label, url? } guideline citations when applicable)`;
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

/** Generate one chunk (default 10) of blueprint-aligned PANCE items. */
export async function generatePanceChunk(params: {
  slots: PanceGenerationSlot[];
  batchId: string;
  exemplarItems?: BankItem[];
}): Promise<{ accepted: BankItem[]; rejected: number }> {
  if (!openai) {
    throw new Error("OPENAI_API_KEY required for PANCE generation.");
  }

  const topic = params.slots[0]?.blueprintTopic ?? "clinical medicine";
  const subjectId = params.slots[0]?.contentCategory;
  const pattern = await analyzeQuestionPatterns({
    fieldId: "pance",
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

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: `${UNIVERSAL_EXAM_SYSTEM}\n${PANCE_SYSTEM_AUGMENTATION}` },
      {
        role: "user",
        content: buildSlotPrompt(params.slots, patternBlock, exemplarBlock),
      },
    ],
    temperature: 0.35,
    max_tokens: 12000,
    response_format: { type: "json_object" },
  });

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

  if (!batchPassesDiversity(deduped)) {
    const issues = auditBatchDiversity(deduped);
    if (issues.length > 3) {
      return { accepted: [], rejected: params.slots.length };
    }
  }

  const accepted = filterBankItemsForIngest("pance", deduped, "generated");
  rejected += deduped.length - accepted.length;

  return { accepted, rejected };
}

/** Generate a full batch (e.g. 500) in chunks of 10 with diversity controls. */
export async function generatePanceBatch(params: {
  count: number;
  deficitsByCategory: Record<string, number>;
  batchId?: string;
  exemplarItems?: BankItem[];
  onProgress?: (done: number, total: number) => void;
}): Promise<PanceGenerationResult> {
  const batchId =
    params.batchId ??
    `pance-${new Date().toISOString().slice(0, 10)}-${Math.random().toString(36).slice(2, 8)}`;
  const slots = planPanceGenerationSlots({
    count: params.count,
    deficitsByCategory: params.deficitsByCategory,
  });

  const allAccepted: BankItem[] = [];
  let totalRejected = 0;
  let diversityIssues = 0;

  for (let i = 0; i < slots.length; i += PANCE_GENERATION_CHUNK_SIZE) {
    const chunk = slots.slice(i, i + PANCE_GENERATION_CHUNK_SIZE);
    const { accepted, rejected } = await generatePanceChunk({
      slots: chunk,
      batchId,
      exemplarItems: params.exemplarItems,
    });
    allAccepted.push(...accepted);
    totalRejected += rejected;
    if (accepted.length > 0 && !batchPassesDiversity(accepted)) {
      diversityIssues += auditBatchDiversity(accepted).length;
    }
    params.onProgress?.(Math.min(i + chunk.length, slots.length), slots.length);
  }

  return {
    items: allAccepted,
    rejected: totalRejected,
    batchId,
    diversityIssues,
  };
}
