import { describe, expect, it } from "vitest";
import { getCycleKey } from "./cycles";
import { TOP_500_COUNT, TOP_500_DRUGS, getDrugById } from "./catalog";
import { enrichDrug } from "./enrichment";
import { applySpacedRepetition, initialSpacedRepetitionState } from "./spaced-repetition";
import {
  buildOfflineDrugReviewDashboard,
  buildOfflineDueDrugCards,
} from "./offline-fallback";

describe("drugs300", () => {
  it("catalog includes full GLP-1 class coverage", () => {
    expect(TOP_500_COUNT).toBe(509);
    const glpIds = [
      "dulaglutide",
      "exenatide",
      "liraglutide",
      "semaglutide",
      "tirzepatide",
      "lixisenatide",
      "albiglutide",
    ];
    for (const id of glpIds) {
      expect(getDrugById(id)?.therapeuticClass.toLowerCase()).toMatch(/glp-1|gip/);
    }
    expect(getDrugById("semaglutide")?.brand).toContain("Ozempic");
    expect(getDrugById("tirzepatide")?.brand).toContain("Mounjaro");
    expect(getDrugById("lixisenatide")?.brand).toContain("Adlyxin");
  });

  it("marks verified US withdrawals and drops retired pregnancy letters", () => {
    const offPrep = { NCLEX: false, USMLE: false, NAPLEX: false };
    const onAllBoards = { NCLEX: true, USMLE: true, NAPLEX: true };

    expect(getDrugById("albiglutide")?.brand).toContain("withdrawn");
    expect(getDrugById("albiglutide")?.examRelevance).toEqual(onAllBoards);

    for (const id of ["lixisenatide", "betrixaban", "insulin-detemir"]) {
      const drug = getDrugById(id);
      expect(drug?.brand.toLowerCase(), id).toContain("withdrawn");
      expect(drug?.examRelevance, id).toEqual(offPrep);
    }

    for (const id of ["exenatide", "elbasvir", "chloramphenicol", "edrophonium"]) {
      expect(getDrugById(id)?.brand.toLowerCase(), id).toContain("withdrawn");
      expect(getDrugById(id)?.examRelevance, id).toEqual(onAllBoards);
    }

    const catalogText = TOP_500_DRUGS.map(
      (drug) => `${drug.sideEffects} ${drug.mnemonic} ${drug.indications}`
    ).join("\n");
    expect(catalogText).not.toMatch(/pregnancy category\s+[a-dx]/i);
    expect(catalogText).not.toMatch(/\bpregnancy\s+[xdc]\b/i);
    expect(catalogText).not.toMatch(/teratogenic\s*\([dx]\)/i);
    expect(catalogText).not.toMatch(/\(pregnancy\s+[xdc]\)/i);

    const warfarin = getDrugById("warfarin");
    expect(warfarin).toBeDefined();
    const warfarinPearls = enrichDrug(warfarin!).pearls.join(" ");
    expect(warfarinPearls).not.toMatch(/category\s+x/i);
    expect(warfarinPearls).toMatch(/mechanical valves/i);
  });

  it("catalog includes FDA-approved ADHD pharmacotherapy", () => {
    const adhdIds = [
      "methylphenidate",
      "dexmethylphenidate",
      "amphetamine-dextroamphetamine",
      "dextroamphetamine",
      "lisdexamfetamine",
      "methamphetamine",
      "atomoxetine",
      "guanfacine",
      "guanfacine-extended-release",
      "clonidine",
      "clonidine-extended-release",
      "viloxazine-extended-release",
    ];
    for (const id of adhdIds) {
      expect(getDrugById(id), id).toBeDefined();
      expect(getDrugById(id)!.indications.toLowerCase()).toMatch(/adhd/);
    }
    expect(getDrugById("lisdexamfetamine")?.brand).toContain("Vyvanse");
    expect(getDrugById("viloxazine-extended-release")?.brand).toContain("Qelbree");
  });

  it("uses quarterly cycle keys", () => {
    expect(getCycleKey(new Date("2026-04-15T12:00:00Z"))).toBe("2026-Q2");
    expect(getCycleKey(new Date("2026-01-10T12:00:00Z"))).toBe("2026-Q1");
  });

  it("schedules sooner after again, later after easy", () => {
    const now = new Date("2026-05-01T12:00:00Z");
    const again = applySpacedRepetition({
      ...initialSpacedRepetitionState(now),
      grade: 0,
      reviewedAt: now,
    });
    const easy = applySpacedRepetition({
      ...initialSpacedRepetitionState(now),
      grade: 3,
      reviewedAt: now,
    });
    expect(again.nextReviewAt.getTime()).toBeLessThan(easy.nextReviewAt.getTime());
  });

  it("serves offline dashboard and due cards from curated catalog", () => {
    const dashboard = buildOfflineDrugReviewDashboard();
    expect(dashboard.offline).toBe(true);
    expect(dashboard.stats.total).toBe(TOP_500_COUNT);
    expect(dashboard.stats.due).toBe(TOP_500_COUNT);

    const cards = buildOfflineDueDrugCards(5, "all");
    expect(cards).toHaveLength(5);
    expect(cards[0]?.generic.length).toBeGreaterThan(0);
    expect(cards[0]?.due).toBe(true);

    const cvClass = dashboard.classProgress.find((c) => c.id === "cardiovascular");
    expect(cvClass?.total).toBeGreaterThan(30);
    const cvCards = buildOfflineDueDrugCards(30, "cardiovascular");
    expect(cvCards).toHaveLength(cvClass!.total);
  });
});
