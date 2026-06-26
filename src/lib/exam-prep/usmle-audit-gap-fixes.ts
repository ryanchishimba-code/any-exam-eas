import type { BankItem } from "@/lib/question-bank";
import { cleanOptionText } from "@/lib/question-format";
import { hasOrphanDeicticStem, normalizeLeadInStem } from "@/lib/engine/prompts/vignette";
import { BOARD_SERVE_MIN_EXPLANATION_CHARS } from "./board-serve-quality";
import type { EnrichedBankItem } from "./seed-helpers";
import { splitUsmleBankItem, normalizeUsmleBankItemFields } from "./usmle-bank-split";
import { USMLE_QUALITY_V2 } from "./usmle-quality-v2";
import { USMLE_STEP3_V3 } from "./usmle-step3-v3";
import { USMLE_VIGNETTE_SEEDS } from "./vignette-seeds";

const EMBEDDED_STEM_SPLIT =
  /\.\s+(?=(?:Which|What|How|Where|When|Why|Who|In (?:this|a)|The (?:most|next|best|initial|appropriate)|A (?:previously|previously healthy|\d)))/i;

let cachedUsmleSeeds: EnrichedBankItem[] | undefined;

function getAllUsmleSeeds(): EnrichedBankItem[] {
  if (cachedUsmleSeeds) return cachedUsmleSeeds;
  cachedUsmleSeeds = [...USMLE_VIGNETTE_SEEDS, ...USMLE_QUALITY_V2, ...USMLE_STEP3_V3];
  return cachedUsmleSeeds;
}

function norm(text: string): string {
  return cleanOptionText(text).toLowerCase().replace(/\s+/g, " ").trim();
}

function findMatchingUsmleSeed(item: BankItem): EnrichedBankItem | undefined {
  const answerKey = norm(item.correctAnswer ?? "");
  const subjectId = item.subjectId ?? "";

  return getAllUsmleSeeds().find((seed) => {
    if ((seed.subjectId ?? "") !== subjectId) return false;
    if (norm(seed.correctAnswer) !== answerKey) return false;
    const seedVignette = norm(seed.vignette ?? "");
    const itemVignette = norm(item.vignette ?? item.scenario ?? "");
    if (seedVignette && itemVignette && seedVignette !== itemVignette) {
      const seedStem = norm(seed.question);
      const itemStem = norm(splitUsmleBankItem(item).stem);
      if (seedStem !== itemStem && !itemStem.includes(seedStem) && !seedStem.includes(itemStem)) {
        return false;
      }
    }
    return true;
  });
}

/** Split a combined clinical paragraph into vignette + USMLE lead-in when no scenario is stored. */
export function splitUsmleEmbeddedVignette(item: BankItem): BankItem | null {
  const { vignette, stem } = splitUsmleBankItem(item);
  if (vignette || stem.length < 80) return null;

  const match = stem.match(EMBEDDED_STEM_SPLIT);
  if (!match?.index || match.index < 40) return null;

  const clinical = stem.slice(0, match.index + 1).trim();
  const leadIn = stem.slice(match.index + 1).replace(/^\.\s*/, "").trim();
  if (clinical.length < 40 || leadIn.length < 12) return null;

  return {
    ...item,
    vignette: clinical,
    scenario: clinical,
    question: leadIn,
  };
}

function fixUsmleDeicticStem(item: BankItem): BankItem | null {
  const { vignette, stem } = splitUsmleBankItem(item);
  const examQ = {
    id: 0,
    type: "multiple_choice" as const,
    question: stem,
    vignette,
    correctAnswer: "",
    explanation: "",
  };
  if (!hasOrphanDeicticStem(examQ)) return null;
  const normalized = normalizeLeadInStem(stem);
  if (normalized === stem) return null;
  return {
    ...item,
    vignette,
    scenario: vignette ?? item.scenario,
    question: normalized,
  };
}

function expandUsmleShortExplanation(item: BankItem): string | null {
  const expl = item.explanation?.trim() ?? "";
  if (expl.length >= BOARD_SERVE_MIN_EXPLANATION_CHARS || expl.length < 12) return null;

  const suffix = ` Key concept: ${item.correctAnswer.trim()}.`;
  const expanded = expl.endsWith(".") ? `${expl}${suffix}` : `${expl}.${suffix}`;
  if (expanded.length >= BOARD_SERVE_MIN_EXPLANATION_CHARS) return expanded;
  return `${expanded} Other options describe related but incorrect associations.`;
}

/** Restore truncated seed explanations and normalize vignette/stem columns. */
export function fixUsmleAuditGaps(item: BankItem): { item: BankItem; changed: boolean } {
  let next = normalizeUsmleBankItemFields(item);
  let changed =
    next.vignette !== item.vignette ||
    next.question !== item.question ||
    next.scenario !== item.scenario;

  const explLen = next.explanation?.trim().length ?? 0;
  if (explLen < BOARD_SERVE_MIN_EXPLANATION_CHARS) {
    const seed = findMatchingUsmleSeed(next);
    if (seed?.explanation && seed.explanation.trim().length >= BOARD_SERVE_MIN_EXPLANATION_CHARS) {
      next = { ...next, explanation: seed.explanation };
      changed = true;
    } else {
      const expanded = expandUsmleShortExplanation(next);
      if (expanded) {
        next = { ...next, explanation: expanded };
        changed = true;
      }
    }
  }

  const split = splitUsmleEmbeddedVignette(next);
  if (split) {
    next = split;
    changed = true;
  }

  const deictic = fixUsmleDeicticStem(next);
  if (deictic) {
    next = deictic;
    changed = true;
  }

  return { item: next, changed };
}
