import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  NURSING_WAVE1_MEDIA_VERSION,
  OPEN_QUICK_BITE_SLUG,
  QUICK_BITE_EPISODES,
  QUICK_BITE_GROUPS,
  getQuickBiteBySlug,
  isOpenQuickBite,
  isQuickBiteEpisodePlayable,
  nextPlayableQuickBite,
  previousPlayableQuickBite,
  quickBiteCaptionsPath,
  quickBitePoster,
  quickBiteVideoPath,
} from "./catalog";
import {
  PHARMACY_EP07_MEDIA_VERSION,
  PHARMACY_QUICK_BITE_EPISODES,
  pharmacyQuickBiteCaptionsPath,
  pharmacyQuickBiteVideoPath,
} from "./pharmacy-catalog";
import { unsignedQuickBiteUrl } from "./private-store";

const WAVE1_V2_SLUGS = [
  "quick-bites-potassium",
  "quick-bites-ep02-nclex-works",
  "quick-bites-ep03-priority",
  "quick-bites-ep04-delegation",
  "quick-bites-ep05-isolation",
  "quick-bites-ep06-sodium-calcium",
  "quick-bites-ep07-acid-base",
  "quick-bites-ep08-cardiac",
  "quick-bites-ep09-respiratory",
  "quick-bites-ep10-endocrine",
  "quick-bites-ep11-neuro",
  "quick-bites-ep12-high-alert-pharm",
  "quick-bites-ep13-psych",
  "quick-bites-ep14-maternity",
  "quick-bites-ep15-peds",
  "quick-bites-bonus-labs-examday",
] as const;

const WAVE2_UNVERSIONED_SLUGS = [
  "quick-bites-ep17-gi-bleed-obstruction",
  "quick-bites-ep18-liver-pancreas",
  "quick-bites-ep19-kidneys-dialysis",
  "quick-bites-ep20-transfusion",
  "quick-bites-ep21-neutropenia-sickle-cell",
  "quick-bites-ep22-surgery-wounds",
  "quick-bites-ep23-burns",
  "quick-bites-ep24-ortho",
  "quick-bites-ep25-dosage-calc",
] as const;

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
  ["Kidneys", "Kidneys: Acute vs Chronic & Dialysis", "quick-bites-ep19-kidneys-dialysis"],
  ["Blood Transfusions", "Blood Transfusions: Safe Setup & Reactions", "quick-bites-ep20-transfusion"],
  ["Med-Surg: GI & Liver", "GI Bleeds & Bowel Obstruction", "quick-bites-ep17-gi-bleed-obstruction"],
  ["Med-Surg: GI & Liver", "Liver & Pancreas: Cirrhosis vs Pancreatitis", "quick-bites-ep18-liver-pancreas"],
  [
    "Musculoskeletal",
    "Orthopedics: Compartment Syndrome, Fat Embolism, Hip Precautions",
    "quick-bites-ep24-ortho",
  ],
  [
    "Hematology & Oncology",
    "Cancer Care & Sickle Cell: Neutropenia, Low Platelets, Crisis",
    "quick-bites-ep21-neutropenia-sickle-cell",
  ],
  [
    "Surgery, Wounds & Burns",
    "Surgery & Wounds: Pre-Op, Post-Op, Pressure Injuries",
    "quick-bites-ep22-surgery-wounds",
  ],
  ["Surgery, Wounds & Burns", "Burns: Airway, Rule of Nines, Fluids", "quick-bites-ep23-burns"],
  ["Dosage Calculations", "Dosage Calculations: Drip Rates & Weight-Based Dosing", "quick-bites-ep25-dosage-calc"],
  ["Exam Day", "Danger-Zone Labs & Exam-Day Plan", "quick-bites-bonus-labs-examday"],
] as const;

