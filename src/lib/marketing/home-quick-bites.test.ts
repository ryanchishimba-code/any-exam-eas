import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { PHARMACY_QUICK_BITE_EPISODES } from "@/lib/quick-bites/pharmacy-catalog";
import { QUICK_BITE_EPISODES } from "@/lib/quick-bites/catalog";
import {
  homeQuickBiteTracks,
  isQuickBiteBonus,
  quickBiteCountLabel,
  releasedQuickBites,
} from "@/lib/marketing/home-quick-bites";

const MEDIA_URL = /\.mp4|\.vtt|\/api\/quick-bites|blob\.vercel-storage|quickBiteVideoPath|quickBiteCaptionsPath/i;

describe("homepage Quick Bites", () => {
  it("counts lessons and keeps a Bonus title beside the lesson count", () => {
    expect(quickBiteCountLabel([{ title: "Cardiac" }, { title: "Bonus: format" }])).toBe(
      "1 lesson + bonus"
    );
    expect(quickBiteCountLabel([{ title: "Cardiac", held: true }, { title: "Neuro" }])).toBe(
      "1 lesson"
    );
    expect(isQuickBiteBonus({ title: "Danger-Zone Labs & Exam-Day Plan" })).toBe(false);
    expect(isQuickBiteBonus({ title: "Bonus: How the Pharmacy Boards Work" })).toBe(true);

    const tracks = homeQuickBiteTracks();
    const nursing = tracks.find((track) => track.id === "nursing");
    const pharmacy = tracks.find((track) => track.id === "pharmacy");
    expect(nursing?.board).toBe("NCLEX");
    expect(pharmacy?.board).toBe("NAPLEX");
    expect(nursing?.countLabel).toBe(quickBiteCountLabel(QUICK_BITE_EPISODES));
    expect(pharmacy?.countLabel).toBe(quickBiteCountLabel(PHARMACY_QUICK_BITE_EPISODES));
    expect(releasedQuickBites(QUICK_BITE_EPISODES).filter((episode) => !isQuickBiteBonus(episode))).toHaveLength(25);
    expect(releasedQuickBites(PHARMACY_QUICK_BITE_EPISODES).filter(isQuickBiteBonus)).toHaveLength(1);
    expect(nursing?.countLabel).toBe("25 lessons");
    expect(pharmacy?.countLabel).toBe("26 lessons + bonus");
  });

  it("uses public poster files and never a media URL", () => {
    const tracks = homeQuickBiteTracks();
    const posters = tracks.flatMap((track) => track.posters);
    expect(posters.length).toBeGreaterThan(0);
    for (const poster of posters) {
      expect(poster.webp).toMatch(/-poster\.webp$/);
      expect(poster.jpg).toMatch(/-poster\.jpg$/);
      expect(`${poster.webp} ${poster.jpg}`).not.toMatch(MEDIA_URL);
      expect(isQuickBiteBonus(poster)).toBe(false);
    }
    const nursing = tracks.find((track) => track.id === "nursing");
    const firstLesson = releasedQuickBites(QUICK_BITE_EPISODES).find((episode) => !isQuickBiteBonus(episode));
    expect(nursing?.posters[0]?.webp).toBe(`/quick-bites/${firstLesson?.slug}-poster.webp`);
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
      expect(text, file).not.toMatch(/\b(?:16|17|25|26|27) lessons\b/);
    }
  });
});
