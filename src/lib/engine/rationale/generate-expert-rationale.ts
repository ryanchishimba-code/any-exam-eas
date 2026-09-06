/**
 * Generate UWorld-caliber expert rationales (NCLEX + USMLE) via OpenAI.
 */
import { z } from "zod";
import { getOpenAiClient } from "@/lib/openai-client";
import {
  buildNclexExpertSystemPrompt,
  buildNclexExpertUserPrompt,
} from "../prompts/nclex-expert-rationale";
import {
  buildUsmleExpertSystemPrompt,
  buildUsmleExpertUserPrompt,
} from "../prompts/usmle-expert-rationale";
import type { RationaleGenerationInput } from "../prompts/rationale-generation";
import { validateStructuredRationale, matchRationaleOptionToBank } from "./validate-rationale";
import {
  assembleExpertRationale,
  type AssembledExpertRationale,
} from "./assemble-expert-rationale";
import { attachVisualRationaleToItem } from "./enrich-visual-rationale";
import type { VisualRationaleBlock } from "./visual-rationale-types";
import type { ExpertStructuredRationale } from "./expert-rationale-types";
import {
  EXPERT_RATIONALE_META_KEY,
  EXPERT_RATIONALE_VERSION,
  USMLE_EXPERT_RATIONALE_VERSION,
} from "./expert-rationale-types";
import { scoreUsmleExplanationQuality } from "./usmle-explanation-quality";
import { isUsmleFieldId } from "@/lib/exam-prep/usmle/steps";
import { isNclexField } from "@/lib/exam/exam-lengths";

const ExpertRationaleSchema = z.object({
  whyCorrect: z.object({
    headline: z.string().min(20),
    conceptBreakdown: z.array(z.string().min(8)).min(2).max(5),
    clinicalContext: z.string().min(20),
  }),
  stepByStepReasoning: z.array(z.string().min(15)).min(3).max(7),
  whyIncorrect: z.array(
    z.object({
      option: z.string().min(1),
      misconception: z.string().min(10),
      correction: z.string().min(25),
      conceptLink: z.string().min(10),
    })
  ),
  clinicalPearl: z.string().min(20),
  pharmacologyTieIn: z.string().optional(),
  highYieldFacts: z.array(z.string().min(10)).min(2).max(5),
  commonPitfalls: z.array(z.string().min(10)).min(1).max(4),
  nextStepInCare: z.string().min(15).optional(),
  testTakingTip: z.string().min(15),
  realWorldApplication: z.string().min(20),
  layeredDepth: z
    .object({
      basic: z.string().min(15),
      intermediate: z.string().min(20),
      advanced: z.string().min(20),
    })
    .optional(),
  visualCues: z
    .array(
      z.object({
        label: z.string().min(3),
        description: z.string().min(10),
      })
    )
    .optional(),
  visualBlocks: z
    .array(
      z.discriminatedUnion("kind", [
        z.object({
          kind: z.literal("lab_table"),
          title: z.string().min(3),
          rows: z
            .array(
              z.object({
                label: z.string().min(1),
                value: z.string().min(1),
                reference: z.string().optional(),
                abnormal: z.boolean().optional(),
                note: z.string().optional(),
              })
            )
            .min(2),
        }),
        z.object({
          kind: z.literal("comparison"),
          title: z.string().min(3),
          headers: z.tuple([z.string(), z.string(), z.string()]),
          rows: z.array(z.tuple([z.string(), z.string(), z.string()])).min(1),
        }),
        z.object({
          kind: z.literal("flow"),
          title: z.string().min(3),
          steps: z.array(z.string().min(8)).min(3).max(7),
        }),
      ])
    )
    .optional(),
  crossReferences: z
    .array(
      z.object({
        exam: z.string().min(2),
        topic: z.string().min(3),
        note: z.string().min(10),
      })
    )
    .optional(),
  keyTakeaway: z.string().min(15),
  memoryHook: z.string().min(5).optional(),
});

export type GenerateExpertRationaleResult = {
  structured: ExpertStructuredRationale;
  assembled: AssembledExpertRationale;
  quality: { ok: boolean; score: number; issues: string[] };
  model: string;
  version: string;
};

const openai = getOpenAiClient("enrichment");