describe("Quick Bites catalog", () => {
  it("lists 25 episodes in study-guide order, with exam day last", () => {
    expect(QUICK_BITE_EPISODES).toHaveLength(25);
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
    expect(previousPlayableQuickBite("quick-bites-ep03-priority", true)?.slug).toBe(
      OPEN_QUICK_BITE_SLUG
    );
    expect(previousPlayableQuickBite(OPEN_QUICK_BITE_SLUG, true)).toBeNull();
    expect(nextPlayableQuickBite("quick-bites-ep07-acid-base", true)?.slug).toBe(
      "quick-bites-ep19-kidneys-dialysis"
    );
    expect(nextPlayableQuickBite("quick-bites-ep25-dosage-calc", true)?.slug).toBe(
      "quick-bites-bonus-labs-examday"
    );
    expect(nextPlayableQuickBite("quick-bites-bonus-labs-examday", true)).toBeNull();
    for (const episode of QUICK_BITE_EPISODES) {
      if (episode.slug === OPEN_QUICK_BITE_SLUG) continue;
      expect(isOpenQuickBite(episode.slug)).toBe(false);
      expect(isQuickBiteEpisodePlayable(episode, false)).toBe(false);
      expect(isQuickBiteEpisodePlayable(episode, true)).toBe(true);
    }
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
      "Kidneys",
      "Blood Transfusions",
      "Med-Surg: GI & Liver",
      "Musculoskeletal",
      "Hematology & Oncology",
      "Surgery, Wounds & Burns",
      "Dosage Calculations",
      "Exam Day",
    ]);
  });

  it("keeps video and caption paths private and posters public", () => {
    const episode = getQuickBiteBySlug("quick-bites-potassium");
    expect(episode?.title).toBe("Potassium: Highs, Lows & the Heart");
    expect(quickBiteVideoPath("quick-bites-potassium")).toBe(
      "quick-bites/v2-20261017/quick-bites-potassium-web.mp4"
    );
    expect(quickBiteCaptionsPath("quick-bites-potassium")).toBe(
      "quick-bites/v2-20261017/quick-bites-potassium.vtt"
    );
    expect(quickBitePoster("quick-bites-potassium").webp).toBe(
      "/quick-bites/quick-bites-potassium-poster.webp"
    );
    const bare = unsignedQuickBiteUrl(quickBiteVideoPath("quick-bites-potassium"));
    expect(bare).not.toContain("?");
    expect(bare).not.toContain("vercel-blob-signature");
    expect(bare.startsWith("https://")).toBe(true);
    expect(bare).toContain(".private.blob.vercel-storage.com/");
  });

  it("versions the 16 re-rendered episodes and leaves 17-25 and pharmacy unchanged", () => {
    expect(NURSING_WAVE1_MEDIA_VERSION).toBe("v2-20261017");
    expect(WAVE1_V2_SLUGS).toHaveLength(16);
    expect(WAVE2_UNVERSIONED_SLUGS).toHaveLength(9);
    expect([...WAVE1_V2_SLUGS, ...WAVE2_UNVERSIONED_SLUGS].sort()).toEqual(
      QUICK_BITE_EPISODES.map((episode) => episode.slug).sort()
    );

    for (const slug of WAVE1_V2_SLUGS) {
      const episode = getQuickBiteBySlug(slug);
      expect(episode?.mediaVersion).toBe(NURSING_WAVE1_MEDIA_VERSION);
      expect(quickBiteVideoPath(slug)).toBe(
        `quick-bites/${NURSING_WAVE1_MEDIA_VERSION}/${slug}-web.mp4`
      );
      expect(quickBiteCaptionsPath(slug)).toBe(
        `quick-bites/${NURSING_WAVE1_MEDIA_VERSION}/${slug}.vtt`
      );
      expect(quickBitePoster(slug)).toEqual({
        webp: `/quick-bites/${slug}-poster.webp`,
        jpg: `/quick-bites/${slug}-poster.jpg`,
      });
    }

    for (const slug of WAVE2_UNVERSIONED_SLUGS) {
      expect(getQuickBiteBySlug(slug)?.mediaVersion).toBeUndefined();
      expect(quickBiteVideoPath(slug)).toBe(`quick-bites/${slug}-web.mp4`);
      expect(quickBiteCaptionsPath(slug)).toBe(`quick-bites/${slug}.vtt`);
    }

    expect(OPEN_QUICK_BITE_SLUG).toBe("quick-bites-ep02-nclex-works");
    expect(isOpenQuickBite(OPEN_QUICK_BITE_SLUG)).toBe(true);

    for (const episode of PHARMACY_QUICK_BITE_EPISODES) {
      const versioned = episode.slug === "quick-bites-pharm-ep07-insulin";
      const folder = versioned
        ? `quick-bites-pharmacy/${PHARMACY_EP07_MEDIA_VERSION}`
        : "quick-bites-pharmacy";
      expect(episode.mediaVersion).toBe(versioned ? PHARMACY_EP07_MEDIA_VERSION : undefined);
      expect(pharmacyQuickBiteVideoPath(episode.slug)).toBe(`${folder}/${episode.slug}-web.mp4`);
      expect(pharmacyQuickBiteCaptionsPath(episode.slug)).toBe(`${folder}/${episode.slug}.vtt`);
      expect(pharmacyQuickBiteVideoPath(episode.slug).startsWith("quick-bites/")).toBe(false);
    }
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
