import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  QUICK_BITE_EPISODES,
  getQuickBiteBySlug,
  quickBiteCaptionsPath,
  quickBitePoster,
  quickBiteVideoPath,
} from "@/lib/quick-bites/catalog";
import {
  FNP_QUICK_BITE_EPISODES,
  fnpQuickBiteCaptionsPath,
  fnpQuickBitePoster,
  fnpQuickBiteVideoPath,
  getFnpQuickBiteBySlug,
} from "@/lib/quick-bites/fnp-catalog";
import {
  PANCE_QUICK_BITE_EPISODES,
  getPanceQuickBiteBySlug,
  panceQuickBiteCaptionsPath,
  panceQuickBitePoster,
  panceQuickBiteVideoPath,
} from "@/lib/quick-bites/pance-catalog";
import {
  PHARMACY_QUICK_BITE_EPISODES,
  getPharmacyQuickBiteBySlug,
  pharmacyQuickBiteCaptionsPath,
  pharmacyQuickBitePoster,
  pharmacyQuickBiteVideoPath,
} from "@/lib/quick-bites/pharmacy-catalog";

const PHARM_PREFIX = "quick-bites-pharm-";
const FNP_PREFIX = "quick-bites-fnp-";
const PANCE_PREFIX = "quick-bites-pance-";

const isPharmacySlug = (slug: string) => slug.startsWith(PHARM_PREFIX);
const isFnpSlug = (slug: string) => slug.startsWith(FNP_PREFIX);
const isPanceSlug = (slug: string) => slug.startsWith(PANCE_PREFIX);

const OTHER_LOOKUPS = [
  getPharmacyQuickBiteBySlug,
  getFnpQuickBiteBySlug,
  getPanceQuickBiteBySlug,
] as const;

function assertNursingOnly(slug: string) {
  expect(isPharmacySlug(slug), slug).toBe(false);
  expect(isFnpSlug(slug), slug).toBe(false);
  expect(isPanceSlug(slug), slug).toBe(false);
  for (const lookup of OTHER_LOOKUPS) {
    expect(lookup(slug), slug).toBeUndefined();
  }
}

type RawQuiz = { episode: string; video: string };

function readQuizzes(dir: string): RawQuiz[] {
  const url = new URL(`./${dir}/`, import.meta.url);
  return readdirSync(url)
    .filter((name) => name.endsWith(".json"))
    .map((name) => JSON.parse(readFileSync(new URL(name, url), "utf8")) as RawQuiz);
}

const ALL_SERIES = [
  {
    label: "nursing",
    episodes: QUICK_BITE_EPISODES,
    quizzes: () => readQuizzes("quizzes"),
    slugFromQuiz: (quiz: RawQuiz) => `quick-bites-${quiz.episode}`,
    isOwn: (slug: string) => !isPharmacySlug(slug) && !isFnpSlug(slug) && !isPanceSlug(slug),
    lookup: getQuickBiteBySlug,
    videoPath: quickBiteVideoPath,
    captionsPath: quickBiteCaptionsPath,
    poster: quickBitePoster,
    blobPrefix: "quick-bites/",
    publicPrefix: "/quick-bites/",
  },
  {
    label: "pharmacy",
    episodes: PHARMACY_QUICK_BITE_EPISODES,
    quizzes: () => readQuizzes("quizzes-pharmacy"),
    slugFromQuiz: (quiz: RawQuiz) => quiz.video.replace(/-web\.mp4$/, ""),
    isOwn: isPharmacySlug,
    lookup: getPharmacyQuickBiteBySlug,
    videoPath: pharmacyQuickBiteVideoPath,
    captionsPath: pharmacyQuickBiteCaptionsPath,
    poster: pharmacyQuickBitePoster,
    blobPrefix: "quick-bites-pharmacy/",
    publicPrefix: "/quick-bites-pharmacy/",
  },
  {
    label: "fnp",
    episodes: FNP_QUICK_BITE_EPISODES,
    quizzes: () => readQuizzes("quizzes-fnp"),
    slugFromQuiz: (quiz: RawQuiz) => quiz.video.replace(/-web\.mp4$/, ""),
    isOwn: isFnpSlug,
    lookup: getFnpQuickBiteBySlug,
    videoPath: fnpQuickBiteVideoPath,
    captionsPath: fnpQuickBiteCaptionsPath,
    poster: fnpQuickBitePoster,
    blobPrefix: "quick-bites-fnp/",
    publicPrefix: "/quick-bites-fnp/",
  },
  {
    label: "pance",
    episodes: PANCE_QUICK_BITE_EPISODES,
    quizzes: () => readQuizzes("quizzes-pance"),
    slugFromQuiz: (quiz: RawQuiz) => quiz.video.replace(/-web\.mp4$/, ""),
    isOwn: isPanceSlug,
    lookup: getPanceQuickBiteBySlug,
    videoPath: panceQuickBiteVideoPath,
    captionsPath: panceQuickBiteCaptionsPath,
    poster: panceQuickBitePoster,
    blobPrefix: "quick-bites-pance/",
    publicPrefix: "/quick-bites-pance/",
  },
] as const;

