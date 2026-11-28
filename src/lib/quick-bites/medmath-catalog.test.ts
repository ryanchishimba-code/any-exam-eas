import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  MEDMATH_EPISODES,
  isOpenMedmathEpisode,
  medmathPoster,
  medmathVideoPath,
} from "@/lib/quick-bites/medmath-catalog";
import { getMedmathQuiz } from "@/lib/quick-bites/medmath-quiz-data";

describe("Medical Math catalog", () => {
  it("ships three private episodes and public posters", () => {
    expect(MEDMATH_EPISODES.map((episode) => episode.title)).toEqual([
      "Dosing and Drips",
      "Clinical Formulas",
      "Biostats That Change the Decision",
    ]);
    for (const episode of MEDMATH_EPISODES) {
      expect(isOpenMedmathEpisode(episode.slug)).toBe(false);
      expect(medmathVideoPath(episode.slug)).toBe(
        `quick-bites-medmath/v1-20261121/${episode.slug}-web.mp4`
      );
      expect(getMedmathQuiz(episode.slug)?.questions).toHaveLength(10);
      const poster = medmathPoster(episode.slug);
      expect(existsSync(path.join(process.cwd(), "public", poster.webp.slice(1)))).toBe(true);
      expect(existsSync(path.join(process.cwd(), "public", poster.jpg.slice(1)))).toBe(true);
    }
  });
});
