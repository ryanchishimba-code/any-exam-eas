/**
 * Variant expansion — derive new questions from curated seeds (same concept, new presentation).
 */
import OpenAI from "openai";
import type { BankItem } from "@/lib/question-bank";
import type { ExamQuestion } from "@/lib/ai";
import { UNIVERSAL_EXAM_SYSTEM } from "@/lib/engine/prompts/base";
import { VIGNETTE_REQUIREMENTS } from "@/lib/engine/prompts/vignette";
import { AANP_FNP_EXAM_SYSTEM_AUGMENTATION } from "@/lib/subjects/aanp-fnp/prompts";
import { examQuestionToBankItem } from "@/lib/engine/curation/exam-to-bank";
import { splitUsmleBankItem } from "../usmle-clinical-gate";
import { runAanpFnpHybridGate } from "./hybrid-gate";
import { dedupeBatchItems } from "./batch-diversity";
import { attachAanpFnpStudyLinks } from "./study-links";
import {
  buildVariantGenerationUserPrompt,
  summarizeAanpFnpGateFailures,
} from "./clinical-gate-prompt";
import type { AanpFnpGenerationMeta, AanpFnpPatientAgeGroupId } from "./types";
import { AANP_FNP_GENERATION_VERSION } from "./types";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const MAX_VARIANT_ATTEMPTS = 2;
const MAX_API_RETRIES = 5;
const RETRY_BASE_MS = 3000;

export type AanpFnpVariantKind =
  | "age-shift"
  | "presentation-change"
  | "stem-angle"
  | "distractor-refresh";

const VARIANT_KINDS: AanpFnpVariantKind[] = [
  "age-shift",
  "presentation-change",
  "stem-angle",
  "distractor-refresh",
];

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function withRetries<T>(label: string, fn: () => Promise<T>): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_API_RETRIES; attempt++) {
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
      if (!retryable || attempt === MAX_API_RETRIES) break;
      await sleep(RETRY_BASE_MS * 2 ** (attempt - 1));
      console.warn(`[aanp-fnp-variant] ${label} retry ${attempt}/${MAX_API_RETRIES}`);
    }
  }
  throw lastError;
}

function parseResponse(raw: string): ExamQuestion | null {
  try {
    const parsed = JSON.parse(raw) as { question?: ExamQuestion } & ExamQuestion;
    const q = parsed.question && typeof parsed.question === "object"
      ? (parsed.question as ExamQuestion)
      : (parsed as ExamQuestion);
    if (!q?.question || !q.correctAnswer || !q.options?.length) return null;
    return q;
  } catch {
    return null;
  }
}

function variantInstruction(kind: AanpFnpVariantKind, targetAge?: string): string {
  switch (kind) {
    case "age-shift":
      return targetAge
        ? `Shift the patient to age group "${targetAge}" while testing the SAME underlying clinical concept. Adjust vitals, history, and management appropriately for that age.`
        : "Shift to a different valid age group while testing the SAME underlying clinical concept.";
    case "presentation-change":
      return "Change the clinical presentation (different chief complaint framing, timing, or severity) while testing the SAME core concept.";
    case "stem-angle":
      return "Keep the vignette similar but change the question stem to test a different cognitive angle within the same domain (e.g., next step vs diagnosis vs monitoring).";
    case "distractor-refresh":
      return "Create a fresh vignette and entirely new plausible distractors while preserving the same correct clinical answer category.";
  }
}

function seedToVariantBankItem(
  exam: ExamQuestion,
  seed: BankItem,
  batchId: string,
  variantIndex: number,
  kind: AanpFnpVariantKind,
  qcScore: number
): BankItem {
  const domain =
    seed.blueprintDomain ??
    (seed.ngnPayload?.blueprintDomain as string | undefined) ??
    seed.subjectId ??
    "assess";
  const ageGroup =
    seed.patientAgeGroup ??
    (seed.ngnPayload?.patientAgeGroup as string | undefined);
  const clinicalSystem =
    (seed.ngnPayload?.clinicalSystem as string | undefined) ?? seed.subjectId ?? "cardiovascular";
  const topic =
    seed.blueprintTopic ??
    (seed.ngnPayload?.blueprintTopic as string | undefined) ??
    "primary care";

  const meta: AanpFnpGenerationMeta = {
    batchId,
    slotIndex: variantIndex,
    model: "gpt-4o-mini",
    pipelineVersion: AANP_FNP_GENERATION_VERSION,
    blueprintAligned: true,
    qcScore,
    seedExemplarIds: [(seed.id ?? seed.subjectId ?? "seed")].filter(Boolean) as string[],
    generatedAt: new Date().toISOString(),
  };

  const base = examQuestionToBankItem(exam, {
    subjectId: clinicalSystem,
    topicCategory: clinicalSystem,
    blueprintDomain: domain,
    difficulty: seed.difficulty ?? 3,
    tags: [
      "aanp-fnp-variant",
      "aanp-fnp-generated",
      "AANP-FNP-2024",
      domain,
      clinicalSystem,
      kind,
      `variant-${batchId}`,
    ],
    source: "generated",
  });

  return {
    ...base,
    itemType: "vignette",
    patientAgeGroup: ageGroup,
    blueprintTopic: topic,
    ngnPayload: attachAanpFnpStudyLinks(
      {
        ...base.ngnPayload,
        clinicalSystem,
        patientAgeGroup: ageGroup,
        blueprintTopic: topic,
        blueprintDomain: domain,
        variantKind: kind,
        seedSubjectId: seed.subjectId,
        generationMeta: meta,
      },
      {
        blueprintDomain: domain,
        clinicalSystem,
        blueprintTopic: topic,
        patientAgeGroup: ageGroup,
      },
      seed.ngnPayload ?? undefined
    ),
  };
}

