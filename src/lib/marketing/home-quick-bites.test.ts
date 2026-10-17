import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { PHARMACY_QUICK_BITE_EPISODES } from "@/lib/quick-bites/pharmacy-catalog";
import { QUICK_BITE_EPISODES } from "@/lib/quick-bites/catalog";
import {
  homeQuickBiteTracks,
  quickBiteLessonLabel,
  releasedQuickBiteCount,
} from "@/lib/marketing/home-quick-bites";

const MEDIA_URL = /\.mp4|\.vtt|\/api\/quick-bites|blob\.vercel-storage|quickBiteVideoPath|quickBiteCaptionsPath/i;

describe("homepage Quick Bites", () => {
  it("counts released catalog episodes instead of a fixed number", () => {
    const tracks = homeQuickBiteTracks();
    const nursing = tracks.find((track) => track.id === "nursing");
    const pharmacy = tracks.find((track) => track.id === "pharmacy");
    expect(nursing?.board).toBe("NCLEX");
    expect(pharmacy?.board).toBe("NAPLEX");
    expect(nursing?.count).toBe(releasedQuickBiteCount(QUICK_BITE_EPISODES));
    expect(pharmacy?.count).toBe(releasedQuickBiteCount(PHARMACY_QUICK_BITE_EPISODES));
    expect(nursing?.count).toBe(QUICK_BITE_EPISODES.filter((episode) => episode.held !== true).length);
    expect(pharmacy?.count).toBe(
      PHARMACY_QUICK_BITE_EPISODES.filter((episode) => episode.held !== true).length
    );
    expect(nursing?.countLabel).toBe(quickBiteLessonLabel(nursing?.count ?? 0));
    expect(nursing?.count).toBeGreaterThan(0);
    expect(pharmacy?.count).toBeGreaterThan(0);
  });

  it("uses public poster files and never a media URL", () => {
    const tracks = homeQuickBiteTracks();
    const posters = tracks.flatMap((track) => track.posters);
    expect(posters.length).toBeGreaterThan(0);
    for (const poster of posters) {
      expect(poster.webp).toMatch(/-poster\.webp$/);
      expect(poster.jpg).toMatch(/-poster\.jpg$/);
      expect(`${poster.webp} ${poster.jpg}`).not.toMatch(MEDIA_URL);
    }
    const nursing = tracks.find((track) => track.id === "nursing");
    expect(nursing?.posters[0]?.webp).toBe(
      `/quick-bites/${QUICK_BITE_EPISODES.find((episode) => episode.held !== true)?.slug}-poster.webp`
    );
  });

  it("does not hard-code episode totals or media paths in the homepage section", () => {
    const files = [
      "src/lib/marketing/home-quick-bites.ts",
      "src/components/marketing/elevation/HomeQuickBites.tsx",
      "src/components/marketing/elevation/PublicHome.tsx",
    ];
    for (const file of files) {
      const text = readFileSync(path.resolve(process.cwd(), file), "utf8");
      expect(text, file).not.toMatch(MEDIA_URL);
      expect(text, file).not.toMatch(/\b16 lessons\b|\b17 lessons\b/);
    }
  });
});
