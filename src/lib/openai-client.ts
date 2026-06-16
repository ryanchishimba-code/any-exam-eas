/**
 * Central, purpose-gated OpenAI client factory.
 *
 * Goal: reserve the OpenAI key for the most demanding work (question/exam
 * generation) and let operators turn off auxiliary AI calls (repair, curation,
 * enrichment, RAG) during heavy generation runs to avoid rate-limit contention.
 *
 * Control via environment:
 *   OPENAI_GENERATION_ONLY=1        → only "generation" purpose may use the key
 *   OPENAI_ALLOWED_PURPOSES=a,b,c   → allowlist of purposes (generation always on)
 *   (neither set)                   → all purposes allowed (default; no change)
 *
 * Each caller passes its purpose; gated-off purposes get `null` and should fall
 * back to their existing non-AI behavior.
 */
import OpenAI from "openai";

export type OpenAiPurpose =
  | "generation" // bulk question/exam/variant generation — the demanding task
  | "repair" // fixing/polishing existing items
  | "curation" // AI scoring/curation of existing items
  | "enrichment" // mnemonics, study briefs, learning quilts
  | "rag" // embeddings, rerank, query expansion, research
  | "misc"; // everything else

const ALL_PURPOSES: OpenAiPurpose[] = [
  "generation",
  "repair",
  "curation",
  "enrichment",
  "rag",
  "misc",
];

function isTruthyFlag(value: string | undefined): boolean {
  if (!value) return false;
  const v = value.trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes" || v === "on";
}

/** Resolve the currently-allowed purposes from the environment (read fresh). */
export function allowedOpenAiPurposes(): Set<OpenAiPurpose> {
  if (isTruthyFlag(process.env.OPENAI_GENERATION_ONLY)) {
    return new Set<OpenAiPurpose>(["generation"]);
  }
  const raw = process.env.OPENAI_ALLOWED_PURPOSES?.trim();
  if (!raw) return new Set(ALL_PURPOSES);

  // Generation is always permitted so the primary task can never be disabled.
  const set = new Set<OpenAiPurpose>(["generation"]);
  for (const token of raw.split(",").map((s) => s.trim()).filter(Boolean)) {
    if ((ALL_PURPOSES as string[]).includes(token)) {
      set.add(token as OpenAiPurpose);
    }
  }
  return set;
}

export function isOpenAiPurposeAllowed(purpose: OpenAiPurpose): boolean {
  return allowedOpenAiPurposes().has(purpose);
}

let cachedClient: OpenAI | null | undefined;

function rawOpenAiClient(): OpenAI | null {
  if (cachedClient !== undefined) return cachedClient;
  const key = process.env.OPENAI_API_KEY?.trim();
  cachedClient = key ? new OpenAI({ apiKey: key }) : null;
  return cachedClient;
}

/**
 * Get an OpenAI client for a given purpose, or `null` if no key is configured
 * or this purpose has been gated off. Callers MUST handle the null case.
 */
export function getOpenAiClient(purpose: OpenAiPurpose): OpenAI | null {
  if (!isOpenAiPurposeAllowed(purpose)) return null;
  return rawOpenAiClient();
}

/** Test/CLI helper to reset the cached client (e.g. after changing env). */
export function resetOpenAiClientCache(): void {
  cachedClient = undefined;
}
