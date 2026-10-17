import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  QUICK_BITE_EPISODES,
  quickBiteCaptionsPath,
  quickBitePoster,
  quickBiteVideoPath,
  type QuickBiteEpisode,
} from "@/lib/quick-bites/catalog";
import {
  PHARMACY_QUICK_BITE_EPISODES,
  pharmacyQuickBiteCaptionsPath,
  pharmacyQuickBitePoster,
  pharmacyQuickBiteVideoPath,
} from "@/lib/quick-bites/pharmacy-catalog";

type QuizFile = { episode: string; video: string; questions: { stem: string }[] };

function normalizeStem(stem: string): string {
  return stem
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function duplicates(values: string[]): string[] {
  const seen = new Set<string>();
  const dupes = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) dupes.add(value);
    seen.add(value);
  }
  return [...dupes];
}

function readQuizzes(dir: string): QuizFile[] {
  return readdirSync(dir)
    .filter((name) => name.endsWith(".json"))
    .map((name) => JSON.parse(readFileSync(path.join(dir, name), "utf8")) as QuizFile);
}

function assertContinuousUniqueCatalog(
  episodes: readonly QuickBiteEpisode[],
  videoPath: (slug: string) => string,
  captionsPath: (slug: string) => string,
  poster: (slug: string) => { webp: string; jpg: string }
) {
  expect(duplicates(episodes.map((episode) => episode.slug))).toEqual([]);
  expect(duplicates(episodes.map((episode) => episode.title))).toEqual([]);
  const videos = episodes.map((episode) => videoPath(episode.slug));
  const captions = episodes.map((episode) => captionsPath(episode.slug));
  expect(duplicates(videos)).toEqual([]);
  expect(duplicates(captions)).toEqual([]);
  expect(duplicates([...videos, ...captions])).toEqual([]);
  const posters = episodes.flatMap((episode) => [poster(episode.slug).webp, poster(episode.slug).jpg]);
  expect(duplicates(posters)).toEqual([]);
  expect(episodes.map((episode) => episode.number)).toEqual(episodes.map((_, index) => index + 1));
}

describe("Quick Bites catalog integrity", () => {
  it("rejects duplicate slugs, titles, or media paths and broken numbering in each series", () => {
    assertContinuousUniqueCatalog(
      QUICK_BITE_EPISODES,
      quickBiteVideoPath,
      quickBiteCaptionsPath,
      quickBitePoster
    );
    assertContinuousUniqueCatalog(
      PHARMACY_QUICK_BITE_EPISODES,
      pharmacyQuickBiteVideoPath,
      pharmacyQuickBiteCaptionsPath,
      pharmacyQuickBitePoster
    );
    expect(PHARMACY_QUICK_BITE_EPISODES.at(-1)?.slug).toBe("quick-bites-pharm-bonus-exam-format");
    expect(PHARMACY_QUICK_BITE_EPISODES.filter((episode) => episode.slug.includes("ep07"))).toHaveLength(1);
    expect(pharmacyQuickBiteVideoPath("quick-bites-pharm-ep07-insulin")).toBe(
      "quick-bites-pharmacy/v2-20261017/quick-bites-pharm-ep07-insulin-web.mp4"
    );
  });

  it("gives every episode one quiz file and one poster pair, with no repeated stems in a series", () => {
    const root = path.join(process.cwd(), "src/lib/quick-bites");
    const nursingQuizzes = readQuizzes(path.join(root, "quizzes"));
    const pharmacyQuizzes = readQuizzes(path.join(root, "quizzes-pharmacy"));
    const nursingSlugs = nursingQuizzes.map((quiz) => `quick-bites-${quiz.episode}`);
    const pharmacySlugs = pharmacyQuizzes.map((quiz) => quiz.video.replace(/-web\.mp4$/, ""));
    expect(duplicates(nursingSlugs)).toEqual([]);
    expect(duplicates(pharmacySlugs)).toEqual([]);
    expect(nursingSlugs.sort()).toEqual(QUICK_BITE_EPISODES.map((episode) => episode.slug).sort());
    expect(pharmacySlugs.sort()).toEqual(PHARMACY_QUICK_BITE_EPISODES.map((episode) => episode.slug).sort());

    for (const [quizzes, label] of [
      [nursingQuizzes, "nursing"],
      [pharmacyQuizzes, "pharmacy"],
    ] as const) {
      const stems = quizzes.flatMap((quiz) => quiz.questions.map((question) => normalizeStem(question.stem)));
      expect(duplicates(stems), label).toEqual([]);
    }

    for (const [dir, episodes, posterFor] of [
      ["public/quick-bites", QUICK_BITE_EPISODES, quickBitePoster],
      ["public/quick-bites-pharmacy", PHARMACY_QUICK_BITE_EPISODES, pharmacyQuickBitePoster],
    ] as const) {
      const onDisk = readdirSync(dir).filter((name) => name.includes("-poster."));
      const expected = episodes.flatMap((episode) => {
        const posters = posterFor(episode.slug);
        return [path.basename(posters.webp), path.basename(posters.jpg)];
      });
      expect(duplicates(onDisk)).toEqual([]);
      expect(onDisk.sort()).toEqual([...expected].sort());
      for (const name of expected) expect(existsSync(path.join(dir, name))).toBe(true);
    }
  });
});
