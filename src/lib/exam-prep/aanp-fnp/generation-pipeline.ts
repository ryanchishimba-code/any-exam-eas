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
import { assessAanpFnpBankItem } from "./quality-gate";
import { stemFormatForIndex, planAanpFnpGenerationSlots } from "./blueprint-quota";
import type { AanpFnpGenerationMeta, AanpFnpGenerationSlot } from "./types";
import {
  AANP_FNP_GENERATION_CHUNK_SIZE,
  AANP_FNP_GENERATION_VERSION,
} from "./types";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

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
    ngnPayload: {
      ...base.ngnPayload,
      clinicalSystem: slot.clinicalSystem,
      patientAgeGroup: slot.patientAgeGroup,
      blueprintTopic: slot.blueprintTopic,
      blueprintDomain: slot.blueprintDomain,
      generationMeta: meta,
    },
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

  const completion = await openai.chat.completions.create({
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
    const qc = assessAanpFnpBankItem(item, { source: "generated" });
    if (!qc.serveReady || qc.qcScore < 60) {
      rejected++;
      continue;
    }
    bankItems.push({
      ...item,
      difficulty: slot.difficulty,
      ngnPayload: {
        ...item.ngnPayload,
        generationMeta: {
          ...(item.ngnPayload?.generationMeta as AanpFnpGenerationMeta),
          qcScore: qc.qcScore,
          qcFlags: qc.flags,
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

  for (let i = 0; i < slots.length; i += AANP_FNP_GENERATION_CHUNK_SIZE) {
    const chunk = slots.slice(i, i + AANP_FNP_GENERATION_CHUNK_SIZE);
    const result = await generateAanpFnpChunk({
      slots: chunk,
      batchId,
      exemplarItems: params.exemplarItems,
    });
    rejected += result.rejected;

    const diversity = auditBatchDiversity(result.accepted);
    if (!batchPassesDiversity(result.accepted)) {
      diversityIssues += diversity.length;
    }

    allItems.push(...result.accepted);
    params.onProgress?.(Math.min(i + chunk.length, params.count), params.count);
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
