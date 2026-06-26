import type { BankItem } from "@/lib/question-bank";
import { cleanOptionText } from "@/lib/question-format";
import { NGN_NURSING_QUALITY_V2 } from "./ngn-nursing-quality-v2";
import { NGN_NURSING_SEEDS } from "./ngn-nursing-seeds";
import type { EnrichedBankItem } from "./seed-helpers";

const ALL_NGN_NURSING_SEEDS: EnrichedBankItem[] = [...NGN_NURSING_SEEDS, ...NGN_NURSING_QUALITY_V2];

function norm(text: string): string {
  return cleanOptionText(text).toLowerCase().replace(/\s+/g, " ").trim();
}

function normCorrectAnswer(text: string): string {
  return norm(text).replace(/\bsskip\b/g, "skip");
}

export function hasCorruptedNgnPayloadOptions(item: BankItem): boolean {
  const kind = String(item.ngnPayload?.kind ?? "");
  if (kind !== "select_all" && kind !== "ordered_response") return false;
  const payloadOpts = item.ngnPayload?.options;
  if (!Array.isArray(payloadOpts) || payloadOpts.length < 3) return true;
  return payloadOpts.every((option) => /^[A-D]$/i.test(String(option).trim()));
}

function findMatchingNgnSeed(item: BankItem): EnrichedBankItem | undefined {
  const answerKey = normCorrectAnswer(item.correctAnswer ?? "");
  return ALL_NGN_NURSING_SEEDS.find((seed) => {
    if (seed.itemType !== item.itemType) return false;
    if (normCorrectAnswer(seed.correctAnswer) !== answerKey) return false;
    const seedVignette = norm(seed.vignette ?? "");
    const itemVignette = norm(item.vignette ?? item.scenario ?? "");
    if (seedVignette && itemVignette && seedVignette !== itemVignette) {
      const stem = norm(item.question);
      const seedStem = norm(seed.question);
      if (seedStem !== stem && !stem.includes(seedStem) && !seedStem.includes(stem)) {
        return false;
      }
    }
    return Array.isArray(seed.ngnPayload?.options) && seed.ngnPayload.options.length >= 3;
  });
}

/** Restore real selectable strings when ngnPayload.options were overwritten with A–D placeholders. */
export function repairNclexNgnPayloadFromSeed(item: BankItem): BankItem | null {
  if (!hasCorruptedNgnPayloadOptions(item)) return null;

  const seed = findMatchingNgnSeed(item);
  if (!seed?.ngnPayload?.options) return null;

  const payloadOptions = (seed.ngnPayload.options as string[]).map(String);
  let correctAnswer = item.correctAnswer;
  if (seed.itemType === "select_all" || seed.itemType === "ordered_response") {
    correctAnswer = seed.correctAnswer;
  }

  return {
    ...item,
    correctAnswer,
    ngnPayload: {
      ...item.ngnPayload,
      ...seed.ngnPayload,
      options: payloadOptions,
    },
  };
}
