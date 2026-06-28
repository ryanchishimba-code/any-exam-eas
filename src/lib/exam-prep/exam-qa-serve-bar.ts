import type { BankItem } from "@/lib/question-bank";
import { hasGenericPlaceholderOptions } from "@/lib/question-format";
import {
  BOARD_SERVE_MIN_EXPLANATION_CHARS,
  BOARD_SERVE_MIN_STEM_CHARS,
  BOARD_SERVE_MCQ_OPTION_COUNT,
} from "@/lib/exam-prep/board-serve-quality";

/** Structural board bar for items already vetted by the field serve gate. */
export function bankItemMeetsStructuralBar(item: BankItem): boolean {
  const stem = item.question?.trim() ?? "";
  if (stem.length < BOARD_SERVE_MIN_STEM_CHARS) return false;
  const explanation = item.explanation?.trim() ?? "";
  if (explanation.length < BOARD_SERVE_MIN_EXPLANATION_CHARS) return false;
  const options = item.options ?? [];
  if (options.length < BOARD_SERVE_MCQ_OPTION_COUNT) return false;
  if (hasGenericPlaceholderOptions(options)) return false;
  const answer = item.correctAnswer?.trim();
  if (answer && !options.some((o) => o.trim() === answer)) return false;
  return true;
}