/** Drop broken visualBlocks so zod parse can succeed (lab_table with <2 rows, etc.). */
function sanitizeExpertJson(json: unknown): unknown {
  if (!json || typeof json !== "object") return json;
  const obj = { ...(json as Record<string, unknown>) };
  if (!Array.isArray(obj.visualBlocks)) return obj;

  const cleaned = obj.visualBlocks.filter((block) => {
    if (!block || typeof block !== "object") return false;
    const b = block as Record<string, unknown>;
    if (b.kind === "lab_table") {
      return Array.isArray(b.rows) && b.rows.length >= 2;
    }
    if (b.kind === "comparison") {
      return Array.isArray(b.rows) && b.rows.length >= 1 && Array.isArray(b.headers);
    }
    if (b.kind === "flow") {
      return Array.isArray(b.steps) && b.steps.length >= 3;
    }
    return false;
  });

  if (cleaned.length === 0) {
    delete obj.visualBlocks;
  } else {
    obj.visualBlocks = cleaned;
  }
  return obj;
}

function alignWhyIncorrectOptions<T extends { whyIncorrect: Array<{ option: string }> }>(
  rationale: T,
  options: string[]
): T {
  return {
    ...rationale,
    whyIncorrect: rationale.whyIncorrect.map((entry) => {
      const matched = matchRationaleOptionToBank(entry.option, options);
      return matched ? { ...entry, option: matched } : entry;
    }),
  };
}

type ExpertBoard = "nclex" | "usmle";

async function generateExpertRationaleWithPrompts(
  input: RationaleGenerationInput,
  board: ExpertBoard,
  opts?: { maxRetries?: number; temperature?: number }
): Promise<GenerateExpertRationaleResult | null> {
  if (!openai) return null;

  const maxRetries = opts?.maxRetries ?? 2;
  const system =
    board === "usmle"
      ? buildUsmleExpertSystemPrompt(input.fieldId)
      : buildNclexExpertSystemPrompt();
  const user =
    board === "usmle"
      ? buildUsmleExpertUserPrompt(input)
      : buildNclexExpertUserPrompt(input);
  const version =
    board === "usmle" ? USMLE_EXPERT_RATIONALE_VERSION : EXPERT_RATIONALE_VERSION;
  const logTag = board === "usmle" ? "generate-expert-usmle" : "generate-expert-rationale";

  let lastError: unknown;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: opts?.temperature ?? 0.28,
        max_tokens: 3200,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          {
            role: "user",
            content:
              attempt > 0
                ? `${user}\n\nPrevious JSON failed validation. Include ALL wrong options with vignette-specific corrections, 3+ stepByStepReasoning steps, a substantive clinicalPearl, and 2+ highYieldFacts. JSON only.`
                : user,
          },
        ],
      });

      const raw = completion.choices[0]?.message?.content;
      if (!raw) {
        lastError = new Error("empty_completion_content");
        continue;
      }

      let json: unknown;
      try {
        json = sanitizeExpertJson(JSON.parse(raw));
      } catch (err) {
        lastError = err;
        continue;
      }

      const parsed = ExpertRationaleSchema.safeParse(json);
      if (!parsed.success) {
        lastError = parsed.error;
        if (attempt === maxRetries) {
          console.warn(
            `[${logTag}] zod:`,
            parsed.error.issues.slice(0, 4).map((i) => `${i.path.join(".")}: ${i.message}`)
          );
        }
        continue;
      }

      const aligned = alignWhyIncorrectOptions(parsed.data, input.options);
      const withVisuals = augmentExpertVisualBlocks(aligned as ExpertStructuredRationale);

      const quality =
        board === "usmle"
          ? scoreUsmleExplanationQuality(
              withVisuals,
              input.options,
              input.correctAnswer,
              input.fieldId
            )
          : validateStructuredRationale(aligned, input.options, input.correctAnswer);

      if (!quality.ok && attempt < maxRetries) continue;

      const assembled = assembleExpertRationale(withVisuals);
      return {
        structured: withVisuals,
        assembled,
        quality: {
          ok: quality.ok,
          score: quality.score,
          issues: quality.issues.map(String),
        },
        model: "gpt-4o-mini",
        version,
      };
    } catch (err) {
      lastError = err;
    }
  }

  if (lastError) {
    const msg =
      lastError instanceof Error
        ? lastError.message
        : typeof lastError === "object" && lastError && "message" in lastError
          ? String((lastError as { message: unknown }).message)
          : String(lastError);
    console.warn(`[${logTag}] failed:`, msg.slice(0, 240));
  }
  return null;
}

