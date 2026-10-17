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
  PHARMACY_QUICK_BITE_EPISODES,
  getPharmacyQuickBiteBySlug,
  pharmacyQuickBiteCaptionsPath,
  pharmacyQuickBitePoster,
  pharmacyQuickBiteVideoPath,
} from "@/lib/quick-bites/pharmacy-catalog";

/**
 * Hard rule: nursing episodes and quizzes appear on the NCLEX track only,
 * pharmacy episodes and quizzes on the NAPLEX track only.
 * Note the nursing slug "quick-bites-ep12-high-alert-pharm" ends in "pharm"; the series
 * marker is the "quick-bites-pharm-" prefix, never a substring match.
 */
const PHARM_PREFIX = "quick-bites-pharm-";
const isPharmacySlug = (slug: string) => slug.startsWith(PHARM_PREFIX);

type RawQuiz = { episode: string; video: string };

function readQuizzes(dir: string): RawQuiz[] {
  const url = new URL(`./${dir}/`, import.meta.url);
  return readdirSync(url)
    .filter((name) => name.endsWith(".json"))
    .map((name) => JSON.parse(readFileSync(new URL(name, url), "utf8")) as RawQuiz);
}

describe("Quick Bites series separation (NCLEX vs NAPLEX)", () => {
  it("has no pharmacy episode in the nursing catalog and no nursing episode in the pharmacy catalog", () => {
    expect(QUICK_BITE_EPISODES.length).toBeGreaterThan(0);
    expect(PHARMACY_QUICK_BITE_EPISODES.length).toBeGreaterThan(0);
    for (const episode of QUICK_BITE_EPISODES) {
      expect(isPharmacySlug(episode.slug), episode.slug).toBe(false);
      expect(getPharmacyQuickBiteBySlug(episode.slug), episode.slug).toBeUndefined();
    }
    for (const episode of PHARMACY_QUICK_BITE_EPISODES) {
      expect(isPharmacySlug(episode.slug), episode.slug).toBe(true);
      expect(getQuickBiteBySlug(episode.slug), episode.slug).toBeUndefined();
    }
    const nursing = new Set(QUICK_BITE_EPISODES.map((episode) => episode.slug));
    expect(PHARMACY_QUICK_BITE_EPISODES.filter((episode) => nursing.has(episode.slug))).toEqual([]);
    // Both live series have a distinct episode titled "High-Alert Medications". That is the only shared title.
    const nursingTitles = new Set(QUICK_BITE_EPISODES.map((episode) => episode.title));
    expect(
      PHARMACY_QUICK_BITE_EPISODES.filter((episode) => nursingTitles.has(episode.title)).map((e) => e.title)
    ).toEqual(["High-Alert Medications"]);
  });

  it("keeps each series' quizzes in its own directory", () => {
    const nursingQuizzes = readQuizzes("quizzes");
    const pharmacyQuizzes = readQuizzes("quizzes-pharmacy");
    expect(nursingQuizzes).toHaveLength(QUICK_BITE_EPISODES.length);
    expect(pharmacyQuizzes).toHaveLength(PHARMACY_QUICK_BITE_EPISODES.length);
    for (const quiz of nursingQuizzes) {
      expect(isPharmacySlug(quiz.video.replace(/-web\.mp4$/, "")), quiz.video).toBe(false);
      expect(getQuickBiteBySlug(`quick-bites-${quiz.episode}`), quiz.episode).toBeDefined();
    }
    for (const quiz of pharmacyQuizzes) {
      const slug = quiz.video.replace(/-web\.mp4$/, "");
      expect(isPharmacySlug(slug), quiz.video).toBe(true);
      expect(getPharmacyQuickBiteBySlug(slug), quiz.video).toBeDefined();
    }
  });

  it("serves each series' media and posters from its own prefix", () => {
    for (const episode of QUICK_BITE_EPISODES) {
      expect(quickBiteVideoPath(episode.slug).startsWith("quick-bites/")).toBe(true);
      expect(quickBiteCaptionsPath(episode.slug).startsWith("quick-bites/")).toBe(true);
      expect(quickBitePoster(episode.slug).webp.startsWith("/quick-bites/")).toBe(true);
    }
    for (const episode of PHARMACY_QUICK_BITE_EPISODES) {
      expect(pharmacyQuickBiteVideoPath(episode.slug).startsWith("quick-bites-pharmacy/")).toBe(true);
      expect(pharmacyQuickBiteCaptionsPath(episode.slug).startsWith("quick-bites-pharmacy/")).toBe(true);
      expect(pharmacyQuickBitePoster(episode.slug).webp.startsWith("/quick-bites-pharmacy/")).toBe(true);
    }
  });

  it("mounts the nursing series on NCLEX only and the pharmacy series on NAPLEX only", () => {
    const dashboard = readFileSync(
      new URL("../../components/app/DashboardPageContent.tsx", import.meta.url),
      "utf8"
    );
    const blocks = [...dashboard.matchAll(/\{examSlug === "(\w+)" && quickBites \? \(([\s\S]*?)\) : null\}/g)];
    const byExam = new Map(blocks.map((match) => [match[1], match[2] ?? ""]));
    expect([...byExam.keys()].sort()).toEqual(["naplex", "nclex"]);
    expect(byExam.get("nclex")).toContain("<VideoQuickBitesSection");
    expect(byExam.get("nclex")).not.toContain("series=");
    expect(byExam.get("naplex")).toContain('series="pharmacy"');
    expect(dashboard.match(/<VideoQuickBitesSection/g)).toHaveLength(2);
  });
});
