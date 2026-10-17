import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { QUICK_BITE_EPISODES } from "@/lib/quick-bites/catalog";
import { parseVideoTimestamp } from "@/lib/quick-bites/timestamp";

/**
 * Server-side quiz bank. Quizzes are read from JSON files in `quizzes/`
 * so a reviewed file can replace the current one without a code change.
 * Do not import this module from a client component.
 */

const QUIZ_DIR = path.join(process.cwd(), "src/lib/quick-bites/quizzes");
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export type QuickBiteAnswerType = "single-answer" | "sata";

export type PublicQuickBiteQuestion = {
  id: string;
  type: QuickBiteAnswerType;
  stem: string;
  options: { id: string; text: string }[];
  videoTimestamp: string;
};

export type PublicQuickBiteQuiz = {
  questions: PublicQuickBiteQuestion[];
};

export type StoredQuickBiteQuestion = PublicQuickBiteQuestion & {
  keys: string[];
  explanation: string;
};

export type StoredQuickBiteQuiz = {
  slug: string;
  questions: StoredQuickBiteQuestion[];
};

type RawOption = { id: string; text: string };

type RawQuestion = {
  id: string;
  type: string;
  stem: string;
  options: RawOption[];
  keys: string[];
  explanation: string;
  videoTimestamp: string;
};

type RawQuiz = {
  episode: string;
  title: string;
  video: string;
  questions: RawQuestion[];
};

/** `single_best_answer` is one radio choice. `select_all_that_apply` is SATA. */
export function mapQuickBiteAnswerType(type: string): QuickBiteAnswerType | null {
  if (type === "single_best_answer") return "single-answer";
  if (type === "select_all_that_apply") return "sata";
  return null;
}

function hashSeed(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let next = Math.imul(state ^ (state >>> 15), 1 | state);
    next = (next + Math.imul(next ^ (next >>> 7), 61 | next)) ^ next;
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle<T>(items: readonly T[], seedKey: string): T[] {
  const random = mulberry32(hashSeed(seedKey));
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    const current = copy[index]!;
    copy[index] = copy[swapIndex]!;
    copy[swapIndex] = current;
  }
  return copy;
}

function presentQuestion(question: RawQuestion, type: QuickBiteAnswerType): StoredQuickBiteQuestion {
  const shuffled = seededShuffle(question.options, question.id);
  const letterForOriginal = new Map<string, string>();
  const options = shuffled.map((option, index) => {
    const id = LETTERS[index];
    if (!id) throw new Error(`Quiz question ${question.id} has too many options.`);
    letterForOriginal.set(option.id, id);
    return { id, text: option.text };
  });
  const keys = [...question.keys]
    .map((key) => {
      const next = letterForOriginal.get(key);
      if (!next) throw new Error(`Quiz question ${question.id} is missing key ${key}.`);
      return next;
    })
    .sort();
  const originalIds = new Set(question.options.map((option) => option.id));
  const explanation = question.explanation.replace(/\b[A-Z]\b/g, (letter) =>
    originalIds.has(letter) ? (letterForOriginal.get(letter) ?? letter) : letter
  );
  return {
    id: question.id,
    type,
    stem: question.stem,
    options,
    keys,
    explanation,
    videoTimestamp: question.videoTimestamp,
  };
}

