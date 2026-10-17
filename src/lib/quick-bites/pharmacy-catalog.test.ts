import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parseVideoTimestamp } from "@/lib/quick-bites/timestamp";
import { getPharmacyQuickBiteQuiz } from "@/lib/quick-bites/pharmacy-quiz-data";
import { publicQuickBiteQuiz } from "@/lib/quick-bites/quiz-data";
import {
  PHARMACY_QUICK_BITE_EPISODES,
  getPharmacyQuickBiteBySlug,
  isPharmacyQuickBitePlayable,
  nextPlayablePharmacyQuickBite,
  pharmacyQuickBiteCaptionsPath,
  pharmacyQuickBitePoster,
  pharmacyQuickBiteVideoPath,
} from "@/lib/quick-bites/pharmacy-catalog";
import { unsignedQuickBiteUrl } from "@/lib/quick-bites/private-store";

const ORDER = [
  ["Anticoagulants: Warfarin vs Heparins vs DOACs", "quick-bites-pharm-ep01-anticoagulants", "5:09"],
  ["ACE Inhibitors vs ARBs vs ARNI", "quick-bites-pharm-ep02-raas", "5:03"],
  ["Hypertension: Who Gets Which Drug", "quick-bites-pharm-ep03-hypertension", "3:46"],
  ["Heart Failure: The Four Pillars", "quick-bites-pharm-ep04-heart-failure", "3:42"],
  ["Statins: Intensity, Goals + Safety", "quick-bites-pharm-ep05-lipids", "4:03"],
  ["Type 2 Diabetes: Pick by the Patient", "quick-bites-pharm-ep06-diabetes", "4:07"],
  ["Insulin: Onset, Peak + Safety", "quick-bites-pharm-ep07-insulin", "3:55"],
  ["Asthma vs COPD Inhalers", "quick-bites-pharm-ep08-asthma-copd", "4:06"],
  ["Antibiotics: Bug-Drug Match", "quick-bites-pharm-ep09-antibiotics", "3:02"],
  ["Drug Interactions: CYP Inhibitors vs Inducers", "quick-bites-pharm-ep10-cyp-interactions", "2:57"],
  ["Pharmacokinetics in Pictures", "quick-bites-pharm-ep11-pharmacokinetics", "2:42"],
  ["Calculations Survival Kit", "quick-bites-pharm-ep12-calculations", "2:52"],
  ["Compounding Safety: USP 797 vs 800", "quick-bites-pharm-ep13-compounding", "2:49"],
  ["High-Alert Medications", "quick-bites-pharm-ep14-high-alert", "2:42"],
  ["Vaccines: Live vs Inactivated", "quick-bites-pharm-ep15-vaccines", "2:57"],
  ["Older Adults: Beers Criteria", "quick-bites-pharm-ep16-beers", "2:58"],
  ["HIV Drugs: Starting, PrEP + PEP", "quick-bites-pharm-ep22-hiv", "4:01"],
  ["Thyroid Drugs: Timing, Brakes + Pregnancy", "quick-bites-pharm-ep20-thyroid", "3:54"],
  ["Antidepressants: First Line, Washouts + Serotonin Syndrome", "quick-bites-pharm-ep18-antidepressants", "4:07"],
  ["Antipsychotics + Lithium", "quick-bites-pharm-ep19-antipsychotics-lithium", "4:12"],
  ["Antiseizure Drugs: Levels, Rashes + Pregnancy", "quick-bites-pharm-ep17-antiseizure", "4:04"],
  ["Pain + Opioids: Limits, Equivalents + Switches", "quick-bites-pharm-ep23-pain-opioids", "3:49"],
  ["Chemotherapy Safety: Toxicities, Rescues + Fatal Errors", "quick-bites-pharm-ep21-oncology", "3:47"],
  ["Pediatric Dosing: Weight Math + the Never List", "quick-bites-pharm-ep24-pediatric-dosing", "3:51"],
  ["Pregnancy + Lactation: Labels, Avoids + Swaps", "quick-bites-pharm-ep25-pregnancy-lactation", "3:47"],
  ["Toxicology: The Nomogram + Key Antidotes", "quick-bites-pharm-ep26-antidotes", "4:07"],
  ["Bonus: How the Pharmacy Boards Work", "quick-bites-pharm-bonus-exam-format", "2:18"],
] as const;

