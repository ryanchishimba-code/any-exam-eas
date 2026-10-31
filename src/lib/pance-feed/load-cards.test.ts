import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { loadPanceFeedCards, loadPanceFeedSvg, resetPanceFeedCardCache } from "./load-cards";

const tempRoots: string[] = [];

function writeCard(root: string, file: string, cards: unknown[]) {
  const dir = path.join(root, "cards");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, file), JSON.stringify(cards));
}

afterEach(() => {
  resetPanceFeedCardCache();
  for (const root of tempRoots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe("loadPanceFeedCards", () => {
  it("loads every cards-*.json file and ignores a plain cards.json", () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "pance-feed-"));
    tempRoots.push(root);
    writeCard(root, "cards-beta.json", [
      {
        id: "pance-200",
        system: "Psychiatry/Behavioral",
        front: "Later card",
        bottom: "Bottom",
        bullets: { clue: "c", treat: "t", trap: "x" },
        source: { guideline: "Guide", year: "2026" },
      },
    ]);
    writeCard(root, "cards-alpha.json", [
      {
        id: "pance-050",
        system: "Pulmonary",
        front: "Earlier card",
        bottom: "Bottom",
        bullets: { clue: "c", treat: "t", trap: "x" },
        source: { guideline: "Guide", year: "2026" },
      },
    ]);
    fs.writeFileSync(path.join(root, "cards", "cards.json"), JSON.stringify([{ id: "pance-001" }]));
    fs.writeFileSync(path.join(root, "cards", "notes.json"), "{}");

    const cards = loadPanceFeedCards(root);
    expect(cards.map((card) => card.id)).toEqual(["pance-050", "pance-200"]);
    expect(cards[1]?.system).toBe("Psychiatry");
  });

  it("reads the shipped catalog from cards-*.json only", () => {
    const cards = loadPanceFeedCards();
    expect(cards).toHaveLength(148);
    expect(cards.some((card) => card.id === "pance-001")).toBe(false);
    expect(new Set(cards.map((card) => card.id)).size).toBe(148);
    expect(loadPanceFeedSvg(cards[0]!.id)).toContain("<svg");
    expect(loadPanceFeedSvg("../cards/cards-cardio")).toBeNull();
    expect(loadPanceFeedSvg("pance-001")).toBeNull();
  });
});
