/**
 * Per-delivery option order. The keyed text stays the correct answer.
 * Position-dependent choices ("both A and B", "all of the above") are not
 * scrambled in a way that makes the item unanswerable, and rationale letters
 * move with the choice they named.
 */
import { cleanOptionText } from "@/lib/question-format";

const CROSS_REFERENCE =
  /^(?:both\s+)?[A-D](?:\s*,\s*[A-D])*(?:\s*,?\s*and\s+[A-D])?(?:\s+only)?$/i;
const NUMBER_REFERENCE =
  /^(?:[1-4]|i{1,3}|iv|v)(?:\s*,\s*(?:[1-4]|i{1,3}|iv|v))*(?:\s+and\s+(?:[1-4]|i{1,3}|iv|v))?(?:\s+only)?$/i;
const NAMED_REFERENCE = /^(?:options?|choices?)\s+[A-D]\b/i;
const PINNED_CHOICE = /^(?:all|none)\s+of\s+(?:the\s+)?(?:above|following|these)\b/i;

export type DeliveryShuffleInput = {
  options: string[];
  correctAnswer: string;
  explanation?: string;
  clinicalReasoning?: string;
  distractorRationale?: Record<string, string>;
  solutionSteps?: string[];
  expertRationale?: unknown;
  /** Stable across resume when the session stores this seed. */
  seed?: number;
};

export type DeliveryShuffleResult = {
  options: string[];
  correctAnswer: string;
  explanation?: string;
  clinicalReasoning?: string;
  distractorRationale?: Record<string, string>;
  solutionSteps?: string[];
  expertRationale?: unknown;
  shuffled: boolean;
};

function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function mixShuffleSeed(seed: number, index: number, id?: string): number {
  let hash = (seed ^ Math.imul(index + 1, 0x9e3779b9)) >>> 0;
  const key = id ?? "";
  for (let i = 0; i < key.length; i++) {
    hash = Math.imul(hash ^ key.charCodeAt(i), 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

function optionLocksPosition(option: string): boolean {
  const text = cleanOptionText(option).trim();
  if (!text || text.length > 96) return false;
  if (CROSS_REFERENCE.test(text) || NUMBER_REFERENCE.test(text) || NAMED_REFERENCE.test(text)) {
    return true;
  }
  if (/\b(?:statements?|options?|choices?)\s+(?:[A-D]|[1-4]|i{1,3}|iv|v)\b/i.test(text)) return true;
  if (/\b[A-D]\s+and\s+[A-D]\b/i.test(text) && text.length < 64) return true;
  if (/\b(?:i{1,3}|iv|v)\s+and\s+(?:i{1,3}|iv|v)\b/i.test(text)) return true;
  return false;
}

function optionIsPinned(option: string): boolean {
  return PINNED_CHOICE.test(cleanOptionText(option).trim());
}

function letterFor(index: number): string {
  return String.fromCharCode(65 + index);
}

/** Rewrite "option B" / "(C)" to the letter that choice moved to. */
export function rewriteChoiceLetters(text: string, letterMap: ReadonlyMap<string, string>): string {
  if (!text || letterMap.size === 0) return text;
  const mapped = (letter: string) => letterMap.get(letter.toUpperCase()) ?? letter.toUpperCase();
  return text
    .replace(/\b(option|choice|answer)\s+([A-D])\b/gi, (full, word: string, letter: string) => {
      const next = mapped(letter);
      if (next === letter.toUpperCase()) return full;
      const shown = letter === letter.toLowerCase() ? next.toLowerCase() : next;
      return `${word} ${shown}`;
    })
    .replace(/\(([A-D])\)/g, (full, letter: string) => {
      const next = mapped(letter);
      return next === letter.toUpperCase() ? full : `(${next})`;
    });
}

function rewriteUnknown(value: unknown, letterMap: ReadonlyMap<string, string>): unknown {
  if (typeof value === "string") return rewriteChoiceLetters(value, letterMap);
  if (Array.isArray(value)) return value.map((entry) => rewriteUnknown(entry, letterMap));
  if (!value || typeof value !== "object") return value;
  const out: Record<string, unknown> = {};
  for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
    const nextKey = /^[A-D]$/i.test(key) ? (letterMap.get(key.toUpperCase()) ?? key) : key;
    out[nextKey] = rewriteUnknown(entry, letterMap);
  }
  return out;
}

function shuffleSlice(items: string[], random: () => number): string[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

export function shuffleDeliveryChoices(input: DeliveryShuffleInput): DeliveryShuffleResult {
  const options = input.options.map((option) => cleanOptionText(option)).filter(Boolean);
  const correctAnswer = cleanOptionText(input.correctAnswer);
  const base: DeliveryShuffleResult = {
    options,
    correctAnswer,
    explanation: input.explanation,
    clinicalReasoning: input.clinicalReasoning,
    distractorRationale: input.distractorRationale,
    solutionSteps: input.solutionSteps,
    expertRationale: input.expertRationale,
    shuffled: false,
  };
  if (options.length < 2) return base;
  if (options.some(optionLocksPosition)) return base;

  const pinned = options.filter(optionIsPinned);
  const movable = options.filter((option) => !optionIsPinned(option));
  if (movable.length < 2 && pinned.length === options.length) return base;

  const random = input.seed == null ? Math.random : mulberry32(input.seed);
  const nextOptions = [...shuffleSlice(movable, random), ...pinned];
  if (nextOptions.join("\0") === options.join("\0")) {
    return { ...base, options: nextOptions };
  }

  const letterMap = new Map<string, string>();
  options.forEach((option, index) => {
    const nextIndex = nextOptions.indexOf(option);
    if (nextIndex >= 0) letterMap.set(letterFor(index), letterFor(nextIndex));
  });

  const distractor = input.distractorRationale
    ? (rewriteUnknown(input.distractorRationale, letterMap) as Record<string, string>)
    : undefined;

  return {
    options: nextOptions,
    correctAnswer,
    explanation: input.explanation
      ? rewriteChoiceLetters(input.explanation, letterMap)
      : input.explanation,
    clinicalReasoning: input.clinicalReasoning
      ? rewriteChoiceLetters(input.clinicalReasoning, letterMap)
      : input.clinicalReasoning,
    distractorRationale: distractor,
    solutionSteps: input.solutionSteps?.map((step) => rewriteChoiceLetters(step, letterMap)),
    expertRationale: rewriteUnknown(input.expertRationale, letterMap),
    shuffled: true,
  };
}
