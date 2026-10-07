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
  /** Stem and vignette. A letter or number that names an option here locks order. */
  question?: string;
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

const ORDINALS = ["first", "second", "third", "fourth", "fifth"] as const;

function mappedLetter(letterMap: ReadonlyMap<string, string>, letter: string): string {
  return letterMap.get(letter.toUpperCase()) ?? letter.toUpperCase();
}

function letterIndex(letter: string): number {
  return letter.toUpperCase().charCodeAt(0) - 65;
}

function withInitialCase(source: string, next: string): string {
  if (source[0] && source[0] === source[0].toUpperCase()) {
    return next[0]!.toUpperCase() + next.slice(1);
  }
  return next;
}

/**
 * Move unambiguous option labels onto the letter or number that choice now
 * occupies. Drug names and articles stay put: "Option D-dimer", "Rho(D)",
 * "this option a…", and "(A)lert" are not labels.
 */
function choiceText(value: unknown): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    for (const key of ["text", "label", "content", "step"]) {
      if (typeof record[key] === "string") return record[key];
    }
  }
  return "";
}

export function rewriteChoiceLetters(text: string, letterMap: ReadonlyMap<string, string>): string {
  if (typeof text !== "string" || !text || letterMap.size === 0) {
    return typeof text === "string" ? text : "";
  }
  const mapped = (letter: string) => mappedLetter(letterMap, letter);

  return (
    text
      // "(A)" only as a label at the start of a line or bullet. Not Rho(D) or (A)lert.
      .replace(
        /(^|\n)([ \t]*(?:[-*•][ \t]+)?)(\()([A-E])(\))(?=\s|$)/gm,
        (full, lead: string, indent: string, open: string, letter: string, close: string) => {
          const next = mapped(letter);
          return next === letter ? full : `${lead}${indent}${open}${next}${close}`;
        }
      )
      // "**A. …**" / "**A.**" bullets, and "A." / "A)" labels at line start.
      .replace(
        /(^|\n)([ \t]*)(\*\*)([A-E])(\.)/g,
        (full, lead: string, indent: string, stars: string, letter: string, dot: string) => {
          const next = mapped(letter);
          return next === letter ? full : `${lead}${indent}${stars}${next}${dot}`;
        }
      )
      .replace(
        /(^|\n)([ \t]*)([A-E])([.)])(?=\s+[A-Z])/g,
        (full, lead: string, indent: string, letter: string, mark: string) => {
          const next = mapped(letter);
          return next === letter ? full : `${lead}${indent}${next}${mark}`;
        }
      )
      // "Option A" / "Choice B" when the letter is its own token. Not "Option D-dimer".
      .replace(
        /\b([Oo]ption|[Cc]hoice|[Aa]nswer)\s+([A-E])(?![A-Za-z0-9-])/g,
        (full, word: string, letter: string) => {
          const next = mapped(letter);
          return next === letter ? full : `${word} ${next}`;
        }
      )
      // "option 2" / "(option 2)" — the number is the original position.
      .replace(
        /\b([Oo]ption|[Cc]hoice|[Aa]nswer)\s+([1-5])(?![0-9-])/g,
        (full, word: string, raw: string) => {
          const original = letterFor(Number(raw) - 1);
          const next = mapped(original);
          const shown = String(letterIndex(next) + 1);
          return shown === raw ? full : `${word} ${shown}`;
        }
      )
      .replace(
        /\b(first|second|third|fourth|fifth)\s+(option|choice|answer)\b/gi,
        (full, ordinal: string, noun: string) => {
          const index = ORDINALS.indexOf(ordinal.toLowerCase() as (typeof ORDINALS)[number]);
          if (index < 0) return full;
          const next = mapped(letterFor(index));
          const nextOrdinal = ORDINALS[letterIndex(next)];
          if (!nextOrdinal || nextOrdinal === ordinal.toLowerCase()) return full;
          return `${withInitialCase(ordinal, nextOrdinal)} ${noun}`;
        }
      )
  );
}

/** Stem text that names a choice by letter, number, or a lettered list. */
export function stemLocksOptionOrder(question: string | undefined): boolean {
  if (!question) return false;
  if (/\b(?:[Oo]ption|[Cc]hoice|[Aa]nswer)\s+[A-E](?![A-Za-z0-9-])/.test(question)) return true;
  if (/\b(?:[Oo]ption|[Cc]hoice|[Aa]nswer)\s+\([A-E]\)(?![A-Za-z0-9-])/.test(question)) return true;
  if (/\b(?:[Oo]ption|[Cc]hoice|[Aa]nswer)\s+[1-5](?![0-9-])/.test(question)) return true;
  if (/\b(?:first|second|third|fourth|fifth)\s+(?:option|choice|answer)\b/i.test(question)) return true;
  const labels = question.match(/(?:^|\n)\s*[A-E][.)]\s/g);
  return (labels?.length ?? 0) >= 2;
}

/**
 * Bare letters used as option commentary ("B is incorrect; C is…") are too
 * varied to rewrite safely. Keep the original order instead.
 */
export function rationaleLocksOptionOrder(text: string | undefined): boolean {
  if (!text) return false;
  if (/(?:^|[.;:\n])\s*[A-E]\s+is\s+(?:in)?correct\b/m.test(text)) return true;
  if (/(?:^|[.;:\n])\s*[A-E]\s+does\s+not\b/m.test(text)) return true;
  if (/\b(?:options|choices|answers)\s+[A-E]\s*(?:,|\band\b|\bor\b)\s*[A-E]\b/.test(text)) return true;
  if (/\bboth\s+[A-E]\s+and\s+[A-E]\b/.test(text)) return true;
  return false;
}

function rationaleCorpus(input: DeliveryShuffleInput): string {
  const parts: string[] = [];
  if (input.explanation) parts.push(input.explanation);
  if (input.clinicalReasoning) parts.push(input.clinicalReasoning);
  if (input.solutionSteps?.length) parts.push(input.solutionSteps.join("\n"));
  if (input.distractorRationale) parts.push(Object.values(input.distractorRationale).join("\n"));
  if (input.expertRationale != null) parts.push(flattenUnknown(input.expertRationale));
  return parts.join("\n");
}

function flattenUnknown(value: unknown): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(flattenUnknown).join("\n");
  if (!value || typeof value !== "object") return "";
  return Object.values(value as Record<string, unknown>).map(flattenUnknown).join("\n");
}

function rewriteUnknown(value: unknown, letterMap: ReadonlyMap<string, string>): unknown {
  if (typeof value === "string") return rewriteChoiceLetters(value, letterMap);
  if (Array.isArray(value)) return value.map((entry) => rewriteUnknown(entry, letterMap));
  if (!value || typeof value !== "object") return value;
  const out: Record<string, unknown> = {};
  for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
    const nextKey = /^[A-E]$/i.test(key) ? (letterMap.get(key.toUpperCase()) ?? key) : key;
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
  if (stemLocksOptionOrder(input.question) || rationaleLocksOptionOrder(rationaleCorpus(input))) {
    return base;
  }

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
      ? rewriteChoiceLetters(choiceText(input.explanation), letterMap)
      : input.explanation,
    clinicalReasoning: input.clinicalReasoning
      ? rewriteChoiceLetters(choiceText(input.clinicalReasoning), letterMap)
      : input.clinicalReasoning,
    distractorRationale: distractor,
    solutionSteps: input.solutionSteps?.map((step) => rewriteChoiceLetters(choiceText(step), letterMap)),
    expertRationale: rewriteUnknown(input.expertRationale, letterMap),
    shuffled: true,
  };
}