describe("Quick Bites series separation", () => {
  it("keeps each catalog disjoint from the other three", () => {
    const slugs = ALL_SERIES.map((series) => series.episodes.map((episode) => episode.slug));
    for (let i = 0; i < ALL_SERIES.length; i += 1) {
      for (let j = i + 1; j < ALL_SERIES.length; j += 1) {
        const overlap = slugs[i].filter((slug) => slugs[j].includes(slug));
        expect(overlap, `${ALL_SERIES[i].label} vs ${ALL_SERIES[j].label}`).toEqual([]);
      }
    }

    for (const episode of QUICK_BITE_EPISODES) {
      assertNursingOnly(episode.slug);
    }
    for (const episode of PHARMACY_QUICK_BITE_EPISODES) {
      expect(isPharmacySlug(episode.slug)).toBe(true);
      expect(getQuickBiteBySlug(episode.slug)).toBeUndefined();
      expect(getFnpQuickBiteBySlug(episode.slug)).toBeUndefined();
      expect(getPanceQuickBiteBySlug(episode.slug)).toBeUndefined();
    }
    for (const episode of FNP_QUICK_BITE_EPISODES) {
      expect(isFnpSlug(episode.slug)).toBe(true);
      expect(getQuickBiteBySlug(episode.slug)).toBeUndefined();
      expect(getPharmacyQuickBiteBySlug(episode.slug)).toBeUndefined();
      expect(getPanceQuickBiteBySlug(episode.slug)).toBeUndefined();
    }
    for (const episode of PANCE_QUICK_BITE_EPISODES) {
      expect(isPanceSlug(episode.slug)).toBe(true);
      expect(getQuickBiteBySlug(episode.slug)).toBeUndefined();
      expect(getPharmacyQuickBiteBySlug(episode.slug)).toBeUndefined();
      expect(getFnpQuickBiteBySlug(episode.slug)).toBeUndefined();
    }
  });

  it("keeps each series' quizzes in its own directory", () => {
    for (const series of ALL_SERIES) {
      const quizzes = series.quizzes();
      expect(quizzes).toHaveLength(series.episodes.length);
      for (const quiz of quizzes) {
        const slug = series.slugFromQuiz(quiz);
        expect(series.isOwn(slug), quiz.video).toBe(true);
        expect(series.lookup(slug), quiz.video).toBeDefined();
      }
    }
  });

  it("serves each series' media and posters from its own prefix", () => {
    for (const series of ALL_SERIES) {
      for (const episode of series.episodes) {
        expect(series.videoPath(episode.slug).startsWith(series.blobPrefix)).toBe(true);
        expect(series.captionsPath(episode.slug).startsWith(series.blobPrefix)).toBe(true);
        expect(series.poster(episode.slug).webp.startsWith(series.publicPrefix)).toBe(true);
      }
    }
  });

  it("mounts one Quick Bites section per board track on the dashboard", () => {
    const dashboard = readFileSync(
      new URL("../../components/app/DashboardPageContent.tsx", import.meta.url),
      "utf8"
    );
    const blocks = [
      ...dashboard.matchAll(/\{examSlug === "([\w-]+)" && quickBites \? \(([\s\S]*?)\) : null\}/g),
    ];
    const byExam = new Map(blocks.map((match) => [match[1], match[2] ?? ""]));
    expect([...byExam.keys()].sort()).toEqual(["aanp-fnp", "naplex", "nclex", "pance"]);
    expect(byExam.get("nclex")).toContain("<VideoQuickBitesSection");
    expect(byExam.get("nclex")).not.toContain("series=");
    expect(byExam.get("naplex")).toContain('series="pharmacy"');
    expect(byExam.get("aanp-fnp")).toContain('series="fnp"');
    expect(byExam.get("pance")).toContain('series="pance"');
    expect(dashboard.match(/<VideoQuickBitesSection/g)).toHaveLength(4);
  });
});