export async function generateExpertNclexRationale(
  input: RationaleGenerationInput,
  opts?: { maxRetries?: number; temperature?: number }
): Promise<GenerateExpertRationaleResult | null> {
  return generateExpertRationaleWithPrompts(input, "nclex", opts);
}

export async function generateExpertUsmleRationale(
  input: RationaleGenerationInput,
  opts?: { maxRetries?: number; temperature?: number }
): Promise<GenerateExpertRationaleResult | null> {
  return generateExpertRationaleWithPrompts(input, "usmle", opts);
}

/** Route expert generation by bank field (nursing → NCLEX, usmle-step-* → USMLE). */
export async function generateExpertRationaleForField(
  fieldId: string,
  input: RationaleGenerationInput,
  opts?: { maxRetries?: number; temperature?: number }
): Promise<GenerateExpertRationaleResult | null> {
  if (isUsmleFieldId(fieldId) || isUsmleFieldId(input.fieldId)) {
    return generateExpertUsmleRationale({ ...input, fieldId: input.fieldId || fieldId }, opts);
  }
  if (isNclexField(fieldId) || fieldId === "nursing") {
    return generateExpertNclexRationale(input, opts);
  }
  return null;
}

function augmentExpertVisualBlocks(expert: ExpertStructuredRationale): ExpertStructuredRationale {
  const blocks: VisualRationaleBlock[] = [...(expert.visualBlocks ?? [])];

  if (expert.stepByStepReasoning.length >= 3 && !blocks.some((b) => b.kind === "flow")) {
    blocks.push({
      kind: "flow",
      title: "Clinical judgment pathway",
      steps: expert.stepByStepReasoning,
    });
  }

  return blocks.length ? { ...expert, visualBlocks: blocks } : expert;
}

function finalizeEnrichedItem(
  item: import("@/lib/question-bank").BankItem
): import("@/lib/question-bank").BankItem {
  return attachVisualRationaleToItem(item);
}

/** Expert-tier enrich when RATIONALE_ENRICH_ON_GENERATE=1 (NCLEX + USMLE). */
export async function maybeEnrichExpertBankItemRationale(
  item: import("@/lib/question-bank").BankItem,
  fieldId: string
): Promise<import("@/lib/question-bank").BankItem> {
  if (process.env.RATIONALE_ENRICH_ON_GENERATE !== "1") return finalizeEnrichedItem(item);

  const useExpert = fieldId === "nursing" || isNclexField(fieldId) || isUsmleFieldId(fieldId);
  if (!useExpert) {
    const { maybeEnrichBankItemRationale } = await import("./generate-rationale");
    return maybeEnrichBankItemRationale(item, fieldId);
  }

  const { needsRationaleEnrichment } = await import("./needs-enrichment");
  const { rationaleInputFromBankItem } = await import("../prompts/rationale-generation");
  const { applyAssembledRationale, maybeEnrichBankItemRationale } = await import(
    "./generate-rationale"
  );
  const check = needsRationaleEnrichment(item);
  if (!check.needs) return finalizeEnrichedItem(item);

  const result = await generateExpertRationaleForField(
    fieldId,
    rationaleInputFromBankItem(item, fieldId)
  );
  if (!result?.quality.ok) {
    return finalizeEnrichedItem(await maybeEnrichBankItemRationale(item, fieldId));
  }

  const applied = applyAssembledRationale(
    {
      ...item,
      keyTakeaways: result.assembled.keyTakeaways,
      expertRationale: result.structured,
    },
    result.assembled
  );

  const priorMeta =
    typeof item.ngnPayload?.generationMeta === "object" && item.ngnPayload.generationMeta
      ? (item.ngnPayload.generationMeta as Record<string, unknown>)
      : {};

  return finalizeEnrichedItem({
    ...applied,
    ngnPayload: {
      ...(item.ngnPayload ?? {}),
      generationMeta: {
        ...priorMeta,
        [EXPERT_RATIONALE_META_KEY]: result.structured,
        expertRationaleVersion: result.version,
        rationaleQualityScore: result.quality.score,
      },
    },
  });
}