function normalize(file: RawQuiz, slug: string): StoredQuickBiteQuiz {
  if (file.video !== `${slug}-web.mp4`) {
    throw new Error(`Quiz ${file.episode} does not match its video file.`);
  }
  // The lithium label-range item was removed. Every other quiz stays at 10.
  const requiredCount = file.episode === "ep19-antipsychotics-lithium" ? 9 : 10;
  if (file.questions.length !== requiredCount) {
    throw new Error(`Quiz ${file.episode} must have ${requiredCount} questions.`);
  }

  const questions = file.questions.map((question, index) => {
    const type = mapQuickBiteAnswerType(question.type);
    if (!type) throw new Error(`Quiz ${file.episode} question ${index + 1} has an unknown type.`);
    if (!question.id || !question.stem.trim() || !question.explanation.trim()) {
      throw new Error(`Quiz ${file.episode} question ${index + 1} is incomplete.`);
    }
    if (parseVideoTimestamp(question.videoTimestamp) == null) {
      throw new Error(`Quiz ${file.episode} question ${index + 1} has a bad timestamp.`);
    }
    const optionIds = question.options.map((option) => option.id);
    if (optionIds.length < 2 || new Set(optionIds).size !== optionIds.length) {
      throw new Error(`Quiz ${file.episode} question ${index + 1} has bad options.`);
    }
    if (question.options.some((option) => !option.text.trim())) {
      throw new Error(`Quiz ${file.episode} question ${index + 1} has an empty option.`);
    }
    const keys = [...new Set(question.keys)];
    if (keys.length !== question.keys.length || keys.some((key) => !optionIds.includes(key))) {
      throw new Error(`Quiz ${file.episode} question ${index + 1} has bad keys.`);
    }
    if (type === "single-answer" && keys.length !== 1) {
      throw new Error(`Quiz ${file.episode} question ${index + 1} must have one key.`);
    }
    if (type === "sata" && keys.length < 2) {
      throw new Error(`Quiz ${file.episode} question ${index + 1} must have at least two keys.`);
    }
    return presentQuestion({ ...question, keys }, type);
  });

  return { slug, questions };
}

function quizStamp(): string {
  return readdirSync(QUIZ_DIR)
    .filter((name) => name.endsWith(".json"))
    .sort()
    .map((name) => {
      const stat = statSync(path.join(QUIZ_DIR, name));
      return `${name}:${stat.mtimeMs}:${stat.size}`;
    })
    .join("|");
}

export function readQuickBiteQuizDirectory(
  dir: string,
  episodes: readonly { slug: string }[],
  slugFor: (file: { episode: string; video: string }) => string
): Map<string, StoredQuickBiteQuiz> {
  const bySlug = new Map<string, StoredQuickBiteQuiz>();
  const names = readdirSync(dir)
    .filter((name) => name.endsWith(".json"))
    .sort();
  for (const name of names) {
    const raw = JSON.parse(readFileSync(path.join(dir, name), "utf8")) as RawQuiz;
    const quiz = normalize(raw, slugFor(raw));
    if (bySlug.has(quiz.slug)) throw new Error(`Duplicate quiz for ${quiz.slug}.`);
    bySlug.set(quiz.slug, quiz);
  }
  for (const episode of episodes) {
    if (!bySlug.has(episode.slug)) throw new Error(`Missing quiz for ${episode.slug}.`);
  }
  if (bySlug.size !== episodes.length) {
    throw new Error("Quiz bank does not match the episode catalog.");
  }
  return bySlug;
}

function readQuizBank(): Map<string, StoredQuickBiteQuiz> {
  return readQuickBiteQuizDirectory(QUIZ_DIR, QUICK_BITE_EPISODES, (file) => `quick-bites-${file.episode}`);
}

let cache: { stamp: string; bySlug: Map<string, StoredQuickBiteQuiz> } | null = null;

function bank(): Map<string, StoredQuickBiteQuiz> {
  const stamp = quizStamp();
  if (cache?.stamp === stamp) return cache.bySlug;
  const bySlug = readQuizBank();
  cache = { stamp, bySlug };
  return bySlug;
}

export function getQuickBiteQuiz(slug: string): StoredQuickBiteQuiz | null {
  return bank().get(slug) ?? null;
}

export function publicQuickBiteQuiz(quiz: StoredQuickBiteQuiz): PublicQuickBiteQuiz {
  return {
    questions: quiz.questions.map(({ id, type, stem, options, videoTimestamp }) => ({
      id,
      type,
      stem,
      options,
      videoTimestamp,
    })),
  };
}

export function gradeQuickBiteAnswer(
  question: StoredQuickBiteQuestion,
  selected: readonly string[]
): { correct: boolean; explanation: string; keys: string[] } | null {
  const unique = [...new Set(selected)];
  const optionIds = new Set(question.options.map((option) => option.id));
  if (unique.some((id) => !optionIds.has(id))) return null;
  if (question.type === "single-answer" && unique.length !== 1) return null;
  if (question.type === "sata" && unique.length < 1) return null;

  const chosen = [...unique].sort();
  const keys = [...question.keys].sort();
  const correct = chosen.length === keys.length && chosen.every((id, index) => id === keys[index]);
  return { correct, explanation: question.explanation, keys: question.keys };
}