describe("Quick Bites: Pharmacy catalog", () => {
  it("lists episodes 1-26 and the bonus last", () => {
    expect(PHARMACY_QUICK_BITE_EPISODES.map((episode) => [episode.title, episode.slug, episode.duration])).toEqual(
      ORDER.map((row) => [...row])
    );
    expect(PHARMACY_QUICK_BITE_EPISODES.map((episode) => episode.number)).toEqual(
      ORDER.map((_, index) => index + 1)
    );
    expect(nextPlayablePharmacyQuickBite("quick-bites-pharm-ep01-anticoagulants", true)?.title).toBe(
      "ACE Inhibitors vs ARBs vs ARNI"
    );
    expect(nextPlayablePharmacyQuickBite("quick-bites-pharm-ep01-anticoagulants", false)).toBeNull();
    expect(nextPlayablePharmacyQuickBite("quick-bites-pharm-bonus-exam-format", true)).toBeNull();
    expect(nextPlayablePharmacyQuickBite("quick-bites-pharm-ep16-beers", true)?.slug).toBe(
      "quick-bites-pharm-ep22-hiv"
    );
    expect(nextPlayablePharmacyQuickBite("quick-bites-pharm-ep26-antidotes", true)?.slug).toBe(
      "quick-bites-pharm-bonus-exam-format"
    );
    expect(PHARMACY_QUICK_BITE_EPISODES.at(-1)?.slug).toBe("quick-bites-pharm-bonus-exam-format");
    for (const episode of PHARMACY_QUICK_BITE_EPISODES) {
      expect(isPharmacyQuickBitePlayable(episode, false)).toBe(false);
    }
    expect(isPharmacyQuickBitePlayable(PHARMACY_QUICK_BITE_EPISODES[0]!, false)).toBe(false);
    expect(isPharmacyQuickBitePlayable(PHARMACY_QUICK_BITE_EPISODES[0]!, true)).toBe(true);
  });

  it("keeps pharmacy media on a private prefix and posters public", () => {
    const slug = "quick-bites-pharm-ep07-insulin";
    // The re-rendered ep07 lives under a new folder so the old file is never overwritten.
    expect(pharmacyQuickBiteVideoPath(slug)).toBe(`quick-bites-pharmacy/v2-20261017/${slug}-web.mp4`);
    expect(pharmacyQuickBiteCaptionsPath(slug)).toBe(`quick-bites-pharmacy/v2-20261017/${slug}.vtt`);
    expect(pharmacyQuickBitePoster(slug).webp).toBe(`/quick-bites-pharmacy/${slug}-poster.webp`);
    const beers = "quick-bites-pharm-ep16-beers";
    expect(pharmacyQuickBiteVideoPath(beers)).toBe(`quick-bites-pharmacy/${beers}-web.mp4`);
    const antidotes = "quick-bites-pharm-ep26-antidotes";
    expect(pharmacyQuickBiteVideoPath(antidotes)).toBe(`quick-bites-pharmacy/${antidotes}-web.mp4`);
    const bare = unsignedQuickBiteUrl(pharmacyQuickBiteVideoPath(slug));
    expect(bare).not.toContain("vercel-blob-signature");
    expect(bare).toContain("/quick-bites-pharmacy/");
    expect(bare).not.toContain("/quick-bites/quick-bites-pharm");
  });

  it("serves a 10-question quiz per episode from the pharmacy JSON directory", () => {
    for (const episode of PHARMACY_QUICK_BITE_EPISODES) {
      const quiz = getPharmacyQuickBiteQuiz(episode.slug);
      expect(quiz?.questions).toHaveLength(10);
      const published = JSON.stringify(publicQuickBiteQuiz(quiz!));
      expect(published).not.toContain('"keys"');
      expect(published).not.toContain('"explanation"');
    }
    const insulin = getPharmacyQuickBiteQuiz("quick-bites-pharm-ep07-insulin")!;
    expect(insulin.questions.find((question) => question.id === "ep07-insulin-q03")?.videoTimestamp).toBe(
      "0:47"
    );
    const insulinFile = JSON.parse(
      readFileSync(new URL("./quizzes-pharmacy/ep07-insulin.json", import.meta.url), "utf8")
    ) as {
      questions: {
        id: string;
        keys: string[];
        options: { id: string; text: string }[];
        videoTimestamp: string;
      }[];
    };
    const sourceIsophane = insulinFile.questions.find((question) => question.id === "ep07-insulin-q04");
    expect(sourceIsophane?.options.find((option) => option.id === "E")?.text).toBe(
      "It can last up to about 24 hours"
    );
    expect(sourceIsophane?.keys).toEqual(["B", "C", "D", "E"]);
    expect(sourceIsophane?.videoTimestamp).toBe("0:55");
    const isophane = insulin.questions.find((question) => question.id === "ep07-insulin-q04");
    const durationOption = isophane?.options.find(
      (option) => option.text === "It can last up to about 24 hours"
    );
    expect(durationOption?.id).toBeTruthy();
    expect(isophane?.keys).toContain(durationOption?.id);
    expect(isophane?.videoTimestamp).toBe("0:55");
    expect(isophane?.explanation).toContain("up to about 24 hours");
    expect(JSON.stringify(publicQuickBiteQuiz(insulin))).toContain("It can last up to about 24 hours");
    expect(JSON.stringify(publicQuickBiteQuiz(insulin))).not.toContain("18 hours");
    const quizDir = new URL("./quizzes-pharmacy/", import.meta.url);
    const rawQuizzes = readdirSync(quizDir)
      .filter((name) => name.endsWith(".json"))
      .map((name) => readFileSync(new URL(name, quizDir), "utf8"))
      .join("\n");
    expect(rawQuizzes).not.toContain("reviewNote");
    expect(rawQuizzes).not.toContain("needs Ryan");
    expect(parseVideoTimestamp("0:47")).toBe(47);
    expect(parseVideoTimestamp("0:55")).toBe(55);
    expect(getPharmacyQuickBiteBySlug("quick-bites-ep02-nclex-works")).toBeUndefined();
  });

  it("is mounted on the NAPLEX dashboard only", () => {
    const dashboard = readFileSync(
      new URL("../../components/app/DashboardPageContent.tsx", import.meta.url),
      "utf8"
    );
    expect(dashboard).toContain('examSlug === "naplex"');
    expect(dashboard).toContain('series="pharmacy"');
    expect(dashboard).toContain('examSlug === "nclex"');
    const sitemap = readFileSync(new URL("../../app/sitemap.ts", import.meta.url), "utf8");
    expect(sitemap).not.toContain("quick-bites-pharmacy");
    expect(sitemap).not.toContain("Quick Bites: Pharmacy");
  });
});
