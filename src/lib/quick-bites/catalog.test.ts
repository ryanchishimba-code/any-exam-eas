import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  OPEN_QUICK_BITE_SLUG,
  QUICK_BITE_EPISODES,
  QUICK_BITE_GROUPS,
  getQuickBiteBySlug,
  isOpenQuickBite,
  isQuickBiteEpisodePlayable,
  nextPlayableQuickBite,
  quickBiteCaptionsPath,
  quickBitePoster,
  quickBiteVideoPath,
} from "./catalog";
import { unsignedQuickBiteUrl } from "./private-store";

const ORDER = [
  ["How the Exam Works", "How the Nursing Boards Work", "quick-bites-ep02-nclex-works"],
  ["Core Frameworks", "Priority: Who Do You See First?", "quick-bites-ep03-priority"],
  ["Core Frameworks", "Delegation: Who Can Do What?", "quick-bites-ep04-delegation"],
  ["Fundamentals & Safety", "Isolation Precautions", "quick-bites-ep05-isolation"],
  ["Med-Surg", "Cardiac Essentials", "quick-bites-ep08-cardiac"],
  ["Med-Surg", "Respiratory Essentials", "quick-bites-ep09-respiratory"],
  ["Med-Surg", "Endocrine: DKA vs HHS & Thyroid", "quick-bites-ep10-endocrine"],
  ["Med-Surg", "Neuro: Stroke & Pressure in the Brain", "quick-bites-ep11-neuro"],
  ["Pharmacology", "High-Alert Medications", "quick-bites-ep12-high-alert-pharm"],
  ["Maternity & Newborn", "Maternity Essentials", "quick-bites-ep14-maternity"],
  ["Pediatrics", "Pediatrics Essentials", "quick-bites-ep15-peds"],
  ["Psych / Mental Health", "Psych Essentials", "quick-bites-ep13-psych"],
  ["Fluids, Electrolytes & Acid-Base", "Potassium: Highs, Lows & the Heart", "quick-bites-potassium"],
  ["Fluids, Electrolytes & Acid-Base", "Sodium & Calcium", "quick-bites-ep06-sodium-calcium"],
  ["Fluids, Electrolytes & Acid-Base", "Acid-Base Made Simple", "quick-bites-ep07-acid-base"],
  ["Exam Day", "Danger-Zone Labs & Exam-Day Plan", "quick-bites-bonus-labs-examday"],
] as const;

describe("Quick Bites catalog", () => {
  it("lists the 16 nursing-board episodes in the approved order", () => {
    expect(QUICK_BITE_EPISODES).toHaveLength(16);
    expect(QUICK_BITE_EPISODES.map((episode) => [episode.group, episode.title, episode.slug])).toEqual(
      ORDER.map((row) => [...row])
    );
    expect(QUICK_BITE_EPISODES.map((episode) => episode.number)).toEqual(
      ORDER.map((_, index) => index + 1)
    );
    expect(QUICK_BITE_EPISODES.filter((episode) => episode.held)).toEqual([]);
    expect(getQuickBiteBySlug(OPEN_QUICK_BITE_SLUG)).toMatchObject({
      number: 1,
      title: "How the Nursing Boards Work",
    });
    expect(QUICK_BITE_EPISODES.filter((episode) => isOpenQuickBite(episode.slug))).toHaveLength(1);
    expect(nextPlayableQuickBite(OPEN_QUICK_BITE_SLUG, true)?.slug).toBe("quick-bites-ep03-priority");
    expect(nextPlayableQuickBite(OPEN_QUICK_BITE_SLUG, false)).toBeNull();
    expect(nextPlayableQuickBite("quick-bites-ep07-acid-base", true)?.title).toBe(
      "Danger-Zone Labs & Exam-Day Plan"
    );
    expect(nextPlayableQuickBite("quick-bites-bonus-labs-examday", true)).toBeNull();
    expect(isQuickBiteEpisodePlayable(QUICK_BITE_EPISODES[0]!, false)).toBe(true);
    expect(isQuickBiteEpisodePlayable(QUICK_BITE_EPISODES[1]!, false)).toBe(false);
    expect(getQuickBiteBySlug("quick-bites-ep07-acid-base")?.duration).toBe("3:25");
    expect(getQuickBiteBySlug("quick-bites-ep12-high-alert-pharm")?.duration).toBe("2:44");
    expect(QUICK_BITE_GROUPS.map((group) => group.title)).toEqual([
      "How the Exam Works",
      "Core Frameworks",
      "Fundamentals & Safety",
      "Med-Surg",
      "Pharmacology",
      "Maternity & Newborn",
      "Pediatrics",
      "Psych / Mental Health",
      "Fluids, Electrolytes & Acid-Base",
      "Exam Day",
    ]);
  });

  it("keeps video and caption paths private and posters public", () => {
    const episode = getQuickBiteBySlug("quick-bites-potassium");
    expect(episode?.title).toBe("Potassium: Highs, Lows & the Heart");
    expect(quickBiteVideoPath("quick-bites-potassium")).toBe("quick-bites/quick-bites-potassium-web.mp4");
    expect(quickBiteCaptionsPath("quick-bites-potassium")).toBe("quick-bites/quick-bites-potassium.vtt");
    expect(quickBitePoster("quick-bites-potassium").webp).toBe(
      "/quick-bites/quick-bites-potassium-poster.webp"
    );
    const bare = unsignedQuickBiteUrl(quickBiteVideoPath("quick-bites-potassium"));
    expect(bare).not.toContain("?");
    expect(bare).not.toContain("vercel-blob-signature");
    expect(bare.startsWith("https://")).toBe(true);
    expect(bare).toContain(".private.blob.vercel-storage.com/");
  });

  it("is mounted on the NCLEX dashboard only", () => {
    const dashboard = readFileSync(
      new URL("../../components/app/DashboardPageContent.tsx", import.meta.url),
      "utf8"
    );
    expect(dashboard).toContain('examSlug === "nclex"');
    expect(dashboard).toContain("VideoQuickBitesSection");
  });
});
