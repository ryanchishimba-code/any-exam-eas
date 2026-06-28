import type { BankItem } from "@/lib/question-bank";
import { cleanOptionText, selectAllAnswersMatchOptions } from "@/lib/question-format";

export type NaplexAnswerAlignResult = {
  item: BankItem;
  changed: boolean;
  /** Human-readable note when auto-fixed */
  note?: string;
};

function norm(text: string): string {
  return cleanOptionText(text).toLowerCase().replace(/\s+/g, " ").trim();
}

/** Whether correctAnswer matches an option after normalization. */
export function correctAnswerMatchesOption(
  options: string[],
  correctAnswer: string,
  itemType?: string | null
): boolean {
  const type = itemType ?? "mcq";
  if (!correctAnswer?.trim()) return false;

  if (type === "select_all" || type === "sata") {
    return selectAllAnswersMatchOptions(options, correctAnswer);
  }

  if (type === "constructed_response") {
    return correctAnswer.trim().length > 0;
  }

  return options.some((o) => norm(o) === norm(correctAnswer));
}

export function indexOfMatchingOption(options: string[], answer: string): number {
  const target = norm(answer);
  if (!target) return -1;
  return options.findIndex((o) => norm(o) === target);
}

/** Extract the option text implied by "Correct: …" in NAPLEX explanations. */
export function extractExplanationCorrectText(explanation: string): string | null {
  const text = explanation.trim();
  if (!text) return null;

  const direct = text.match(/^Correct:\s*(.+?)(?:\.\s|\.?$)/i);
  if (direct?.[1]) return direct[1].trim();

  const inline = text.match(/\bCorrect:\s*([^.\n]+)/i);
  return inline?.[1]?.trim() ?? null;
}

/** Infer correct option from distractor keys (correct option omitted from rationales). */
export function inferCorrectFromDistractors(
  options: string[],
  distractorRationale?: Record<string, string>
): string | null {
  if (!distractorRationale || options.length === 0) return null;
  const wrongKeys = new Set(Object.keys(distractorRationale).map(norm));
  const candidates = options.filter((o) => !wrongKeys.has(norm(o)));
  if (candidates.length === 1) return candidates[0]!;
  return null;
}

/**
 * Align stored correctAnswer with options and explanation text.
 * Uses exact normalized match, explanation "Correct:" line, or distractor inference.
 */
export function alignNaplexBankItemAnswers(item: BankItem): NaplexAnswerAlignResult {
  const itemType = item.itemType ?? "mcq";

  if (itemType === "select_all" || itemType === "sata") {
    if (item.options.length >= 4) {
      const correctAnswer = item.correctAnswer?.trim() ?? "";
      const idx = indexOfMatchingOption(item.options, correctAnswer);
      if (idx >= 0 && !correctAnswer.includes("|||")) {
        const canonical = item.options[idx]!;
        const needsTypeFix = itemType === "select_all" || itemType === "sata";
        const needsAnswerFix = canonical !== correctAnswer;
        if (needsTypeFix || needsAnswerFix) {
          return {
            item: {
              ...item,
              itemType: "mcq",
              correctAnswer: canonical,
            },
            changed: true,
            note: "reclassified mislabeled select_all to mcq",
          };
        }
      }
    }
    return { item, changed: false };
  }

  if (itemType !== "mcq" && itemType !== "vignette" && itemType !== "case_based") {
    return { item, changed: false };
  }

  if (item.options.length !== 4) {
    return { item, changed: false };
  }

  const correctAnswer = item.correctAnswer?.trim() ?? "";
  const options = [...item.options];

  if (correctAnswerMatchesOption(options, correctAnswer, itemType)) {
    const idx = indexOfMatchingOption(options, correctAnswer);
    if (idx >= 0 && options[idx] !== correctAnswer) {
      return {
        item: { ...item, correctAnswer: options[idx]! },
        changed: true,
        note: "canonicalized correctAnswer to exact option text",
      };
    }
    return { item, changed: false };
  }

  const fromExplanation = extractExplanationCorrectText(item.explanation ?? "");
  if (fromExplanation) {
    const idx = indexOfMatchingOption(options, fromExplanation);
    if (idx >= 0) {
      return {
        item: { ...item, correctAnswer: options[idx]! },
        changed: true,
        note: "correctAnswer aligned to explanation Correct: line",
      };
    }
  }

  const fromDistractors = inferCorrectFromDistractors(options, item.distractorRationale);
  if (fromDistractors) {
    return {
      item: { ...item, correctAnswer: fromDistractors },
      changed: true,
      note: "correctAnswer inferred from distractor rationales",
    };
  }

  const normalized = normalizeQuestionOptionsSafe(options, correctAnswer);
  if (correctAnswerMatchesOption(normalized.options, normalized.correctAnswer, itemType)) {
    return {
      item: { ...item, options: normalized.options, correctAnswer: normalized.correctAnswer },
      changed: true,
      note: "options/correctAnswer normalized via question-format helper",
    };
  }

  return { item, changed: false };
}

function normalizeQuestionOptionsSafe(
  options: string[],
  correctAnswer: string
): { options: BankItem["options"]; correctAnswer: string } {
  const cleaned = options.map(cleanOptionText).filter(Boolean);
  const four = cleaned.slice(0, 4) as BankItem["options"];
  while (four.length < 4) {
    four.push(`Alternative ${four.length + 1}` as BankItem["options"][number]);
  }
  const idx = indexOfMatchingOption(four, correctAnswer);
  if (idx >= 0) {
    return { options: four, correctAnswer: four[idx]! };
  }
  const correctClean = cleanOptionText(correctAnswer);
  if (correctClean) {
    four[3] = correctClean;
    return { options: four, correctAnswer: correctClean };
  }
  return { options: four, correctAnswer };
}

/** True when explanation "Correct:" line points at a different option than correctAnswer. */
export function explanationCorrectMismatch(item: BankItem): boolean {
  const itemType = item.itemType ?? "mcq";
  if (itemType !== "mcq" && itemType !== "vignette" && itemType !== "case_based") {
    return false;
  }
  if (item.options.length !== 4) return false;

  const implied = extractExplanationCorrectText(item.explanation ?? "");
  if (!implied) return false;

  const impliedIdx = indexOfMatchingOption(item.options, implied);
  const storedIdx = indexOfMatchingOption(item.options, item.correctAnswer);
  if (impliedIdx < 0 || storedIdx < 0) return false;
  return impliedIdx !== storedIdx;
}

