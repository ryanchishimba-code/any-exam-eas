import { getOpenAiClient } from "@/lib/openai-client";
import type { LlmItemEvaluation, QaScanProvider } from "./types";
import { buildQaScanSystemPrompt, buildQaScanUserPayload } from "./prompt";
import type { SerializedQaItem } from "./serialize-item";

export type LlmBatchResult = {
  provider: QaScanProvider;
  model: string;
  evaluations: LlmItemEvaluation[];
  rawError?: string;
};

type RawLlmItem = {
  itemId?: string;
  pass?: boolean;
  verdict?: string;
  singleCorrectAnswer?: boolean;
  scores?: Partial<LlmItemEvaluation["scores"]>;
  overallScore?: number;
  issues?: string[];
  suggestedFixes?: string[];
  rewriteStem?: string;
  rewriteRationale?: string;
};

function clampScore(n: unknown, fallback = 5): number {
  const v = typeof n === "number" ? n : Number.parseFloat(String(n ?? ""));
  if (!Number.isFinite(v)) return fallback;
  return Math.max(1, Math.min(10, Math.round(v * 10) / 10));
}

function normalizeVerdict(raw: string | undefined, pass: boolean): LlmItemEvaluation["verdict"] {
  if (raw === "pass" || raw === "fail" || raw === "review") return raw;
  return pass ? "pass" : "fail";
}

export function parseLlmResponse(items: SerializedQaItem[], parsed: { items?: RawLlmItem[] }): LlmItemEvaluation[] {
  const byId = new Map<string, RawLlmItem>();
  for (const row of parsed.items ?? []) {
    if (row.itemId) byId.set(row.itemId, row);
  }

  return items.map((item) => {
    const row = byId.get(item.id);
    if (!row) {
      return {
        itemId: item.id,
        verdict: "review",
        pass: false,
        scores: {
          logicClarity: 5,
          answerValidity: 5,
          boardQuality: 5,
          distractorQuality: 5,
          rationaleQuality: 5,
        },
        overallScore: 5,
        singleCorrectAnswer: false,
        issues: ["LLM response missing item evaluation"],
        suggestedFixes: ["Re-run QA scan for this item"],
      };
    }

    const scores = {
      logicClarity: clampScore(row.scores?.logicClarity),
      answerValidity: clampScore(row.scores?.answerValidity),
      boardQuality: clampScore(row.scores?.boardQuality),
      distractorQuality: clampScore(row.scores?.distractorQuality),
      rationaleQuality: clampScore(row.scores?.rationaleQuality),
    };

    const overallScore = clampScore(
      row.overallScore ??
        (scores.logicClarity +
          scores.answerValidity +
          scores.boardQuality +
          scores.distractorQuality +
          scores.rationaleQuality) /
          5
    );

    const pass =
      row.pass ??
      (overallScore >= 8 &&
        scores.answerValidity >= 7 &&
        scores.logicClarity >= 7 &&
        row.singleCorrectAnswer !== false);

    return {
      itemId: item.id,
      verdict: normalizeVerdict(row.verdict, pass),
      pass,
      scores,
      overallScore,
      singleCorrectAnswer: row.singleCorrectAnswer ?? pass,
      issues: Array.isArray(row.issues) ? row.issues.map(String) : [],
      suggestedFixes: Array.isArray(row.suggestedFixes) ? row.suggestedFixes.map(String) : [],
      rewriteStem: row.rewriteStem?.trim() || undefined,
      rewriteRationale: row.rewriteRationale?.trim() || undefined,
    };
  });
}

