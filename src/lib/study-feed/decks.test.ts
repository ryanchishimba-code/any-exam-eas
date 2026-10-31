import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadStudyFeedCards, loadStudyFeedSvg, resetPanceFeedCardCache } from "@/lib/pance-feed/load-cards";
import { STUDY_FEEDS, type StudyFeedExam } from "./catalog";

const boards: StudyFeedExam[] = ["nclex", "naplex", "aanp-fnp"];

describe("board feed decks", () => {
  it.each(boards)("loads 200 %s cards without rewriting the source text", (exam) => {
    resetPanceFeedCardCache();
    const board = STUDY_FEEDS[exam];
    const dir = path.join(process.cwd(), "content", board.contentDir, "cards");
    const raw = fs
      .readdirSync(dir)
      .filter((name) => /^cards(?:-.+)?\.json$/.test(name))
      .flatMap((name) => JSON.parse(fs.readFileSync(path.join(dir, name), "utf8")) as Record<string, unknown>[]);
    const cards = loadStudyFeedCards(exam);
    expect(cards).toHaveLength(200);
    expect(new Set(cards.map((card) => card.id)).size).toBe(200);
    expect(cards[0]?.id).toBe(`${board.idPrefix}-001`);
    expect(cards.at(-1)?.id).toBe(`${board.idPrefix}-200`);
    for (const card of cards) {
      const source = raw.find((row) => row.id === card.id);
      expect(source).toBeTruthy();
      expect(card.front).toBe(source?.front);
      expect(card.bottom).toBe(source?.bottom);
      const bullets = source?.bullets as { clue: string; treat: string; trap: string };
      expect(card.bullets).toEqual({ clue: bullets.clue, treat: bullets.treat, trap: bullets.trap });
      const citation = source?.source as { guideline: string; year: string };
      expect(card.source.guideline).toBe(citation.guideline);
      expect(card.source.year).toBe(citation.year);
      expect(card).not.toHaveProperty("topic");
      expect(card).not.toHaveProperty("verified");
      expect(card).not.toHaveProperty("recheck_note");
    }
  });

  it("serves an FNP graphic and refuses a path escape", () => {
    resetPanceFeedCardCache();
    expect(loadStudyFeedSvg("aanp-fnp", "fnp-001")).toContain("<svg");
    expect(loadStudyFeedSvg("aanp-fnp", "../cards/cards-fnp.FINAL-20261031.json")).toBeNull();
    expect(loadStudyFeedSvg("nclex", "pance-001")).toBeNull();
  });
});
