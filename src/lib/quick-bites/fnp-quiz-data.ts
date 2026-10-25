import { readdirSync, statSync } from "node:fs";
import path from "node:path";
import { FNP_QUICK_BITE_EPISODES } from "@/lib/quick-bites/fnp-catalog";
import {
  readQuickBiteQuizDirectory,
  type StoredQuickBiteQuiz,
} from "@/lib/quick-bites/quiz-data";

const QUIZ_DIR = path.join(process.cwd(), "src/lib/quick-bites/quizzes-fnp");

let cache: { stamp: string; bySlug: Map<string, StoredQuickBiteQuiz> } | null = null;

function stamp(): string {
  return readdirSync(QUIZ_DIR)
    .filter((name) => name.endsWith(".json"))
    .sort()
    .map((name) => {
      const stat = statSync(path.join(QUIZ_DIR, name));
      return `${name}:${stat.mtimeMs}:${stat.size}`;
    })
    .join("|");
}

function bank(): Map<string, StoredQuickBiteQuiz> {
  const current = stamp();
  if (cache?.stamp === current) return cache.bySlug;
  const bySlug = readQuickBiteQuizDirectory(QUIZ_DIR, FNP_QUICK_BITE_EPISODES, (file) =>
    file.video.replace(/-web\.mp4$/, "")
  );
  cache = { stamp: current, bySlug };
  return bySlug;
}

export function getFnpQuickBiteQuiz(slug: string): StoredQuickBiteQuiz | null {
  return bank().get(slug) ?? null;
}