async function callOpenAi(
  fieldId: string,
  items: SerializedQaItem[],
  model: string
): Promise<LlmBatchResult> {
  const client = getOpenAiClient("curation");
  if (!client) {
    return {
      provider: "openai",
      model,
      evaluations: [],
      rawError: "OpenAI unavailable (missing key or purpose gated off — set OPENAI_ALLOWED_PURPOSES=curation)",
    };
  }

  const completion = await client.chat.completions.create({
    model,
    temperature: 0,
    max_tokens: 4096,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: buildQaScanSystemPrompt(fieldId) },
      { role: "user", content: buildQaScanUserPayload(items) },
    ],
  });

  const content = completion.choices[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(content) as { items?: RawLlmItem[] };
  return {
    provider: "openai",
    model,
    evaluations: parseLlmResponse(items, parsed),
  };
}

async function callAnthropic(
  fieldId: string,
  items: SerializedQaItem[],
  model: string
): Promise<LlmBatchResult> {
  const key = process.env.ANTHROPIC_API_KEY?.trim();
  if (!key) {
    return {
      provider: "anthropic",
      model,
      evaluations: [],
      rawError: "ANTHROPIC_API_KEY missing",
    };
  }

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      temperature: 0,
      system: buildQaScanSystemPrompt(fieldId),
      messages: [{ role: "user", content: buildQaScanUserPayload(items) }],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    return {
      provider: "anthropic",
      model,
      evaluations: [],
      rawError: `Anthropic HTTP ${res.status}: ${text.slice(0, 300)}`,
    };
  }

  const body = (await res.json()) as {
    content?: Array<{ type: string; text?: string }>;
  };
  const text = body.content?.find((c) => c.type === "text")?.text ?? "{}";
  const jsonStart = text.indexOf("{");
  const jsonText = jsonStart >= 0 ? text.slice(jsonStart) : text;
  const parsed = JSON.parse(jsonText) as { items?: RawLlmItem[] };

  return {
    provider: "anthropic",
    model,
    evaluations: parseLlmResponse(items, parsed),
  };
}

export async function evaluateItemsWithLlm(options: {
  fieldId: string;
  items: SerializedQaItem[];
  provider: QaScanProvider;
  model?: string;
}): Promise<LlmBatchResult> {
  const model =
    options.model ??
    (options.provider === "anthropic"
      ? process.env.QA_SCAN_ANTHROPIC_MODEL ?? "claude-sonnet-4-20250514"
      : process.env.QA_SCAN_OPENAI_MODEL ?? "gpt-4o-mini");

  if (options.items.length === 0) {
    return { provider: options.provider, model, evaluations: [] };
  }

  try {
    if (options.provider === "anthropic") {
      return await callAnthropic(options.fieldId, options.items, model);
    }
    return await callOpenAi(options.fieldId, options.items, model);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      provider: options.provider,
      model,
      evaluations: [],
      rawError: message,
    };
  }
}

/** Split array into fixed-size chunks for LLM batching. */
export function chunkItems<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

/** Run LLM batches with bounded concurrency. */
export async function evaluateItemsInLlmBatches(options: {
  fieldId: string;
  items: SerializedQaItem[];
  provider: QaScanProvider;
  model?: string;
  llmBatchSize: number;
  concurrency: number;
  onBatchDone?: (done: number, total: number) => void;
}): Promise<LlmBatchResult> {
  const chunks = chunkItems(options.items, Math.max(1, options.llmBatchSize));
  const all: LlmItemEvaluation[] = [];
  let provider: QaScanProvider = options.provider;
  let model = options.model ?? "unknown";
  let rawError: string | undefined;

  let index = 0;
  async function worker() {
    while (index < chunks.length) {
      const batchIndex = index++;
      const batch = chunks[batchIndex]!;
      const result = await evaluateItemsWithLlm({
        fieldId: options.fieldId,
        items: batch,
        provider: options.provider,
        model: options.model,
      });
      provider = result.provider;
      model = result.model;
      if (result.rawError) rawError = result.rawError;
      all.push(...result.evaluations);
      options.onBatchDone?.(batchIndex + 1, chunks.length);
    }
  }

  const workers = Array.from({ length: Math.max(1, options.concurrency) }, () => worker());
  await Promise.all(workers);

  return { provider, model, evaluations: all, rawError };
}
