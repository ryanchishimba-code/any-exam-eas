import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { OPEN_QUICK_BITE_SLUG, QUICK_BITE_EPISODES, getQuickBiteBySlug } from "@/lib/quick-bites/catalog";
import {
  OPEN_PHARMACY_QUICK_BITE_SLUG,
  PHARMACY_QUICK_BITE_EPISODES,
  getPharmacyQuickBiteBySlug,
} from "@/lib/quick-bites/pharmacy-catalog";
import { homeQuickBiteSamples } from "@/lib/marketing/home-quick-bites";

const FILE_URL = /\.mp4|\.vtt|blob\.vercel-storage/i;

describe("homepage Quick Bites samples", () => {
  it("shows one public sample per track and no lesson count", () => {
    const samples = homeQuickBiteSamples();
    expect(samples.map((sample) => sample.id)).toEqual(["nursing", "pharmacy"]);
    expect(samples[0]).toMatchObject({
      board: "NCLEX",
      slug: OPEN_QUICK_BITE_SLUG,
      episodeTitle: "How the Nursing Boards Work",
      mediaUrl: `/api/quick-bites/${OPEN_QUICK_BITE_SLUG}/media`,
    });
    expect(samples[1]).toMatchObject({
      board: "NAPLEX",
      slug: OPEN_PHARMACY_QUICK_BITE_SLUG,
      episodeTitle: "Anticoagulants: Warfarin vs Heparins vs DOACs",
      mediaUrl: `/api/quick-bites-pharmacy/${OPEN_PHARMACY_QUICK_BITE_SLUG}/media`,
    });
    expect(getQuickBiteBySlug(samples[0]!.slug)?.title).toBe(samples[0]!.episodeTitle);
    expect(getPharmacyQuickBiteBySlug(samples[1]!.slug)?.title).toBe(samples[1]!.episodeTitle);
    const shown = new Set(samples.map((sample) => sample.slug));
    expect(QUICK_BITE_EPISODES.filter((episode) => shown.has(episode.slug))).toHaveLength(1);
    expect(PHARMACY_QUICK_BITE_EPISODES.filter((episode) => shown.has(episode.slug))).toHaveLength(1);
    expect(JSON.stringify(samples)).not.toMatch(/lessons/);
  });

  it("uses public poster files and never a media file URL", () => {
    for (const sample of homeQuickBiteSamples()) {
      expect(sample.webp).toMatch(/-poster\.webp$/);
      expect(sample.jpg).toMatch(/-poster\.jpg$/);
      expect(`${sample.webp} ${sample.jpg} ${sample.mediaUrl}`).not.toMatch(FILE_URL);
    }
  });

  it("does not hard-code episode totals or media file paths in the homepage section", () => {
    const files = [
      "src/lib/marketing/home-quick-bites.ts",
      "src/components/marketing/elevation/HomeQuickBites.tsx",
      "src/components/marketing/elevation/HomeSamplePlayer.tsx",
      "src/components/marketing/elevation/PublicHome.tsx",
    ];
    for (const file of files) {
      const text = readFileSync(path.resolve(process.cwd(), file), "utf8");
      expect(text, file).not.toMatch(FILE_URL);
      expect(text, file).not.toMatch(/\b(?:16|17|25|26|27) lessons\b/);
    }
  });
});
