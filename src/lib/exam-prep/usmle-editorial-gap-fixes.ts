import type { ExamQuestion } from "@/lib/ai";
import type { BankItem } from "@/lib/question-bank";
import {
  normalizeLeadInStem,
  splitCombinedStem,
} from "@/lib/engine/prompts/vignette";
import { splitUsmleBankItem } from "./usmle-bank-split";

/** Expand shorthand pipe-delimited chart strings into vignette prose. */
export function expandPipeDelimitedVignette(item: BankItem): BankItem | null {
  const raw = item.vignette?.trim() || item.scenario?.trim() || "";
  if (!raw.includes("|")) return null;

  const parts = raw.split("|").map((part) => part.trim()).filter(Boolean);
  if (parts.length < 2) return null;

  const agePart = parts.find((part) => /\d{1,3}\s*(?:y\/o|yo|year-old|year old)/i.test(part));
  const clinicalParts = parts.filter((part) => part !== agePart);

  let expanded: string;
  if (agePart) {
    const ageText = agePart.replace(/\s*y\/o/i, "-year-old");
    const detail = clinicalParts.join(". ");
    expanded = `A ${ageText} presents with ${detail.replace(/\.$/, "")}.`;
  } else if (parts[0] && /\d{1,3}/.test(parts[0])) {
    expanded = `${parts[0]}. ${parts.slice(1).join(". ")}.`;
  } else {
    expanded = `${parts.join(". ")}.`;
  }

  if (expanded === raw) return null;
  return { ...item, vignette: expanded, scenario: expanded };
}

/** Split a combined clinical paragraph stored only in the question column. */
export function splitUsmleCombinedQuestion(item: BankItem): BankItem | null {
  const { vignette, stem } = splitUsmleBankItem(item);
  if (vignette) return null;

  const examQ = splitCombinedStem({
    id: 1,
    type: "multiple_choice",
    question: stem,
    options: item.options,
    correctAnswer: item.correctAnswer,
    explanation: item.explanation ?? "",
  } satisfies ExamQuestion);

  if (!examQ.vignette?.trim()) return null;

  const question = normalizeLeadInStem(examQ.question.trim());
  return {
    ...item,
    vignette: examQ.vignette.trim(),
    scenario: examQ.vignette.trim(),
    question,
  };
}

function ensureStemEndsWithQuestionMark(stem: string): string {
  const trimmed = stem.trim();
  if (!trimmed || trimmed.endsWith("?")) return trimmed;
  return `${trimmed.replace(/[.!]+$/, "")}?`;
}

/** Normalize lead-ins and vignette formatting for Step 1/2 editorial QA. */
export function fixUsmleEditorialGaps(item: BankItem): { item: BankItem; changed: boolean } {
  let next = item;
  let changed = false;

  for (const repair of [expandPipeDelimitedVignette, splitUsmleCombinedQuestion]) {
    const fixed = repair(next);
    if (fixed) {
      next = fixed;
      changed = true;
    }
  }

  const normalizedStem = ensureStemEndsWithQuestionMark(normalizeLeadInStem(splitUsmleBankItem(next).stem));
  if (normalizedStem !== next.question) {
    next = { ...next, question: normalizedStem };
    changed = true;
  }

  return { item: next, changed };
}
