import { cleanOptionText } from "@/lib/question-format";

/** Delimiter that does not appear inside option text. */
export const MULTI_ANSWER_DELIM = "|||";

const PIPE_TYPES = new Set([
  "bow_tie",
  "highlight",
  "ordered_response",
  "drag_drop",
  "select_all",
]);

function norm(value: string): string {
  return cleanOptionText(value).toLowerCase().replace(/\s+/g, " ").trim();
}

/**
 * Join keyed choices for storage and the client payload.
 * Matrix cells already contain `|||`, so those stay separated by `;;`.
 */
export function joinStoredCorrectAnswer(type: string, answers: string[]): string {
  const parts = answers.map((part) => part.trim()).filter(Boolean);
  if (parts.length === 0) return "";
  if (type === "matrix") return parts.join(";;");
  if (parts.length === 1 && !PIPE_TYPES.has(type)) return parts[0] ?? "";
  if (PIPE_TYPES.has(type) || parts.length > 1) return parts.join(MULTI_ANSWER_DELIM);
  return parts[0] ?? "";
}

function consumeChoices(stored: string, choices: string[]): string[] | null {
  const matched: string[] = [];
  const used = new Set<string>();
  let cursor = 0;
  while (cursor < stored.length) {
    if (cursor > 0) {
      const sep = /^\s*,\s*/.exec(stored.slice(cursor));
      if (!sep) return null;
      cursor += sep[0].length;
    }
    const rest = stored.slice(cursor);
    const hit = choices.find((choice) => {
      const key = norm(choice);
      return !used.has(key) && rest.toLowerCase().startsWith(choice.toLowerCase());
    });
    if (!hit) return null;
    used.add(norm(hit));
    matched.push(hit);
    cursor += hit.length;
  }
  return matched.length > 0 ? matched : null;
}

/**
 * Split a stored key. `|||` wins. A legacy comma join is recovered by matching
 * whole option texts, so a comma inside one choice is not a separator.
 */
export function splitStoredCorrectAnswers(stored: string, options: string[] = []): string[] {
  const trimmed = stored.trim();
  if (!trimmed) return [];
  if (trimmed.includes(MULTI_ANSWER_DELIM)) {
    return trimmed
      .split(MULTI_ANSWER_DELIM)
      .map((part) => cleanOptionText(part.trim()))
      .filter(Boolean);
  }

  const choices = [...new Set(options.map((option) => cleanOptionText(option)).filter(Boolean))].sort(
    (a, b) => b.length - a.length
  );
  const consumed = choices.length > 0 ? consumeChoices(trimmed, choices) : null;
  if (consumed && consumed.length > 0) return consumed;

  const commaParts = trimmed
    .split(",")
    .map((part) => cleanOptionText(part.trim()))
    .filter(Boolean);
  const optionKeys = new Set(choices.map(norm));
  if (
    commaParts.length >= 2 &&
    optionKeys.size > 0 &&
    commaParts.every((part) => optionKeys.has(norm(part)))
  ) {
    return commaParts;
  }
  if (choices.some((choice) => choice.includes(",")) && commaParts.length > choices.length) {
    return [];
  }
  return commaParts.length > 0 ? commaParts : [cleanOptionText(trimmed)].filter(Boolean);
}

/** Exam-scoped review keeps bank misses and catalog NGN misses in one queue. */
export function reviewQueueKind(ids: readonly string[]): "clinical" | "mixed" | "bank" {
  const ngn = ids.some((id) => id.startsWith("ngn:"));
  const bank = ids.some((id) => !id.startsWith("ngn:"));
  if (ngn && bank) return "mixed";
  if (ngn) return "clinical";
  return "bank";
}