/** Generate one variant from a curated seed exemplar (with QA-targeted retry). */
export async function generateAanpFnpVariant(params: {
  seed: BankItem;
  kind: AanpFnpVariantKind;
  batchId: string;
  variantIndex: number;
  targetAgeGroup?: AanpFnpPatientAgeGroupId;
}): Promise<BankItem | null> {
  if (!openai) throw new Error("OPENAI_API_KEY required for variant generation.");

  const domain =
    params.seed.blueprintDomain ??
    (params.seed.ngnPayload?.blueprintDomain as string | undefined) ??
    "assess";

  let retryFeedback: string[] | undefined;

  for (let attempt = 0; attempt < MAX_VARIANT_ATTEMPTS; attempt++) {
    const completion = await withRetries("variant completion", () =>
      openai!.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: attempt === 0 ? 0.28 : 0.22,
        max_tokens: 5000,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `${UNIVERSAL_EXAM_SYSTEM}\n${AANP_FNP_EXAM_SYSTEM_AUGMENTATION}\n\n${VIGNETTE_REQUIREMENTS}`,
          },
          {
            role: "user",
            content: buildVariantGenerationUserPrompt({
              variantTask: variantInstruction(params.kind, params.targetAgeGroup),
              seed: params.seed,
              domain,
              retryFeedback,
            }),
          },
        ],
      })
    );

    const raw = completion.choices[0]?.message?.content ?? "{}";
    const exam = parseResponse(raw);
    if (!exam) continue;

    const item = seedToVariantBankItem(
      exam,
      params.seed,
      params.batchId,
      params.variantIndex,
      params.kind,
      0
    );

    const gated = await runAanpFnpHybridGate(item, { source: "generated", useAiRepair: true });
    if (gated.ingestReady) {
      return gated.item;
    }

    retryFeedback = summarizeAanpFnpGateFailures(gated.item);
  }

  return null;
}

export type AanpFnpVariantBatchResult = {
  items: BankItem[];
  rejected: number;
  batchId: string;
};

/** Expand seeds into variants (default 4 kinds per seed). */
export async function generateAanpFnpVariantsFromSeeds(params: {
  seeds: BankItem[];
  variantsPerSeed?: number;
  concurrency?: number;
  onProgress?: (done: number, total: number) => void;
  onVariantAccepted?: (item: BankItem) => Promise<void>;
}): Promise<AanpFnpVariantBatchResult> {
  const batchId = `var-${Date.now().toString(36)}`;
  const variantsPerSeed = params.variantsPerSeed ?? 4;
  const concurrency = params.concurrency ?? 5;

  type Job = { seed: BankItem; seedIndex: number; kind: AanpFnpVariantKind; variantIndex: number };
  const jobs: Job[] = [];

  for (let s = 0; s < params.seeds.length; s++) {
    const seed = params.seeds[s]!;
    const kinds = VARIANT_KINDS.slice(0, variantsPerSeed);
    for (let v = 0; v < kinds.length; v++) {
      jobs.push({
        seed,
        seedIndex: s,
        kind: kinds[v]!,
        variantIndex: s * variantsPerSeed + v,
      });
    }
  }

  const accepted: BankItem[] = [];
  let rejected = 0;
  let done = 0;

  async function runJob(job: Job): Promise<void> {
    try {
      const item = await generateAanpFnpVariant({
        seed: job.seed,
        kind: job.kind,
        batchId,
        variantIndex: job.variantIndex,
      });
      if (item) {
        accepted.push(item);
        if (params.onVariantAccepted) await params.onVariantAccepted(item);
      } else {
        rejected++;
      }
    } catch {
      rejected++;
    } finally {
      done++;
      params.onProgress?.(done, jobs.length);
    }
  }

  for (let i = 0; i < jobs.length; i += concurrency) {
    const slice = jobs.slice(i, i + concurrency);
    await Promise.all(slice.map(runJob));
  }

  return {
    items: dedupeBatchItems(accepted),
    rejected,
    batchId,
  };
}
