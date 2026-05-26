import type { StudyQuestion } from "./types";

export type TopicWeakness = {
  tag: string;
  attempts: number;
  misses: number;
  missRate: number;
};

/** Rank questions for review — weak tags first, then unseen, then shuffle tail. */
export function prioritizeForReview(
  questions: StudyQuestion[],
  weakness: TopicWeakness[]
): StudyQuestion[] {
  const weakTags = new Set(
    weakness
      .filter((w) => w.attempts >= 2 && w.missRate >= 0.4)
      .map((w) => w.tag.toLowerCase())
  );

  const weak: StudyQuestion[] = [];
  const neutral: StudyQuestion[] = [];

  for (const q of questions) {
    const tags = (q.tags ?? []).map((t) => t.toLowerCase());
    if (tags.some((t) => weakTags.has(t))) weak.push(q);
    else neutral.push(q);
  }

  shuffleInPlace(weak);
  shuffleInPlace(neutral);
  return [...weak, ...neutral];
}

export function adjustDifficulty(
  current: string,
  recentAccuracy: number
): string {
  if (recentAccuracy >= 0.85 && current !== "hard") {
    return current === "easy" ? "medium" : "hard";
  }
  if (recentAccuracy <= 0.45 && current !== "easy") {
    return current === "hard" ? "medium" : "easy";
  }
  return current;
}

function shuffleInPlace<T>(arr: T[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
