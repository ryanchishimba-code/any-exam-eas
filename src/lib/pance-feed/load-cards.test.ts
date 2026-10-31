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
  it("loads cards.json and every cards-*.json file", () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "pance-feed-"));
    tempRoots.push(root);
    const card = (id: string, system: string, front: string) => ({
      id,
      system,
      front,
      bottom: "Bottom",
      bullets: { clue: "c", treat: "t", trap: "x" },
      source: { guideline: "Guide", year: "2026" },
    });
    writeCard(root, "cards-beta.json", [card("pance-200", "Psychiatry/Behavioral", "Later card")]);
    writeCard(root, "cards-alpha.json", [card("pance-050", "Pulmonary", "Earlier card")]);
    writeCard(root, "cards.json", [card("pance-001", "Cardiovascular", "Pilot card")]);
    fs.writeFileSync(path.join(root, "cards", "notes.json"), "{}");

    const cards = loadPanceFeedCards(root);
    expect(cards.map((item) => item.id)).toEqual(["pance-001", "pance-050", "pance-200"]);
    expect(cards[2]?.system).toBe("Psychiatry");
  });

  it("reads the shipped 200-card catalog", () => {
    const cards = loadPanceFeedCards();
    expect(cards).toHaveLength(200);
    expect(cards[0]?.id).toBe("pance-001");
    expect(cards.at(-1)?.id).toBe("pance-200");
    expect(new Set(cards.map((card) => card.id)).size).toBe(200);
    expect(loadPanceFeedSvg("pance-001")).toContain("<svg");
    expect(loadPanceFeedSvg("pance-200")).toContain("<svg");
    expect(loadPanceFeedSvg("../cards/cards.json")).toBeNull();
  });
});
