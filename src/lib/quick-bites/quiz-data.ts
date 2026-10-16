import { QUICK_BITE_EPISODES } from "@/lib/quick-bites/catalog";
import acidBase from "@/lib/quick-bites/quizzes/ep07-acid-base.json";
import bonusLabs from "@/lib/quick-bites/quizzes/bonus-labs-examday.json";
import cardiac from "@/lib/quick-bites/quizzes/ep08-cardiac.json";
import delegation from "@/lib/quick-bites/quizzes/ep04-delegation.json";
import endocrine from "@/lib/quick-bites/quizzes/ep10-endocrine.json";
import highAlert from "@/lib/quick-bites/quizzes/ep12-high-alert-pharm.json";
import isolation from "@/lib/quick-bites/quizzes/ep05-isolation.json";
import maternity from "@/lib/quick-bites/quizzes/ep14-maternity.json";
import nclexWorks from "@/lib/quick-bites/quizzes/ep02-nclex-works.json";
import neuro from "@/lib/quick-bites/quizzes/ep11-neuro.json";
import peds from "@/lib/quick-bites/quizzes/ep15-peds.json";
import potassium from "@/lib/quick-bites/quizzes/potassium.json";
import priority from "@/lib/quick-bites/quizzes/ep03-priority.json";
import psych from "@/lib/quick-bites/quizzes/ep13-psych.json";
import respiratory from "@/lib/quick-bites/quizzes/ep09-respiratory.json";
import sodiumCalcium from "@/lib/quick-bites/quizzes/ep06-sodium-calcium.json";
import { parseVideoTimestamp } from "@/lib/quick-bites/timestamp";

/**
 * Server-side quiz bank. Do not import this module from a client component.
 * Premium members receive a copy through the quiz route; free members never do.
 */

export type QuickBiteAnswerType = "single" | "sata";

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

type RawQuiz = {
  episode: string;
  title: string;
  video: string;
  questions: Array<{
    id: string;
    type: string;
    stem: string;
    options: { id: string; text: string }[];
    keys: string[];
    explanation: string;
    videoTimestamp: string;
  }>;
};

const FILES: RawQuiz[] = [
  nclexWorks,
  priority,
  delegation,
  isolation,
  cardiac,
  respiratory,
  endocrine,
  neuro,
  highAlert,
  maternity,
  peds,
  psych,
  potassium,
  sodiumCalcium,
  acidBase,
  bonusLabs,
];

function answerType(type: string): QuickBiteAnswerType | null {
  if (type === "single" || type === "single_best_answer") return "single";
  if (type === "sata" || type === "select_all_that_apply") return "sata";
  return null;
}

function normalize(file: RawQuiz): StoredQuickBiteQuiz {
  const slug = `quick-bites-${file.episode}`;
  if (file.video !== `${slug}-web.mp4`) {
    throw new Error(`Quiz ${file.episode} does not match its video file.`);
  }
  if (file.questions.length !== 10) {
    throw new Error(`Quiz ${file.episode} must have 10 questions.`);
  }

  const questions = file.questions.map((question, index) => {
    const type = answerType(question.type);
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
    if (type === "single" && keys.length !== 1) {
      throw new Error(`Quiz ${file.episode} question ${index + 1} must have one key.`);
    }
    if (type === "sata" && keys.length < 2) {
      throw new Error(`Quiz ${file.episode} question ${index + 1} must have at least two keys.`);
    }
    return {
      id: question.id,
      type,
      stem: question.stem,
      options: question.options.map((option) => ({ id: option.id, text: option.text })),
      keys,
      explanation: question.explanation,
      videoTimestamp: question.videoTimestamp,
    };
  });

  return { slug, questions };
}

const BY_SLUG = new Map<string, StoredQuickBiteQuiz>();
for (const file of FILES) {
  const quiz = normalize(file);
  if (BY_SLUG.has(quiz.slug)) throw new Error(`Duplicate quiz for ${quiz.slug}.`);
  BY_SLUG.set(quiz.slug, quiz);
}
for (const episode of QUICK_BITE_EPISODES) {
  if (!BY_SLUG.has(episode.slug)) throw new Error(`Missing quiz for ${episode.slug}.`);
}
if (BY_SLUG.size !== QUICK_BITE_EPISODES.length) {
  throw new Error("Quiz bank does not match the episode catalog.");
}

export function getQuickBiteQuiz(slug: string): StoredQuickBiteQuiz | null {
  return BY_SLUG.get(slug) ?? null;
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
  if (question.type === "single" && unique.length !== 1) return null;
  if (question.type === "sata" && unique.length < 1) return null;

  const chosen = [...unique].sort();
  const keys = [...question.keys].sort();
  const correct = chosen.length === keys.length && chosen.every((id, index) => id === keys[index]);
  return { correct, explanation: question.explanation, keys: question.keys };
}
